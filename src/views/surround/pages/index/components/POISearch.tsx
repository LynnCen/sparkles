/**
 * @Description 地图poi兴趣点的搜索,
 */
import { AutoComplete, Tooltip } from 'antd';
import React, { useState, useRef, useEffect, CSSProperties } from 'react';
import { useMethods } from '@lhb/hook';
import { debounce, isUndef } from '@lhb/func';
import { codeToPCD } from '@/common/api/common';
import { getCurPosition, getLngLatAddress } from '@/common/utils/map';
import { diyShape } from '../ts-config';

// 地图搜索插件
interface Props {
  form: any,
  cityInfoRef: any;
  boxStyle?: CSSProperties, // 框元素的样式
  citylimit?: boolean, // 是否强制在范围内搜索
  alwaysCountrySearch?: boolean, // 总是在全国范围内搜索
  mapIns?: any,
  debounceTimeout?: number;
  classNames?: any;
  // city?:any; // 省市地址信息对象
  // level?:number;
  radius?: number|string;
  onChange?: Function;
  searchValue: string,
  setSearchValue: Function;
  cityLimitName?: string;
  centerMarkerRef: any;
  circleMarkerRef: any;
  setCityInfoValue: (ids: number[]) => void;
  setTargetName: (name: string) => void;
  isDiyShapeRef:any;// 查询范围是否为自定义形状
  isDrawing:boolean;// 是否正在绘制中
  changePoint:any;
}

