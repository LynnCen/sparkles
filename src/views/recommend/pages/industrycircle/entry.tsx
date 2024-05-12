/**
 * @Description 行业商圈通用版
 * 需要注意的点
 * 1. 只有该页面的商圈信息有街铺类型，行业商圈和网规的商圈信息是没有街铺类型的
 * 2. 筛选条件只在区级展示
 * 3. 本品牌分布只在区级展示，还要过滤掉部分没有机会点（导入的数据时）的数据
 * 4. 搜索栏用的是新的搜索栏
 * 5. 筛选条件在非区级的时候需要清空
 */
import { useRef, useEffect, useState, useMemo } from 'react';
import { useAmapLevelAndCityNew } from '@/common/hook/useAmapLevelAndCityNew';
import { debounce, isArray, isEqual } from '@lhb/func';
import { dropdownRows, targetCityIdShowHousing } from './ts-config';
import {
  industryCircleList,
  industryCircleClusterList,
  industryCircleDistrictList,
} from '@/common/api/networkplan';
import { getSelection as getBusinessCircleTypeSelection } from '@/common/api/networkplan';
import { BUSINESS_ZOOM, CITY_LEVEL, COUNTRY_LEVEL, DISTRICT_LEVEL, PROVINCE_LEVEL } from '@/common/components/AMap/ts-config';
// import cs from 'classnames';
import styles from './entry.module.less';
import ActionBar from './components/ActionBar';
import MapCon from './components/MapCon';
import MapSearchList from './components/MapSearchList';
import Loading from '@/common/components/AMap/Loading';
import { useDebounceEffect } from '@/common/hook/useEffectDebounce';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { message } from 'antd';

