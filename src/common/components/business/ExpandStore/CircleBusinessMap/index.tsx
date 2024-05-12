
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Amap from '../../../AMap';
import styles from './index.module.less';
import ProvinceList from '../../../ProvinceList';
import SearchInMap from '../../SearchInMap';
import { useAmapLevelAndCityNew } from '@/common/hook/useAmapLevelAndCityNew';
import { CITY_LEVEL, CQ_CODE_SUBURB, DISTRICT_LEVEL, PROVINCE_LEVEL } from '../../../AMap/ts-config';
import { useMethods } from '@lhb/hook';
import { setStorage } from '@lhb/cache';
import { CITY_ZOOM, CQ_SUBURB_NAME, DISTRICT_ZOOM, PROVINCE_ZOOM } from '../../../Map/V2AMap/utils/amap';
import { debounce, isArray, isNotEmptyAny } from '@lhb/func';
import { CircleBusinessZoom, MapMarkerType, TargetZoom } from './ts-config';
import { calculateViewportCorners } from '@/common/utils/ways';
import { geUnderTheDistrictPagingData } from '@/common/api/networkplan';
import { markerActiveColorOption, markerDefaultColorOption } from '@/views/iterate/pages/siteselectionmap/ts-config';
import IconFont from '@/common/components/IconFont';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { v4 } from 'uuid'; // 用来生成不重复的key
import ReactDOM from 'react-dom';
import { Typography } from 'antd';

