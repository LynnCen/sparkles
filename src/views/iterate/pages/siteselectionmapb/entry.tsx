/**
 * @Description 选址地图第二版
 */
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import styles from './entry.module.less';
import MapCon from './components/MapCon';
import LeftCon from './components/LeftCon';
import RightCon from './components/RightCon';
import TopCon from './components/TopCon';
import { useCurLocation } from '@/common/hook/Amap/useCurLocation';
import { useAmapLevelAndCityNew } from '@/common/hook/useAmapLevelAndCityNew';
import { BUSINESS_ZOOM, CITY_LEVEL, DISTRICT_LEVEL, PROVINCE_LEVEL } from '@/common/components/AMap/ts-config';
import { geUnderTheDistrictPagingData, getSelection, industryCircleClusterList } from '@/common/api/networkplan';
import { isArray, isEqual, isUndef } from '@lhb/func';
import { useDebounceEffect } from '@/common/hook/useEffectDebounce';
import { curSelectDistrictType, sectionKey, sortRuleAliasOptions,
  rankOptions,
  networkMapContainer,
  isResetContext,
  businessStatus,
} from './ts-config';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { MapHelpfulContextProvider } from '@/common/components/AMap/MapHelpfulContext';
import { bigdataBtn } from '@/common/utils/bigdata';
import cs from 'classnames';