const POISearch: React.FC<Props> = ({
  form,
  cityInfoRef,
  boxStyle = {},
  cityLimitName = '',
  citylimit = true,
  // alwaysCountrySearch = true,
  mapIns,
  debounceTimeout = 300,
  classNames,
  // city,
  // level,
  radius,
  onChange,
  searchValue,
  setSearchValue,
  centerMarkerRef,
  circleMarkerRef,
  setCityInfoValue,
  setTargetName,
  isDiyShapeRef, // 查询范围是否为自定义形状
  isDrawing, // 是否正在绘制中
  changePoint, // 更新后模拟地图click后触发的事件
}) => {
  const fetchRef = useRef(0);
  const [result, setResult] = useState<any>({
    fetching: false,
    list: []
  });
  const [options, setOptions] = useState<any>([]);
  const [POISearchIns, setPOISearchIns] = useState<any>(null);
  // 分割线
  // const centerMarkerRef: any = useRef(null); // 中心点marker
  // const circleMarkerRef: any = useRef(null); // 圆形矢量图marker

  useEffect(() => {
    if (!mapIns) return;
    // 没有半径时隐藏圆形矢量物
    if (!radius) {
      circleMarkerRef.current && circleMarkerRef.current.hide();
      form.resetFields(['radius']);
      return;
    }
    // 如果是自义定形状，则隐藏圆形矢量物
    if (radius === diyShape) {
      circleMarkerRef.current && circleMarkerRef.current.hide();
      return;
    }
    // 已经绘制过圆形矢量物,更新相关参数
    if (circleMarkerRef.current) {
      circleMarkerRef.current.show();
      // 这里需要先获取center在设置，否则会有问题
      // 原因：没有去设置新的位置
      // 场景：先生成circleMarker，再重置，再点击地图更换位置，再选择查询范围
      circleMarkerRef.current.setCenter(centerMarkerRef?.current?.getPosition());
      circleMarkerRef.current.setRadius(radius);
      // 设置半径后马上调整地图范围，调整结果不符合预期，因此加上延时，等DOM更新循环之后再处理
      setTimeout(() => {
        mapIns.setFitView(circleMarkerRef.current);
      }, 0);
      return;
    }

    // 还没有绘制过圆形矢量物
    let center = mapIns.getCenter(); // 获取此时的地图中心点
    if (centerMarkerRef.current) { // 获取点击地图后标注的位置，优先使用点击位置
      center = centerMarkerRef.current._position;
    }
    // 绘制圆形矢量物
    const circleMarker = new window.AMap.Circle({
      center: center,
      radius, // 默认半径1km
      strokeColor: 'transparent', // 线条颜色
      strokeOpacity: 1, // 轮廓线透明度
      strokeWeight: 0, // 线宽
      fillOpacity: 0.18, // 填充透明度
      strokeStyle: 'solid',
      // strokeDasharray: [5, 5],
      fillColor: '#006AFF', // 填充颜色
      zIndex: 20,
      bubble: true,
    // zooms: [13, 20]
    });
    mapIns.add(circleMarker);
    circleMarkerRef.current = circleMarker;
    mapIns.setFitView(circleMarker);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radius]);

  // 地图实例生成后的初始化
  useEffect(() => {
    if (!mapIns) return;
    mapIns.on('click', amapClickHandle); // 点击
    if (centerMarkerRef.current) return;
    // 浏览器定位
    getCurPosition(mapIns, {
      showButton: false,
      showMarker: false
    }).then(async (res: any) => {
      const { position } = res;
      const centerMarker = addMarker(position);
      mapIns.add(centerMarker);
      mapIns.setFitView(centerMarker);
      centerMarkerRef.current = centerMarker;
    });

    return () => { // 解除监听事件
      mapIns.off('click', amapClickHandle);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapIns]);

  const {
    onValueChange,
    loadData,
    changePoiSelect,
    loadDataHandle,
    debounceLoadData,
    addMarker, // 添加中心点覆盖物
    amapClickHandle,
    getAddress
  } = useMethods({
    addMarker: (position) => {
      const size = new window.AMap.Size(30, 30);
      const customIcon = new window.AMap.Icon({
        // 图标尺寸
        size,
        // 图标的取图地址
        image: 'https://staticres.linhuiba.com/project-custom/location-insight/icon_marker_point@2x.png',
        // 图标所用图片大小
        imageSize: size,
        // 图标取图偏移量
        // imageOffset: new AMap.Pixel(0, 10)
      });
      return new window.AMap.Marker({
        position,
        anchor: 'center', // 底部中间为基准点
        icon: customIcon,
        offset: new window.AMap.Pixel(0, 0),
        zIndex: 30
        // zooms: [13, 20]
      });
    },
    // 地图点击
    amapClickHandle: async(e: any) => {
      if (isDiyShapeRef.current) return;
      console.log('isDiyShapeRef', isDiyShapeRef);
      const { lnglat: center } = e; // lnglat是高德格式的位置对象
      const { lng, lat } = center;
      mapIns.setCenter(center);
      if (isUndef(lng) || isUndef(lat)) return;

      centerMarkerRef.current && (centerMarkerRef.current.setPosition(center)); // 更新中心点位置
      if (circleMarkerRef.current && radius) {
        circleMarkerRef.current.setCenter(center);
      }
      getAddress(center);
    },
    getAddress: async(center) => {
      const addressInfo: any = await getLngLatAddress(center, '', false).catch((err) => console.log(`根据经纬度查询具体地址失败：${err}`));
      // console.log(`addressInfo`, addressInfo);
      const { formattedAddress, addressComponent } = addressInfo;
      const { adcode, city } = addressComponent || {};
      let pcdInfo: any = null;
      if (adcode) {
        // 通过adcode获取数据库里的城市信息
        pcdInfo = await codeToPCD({
          districtCode: adcode,
          cityName: city
        });
        // 同步限定的搜索城市和查询城市的省市
        cityInfoRef.current = pcdInfo;
        const { provinceId, cityId, cityName, provinceName } = pcdInfo || {};
        provinceId && cityId && setCityInfoValue([provinceId, cityId]);
        setTargetName(cityName || provinceName);
      }
      onChange && onChange({
        lng: center.lng,
        lat: center.lat,
        address: formattedAddress,
        cityId: pcdInfo?.cityId
      });
      setSearchValue(formattedAddress || '');
      form.setFieldValue('keyword', formattedAddress);
    },
    onValueChange: (val) => {
      setSearchValue(val);
    },
    loadData: async (keyword: string) => {
      let ins;
      // 设置城市
      if (!POISearchIns) {
        ins = new window.AMap.PlaceSearch({
          pageSize: 10, // 单页显示结果条数
          pageIndex: 1, // 页码
          city: cityLimitName, // 兴趣点城市
          citylimit: citylimit, // 是否强制限制在设置的城市内搜索
          extensions: 'all'
        });
        setPOISearchIns(ins);
      } else {
        POISearchIns.setCity(cityLimitName);
        ins = POISearchIns;
      };
      return new Promise(function (resolve,) {
        ins.search(keyword, function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            resolve(result?.poiList?.pois || []);
          } else {
            resolve([]);
          };
        });
      });
    },
    // 搜索结果
    loadDataHandle: async (keyword: string, fetchId?: number) => {
      const data = await loadData(keyword);
      if (fetchId && (fetchId !== fetchRef.current)) return;
      const options = data.map(_ => {
        return {
          value: _.id,
          label: (
            <div className='poiSearchOption mb-7'>
              <div className='fn-14 c-132'>
                {_.name}
              </div>
              <Tooltip title={`${_.pname}${_.pname === _.cityname ? '' : _.cityname}${_.adname}${_.address}`}>
                <div className='fn-12 c-959'>
                  {_.pname}{_.pname === _.cityname ? '' : _.cityname}{_.adname}{_.address}
                </div>
              </Tooltip>
            </div>
          )
        };
      });
      setResult({
        fetching: false,
        list: data
      });
      setOptions(options);
    },
    // 地点搜索
    debounceLoadData: debounce((keyword: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setResult({
        fetching: true,
        list: [],
      });
      loadDataHandle(keyword, fetchId);
    }, debounceTimeout),
    // 选择搜索结果
    changePoiSelect: async(value) => {
      const selectedPoi = result.list.filter(poi => poi.id === value);
      // 这里是从选项中筛选出来的所以必定有结果
      const poi = selectedPoi[0];
      const { location } = poi || {};

      let pcdInfo: any = null;
      if (poi.adcode && poi.cityname) {
        // 通过adcode获取数据库里的城市信息
        pcdInfo = await codeToPCD({
          districtCode: poi.adcode,
          cityName: poi.cityname
        });
        // 同步限定的搜索城市和查询城市的省市
        cityInfoRef.current = pcdInfo;
        const { provinceId, cityId, cityName, provinceName } = pcdInfo || {};
        provinceId && cityId && setCityInfoValue([provinceId, cityId]);
        setTargetName(cityName || provinceName);
      }
      onChange && onChange({
        lng: location.lng,
        lat: location.lat,
        address: poi.name,
        cityId: pcdInfo?.cityId
      });
      setSearchValue(poi.name);
      form.setFieldValue('keyword', poi.name);
      // 设置地图中心点来触发地图平移
      const center = [location.lng, location.lat];
      mapIns.setCenter(center);
      centerMarkerRef.current && (centerMarkerRef.current.setPosition(center));
      if (circleMarkerRef.current && radius) {
        circleMarkerRef.current.setCenter(center);
      }

      setResult({
        fetching: false,
        list: []
      });
      setOptions([]);
    },
  });

  useEffect(() => {
    // 0是初始化,不触发
    if (changePoint.update !== 0) {
      centerMarkerRef.current && (centerMarkerRef.current.setPosition([changePoint.lnglat.lng, changePoint.lnglat.lat])); // 更新中心点位置
      getAddress(changePoint.lnglat);
    }
  }, [changePoint.update]);

  return (
    <div className={classNames} style={boxStyle}>
      <AutoComplete
        value={searchValue}
        placeholder='请输入要查询的地点'
        options={options}
        onSearch={debounceLoadData}
        onSelect={changePoiSelect}
        allowClear={true}
        onChange={(value) => onValueChange(value)}
        disabled={isDrawing}
      ></AutoComplete>
    </div>
  );
};

export default POISearch;
