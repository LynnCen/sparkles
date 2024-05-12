/**
 * @Description 选址地图
 */
import { FC, useEffect, useState, useRef, useMemo } from 'react';
import { isArray, isEqual } from '@lhb/func';
import { useAmapLevelAndCityNew } from '@/common/hook/useAmapLevelAndCityNew';
import { useCurLocation } from '@/common/hook/Amap/useCurLocation';
import {
  CITY_LEVEL,
  COUNTRY_LEVEL,
  DISTRICT_LEVEL,
  PROVINCE_LEVEL,
  BUSINESS_ZOOM
} from '@/common/components/AMap/ts-config';
import {
  industryCircleList,
  industryCircleClusterList,
  geUnderTheDistrictPagingData,
} from '@/common/api/networkplan';
import { getSelection as getBusinessCircleTypeSelection } from '@/common/api/networkplan';
import styles from './entry.module.less';
import Loading from '@/common/components/AMap/Loading';
import Top from './components/Top';
import ConditionSidebar from './components/ConditionSidebar';
import ListSidebar from './components/ListSidebar';
import MapCon from './components/MapCon';
import LeftBottomBox from './components/LeftBottomBox';

const Siteselectionmap: FC<any> = () => {
  const pageRef: any = useRef<number>(1); // 虚拟列表下拉筛选的分页page
  const zoomValRef: any = useRef(); // zoom级别
  const pcdIdRef: any = useRef<any>({}); // 省市区id的缓存
  const [searchParams, setSearchParams] = useState<any>({
    sort: 'desc',
    sortField: 'main_brands_score' // 默认评分排序
  }); // 接口入参
  const [selection, setSelection] = useState<any>({}); // 筛选项
  const [mapIns, setMapIns] = useState<any>();
  const [isPositioning, setIsPositioning] = useState<boolean>(true); // 是否正在定位中
  const [poiData, setPoiData] = useState<any>(); // 搜索框搜索后选择的poi
  const [detailData, setDetailData] = useState<any>({ // 当前商圈详情
    visible: false, // 是否显示详情
    id: null,
    detail: null // 存放详情相关字段
  });
  const [clusterDataInMap, setClusterDataInMap] = useState<any[]>([]); // 地图上省市区聚合状态的数据
  const [listLoading, setListLoading] = useState<boolean>(false); // 列表loading
  const [totalInfo, setTotalInfo] = useState<any>({ totalNum: 0 });// 右侧的商圈列表总数
  const [businessCircleData, setBusinessCircleData] = useState<any[]>([]); // 右侧的商圈列表
  const [districtDataInMap, setDistrictDataInMap] = useState<any[]>([]); // 地图上区级别下的数据
  const [isTargetRailZoom, setIsTargetRailZoom] = useState<boolean>(false);// 当前zoom是否需要显示商圈围栏并且区域数据的接口入参
  const locationInfo = useCurLocation(mapIns); // 定位信息
  const mapHelpfulInfo = useAmapLevelAndCityNew(mapIns, true, true); // 监听地图相关的数据
  const { city, district, level } = mapHelpfulInfo;
  const [labelOptionsFlag, setLabelOptionsFlag] = useState<number>(0); // 标签选项变动标记，变动时刷新左侧自定义标签选项

  /*
    标签修改临时信息，用于更新列表

    对象数组
    id:商圈id；
    labelTypeMap:标签对象，按类型分为不同字段 {1: [], 2: [{name: "A类"}], 3: [{name: "测试标签1"}, {name: "测试新增自定义标签"}]}
  */
  const [areaChangedLabels, setAreaChangedLabels] = useState<{id: number, labelTypeMap: any[]}[]>([]);

  const labelOptionsChanged = () => {
    setLabelOptionsFlag((state) => state + 1);
  };

  // 拿到定位信息后，标记是否定位中的状态
  useEffect(() => {
    if (!isPositioning) return; // 已经定位完成
    // 拿到定位信息后，地图会自动放大到区级，所以要判断level
    setIsPositioning(!(locationInfo?.districtId && level === DISTRICT_LEVEL));
    const { lng, lat } = locationInfo;
    if (lng && lat) {
      setSearchParams((state) => ({ ...state, lng, lat }));
    }
  }, [locationInfo, level]);

  useEffect(() => { // 避免用户定位失败
    setTimeout(() => {
      setIsPositioning(false);
    }, 5000);
  }, []);

  // 判断当前zoom是否可显示商圈围栏
  useEffect(() => {
    if (!mapIns) return;
    // 监听地图zoom的变化，到指定的zoom时，显示围栏
    mapIns.on('zoomend', () => {
      const zoom = mapIns.getZoom();
      zoomValRef.current = zoom;
      setIsTargetRailZoom(zoom >= BUSINESS_ZOOM);
    });
  }, [mapIns]);

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
  // 合并依赖项
  useEffect(() => {
    // 默认状态时
    const isEmptyObj = Object.keys(pcdId)?.length === 0 && Object.keys(pcdIdRef.current)?.length === 0;
    if (isEmptyObj) return;
    if (isEqual(pcdIdRef.current, pcdId)) return; // 入参相同时，不触发PCDVal的useEffect
    pcdIdRef.current = pcdId;
    const { provinceId, cityId, districtId } = pcdId; // 根据地图的缩放级别、中心点的联动
    const pcdParams: any = {
      provinceIds: provinceId ? [provinceId] : [],
      cityIds: cityId ? [cityId] : [],
      districtIds: districtId ? [districtId] : [],
    };
    setSearchParams((state) => ({ ...state, ...pcdParams }));
  }, [pcdId]);

  useEffect(() => {
    if (isPositioning) return; // 正在定位中，此时不执行以下逻辑
    if (!mapIns) return;
    pageRef.current = 1;
    setBusinessCircleData([]); // 清空右侧商圈列表
    const params = getParams();

    // 下钻到城市级别以下时才请求商圈数据
    if (level >= CITY_LEVEL) {
      loadBusinessCircleData(params); // 获取右侧商圈数据
    }
    if (level < DISTRICT_LEVEL) { // 获取聚合数据
      loadClusterData(params);
      setDistrictDataInMap([]); // 清空区的数据
    }
    if (level === DISTRICT_LEVEL) { // 获取区域下的数据
      loadDistrictData(params);
      setClusterDataInMap([]); // 清空省市区聚合的数据
      // 切换区id时，隐藏概览
      setDetailData({
        id: null,
        visible: false,
        detail: null
      });
    }
  }, [mapIns, searchParams, isPositioning]);

  // 区以下级别时，是否显示围栏，并更新接口入参
  useEffect(() => {
    const params = getParams();
    loadDistrictData(params);
  }, [isTargetRailZoom]);

  // 获取筛选项
  useEffect(() => {
    getSelection();
  }, []);
  const getSelection = async () => {
    // module 1 网规相关，2行业商圈 （通用版）
    const selections = await getBusinessCircleTypeSelection({ module: 2 });
    setSelection(selections);
  };

  const getParams = () => {
    const params: any = {
      page: pageRef.current,
      size: 20,
      level,
      ...searchParams
    };
    // if (!params.secondLevelCategories || (isArray(params.secondLevelCategories) && params.secondLevelCategories.length === 0)) {
    //   // params.secondLevelCategories = [-1];
    //   // params.secondLevelCategories = [1, 2, 3, 4, 5, 6, 7, 8]; // TODO 方便临时开发
    // }
    return params;
  };

  // 获取右侧商圈列表数据
  const loadBusinessCircleData = async (params?: any) => {
    // params未传入时是右侧分页更新
    const paramsObj = params || getParams();
    setListLoading(true); // 数据变化时重新loading起来
    if (paramsObj.page === 1) { // 重新获取第一页时清空标签变更临时内容
      setAreaChangedLabels([]);
    }
    try {
      const { objectList, totalNum } = await industryCircleList(paramsObj);
      setTotalInfo({ totalNum });
      const targetList = isArray(objectList) ? objectList : [];
      setBusinessCircleData((state) => [...state, ...targetList]);
      targetList.length === 0 && (pageRef.current = 0);
    } catch (error) {}
    setListLoading(false);
  };

  // 获取省市区的聚合数据
  const loadClusterData = async (params: any) => {
    const listData = await industryCircleClusterList(params);
    setClusterDataInMap(isArray(listData) ? listData : []);
  };
  // 获取区级以下的数据(分页接口，通过并行请求及递归获取全量数据)
  const loadDistrictData = async (
    params = {},
    curPage = 1,
    lastData:any[] = []
  ) => {
    const { districtIds } = params as any;
    if (level !== DISTRICT_LEVEL) return;
    // 必须传区id
    if (!(isArray(districtIds) && districtIds?.length)) return;
    const size = 500; // 由接口调试后得出的分页size
    const _params = {
      ...params,
      showPolygon: isTargetRailZoom,
      onlyLatLng: true, // 返回的数据只包含经纬度（数据量大的时候该参数设为true，提升接口响应速度），该参数会在第一次请求时被设为false，用来判断是否需要聚合
      size,
    };
    // onlyLatLng的参数说明，如果返回的数据超过size的大小，此时需要聚合，故需要的数据仅仅是经纬度，因为是分页接口，为了提升速度，并行请求3条，如果依然有数据，递归调用
    Promise.all([
      geUnderTheDistrictPagingData({ ..._params, page: curPage, onlyLatLng: !(curPage === 1) }),
      geUnderTheDistrictPagingData({ ..._params, page: curPage + 1 }),
      geUnderTheDistrictPagingData({ ..._params, page: curPage + 2 }),
    ]).then((res) => {
      const newArr = [...lastData, ...res[0], ...res[1], ...res[2]];
      // 最后一个请求依然有size的数据，可能还有更大的页数，进行递归调用
      if (res[2]?.length === size) {
        loadDistrictData(params, curPage + 3, newArr);
        return;
      }
      setDistrictDataInMap(newArr);
    });
  };

  return (
    <div className={styles.container}>
      <Loading amapIns={mapIns} delay={400}/>
      {/* 顶部搜索/工具箱 */}
      <Top
        mapIns={mapIns}
        mapHelpfulInfo={mapHelpfulInfo}
        setPoiData={setPoiData}
      />
      {/* 左侧筛选栏 */}
      <ConditionSidebar
        labelOptionsFlag={labelOptionsFlag}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <LeftBottomBox
        mapIns={mapIns}
        mapHelpfulInfo={mapHelpfulInfo}
        isPositioning={isPositioning}
      />
      {/* 右侧商圈列表 */}
      <ListSidebar
        mapHelpfulInfo={mapHelpfulInfo}
        locationInfo={locationInfo}
        loading={listLoading}
        pageRef={pageRef}
        totalInfo={totalInfo}
        poiData={poiData}
        data={businessCircleData}
        areaChangedLabels={areaChangedLabels}
        setDetailData={setDetailData}
        setListLoading={setListLoading}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        appendData={loadBusinessCircleData}
      />
      {/* 地图 */}
      <MapCon
        mapIns={mapIns}
        mapHelpfulInfo={mapHelpfulInfo}
        showRail={isTargetRailZoom}
        selection={selection}
        circleData={clusterDataInMap}
        districtDataInMap={districtDataInMap}
        detailData={detailData}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        setDetailData={setDetailData}
        setMapIns={setMapIns}
        labelOptionsChanged={labelOptionsChanged}
        setAreaChangedLabels={setAreaChangedLabels}
      />
    </div>
  );
};

export default Siteselectionmap;