const Siteselectionmapb: FC<any> = () => {

  const [mapIns, setMapIns] = useState<any>(null);// 地图实例
  const [isPositioning, setIsPositioning] = useState<boolean>(true); // 是否正在定位中
  const [showLeftCon, setShowLeftCon] = useState<boolean>(true);// 是否展开左侧
  const [poiData, setPoiData] = useState<any>(null); // 搜索框搜索后选择的poi
  const [searchParams, setSearchParams] = useState<any>({
    sort: 'desc',
    sortField: null, // 默认评分排序
  }); // 接口入参
  const [curSelectDistrict, setCurSelectDistrict] = useState<curSelectDistrictType>({
    districtInfo: [], // 当前选中的行政区信息
    cacheMapInfo: null, // 缓存选中行政区信息时的mapHelpfulInfo
  });// 当前选中的行政区信息
  const [firstLevelCategory, setFirstLevelCategory] = useState<any>(null);
  const [clusterDataInMap, setClusterDataInMap] = useState<any[]>([]); // 地图上省市区聚合状态的数据
  const [districtData, setDistrictData] = useState<any[]>([]); // 地图上区级别下的数据
  const [portData, setPortData] = useState<any[]>([]); // 拿到的地图点位（右侧分页）接口数据
  const [polygonData, setPolygonData] = useState<any[]>([]);// 围栏数据
  const [isTargetRailZoom, setIsTargetRailZoom] = useState<boolean>(false);// 当前zoom是否需要显示商圈围栏并且区域数据的接口入参
  const [itemData, setItemData] = useState<any>({ // 当前商圈详情
    visible: false, // 是否显示详情
    id: null,
    detail: null, // 存放详情相关字段
    isFirst: false
  });
    // 左上角省市组件的数据
  const [provinceCityComData, setProvinceCityComData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);// 右侧数据是否在加载中
  const [handChange, setHandChange] = useState<number>(0);// 用来接收是否手动改变左上角的省市选择器（不需要管内部数值到底为多少）
  const [bounds, setBounds] = useState<any>(null);// 可视范围
  const [openList, setOpenList] = useState<any>(true); // 是否展开商圈列表，商圈列表下钻到城市级别才显示
  const [checked, setChecked] = useState<any>({
    // 排名规则默认选中市场评分
    [sectionKey.sortRule]: 1
  });// 左侧已选的筛选项
  const [isGreater1440, setIsGreater1440] = useState<boolean>(false);// 是否屏幕宽度大于1440
  const [isGreater1920, setIsGreater1920] = useState<boolean>(false);// 是否屏幕宽度大于1920
  const [isReset, setIsReset] = useState<number>(0); // 是否需要更新数据
  const [collectList, setCollectList] = useState<any[]>([]); // 收藏数量

  const commonParamsRef = useRef<any>();// 缓存上一次的mapParams

  const locationInfo = useCurLocation(mapIns); // 定位信息
  const mapHelpfulInfo = useAmapLevelAndCityNew(mapIns, true, true); // 监听地图相关的数据
  const { city, level } = mapHelpfulInfo;
  const [rankSort, setRankSort] = useState<any>(rankOptions[5]); // 默认前100

  const [mapontext, setMapontext] = useState<any>({
    // 工具箱
    toolBox: {
      stadiometry: null
    },
    // 如果未来还有其他场景，往下加
  });
  // 点击区聚合时，记录城市、区数据
  const [districtCluster, setDistrictCluster] = useState<any>({
    data: null,
    isBack: false, // 记录是否是右侧列表点击了返回
  });
  const [isSync, setIsSync] = useState<boolean>(false); // 我的收藏操作后同步列表的收藏状态
  const [isShape, setIsShape] = useState<boolean>(false);// 是否选中绘制商圈


  // 处理地图参数
  const mapParams = useMemo(() => {
    let _mapParams:any = { level };
    // 筛选项选择了行政区
    if (curSelectDistrict?.districtInfo?.length) {
      const { city: cacheCity } = curSelectDistrict.cacheMapInfo || {};
      if (cacheCity?.provinceId && level >= PROVINCE_LEVEL) {
        _mapParams = { ..._mapParams, provinceIds: [cacheCity?.provinceId] };
      };
      if (cacheCity?.id && level >= CITY_LEVEL) {
        _mapParams = { ..._mapParams, cityIds: [cacheCity?.id] };
      }
      const _districtIds:any = [];
      curSelectDistrict?.districtInfo?.map((item) => {
        _districtIds.push(item.id);
      });
      _mapParams = { ..._mapParams, districtIds: _districtIds };
      return _mapParams;
    }
    // 未选择现在去，且city为null，即点位在海外
    if (isUndef(city)) {
      return null;
    }
    // 筛选项未选择行政区
    if (city?.provinceId && level >= PROVINCE_LEVEL) {
      _mapParams = { ..._mapParams, provinceIds: [city?.provinceId] };
    };
    if (city?.id && level >= CITY_LEVEL) {
      _mapParams = { ..._mapParams, cityIds: [city?.id] };
    }
    // districtIds默认全选
    // if (level === DISTRICT_LEVEL) {
    //   const districtIds = city?.districtList?.map((item) => {
    //     return item.id;
    //   });
    //   _mapParams = { ..._mapParams, districtIds };
    // }
    return _mapParams;

  }, [level, city?.id, curSelectDistrict?.districtInfo?.length]);

  // 判断有无生成中、收藏数据
  const hasOtherData = useMemo(() => {
    // const collectList = districtData?.filter((item) => item?.isFavourate);
    setCollectList(districtData?.reduce((acc, item) => {
      if (item?.isFavourate) {
        acc.push(item.id);
      }
      return acc;
    }, []));
    return {
      hasCreating: districtData.filter((item) => item?.status === businessStatus.NEW)?.length,
      // hasCollecting: collectList?.length,
    };
  }, [districtData]);
  console.log('setCollectList', collectList);

  // 获取省市区的聚合数据
  const loadClusterData = async (params: any) => {
    const listData = await industryCircleClusterList(params);
    setClusterDataInMap(isArray(listData) ? listData : []);
  };

  // 获取区级以下的数据(分页接口，通过并行请求及递归获取全量数据)
  const loadDistrictData = async (
    params,
    curPage = 1,
    lastData:any[] = []
  ) => {
    const size = 500; // 由接口调试后得出的分页size
    const _params = {
      ...params,
      showPolygon: isTargetRailZoom,
      onlyLatLng: true, // 返回的数据只包含经纬度（数据量大的时候该参数设为true，提升接口响应速度），该参数会在第一次请求时被设为false，用来判断是否需要聚合
      size,
    };
    // onlyLatLng的参数说明，如果返回的数据超过size的大小，此时需要聚合，故需要的数据仅仅是经纬度，因为是分页接口，为了提升速度，并行请求3条，如果依然有数据，递归调用
    if (!(level >= CITY_LEVEL && params?.cityIds?.length)) {
      setIsLoading(false);
      return;
    };
    Promise.all([
      geUnderTheDistrictPagingData({ ..._params, page: curPage }),
      geUnderTheDistrictPagingData({ ..._params, page: curPage + 1 }),
      geUnderTheDistrictPagingData({ ..._params, page: curPage + 2 }),
    ]).then((res) => {
      // 说明参数改变了，从page=1开始 新参数的递归
      if (!isEqual(commonParamsRef.current, params)) {
        loadDistrictData(commonParamsRef.current, 1, []);
        return;
      }
      const newArr = [...lastData, ...res[0], ...res[1], ...res[2]];
      // 最后一个请求依然有size的数据，可能还有更大的页数，进行递归调用
      // curPage最大15页，超过15页后不请求
      if (res[2]?.length === size && curPage <= 15) {
        loadDistrictData(params, curPage + 3, newArr);
        return;
      }
      setPortData(newArr);
    });
  };

  // 获取围栏
  const loadPolygon = async (
    params = {},
    curPage = 1,
    lastData:any[] = []
  ) => {
    // 必须传区id
    const size = 500; // 由接口调试后得出的分页size
    const _params = {
      ...params,
      ...bounds,
      showPolygon: isTargetRailZoom,
      onlyLatLng: false, // 返回的数据只包含经纬度（数据量大的时候该参数设为true，提升接口响应速度），该参数会在第一次请求时被设为false，用来判断是否需要聚合
      size,
    };
    // onlyLatLng的参数说明，如果返回的数据超过size的大小，此时需要聚合，故需要的数据仅仅是经纬度，因为是分页接口，为了提升速度，并行请求3条，如果依然有数据，递归调用
    geUnderTheDistrictPagingData({ ..._params, page: curPage }).then((res) => {
      const newArr = [...lastData, ...res];
      if (res?.length === size && curPage <= 15) {
        loadPolygon(params, curPage + 1, newArr);
        return;
      }
      setPolygonData(newArr);
    });
    // TODO szn-0509: 上预演后删除
    // Promise.all([
    //   geUnderTheDistrictPagingData({ ..._params, page: curPage }),
    //   // geUnderTheDistrictPagingData({ ..._params, page: curPage + 1 }),
    //   // geUnderTheDistrictPagingData({ ..._params, page: curPage + 2 }),
    // ]).then((res) => {
    //   // 说明参数改变了，从page=1开始 新参数的递归
    //   if (!isEqual(commonParamsRef.current, params)) {
    //     loadPolygon(commonParamsRef.current, 1, []);
    //     // setPolygonData([]);
    //     return;
    //   }
    //   const newArr = [...lastData, ...res[0], ...res[1], ...res[2]];
    //   // 最后一个请求依然有size的数据，可能还有更大的页数，进行递归调用
    //   // curPage最大15页，超过15页后不请求
    //   if (res[2]?.length === size && curPage <= 15) {
    //     loadPolygon(params, curPage + 3, newArr);
    //     return;
    //   }
    //   setPolygonData(newArr);
    // });
  };

  // 处理通过params
  const getParams = () => {
    const params:any = {
      ...mapParams,
      ...searchParams,
    };
    return params;
  };
  const handlerZoomEnd = () => {
    bigdataBtn('ee1220df-2b03-eb44-a93c-64b312390c39', '选址地图', '放大或缩小', '地图-放大或缩小');
    const zoom = mapIns.getZoom();
    setIsTargetRailZoom(zoom >= BUSINESS_ZOOM);
  };
  const handlerDragEnd = () => {
    bigdataBtn('9999a8ad-693e-0778-fac5-3e155c747f89', '选址地图', '拖动', '地图-拖动');
  };
  const getFirstLevelCategoryData = async () => {
    const data = await getSelection({ module: 2 });
    const { firstLevelCategory } = data || {};
    setFirstLevelCategory(isArray(firstLevelCategory) ? firstLevelCategory : []);
  };
  // 拿到定位信息后，标记是否定位中的状态
  useEffect(() => {
    if (!isPositioning) return; // 已经定位完成
    // 拿到定位信息后，地图会自动放大到区级，所以要判断level
    setIsPositioning(!(locationInfo?.districtId && level === DISTRICT_LEVEL));
  }, [locationInfo, level]);

  useEffect(() => { // 避免用户定位失败
    setTimeout(() => {
      setIsPositioning(false);
    }, 5000);
  }, []);

  // 定位完后显示定位marker
  useEffect(() => {
    const { lng, lat } = locationInfo;
    if (!isPositioning && lng && lat) {
      const locationMarker = new window.AMap.Marker({
        position: [lng, lat],
        size: [24, 33],
        anchor: 'center',
        content: '<img src="https://staticres.linhuiba.com/project-custom/locationpc/map_position_marker_red.png" class="locationMarker"/>'
      });
      mapIns.add(locationMarker);
    }
  }, [isPositioning]);

  // 判断当前zoom是否可显示商圈围栏
  useEffect(() => {
    if (!mapIns) return;
    // 监听地图zoom的变化，到指定的zoom时，显示围栏
    mapIns.on('zoomend', handlerZoomEnd);
    mapIns.on('dragend', handlerDragEnd);
    return () => {
      mapIns.off('zoomend', handlerZoomEnd);
      mapIns.off('dragend', handlerDragEnd);
    };
  }, [mapIns]);

  useDebounceEffect(() => {
    if (isPositioning) return; // 正在定位中，此时不执行以下逻辑
    if (!mapIns) return;
    const params = getParams();
    // 如果不存在level，说明mapParams中返回了null,点位在海外
    if (!params?.level) return;
    if (isEqual(commonParamsRef.current, {
      ...params,
      isReset
    })) return;
    commonParamsRef.current = {
      ...params,
      isReset,
    };
    if (level < DISTRICT_LEVEL) { // 获取聚合数据
      loadClusterData(params);
      // setPortData([]); // 清空区的数据
    }
    if (level >= CITY_LEVEL) { // 获取区域下的数据
      // 防止初始化时没拿到定位就先执行了这里
      // if (!(locationInfo?.lng && locationInfo?.lat)) return;

      setIsLoading(true);
      loadDistrictData(params);
    }
  }, [mapIns, searchParams, mapParams, isPositioning, isReset], 300);

  useEffect(() => {
    if (!portData?.length && !isPositioning) {
      V2Message.error('暂无数据');
    }
    const { sortRule } = searchParams;
    let rankKey = 'marketScore';

    sortRuleAliasOptions.map((item) => {
      if (sortRule === item.id) {
        rankKey = item.key;
      }
    });
    // 前端处理排序，根据marketScore排序，如果marketScore相同，取id小的在前
    function compare(a, b) {
      // 如果不存在这个字段数据，则默认为0
      if (!a?.[rankKey]) {
        a[rankKey] = 0;
      }
      if (!b?.[rankKey]) {
        b[rankKey] = 0;
      }
      if (a?.status === businessStatus.NEW) {
        a[rankKey] = -1;
      }
      if (b?.status === businessStatus.NEW) {
        b[rankKey] = -1;
      }
      if (a?.[rankKey] !== b?.[rankKey]) {
        return b?.[rankKey] - a?.[rankKey];
      }
      // 如果是其他的排序字段，且数据相等，则再用marketScore排序
      if (rankKey !== 'marketScore') {
        if (a?.marketScore !== b?.marketScore) {
          return b?.marketScore - a?.marketScore;
        }
      }
      return b.id - a.id;

    }

    const res = portData.sort(compare).map((item, index) => ({ ...item, rank: index }));
    // 每次触发接口更新时，重置初始化参数
    setItemData((state) => ({ ...state, isFirst: false }));
    !isPositioning && setIsLoading(false);

    // 当在level3的时候 点击右侧，那么会缩放到具体的点位导致level为4，level变化会触发portData变化，但实际数据并没有改变，所以此处不重新setDistrictData，因此不会引起其他地图重复监听districtData
    if (isEqual(res, districtData)) return;
    setDistrictData(res);
  }, [portData]);
  const changeSize = () => {
    const root = document.getElementById('root');
    const intiWidth = root?.offsetWidth as number;// 获取初始化的宽度
    const curWidth = root?.offsetWidth as number;// 获取当前的宽度
    setIsGreater1440(curWidth > 1440);
    setIsGreater1920(intiWidth > 1920);
  };
  useDebounceEffect(() => {
    if (isTargetRailZoom) {
      const params = getParams();
      // 如果不存在level，说明mapParams中返回了null,点位在海外
      if (!params?.level) return;
      loadPolygon(params);
    }
  }, [bounds, isTargetRailZoom, searchParams, mapParams, isReset], 300);

  // 监听屏幕大小
  useEffect(() => {
    const root = document.getElementById('root');
    const intiWidth = root?.offsetWidth as number;// 获取初始化的宽度
    setIsGreater1440(intiWidth > 1440);
    setIsGreater1920(intiWidth > 1920);
    window.addEventListener('resize', changeSize);
    return () => {
      window.removeEventListener('resize', changeSize);
    };
  }, []);
  useEffect(() => {
    // 获取一级商圈数据
    getFirstLevelCategoryData();
    bigdataBtn('5442cb35-cfb2-df63-3684-6879f6f2a08e', '选址地图', '访问选址地图', '访问选址地图');
  }, []);
  return (
    <isResetContext.Provider value={{
      isReset,
      setIsReset,
      collectList,
      setCollectList,
    }}>
      <MapHelpfulContextProvider
        helpInfo={mapontext}
        stateEvent={setMapontext}
      >
        <div className={cs(styles.container, networkMapContainer)}>
          <MapCon
            mapIns={mapIns}
            setMapIns={setMapIns}
            mapHelpfulInfo={mapHelpfulInfo}
            curSelectDistrict={curSelectDistrict}
            circleData={clusterDataInMap}
            firstLevelCategory={firstLevelCategory}
            showRail={isTargetRailZoom}
            districtData={districtData}
            itemData={itemData}
            setItemData={setItemData}
            locationInfo={locationInfo}
            setBounds={setBounds}
            polygonData={polygonData}
            isPositioning={isPositioning}
            rankSort={rankSort}
            setDistrictCluster={setDistrictCluster}
            isShape={isShape}
          />
          <LeftCon
            showLeftCon={showLeftCon}
            setShowLeftCon={setShowLeftCon}
            mapHelpfulInfo={mapHelpfulInfo}
            setCurSelectDistrict={setCurSelectDistrict}
            curSelectDistrict={curSelectDistrict}
            setSearchParams={setSearchParams}
            // setFirstLevelCategory={setFirstLevelCategory}
            setItemData={setItemData}
            handChange={handChange}
            setChecked={setChecked}
            checked={checked}
            isGreater1440={isGreater1440}
            isGreater1920={isGreater1920}
            districtCluster={districtCluster}
          />
          <RightCon
            mapIns={mapIns}
            mapHelpfulInfo={mapHelpfulInfo}
            locationInfo={locationInfo}
            searchParams={searchParams}
            firstLevelCategory={firstLevelCategory}
            poiData={poiData}
            itemData={itemData}
            listData={districtData}
            provinceCityComData={provinceCityComData}
            rankSort={rankSort}
            setRankSort={setRankSort}
            setItemData={setItemData}
            isLoading={isLoading}
            isSync={isSync}
            setIsSync={setIsSync}
            setOpenList={setOpenList}
            openList={openList}
            isPositioning={isPositioning}
            districtCluster={districtCluster}
            setDistrictCluster={setDistrictCluster}
            hasOtherData={hasOtherData}
            setIsReset={setIsReset}
          />
          <TopCon
            mapIns={mapIns}
            curSelectDistrict={curSelectDistrict}
            setChecked={setChecked}
            setCurSelectDistrict={setCurSelectDistrict}
            mapHelpfulInfo={mapHelpfulInfo}
            setProvinceCityComData={setProvinceCityComData}
            setShowLeftCon={setShowLeftCon}
            showLeftCon={showLeftCon}
            setPoiData={setPoiData}
            setHandChange={setHandChange}
            isGreater1440={isGreater1440}
            isGreater1920={isGreater1920}
            setRightDrawerVisible={setOpenList}
            polygonData={polygonData}
            firstLevelCategory={firstLevelCategory}
            setRankSort={setRankSort}
            setIsReset={setIsReset}
            setIsShape={setIsShape}
            isShape={isShape}
          />
        </div>
      </MapHelpfulContextProvider>
    </isResetContext.Provider>
  );
};

export default Siteselectionmapb;
