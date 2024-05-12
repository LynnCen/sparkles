/**
 * @Description 规划管理审批详情-地图
 */
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import styles from './index.module.less';
import V2Form from '@/common/components/Form/V2Form';
import IconFont from '@/common/components/IconFont';
import RecommendSidebar from '@/common/components/business/RecommendSidebar';
// import AMap from '@/common/components/AMap';
import { useAmapLevelAndCityNew } from '@/common/hook/useAmapLevelAndCityNew';
import MapDrawer from '@/common/components/business/MapDrawer';
import { getAreaMapData, getTreeSelection, getSelection, getCapacityArea, getPolygon } from '@/common/api/networkplan';
import MapEvent from './MapEvent';
import { Cascader, Form, Switch, message } from 'antd';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
import { debounce, refactorSelection } from '@lhb/func';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { dataType, BusinessAreaType, RankStatus, maxAddressMarkerCount } from '../../ts-config';

import { DISTRICT_LEVEL, PROVINCE_LEVEL, CITY_LEVEL, BUSINESS_ZOOM, DISTRICT_ZOOM } from '@/common/components/AMap/ts-config';
import { useDebounceEffect } from '@/common/hook/useEffectDebounce';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

const mapShowTypeSession = [
  { label: '地址名', value: RankStatus.normal },
  { label: '奶茶行业评分排名', value: RankStatus.brandRank },
  { label: '益禾堂评分排名', value: RankStatus.yhtRank },
];