const IndustryCircle = () => {
  const pageRef: any = useRef<number>(1); // 虚拟列表下拉筛选的分页page
  const pcdIdRef: any = useRef<any>({}); // 省市区id的缓存
  // const [PCDVal, setPCDVal] = useState<any>({}); // 省市区数据
  const [amapIns, setAmapIns] = useState<any>(); // 地图实例
  const [isOpenHeatMap, setIsOpenHeatMap] = useState<boolean>(false);// 监听工具箱中的人口热力是否打开
  const [dropdownRowActive, setDropdownRowActive] = useState<number>(dropdownRows[0].id); // 操作行选中
  const [isSelectToolBox, setIsSelectToolBox] = useState<boolean>(false);// 工具箱内部按钮是否激活
  const [selection, setSelection] = useState<any>({}); // 筛选项
  const [showRailPath, setShowRailPath] = useState<boolean>(false); // 只展示商圈围栏
  const mapHelpfulInfo = useAmapLevelAndCityNew(amapIns, false, true); // 监听地图相关的数据
  const [searchParams, setSearchParams] = useState<any>({}); // 接口入参（商品信息和筛选条件）
  const [listLoading, setListLoading] = useState<boolean>(true); // 列表loading
  const [businessCircleData, setBusinessCircleData] = useState<any[]>([]); // 右侧的商圈列表
  const [totalInfo, setTotalInfo] = useState<any>({ totalNum: 0 });// 右侧的商圈列表总数
  const [clusterDataInMap, setClusterDataInMap] = useState<any[]>([]); // 地图上聚合状态的数据
  const [districtDataInMap, setDistrictDataInMap] = useState<any[]>([]); // 地图上区级别的数据
  const [showRailForSelf, setShowRailForSelf] = useState<boolean>(false); // 不开启只展示商圈围栏按钮时，显示围栏的时机
  const [bounds, setBounds] = useState<any>(null);// 地图可视范围
  const [detailData, setDetailData] = useState<any>({
    visible: false,
    id: null,
    detail: null // 存放详情相关字段
  }); // 列表详情页相关（与地图联动）
  const { city, district, level } = mapHelpfulInfo;

  // 不同级别下，只需要对应的id
  const pcdId = useMemo(() => {
    const { provinceId, id: cityId } = city || {};
    const { id: districtId } = district || {};
    if (level === COUNTRY_LEVEL) return {}; // 全国视角下（省份的聚合）
    if (level === PROVINCE_LEVEL && provinceId) return { provinceId }; // 省视角下（城市的聚合）
    if (level === CITY_LEVEL && provinceId && cityId) return { provinceId, cityId }; // 城市视角下（区的聚合）
    if (level === DISTRICT_LEVEL && provinceId && cityId && districtId) return { provinceId, cityId, districtId };
    return {};
  }, [level, city?.provinceId, city?.id, district?.id]);
  // 这段逻辑的目的在于不会因为地图中心点的变化，在部分缩放级别时重复触发接口请求逻辑
  useEffect(() => {
    // 默认状态时
    const isEmptyObj = Object.keys(pcdId)?.length === 0 && Object.keys(pcdIdRef.current)?.length === 0;
    if (isEmptyObj) return;
    if (isEqual(pcdIdRef.current, pcdId)) return; // 入参相同时，不触发PCDVal的useEffect
    pcdIdRef.current = pcdId;
    const { provinceId, cityId } = pcdId; // 根据地图的缩放级别、中心点的联动
    const pcdParams: any = {
      provinceIds: provinceId ? [provinceId] : [],
      cityIds: cityId ? [cityId] : [],
      // districtIds: districtId ? [districtId] : [],
    };
    setSearchParams((state) => ({ ...state, ...pcdParams }));
  }, [pcdId]);

  useDebounceEffect(() => {
    if (!amapIns) return;
    pageRef.current = 1;
    setBusinessCircleData([]); // 清空数据
    const params = getParams();
    loadBusinessCircleData(params); // 获取右侧商圈数据
    if (level < DISTRICT_LEVEL) { // 获取聚合数据
      loadClusterData(params);
    }
    if (level === DISTRICT_LEVEL) { // 获取区域下的数据
      loadDistrictData(params);
    }
  // 这里不添加level为依赖项，是因为PCDVal兼顾了level的状态变化
  }, [amapIns, searchParams, showRailForSelf, bounds], 300); // 维持这些依赖项是干净的状态，不要重复触发

  // 获取筛选项
  useEffect(() => {
    getSelection();
  }, []);
  const getSelection = async () => {
    // module 1 网规相关，2行业商圈 （通用版）
    const selections = await getBusinessCircleTypeSelection({ module: 2 });
    setSelection(selections);
  };
  // 统一处理接口入参
  const getParams = () => {
    let params: any = {
      page: pageRef.current,
      size: 20,
      level,
      // ...searchParams
    };
    searchParams?.name && (params.name = searchParams?.name);
    // 筛选条件在市、区级的时候才生效
    if (level >= CITY_LEVEL) {
      Object.assign(params, searchParams);
      const { cityIds } = params;
      // 如果城市id不在targetCityIdShowHousing中时，需要手动清除houseYearTypes、householdsTypes
      if (cityIds?.[0] && !targetCityIdShowHousing.includes(cityIds?.[0])) {
        params.houseYearTypes = null;
        params.householdsTypes = null;
      }
    } else {
      searchParams?.provinceIds && (params.provinceIds = searchParams?.provinceIds);
      searchParams?.cityIds && (params.cityIds = searchParams?.cityIds);
      // searchParams?.districtIds && (params.districtIds = searchParams?.districtIds);
      searchParams?.secondLevelCategories && (params.secondLevelCategories = searchParams?.secondLevelCategories);
    }
    // 刚进入页面时，第一次触发接口请求时因为异步的问题secondLevelCategories可能还没值，但是接口要求传空-1
    // 取消勾选时
    if (!params.secondLevelCategories || (isArray(params.secondLevelCategories) && params.secondLevelCategories.length === 0)) {
      params.secondLevelCategories = [-1];
    }
    if (level === DISTRICT_LEVEL) {
      // searchParams 中的 districtIds 已经拿掉了默认的当前地
      // 产品要求区不跟着地图联动，当然包括筛选区后移动到别的区不会重置，所以将searchParams.districtIds的值全部取自筛选项。
      // 此处判断是否有筛选项，有筛选项则根据筛选项搜索，没有则根据当前中心点区id
      params.districtIds = searchParams?.districtIds?.length ? searchParams?.districtIds : [district?.id];
    }
    if (showRailForSelf) {
      // 当districtIds长度为0时，说明没做其他区筛选
      if (!searchParams?.districtIds?.length) {
        params.districtIds = undefined;
      }
      params = { ...params, ...bounds };
    }
    return params;
  };
  // 获取右侧商圈列表数据
  const loadBusinessCircleData = async (params?: any) => {
    // params未传入时是右侧分页更新
    const paramsObj = params || getParams();
    setListLoading(true); // 数据变化时重新loading起来
    // console.log(`右侧入参`, params);
    try {
      const { objectList, totalNum } = await industryCircleList(paramsObj);
      // console.log(`右侧商圈列表数据`, objectList, totalNum);
      setTotalInfo({ totalNum });
      const targetList = isArray(objectList) ? objectList : [];
      setBusinessCircleData((state) => [...state, ...targetList]);
      targetList.length === 0 && (pageRef.current = 0);
    } catch (error) {}
    setListLoading(false);
  };

  const loadClusterData = async (params: any) => { // 省市区的聚合状态数据
    const listData = await industryCircleClusterList(params);
    setClusterDataInMap(isArray(listData) ? listData : []);
  };

  const loadDistrictData = async (params: any) => { // 区级别时的数据
    const { districtIds } = params;
    // 地图移到海里时，比如舟山
    const hasDistrictIds = districtIds.every((item) => !!item);
    if (!hasDistrictIds) return;
    const listData = await industryCircleDistrictList(params);
    setDistrictDataInMap(isArray(listData) ? listData : []);
  };
  const handleZoomEnd = debounce(() => {
    const zoom = amapIns?.getZoom();
    setShowRailForSelf(zoom > BUSINESS_ZOOM);

    if (zoom > BUSINESS_ZOOM) {
      const { southWest, northEast } = amapIns.getBounds(); // 获取地图可视区域的坐标
      const target = {
        minLat: southWest.lat,
        maxLat: northEast.lat,
        minLng: southWest.lng,
        maxLng: northEast.lng,
      };
      setBounds(target);
    }
  }, 300);
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
      {/* 顶部操作栏 */}
      <ActionBar
        mapIns={amapIns}
        mapHelpfulInfo={mapHelpfulInfo}
        selection={selection}
        showRailPath={showRailPath}
        dropdownRowActive={dropdownRowActive}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        setShowRailPath={setShowRailPath}
        setDropdownRowActive={setDropdownRowActive}
        setIsOpenHeatMap={setIsOpenHeatMap}
        setIsSelectToolBox={setIsSelectToolBox}
      />
      {/* 地图 */}
      <MapCon
        mapIns={amapIns}
        level={level}
        city={city}
        selection={selection}
        isOpenHeatMap={isOpenHeatMap}
        isSelectToolBox={isSelectToolBox}
        detailData={detailData}
        businessAreaData={districtDataInMap}
        circleData={clusterDataInMap}
        showRailPath={showRailPath}
        setAmapIns={setAmapIns}
        setDetailData={setDetailData}
        showRailForSelf={showRailForSelf}
      />
      {/* 右侧商圈列表及详情 */}
      <MapSearchList
        amapIns={amapIns}
        pageRef={pageRef}
        loading={listLoading}
        data={businessCircleData}
        detailData={detailData}
        totalInfo={totalInfo}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        setDetailData={setDetailData}
        setListLoading={setListLoading}
        loadData={loadBusinessCircleData}/>
    </div>
  );
};

export default IndustryCircle;
