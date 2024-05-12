/**
 * @description 行业商圈 - 益禾堂
 * 从recommend/networkmap 拷贝过来的，做一些修改
 */
import { FC, useEffect, useRef, useState } from 'react';
import styles from './entry.module.less';
import MapCon from './components/MapCon';
import { useAmapLevelAndCityNew } from '@/common/hook/useAmapLevelAndCityNew';
import MapSearchList from './components/MapSearchList';
import { getBusinessAreaMapData, getBusinessAreaPaging, getBusinessPolygon, getBusinessStatisticsInfo, getSelection, getTreeSelection } from '@/common/api/networkplan';
import { NOT_MORE_DATA, RankStatus } from './ts-config';
import { debounce, isArray, isEqual } from '@lhb/func';
import OperateBox from './components/OperateBox';
import Loading from '@/common/components/AMap/Loading';
import { BUSINESS_ZOOM, CITY_LEVEL, COUNTRY_LEVEL, DISTRICT_LEVEL, DISTRICT_ZOOM, PROVINCE_LEVEL } from '@/common/components/AMap/ts-config';
import { areaList } from '@/common/api/common';
import { useDebounceEffect } from '@/common/hook/useEffectDebounce';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { message } from 'antd';
const NetworkPlanEditMap: FC<any> = () => {

  const [amapIns, setAmapIns] = useState<any>(null);
  const [businessTypeList, setBusinessTypeList] = useState<any>([]);// 商圈类型展示（二级name的数组）
  const [mapShowType, setMapShowType] = useState<number>(RankStatus.brandRank);// 展示商圈排名类型
  const [loading, setLoading] = useState<boolean>(true);// 列表loading
  const [listData, setListData] = useState<any>([]);// 列表-具体商圈addressMarker数据
  // const [polygonListData, setPolygonListData] = useState<any>([]);// 地图围栏数据
  const [leftListData, setLeftListData] = useState<any>([]);// 左侧数据-分页
  const [totalInfo, setTotalInfo] = useState<any>(null);// 总计商圈数
  const [circleData, setCircleData] = useState<any>([]);// 省市聚合数据
  const [searchParams, setSearchParams] = useState<any>(null);// 搜索框
  const [detailData, setDetailData] = useState<any>({
    visible: false,
    id: null,
    index: null
  }); // 列表详情页相关（与地图联动）
  const [searchModalData, setSearchModalData] = useState<any>({ visible: false }); // 全部筛选弹窗
  const [isOpenHeatMap, setIsOpenHeatMap] = useState<boolean>(false);// 监听工具箱中的人口热力是否打开
  const { level, city, district } = useAmapLevelAndCityNew(amapIns, false, true);
  const [isSelectToolBox, setIsSelectToolBox] = useState<boolean>(false);// 工具箱内部按钮是否激活
  const [isBusinessZoom, setIsBusinessZoom] = useState<boolean>(false);// 判断当前zoom是否可显示商圈围栏
  const [bounds, setBounds] = useState<any>(null);// 地图可视范围

  const pageRef = useRef<number>(1); // 虚拟列表下拉筛选的分页page
  const getLeftDataParamsRef = useRef<any>(null);// /记录上一次请求的params
  const selectionsRef = useRef<any>({});// 筛选项大全
  const commonParamsRef = useRef<any>(null);// 存放共同的params，减少到处拼凑params


  const getLeftListData = async(initData = false) => {
    // 处理pageRef为0的情况下，将其置为1（正常情况下难以复现，但是客户出现过该问题，误删！）
    if (pageRef.current === NOT_MORE_DATA) {
      pageRef.current = 1;
    }
    const params:any = {
      page: pageRef.current,
      size: 20,
      ...commonParamsRef.current
    };
    if (isEqual(getLeftDataParamsRef.current, params)) return;// 如果参数一样，则直接return，不在请求
    getLeftDataParamsRef.current = params;

    setLoading(true);

    Promise.all([getBusinessAreaPaging(params), getBusinessStatisticsInfo(params)]).then((res) => {
      if (res[0]?.objectList === null || !res[0]?.objectList?.length) {
        pageRef.current = NOT_MORE_DATA;
      }
      if (initData) {
        setLeftListData(res[0]?.objectList || []);
      } else {
        setLeftListData((state) => [...state, ...res[0]?.objectList || []]);
      }
      // 获取商圈总数和已开门店
      setTotalInfo({
        // openStoreCount: res[1]?.statistics?.openStoreCount,
        totalNum: res[1]?.statistics?.planClusterCount
      });
    }).finally(() => {
      setLoading(false);
    });
  };
  // 获取商圈总数和已开门店
  // const getTotalInfo = async (params) => {
  //   const value = await getBusinessStatisticsInfo(params);
  //   setTotalInfo({
  //     totalNum: value?.statistics?.planClusterCount
  //   });
  // };

  // 获取地图商圈数据--供地图使用
  const getListData = async(curPage = 1, lastData:any[] = []) => {
    if (level < DISTRICT_LEVEL) return;
    const size = 500;
    const params = {
      ...commonParamsRef.current,
      showPolygon: isBusinessZoom,
      onlyLatLng: true,
      size,
    };

    Promise.all([
      getBusinessPolygon({ ...params, page: curPage, onlyLatLng: curPage !== 1 }),
      getBusinessPolygon({ ...params, page: curPage + 1 }),
      getBusinessPolygon({ ...params, page: curPage + 2 }),
      getBusinessPolygon({ ...params, page: curPage + 3 }),
      getBusinessPolygon({ ...params, page: curPage + 4 }),
      getBusinessPolygon({ ...params, page: curPage + 5 }),
    ]).then((res) => {
      const newArr = [...res[0], ...res[1], ...res[2], ...res[3], ...res[4], ...res[5], ...lastData];
      if (res[5].length === size) {
        // 还有数据，接着请求
        getListData(curPage + 6, newArr);
      } else {
        setListData(newArr);
        // 放这里，保证先请求getPolygon的数据，将这个请求后置
        getLeftListData(true);
      }
    });
  };

  // 获取地图聚合数据
  const getCircleData = async() => {
    // 在全国、省份和市情况下才需要获取
    if (![PROVINCE_LEVEL, COUNTRY_LEVEL, CITY_LEVEL].includes(level)) {
      return;
    }
    // 在全国、省份和市情况下才需要获取
    if (level >= DISTRICT_LEVEL) return;
    const data = await getBusinessAreaMapData(commonParamsRef.current);
    setCircleData(data);
    getLeftListData(true);
  };

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

  useDebounceEffect(() => {
    if (!amapIns) return;
    pageRef.current = 1;
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
    searchParams?.districtIdList?.map((item) => {
      if (!districtIdList.includes(+item)) {
        item && districtIdList.push(+item);
        item && selectedDistrictIdList.push(+item);
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
    const clusterTypes = isArray(businessTypeList) && !businessTypeList.length ? { firstLevelCategoryIdList: [-1] } : { secondLevelCategory: businessTypeList };
    const commonParams = {
      isYht: true,
      ...clusterTypes,
      ...searchParams, // 筛选项相关参数
      ...mapParams, // 地图级别、城市id参数
    };
    commonParamsRef.current = commonParams;
    // getLeftListData(true);
    getListData();
    getCircleData();
  }, [amapIns, district?.id, level, businessTypeList, searchParams, isBusinessZoom, bounds], 300);

  useEffect(() => {

    Promise.all([
      // module 1 网规相关，2行业商圈 （通用版）
      getSelection({ module: 1 }),
      getTreeSelection({ type: 2, module: 1 }),
      areaList({ type: 1 })
    ]).then(res => {
      selectionsRef.current = ({ ...res[0], businesses: res[1], cities: res[2] });
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

  useDebounceEffect(() => {
    if (city?.province && city?.name) {
      V2Message.info(`当前已切换到${city?.province}/${city?.name}`);
    }
    message.config({ maxCount: 1 });
  }, [city?.id], 300);

  return (
    <div className={styles.container}>
      <Loading amapIns={amapIns}/>
      {/* 除右侧列表和地图外的页面的所有操作入口 */}
      <OperateBox
        amapIns={amapIns}
        city={city}
        level={level}
        setIsOpenHeatMap={setIsOpenHeatMap}
        setBusinessTypeList={setBusinessTypeList}
        setMapShowType={setMapShowType}
        searchModalData={searchModalData}
        setSearchParams={setSearchParams}
        setSearchModalData={setSearchModalData}
        selectionsRef={selectionsRef}
        setIsSelectToolBox={setIsSelectToolBox}
      />
      {/* 右侧-列表数据及详情 */}
      <MapSearchList
        loading={loading}
        data={leftListData}
        appendData={getLeftListData}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        setDetailData={setDetailData}
        detailData={detailData}
        searchModalData={searchModalData}
        setSearchModalData={setSearchModalData}
        amapIns={amapIns}
        pageRef={pageRef}
        totalInfo={totalInfo}
      />
      <MapCon
        setAmapIns={setAmapIns}
        amapIns={amapIns}
        level={level}
        listData={listData}
        circleData={circleData}
        setDetailData={setDetailData}
        detailData={detailData}
        city={city}
        leftListData={leftListData}
        isOpenHeatMap={isOpenHeatMap}
        mapShowType={mapShowType}
        // polygonListData={polygonListData}
        selectionsRef={selectionsRef}
        isSelectToolBox={isSelectToolBox}
        isBusinessZoom={isBusinessZoom}
      />

    </div>
  );
};

export default NetworkPlanEditMap;