const MapCon:FC<any> = ({
  setIsMap,
  detail,
  detailData,
  setDetailData,
  setAmapIns,
  amapIns,
  setActiveTab,
  activeTab,
  data,
  selectedBusinessDistrict,
  setSelectedBusinessDistrict,
  setCurSelectRightList,
  curClickTypeRef
}) => {
  const [form] = Form.useForm();
  const [areaSelect, setAreaSelect] = useState<any>([]);
  const [rightDrawerVisible, setRightDrawerVisible] = useState<boolean>(true);
  const [businessOptions, setBusinessOptions] = useState<any>([]);
  const [area, setArea] = useState<any>([]);
  const [businessDistrictType, setBusinessDistrictType] = useState<any>(null);
  const [circleData, setCircleData] = useState<any>([]);
  const [businessData, setBusinessData] = useState<any>([]);
  const [isBusinessZoom, setIsBusinessZoom] = useState<boolean>(false);// 判断当前zoom是否可显示商圈围栏
  const [isShowBusinessDistrict, setIsShowBusinessDistrict] = useState<boolean>(true);// 是否展示商区围栏，默认true
  const [areaData, setAreaData] = useState<any>([]);// 市场容量（商区围栏）数据
  const [businessAreaMap, setBusinessAreaMap] = useState<any>();// 市场容量（商区围栏）和商圈点位的映射map结构
  const [mapShowType, setMapShowType] = useState<number>(RankStatus.brandRank);// 展示商圈排名类型
  const [bounds, setBounds] = useState<any>(null);// 地图可视范围

  const commonParamsRef = useRef<any>(null);// 存放共同的params，减少到处拼凑params

  const { level, city, district } = useAmapLevelAndCityNew(amapIns, false, true);

  const selectionsRef = useRef<any>(null);


  const getSelect = async() => {
    // module 1 网规相关，2行业商圈 （通用版）
    const { firstLevelCategory } = await getSelection({ module: 1 });
    const res = firstLevelCategory.map((item) => {
      return {
        ...item,
        value: item.id,
        label: item.name
      };
    });
    setBusinessOptions(res);
  };
  const getAreaSelect = async() => {
    const res = await getTreeSelection({
      planId: detail?.planId,
      type: 1, // 1城市，2商圈
      childCompanyId: detail.branchCompanyId
    });
    setAreaSelect(res);
  };

  // 获取地图商圈点位数据--供地图使用
  const getListData = async(curPage = 1, lastData:any[] = []) => {
    if (level < DISTRICT_LEVEL || !commonParamsRef.current?.cityIds?.length) return;
    const size = 500;
    const params = {
      ...commonParamsRef.current,
      showPolygon: isBusinessZoom,
      onlyLatLng: true,
      size,
    };

    Promise.all([
      // 第一次请求加一个请求详细数据的参数
      getPolygon({ ...params, page: curPage, onlyLatLng: curPage !== 1 }),
      getPolygon({ ...params, page: curPage + 1 }),
      getPolygon({ ...params, page: curPage + 2 }),
      getPolygon({ ...params, page: curPage + 3 }),
      getPolygon({ ...params, page: curPage + 4 }),
      getPolygon({ ...params, page: curPage + 5 }),
    ]).then((res) => {
      const newArr = [...res[0], ...res[1], ...res[2], ...res[3], ...res[4], ...res[5], ...lastData];
      if (res[5].length === size) {
        // 还有数据，接着请求
        getListData(curPage + 6, newArr);
      } else {
        setBusinessData(newArr);
      }
    });
  };

  // 获取地图聚合数据
  const getCircleData = async() => {
    // getRightListData(true);
    // 在全国、省份和市情况下才需要获取
    if (level >= DISTRICT_LEVEL) return;
    const data = await getAreaMapData(commonParamsRef.current);
    setCircleData(data);
  };

  // new
  const handleZoomEnd = debounce(() => {
    const zoom = amapIns?.getZoom();
    setIsBusinessZoom(zoom > BUSINESS_ZOOM);

    if (zoom > DISTRICT_ZOOM) {
      const { southWest, northEast } = amapIns.getBounds(); // 获取地图可视区域的坐标
      /**
       *  当一个屏幕在zoom为BUSINESS_ZOOM的情况下，
       *  maxLat-minLat约为0.05、maxLng-minLng约为0.1
       *  四个角各取1/4增大范围，能让用户在小范围移动时，已经提前加载出点位，同时能够让点位中心不在可视范围，但商圈围栏在可视范围内的也展示出来
       */
      const target = {
        minLat: southWest.lat - 0.05 / 8,
        maxLat: northEast.lat + 0.05 / 8,
        minLng: southWest.lng - 0.1 / 8,
        maxLng: northEast.lng + 0.1 / 8,
      };
      setBounds(target);

    }
  }, 100);
  // 获取地图市场容量（商区围栏）数据
  const getAreaData = async() => {
    if (level < DISTRICT_LEVEL) return;
    // if (level < DISTRICT_LEVEL || !Array.from(businessAreaMap?.keys()).length) return;
    const data = await getCapacityArea({
      ...commonParamsRef.current,
      // ...params,
      businessAreaIds: Array.from(businessAreaMap?.keys())
    });
    setAreaData(data);
  };
  const changeMapType = (value) => {
    setMapShowType(value);
  };


  useEffect(() => {
    getSelect();
    getAreaSelect();
  }, []);

  // useEffect(() => {
  //   if (!amapIns) return;
  //   getListData();
  //   getCircleData();
  // }, [amapIns, level, district?.id, isBusinessZoom, businessDistrictType, area, activeTab]);

  // 处理省市区、地图级别、商圈类型、搜索项、状态更新后重新请求接口
  useDebounceEffect(() => {
    if (!amapIns) return;
    // mapParams 存放地图 相关参数
    let mapParams:any = { level };
    if (city?.provinceId && level >= PROVINCE_LEVEL) {
      mapParams = { ...mapParams, provinceIdList: [city?.provinceId] };
    };
    if (city?.id && level >= CITY_LEVEL) {
      mapParams = { ...mapParams, cityIds: [city?.id] };
    }
    let districtIdList:any = [];
    let selectedDistrictIdList:any = [];
    // 获取所有筛选项的districtIdList
    area.map((item) => {
      if (!districtIdList.includes(+item[2])) {
        item[2] && districtIdList.push(+item[2]);
        item[2] && selectedDistrictIdList.push(+item[2]);
      };
    });
    if (district?.id && level >= DISTRICT_LEVEL) {
      // 如果此时没有筛选项，且在区级别以下，默认取地区中心点区
      if (districtIdList?.length === 0 || districtIdList.includes(district?.id)) {
        districtIdList = [district?.id];
      } else {
        // 筛选项不包括中心点
        districtIdList = [-1];
      }

    }
    mapParams = { ...mapParams, districtIdList };

    // 当在可显示区级别范围下，才根据可视范围+已筛选商圈
    if (level === DISTRICT_LEVEL) {
      // 在传可视范围情况下，如果没有筛选项，则不传districtIdList
      if (selectedDistrictIdList.length === 0) {
        selectedDistrictIdList = undefined;
      }
      mapParams = { ...mapParams, ...bounds, districtIdList: selectedDistrictIdList };
    }

    // 注意，商圈类型按照有无选择，传的参数字段不同
    // const clusterTypes = isArray(businessTypeList) && !businessTypeList.length ? { firstLevelCategoryIdList: [-1] } : { secondLevelCategoryIdList: businessTypeList };
    const commonParams = {
      branchCompanyId: detail?.branchCompanyId,
      planId: detail?.planId,
      tab: activeTab === BusinessAreaType ? undefined : activeTab,
      firstLevelCategoryId: businessDistrictType,
      ...mapParams, // 地图级别、城市id参数
    };

    commonParamsRef.current = commonParams;
    getListData();
    // getRightListData(true);
    getCircleData();
  }, [amapIns, district?.id, level, bounds, isBusinessZoom, area, activeTab, businessDistrictType], 100);

  // new
  useEffect(() => {
    Promise.all([
      // module 1 网规相关，2行业商圈 （通用版）
      getSelection({ module: 1 }),
      getTreeSelection({ planId: data?.planId, type: 1, childCompanyId: data?.branchCompanyId }),
    ]).then(res => {
      selectionsRef.current = ({ ...res[0], cities: res[1] });
    });
  }, []);
  // 判断当前zoom是否可显示商圈围栏
  useEffect(() => {
    if (!amapIns) return;
    // 监听地图缩放移动，手动缩放也会触发move
    amapIns.on('moveend', handleZoomEnd);
    return () => {
      amapIns.off('moveend', handleZoomEnd);
    };
  }, [amapIns]);
  useEffect(() => {
    const map = new Map();
    businessData.map((item) => {
      if (!item.businessAreaId) return;
      if (map.has(item.businessAreaId)) {
        const arr = map.get(item.businessAreaId);
        map.set(item.businessAreaId, [...arr, item.id]);
        return;
      }
      map.set(item.businessAreaId, [item.id]);
    });
    setBusinessAreaMap(map);
  }, [businessData]);

  useEffect(() => {
    // 如果数量大于maxAddressMarkerCount，此时不会显示市场容量
    if (businessData.length >= maxAddressMarkerCount) return;
    getAreaData();
  }, [businessAreaMap]);

  useEffect(() => {
    return () => {
      setAmapIns(null);
    };
  }, []);
  useEffect(() => {
    if (selectedBusinessDistrict.visible && selectedBusinessDistrict.businessAreaId) {
      const valueArr = businessAreaMap?.get(selectedBusinessDistrict.businessAreaId);
      const list:any = [];
      businessData.map((item) => {
        if (valueArr?.includes(item.id)) {
          list.push(item);
        }
      });
      setCurSelectRightList(list);
    }
  }, [businessAreaMap, selectedBusinessDistrict.id, businessData]);

  useDebounceEffect(() => {
    if (city?.province && city?.name) {
      V2Message.info(`当前已切换到${city?.province}/${city?.name}`);
    }
    message.config({ maxCount: 1 });
  }, [city?.id], 300);

  const model = useMemo(() => {
    return { provinceCode: city?.provinceId, cityId: city?.id };
  }, [city?.provinceId, city?.id]);

  return <div className={styles.mapBox}>

    <V2Form layout='inline' className={styles.form} form={form}>
      {/* 规划类型  */}
      <V2FormSelect
        name='tab'
        allowClear={false}
        // dataType第一项 商区列表 = > 全部
        options={
          dataType.map((item) => {
            if (item.key === BusinessAreaType) {
              return {
                ...item,
                label: '全部'
              };
            } else {
              return item;
            }
          })}
        onChange={(e) => { setActiveTab(e); }}
        config={{
          // defaultValue: activeTab === BusinessAreaType ? undefined : activeTab
          defaultValue: activeTab
        }}
      />
      {/* 规划区域 */}
      <V2FormCascader
        name='area'
        options={refactorSelection(areaSelect, { children: 'child' })}
        config={{
          multiple: true,
          showCheckedStrategy: Cascader.SHOW_CHILD,
          maxTagCount: 'responsive',
          style: {
            width: 136
          }
        }}
        onChange={(e) => setArea(e)}
        placeholder='请选择区域'
      />
      {/* 类型 */}
      <V2FormSelect
        name='businessDistrictType'
        options={businessOptions}
        placeholder='请选择商圈类型'
        onChange={(e) => { setBusinessDistrictType(e); }}
      />
      {/* 展示类型 */}
      <V2FormSelect
        name='rankStatus'
        options={mapShowTypeSession}
        onChange={(e) => { changeMapType(e); }}
        config={{
          defaultValue: mapShowType,
          style: {
            width: 160
          }
        }}
        allowClear={false}
      />
    </V2Form>
    <div className={styles.backBtn} onClick={() => {
      setIsMap(false);
      setDetailData({ id: null, visible: false });
      setSelectedBusinessDistrict({ id: null, visible: false });
    }}>
      <IconFont iconHref='iconic_fanweiliebiao' className='inline-block mr-12' />返回列表
    </div>
    {level === DISTRICT_LEVEL ? <div className={styles.showBusiness}>
      <span className='mr-8'>展示商区围栏</span>
      <Switch
        size='small'
        checked={isShowBusinessDistrict}
        onChange={() => { setIsShowBusinessDistrict((state) => !state); }}/>
    </div> : <></>}

    <MapDrawer
      placement='right'
      mapDrawerStyle={{
        width: '240px',
        top: '17px',
        height: 'max-content', // 动态高度
        right: '48px',
        maxHeight: 'calc(100vh - 700px)', // 动态高度，70是根据UI稿
        transform: rightDrawerVisible ? 'translateX(0%)' : 'translateX(288px)'
      }}
      visible={rightDrawerVisible}
      setVisible={setRightDrawerVisible}
    >
      <RecommendSidebar
        amapIns={amapIns}
        model={model}
        scopeCheck={false}
      />
    </MapDrawer>

    <MapEvent
      amapIns={amapIns}
      setAmapIns={setAmapIns}
      level={level}
      listData={businessData}
      circleData={circleData}
      setDetailData={setDetailData}
      detailData={detailData}
      city={city}
      // polygonListData={polygonListData}
      // leftListData={undefined}
      // isBranch={undefined}
      // isOpenHeatMap={undefined}
      mapShowType={mapShowType}
      // isShape={undefined}
      // isSelectToolBox={undefined}
      // drawedRef={undefined}
      selectionsRef={selectionsRef}// 这个需要加，这个是拿到标志的icon、颜色
      isBusinessZoom={isBusinessZoom}// 这个需要加，拿到显示围栏的范围
      isShowBusinessDistrict={isShowBusinessDistrict}// 这个需要加，是否展示商区围栏
      setSelectedBusinessDistrict={setSelectedBusinessDistrict}// 这个需要加，设置选中围栏的详情
      selectedBusinessDistrict={selectedBusinessDistrict}// 这个需要加，围栏的详情
      curClickTypeRef={curClickTypeRef}
      areaData={areaData}// 这个需要加，市场容量（商区围栏）数据
      businessAreaMap={businessAreaMap}// 这个需要加
      activeTab={activeTab}
    />
  </div>;
};
export default MapCon;