interface CirclebusinessMapProps{
  isBusiness?:boolean ; // 是否从选址地址创建商圈
  businessInfo?:any // 选中地址商圈信息
  [k:string]:any
}
const CirclebusinessMap = forwardRef((props:CirclebusinessMapProps, ref) => {
  const { form, isBusiness, businessInfo } = props;
  const [mapIns, setMapIns] = useState<any>(null);// 地图实例
  const [districtList, setDistrictList] = useState<Array<any>>([]);
  const mapHelpfulInfo = useAmapLevelAndCityNew(mapIns, true, true); // 监听地图相关的数据
  const { city, level } = mapHelpfulInfo;
  const selectListRef = useRef<any>([]); // 存储选择的项包含名称之类
  const changeLockRef = useRef<boolean>(true); // 用来准确判断是修改了下拉框选项，然后去跳转位置
  const cityRef = useRef<any>(null); // 存储城市信息
  const businessAreaRailRef = useRef<any>(null); // 记录当前商圈围栏信息
  const curViewMarkerRef: any = useRef(); // 当前查看的商圈id
  const isShowToastMsg = useRef<boolean>(false);

  useEffect(() => {
    if (!mapIns) return;
    // 加载商圈详情的商圈围栏
    if (isBusiness) {
      if (!isNotEmptyAny(businessInfo)) return;
      const { lng, lat } = businessInfo;
      flyToCurrentPos(lng, lat);
    }
    mapIns.on('moveend', handleSearchCircle);
    return () => {
      mapIns.off('moveend', handleSearchCircle);
    };
  }, [mapIns]);

  useEffect(() => {
    if (isBusiness) return;
    const select: any = [];
    const cityName:any = [];
    (level >= PROVINCE_LEVEL) && city?.provinceId && select.push(city.provinceId) && cityName.push(city.province);
    (level >= CITY_LEVEL) && city?.id && select.push(city.id) && cityName.push(city.city || city.province);
    (level >= DISTRICT_LEVEL) && city?.districtList?.forEach(district => {
      if (district.name === city.district) {
        select.push(district.id);
        cityName.push(district.name);
      }
    });
    handledistrict(select, cityName);
  }, [city, level]);

  useEffect(() => {
    cityRef.current = {
      city,
      level
    };
  }, [city, level]);

  // 暴露相关方法
  useImperativeHandle(ref, () => ({
    onChangeProvince, // 点击province
    onDropdownVisibleChange
  }));

  const {
    onChangeProvince,
    onDropdownVisibleChange,
    customCQ,
  } = useMethods({
    onChangeProvince: (val, selectedOptions) => {
      handledistrict(val, selectedOptions.map(it => it.name));
      selectListRef.current = selectedOptions || [];
      !changeLockRef.current && (changeLockRef.current = true);
      // onChange && onChange(val, selectedOptions);
    },
    onDropdownVisibleChange: (value) => {
      // setIsOpenCascaderMap?.(value);
      // 关闭下拉框时判断是否需要将地图定位
      if (changeLockRef.current && !value) {
        changeLockRef.current = false;
        const district = selectListRef.current?.at(-1);
        // 根据选项的长度判断地图放大级别
        /**
           * 0: 全国
           * 1: 省级
           * 2: 市
           * 3: 区
           */
        const zoomMap = [4, PROVINCE_ZOOM, CITY_ZOOM, DISTRICT_ZOOM];

        if (district) {
          // 处理选择重庆市/重庆郊县的特殊逻辑
          customCQ(district);
          // 提升层级 +2
          mapIns && mapIns.setZoomAndCenter(zoomMap[selectListRef.current.length] + 2, [district.lng, district.lat], false, 300);
        }
      };
    },
    // 处理选择重庆市(省级别)下重庆市(城市级别)/重庆郊县(城市级别)的特殊逻辑
    customCQ: (city: any) => {
      const { code } = city || {};
      if (code !== CQ_CODE_SUBURB) return;
      setStorage('CQ_SUBURB_NAME', CQ_SUBURB_NAME);
    }
  });

  const handleSearchCircle = debounce(async() => {
    if (!mapIns) return;
    const zoom = mapIns.getZoom();
    if (zoom <= CircleBusinessZoom.MinZomm) {
      clearOverlayGroup(); // 清楚上一次的图层
      if (!isShowToastMsg.current) {
        V2Message.warning('当前范围过大，商圈围栏无法加载，请缩小地图查看');
        isShowToastMsg.current = true;
      }
      return;
    }
    isShowToastMsg.current = false;
    if (isBusiness) {
      if (!isNotEmptyAny(businessInfo)) return;
      const { id } = businessInfo;
      curViewMarkerRef.current = id;
      createBusinessLayers([businessInfo]);
    } else {
      const { city, level } = cityRef.current;
      const center = mapIns.getCenter();
      const { topLeft, bottomRight } = calculateViewportCorners(center.lat, center.lng, 1000);
      const _params = {
        cityIds: [city.id],
        provinceIds: [city.provinceId],
        level,
        maxLat: topLeft.lat,
        maxLng: bottomRight.lng,
        minLat: bottomRight.lat,
        minLng: topLeft.lng,
        page: 1,
        secondLevelCategories: [],
        showPolygon: true,
        size: 500,
        onlyLatLng: false,
        sort: 'desc',
        sortField: null,
        sortRule: 1
      };
      const businessCircleInfo = await geUnderTheDistrictPagingData(_params);
      if (!isNotEmptyAny(businessCircleInfo)) return;
      createBusinessLayers(businessCircleInfo);
    }

  }, 500);

  // 创建商圈和marker
  const createBusinessLayers = (businessInfo) => {
    const markers :Array<any> = [];
    const layers: any = []; // 围栏覆盖物
    businessInfo.forEach((item) => {
      let marker;
      const { radius, polygon } = item;
      if (radius) { // 显示圆
        marker = createBusinessCircle(item); // 绘制商圈围栏（圆）覆盖物
      } else if (isArray(polygon) && polygon.length) { // 显示多边形
        marker = createBusinessPolygon(item); // 绘制商圈围栏（多边形）覆盖物
      }
      marker[1] && markers.push(marker[1]);
      marker && layers.push(...marker);
    });
    const railOverlayGroups = new window.AMap.OverlayGroup(layers); // 围栏覆盖物群组
    mapIns.add(railOverlayGroups); // 添加到地图
    businessAreaRailRef.current && (mapIns.remove(businessAreaRailRef.current)); // 清除上一次的
    businessAreaRailRef.current = railOverlayGroups;
    markers.forEach(item => {
      const data = item?._opts?.extData;
      const preMarkerId = curViewMarkerRef.current;
      const isClick = preMarkerId === data.id;
      renderMarkerContent(data, isClick);
    });
  };

  // 创建多边形商圈
  const createBusinessPolygon = (item) => {
    const { lng, lat } = item;
    const preMarkerId = curViewMarkerRef.current;
    if (!(+lng && +lat)) return;
    const lnglat = [+lng, +lat];
    const path = item?.polygon?.map((item) => {
      return [+item.lng, +item.lat];
    });
    const isClick = preMarkerId === item.id;
    const fillColor = isClick ? markerActiveColorOption : markerDefaultColorOption;
    const uid:any = v4();
    const polygon = new window.AMap.Polygon({
      zooms: [CircleBusinessZoom.MinZomm, 20],
      path,
      strokeOpacity: 1,
      fillOpacity: 0.2,
      strokeWeight: 1,
      strokeStyle: 'dashed',
      // zIndex: 60,
      anchor: 'bottom-center',
      bubble: true,
      extData: {
        id: item.id
      },
      ...fillColor
      // ...(mainBrandsRank < 4 ? markerDefaultTopColorOption : markerDefaultColorOption)
    });
    const marker = new window.AMap.Marker({
      zooms: [CircleBusinessZoom.MinZomm, 20],
      position: lnglat,
      anchor: 'center',
      extData: { uid, ...item },
      content: `<div id=${uid}></div>`

    });
    polygon.on('click', () => businessAreaItemMarkerClick(item));
    marker.on('click', () => businessAreaItemMarkerClick(item));
    return [polygon, marker];
  };
  // 创建圆形商圈
  const createBusinessCircle = (item: any) => {
    const { lng, lat } = item;
    const preMarkerId = curViewMarkerRef.current;
    if (!(+lng && +lat)) return;
    const lnglat = [+lng, +lat];
    const isClick = preMarkerId === item.id;
    const fillColor = isClick ? markerActiveColorOption : markerDefaultColorOption;
    const uid:any = v4();
    const circle = new window.AMap.Circle({
      zooms: [CircleBusinessZoom.MinZomm, 20],
      center: lnglat,
      radius: item?.radius, // 半径（米）
      strokeWeight: 1,
      strokeOpacity: 1,
      fillOpacity: 0.2,
      strokeStyle: 'dashed',
      strokeDasharray: [10, 10],
      bubble: true, // 为了支持在商圈围栏上测距
      extData: item,
      ...fillColor,
      // ...(mainBrandsRank < 4 ? markerDefaultTopColorOption : markerDefaultColorOption)
    });
    const marker = new window.AMap.Marker({
      position: lnglat,
      zooms: [CircleBusinessZoom.MinZomm, 20],
      anchor: 'center',
      extData: { uid, ...item },
      content: `<div id=${uid}></div>`
    });
    circle.on('click', () => businessAreaItemMarkerClick(item));
    marker.on('click', () => businessAreaItemMarkerClick(item));
    return [circle, marker];
  };

  // 商圈|商圈围栏点击事件
  const businessAreaItemMarkerClick = (item) => {
    // const { lng, lat } = item;
    const preMarkerId = curViewMarkerRef.current;
    if (preMarkerId === item.id) return;
    form.setFieldsValue({
      businessName: item.areaName,
      circleBusinessId: item.id
    });
    // 将点击项移动到地图中心，17是初始化时的zoom
    // mapIns.setZoomAndCenter(TargetZoom, [+lng, +lat], false, 200);
    // 重置前一个点击样式
    if (preMarkerId) {
      const premarkersList = getMarkersById(preMarkerId);
      premarkersList.forEach((marks) => {
        if (marks.type === MapMarkerType.Marker) {
          renderMarkerContent(marks?._opts?.extData, false);
          // marks.setContent(renderMarkerContent(marks?._opts?.extData, false));
        } else {
          marks.setOptions(markerDefaultColorOption);
        }
      });
    }
    const markersList = getMarkersById(item.id);
    markersList.forEach((marks) => {
      if (marks.type === MapMarkerType.Marker) {
        renderMarkerContent(marks?._opts?.extData, true);
        // marks.setContent(renderMarkerContent(item, true));
      } else {
        marks.setOptions(markerActiveColorOption);
      }
    });
    curViewMarkerRef.current = item.id;
    // const lastMarker = curViewMarkerRef.current; // 上一个商圈marker
    // const railMarker = targetMarkerInOverlays(id, businessAreaRailRef.current); // 查找商圈围栏marker
  };

  const clearOverlayGroup = () => {
    businessAreaRailRef.current && (mapIns.remove(businessAreaRailRef.current)); // 清除上一次的
  };

  const flyToCurrentPos = (lng, lat) => {
    mapIns && mapIns.setZoomAndCenter(TargetZoom, [+lng, +lat], false, 200);
  };
  const getMarkersById = (id) => {
    if (!businessAreaRailRef.current) return [];
    const markers = (businessAreaRailRef.current._overlays as Array<any>).filter((item) => item?._opts?.extData?.id === id) || [];
    return markers;
  };
  const renderMarkerContent = (info, isClick) => {
    const { uid } = info;
    if (!uid) return;
    const Node = <div className={styles.markerWrapper}>
      <div
        className={styles.markerContent} style={{
          background: isClick ? '#FF861D ' : '#006AFF',
        }}>
        <Typography.Text style={{ maxWidth: 165, color: '#fff', fontSize: 12 }} ellipsis={{ tooltip: info.areaName }}>{info.areaName}</Typography.Text>
      </div>
      <div className={styles.point} style={{
        borderTopColor: isClick ? '#FF861D ' : '#006AFF'
      }}/>
    </div>;
    return ReactDOM.render(Node, document.getElementById(uid));
  };

  // 地图加载完成
  const mapLoadedHandle = (ins: any) => {
    ins && setMapIns(ins);
  };

  const handledistrict = (province, selectedOptions?:any) => {
    const currentProvincesStr = province?.join('') || '';
    const preProvincesStr = form.getFieldValue('targetAddress')?.join('') || '';
    // 判断是否是同一个省市区
    const isSameProvince = currentProvincesStr === preProvincesStr;
    const setValues = {
      targetAddress: province || [],
      targetAddressInfo: selectedOptions || []
    };
    if (!isSameProvince) {
      Object.assign(setValues, { businessName: '' });
      curViewMarkerRef.current = null;
    }
    form.setFieldsValue(setValues);
    setDistrictList(province || []);
  };

  const handleClickPosition = () => {
    if (!isNotEmptyAny(businessInfo)) return;
    const { lng, lat } = businessInfo;
    clearOverlayGroup();
    flyToCurrentPos(lng, lat);
    createBusinessLayers([businessInfo]);
  };

  return <div className={styles.mapWrapper}>
    <Amap
      mapOpts={{
        // zooms: [, 16],
      }}
      loaded={mapLoadedHandle}
      plugins={[
        'AMap.DistrictSearch',
        'AMap.PlaceSearch',
      ]}
    />
    <div className={styles.toolBar}>
      {
        !isBusiness && <>
          <ProvinceList
            className={styles.provinceList}
            type={1}
            value={districtList}
            onChange={onChangeProvince}
            changeOnSelect
            onDropdownVisibleChange={onDropdownVisibleChange}
            allowClear
          />
          <SearchInMap
            mapIns={mapIns}
            mapHelpfulInfo={mapHelpfulInfo}
            hideBorder
            autoCompleteConfig={{
              style: {
                marginLeft: 8
              }
            }}
            searchConfig={{
              style: {
                width: 280,
                height: 37
              },
            }}/>
        </>
      }
    </div>
    {
      isBusiness && <div className={styles.toolBottomBar}>
        <IconFont
          iconHref='iconic_mendiangengzhong'
          className='c-666'
          onClick={handleClickPosition}
        />
      </div>
    }
  </div>;
});


export default CirclebusinessMap;
