/**
 * @description 新网规地图
 */
import { FC, useEffect, useRef, useState } from 'react';
import styles from './entry.module.less';
import MapCon from './components/MapCon';
import { useAmapLevelAndCityNew } from '@/common/hook/useAmapLevelAndCityNew';
import MapSearchList from './components/MapSearchList';
import { getAreaMapData, getAreaPaging, getMapStatisticsInfo, getPermission, getPlanClusterDetail, getPolygon, getTreeSelection, getSelection, getCapacityArea } from '@/common/api/networkplan';
import { NOT_MORE_DATA, RankStatus, addBusiness, markerType, maxAddressMarkerCount } from './ts-config';
import { debounce, isArray, urlParams } from '@lhb/func';
import { getSession } from '@lhb/cache';
import OperateBox from './components/OperateBox';
import Loading from '@/common/components/AMap/Loading';
import { DISTRICT_LEVEL, PROVINCE_LEVEL, CITY_LEVEL, BUSINESS_FIT_ZOOM, BUSINESS_ZOOM } from '@/common/components/AMap/ts-config';
import cs from 'classnames';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { mapCon } from './ts-config';
import { message } from 'antd';
import { useDebounceEffect } from '@/common/hook/useEffectDebounce';
import { DISTRICT_ZOOM } from '@/common/components/AMap/ts-config';
import { MapHelpfulContextProvider } from '@/common/components/AMap/MapHelpfulContext';

const networkMapContainer = 'networkMapContainer';
const NetworkPlanEditMap: FC<any> = () => {

  const {
    originPath, // 来源path,目前用于处理机会点跳转网规
    childCompanyPlanned, // 分公司是否规划(0:否 1:是)
    parentCompanyPlanned, // 总公司是否规划(0:否 1:是)
    branchCompanyId, // 分公司id
    otherKeys, // 筛选项相关
    isOpenStore, // 已开店（true: 已开店）
    isPlanned, // 是否在规划中
    isBranch, // 是否分公司
    planId, // 版本id
    isActive, // 是否生效中（）
    planClusterId, // 商圈id
    businessAreaId,
    lng,
    lat,
  } = JSON.parse(decodeURI(urlParams(location.search)?.params || null)) || {};

  // 机会点跳转网规时，不携带存储在本地的筛选项
  const planManagementDetail = originPath === 'chancepoint' ? null : getSession('planManagementDetail');

  const [amapIns, setAmapIns] = useState<any>(null);
  const [businessTypeList, setBusinessTypeList] = useState<any>([]);// 商圈类型展示（二级id的数组）
  const [mapShowType, setMapShowType] = useState<number>(RankStatus.brandRank);// 展示商圈排名类型
  const [loading, setLoading] = useState<boolean>(true);// 列表loading
  const [listData, setListData] = useState<any>([]);// 列表-具体商圈addressMarker数据
  // const [polygonListData, setPolygonListData] = useState<any>([]);// 地图围栏数据
  const [leftListData, setLeftListData] = useState<any>([]);// 左侧数据-分页
  const [areaData, setAreaData] = useState<any>([]);// 市场容量（商区围栏）数据
  const [totalInfo, setTotalInfo] = useState<any>(null);// 总计商圈数和已开门店数
  const [circleData, setCircleData] = useState<any>([]);// 省市聚合数据
  const [searchParams, setSearchParams] = useState<any>(null);// 搜索框
  const [detailData, setDetailData] = useState<any>({
    visible: false,
    id: null,
  }); // 列表详情页相关（与地图联动）
  const [selectedBusinessDistrict, setSelectedBusinessDistrict] = useState<any>({
    visible: false,
    di: null
  });// 选中的商区围栏
  const [searchModalData, setSearchModalData] = useState<any>({
    visible: false,
    // 对于从生效中进入的，没有planManagementDetail，所以构造detail和formData
    detail: {
      ...JSON.parse(decodeURI(urlParams(location.search)?.params || null)) || {}
    },
    formData: null,
    ...planManagementDetail,
  }); // 全部筛选弹窗

  const [isOpenHeatMap, setIsOpenHeatMap] = useState<boolean>(false);// 监听工具箱中的人口热力是否打开
  const [isReset, setIsReset] = useState<boolean>(false); // 是否需要更新数据
  const [companyParams, setCompanyBrandParams] = useState<any>(null);// 处理机会点跳入网规，通过detail拿到相关公司数据作为params
  const [isShape, setIsShape] = useState<boolean>(false);// 是否选中绘制商圈
  const [isDraw, setIsDraw] = useState<boolean>(false); // 是否已经绘制出图形信息，graphInfo有数据则为true
  const [isSelectToolBox, setIsSelectToolBox] = useState<boolean>(false);// 工具箱内部按钮是否激活
  const [rightDrawerVisible, setRightDrawerVisible] = useState<boolean>(true);// 右侧列表及详情收缩按钮
  const [isBusinessZoom, setIsBusinessZoom] = useState<boolean>(false);// 判断当前zoom是否可显示商圈围栏
  const [bounds, setBounds] = useState<any>(null);// 地图可视范围
  const [isShowBusinessDistrict, setIsShowBusinessDistrict] = useState<boolean>(true);// 是否展示商区围栏，默认true
  const [businessAreaMap, setBusinessAreaMap] = useState<any>();// 市场容量（商区围栏）和商圈点位的映射map结构
  const [curSelectRightList, setCurSelectRightList] = useState<any>([]);

  const { level, city, district } = useAmapLevelAndCityNew(amapIns, false, true);


  const pageRef = useRef<number>(1); // 虚拟列表下拉筛选的分页page
  const commonParamsRef = useRef<any>(null);// 存放共同的params，减少到处拼凑params
  const drawedRef = useRef<boolean>(false);// 是否填写信息后，点位数据会加载两次，一个新数据加载，一次由hide转show
  const selectionsRef = useRef<any>({});// 筛选项大全
  const curClickTypeRef = useRef<markerType>(planClusterId ? markerType.AddressMarker : businessAreaId ? markerType.BusinessDistrictMarker : null);// 初始值，当存在planClusterId则说明点击商圈名称，当存在businessAreaId说明点击商区名称
  const [mapontext, setMapontext] = useState<any>({
    // 工具箱
    toolBox: {
      stadiometry: null
    },
    // 如果未来还有其他场景，往下加
  });

  /**
   * @description 右侧列表数据-分页，initData是否初始化，
   * @param initData 是否初始化数据
   */
  const getRightListData = async(initData = false) => {
    // 处理pageRef为0的情况下，将其置为1（正常情况下难以复现，但是客户出现过该问题，误删！）
    if (pageRef.current === NOT_MORE_DATA) {
      pageRef.current = 1;
    }
    let params:any = {
      page: pageRef.current,
      size: 20,
      ...commonParamsRef.current
    };
    // 当排序的时候，接口传入orderByIds会有问题
    if (planClusterId && !searchParams?.sortField) {
      params = { ...params, orderByIds: [planClusterId] };
    }
    setLoading(true);
    Promise.all([getAreaPaging(params), getMapStatisticsInfo(params)]).then((res) => {
      if (res[0]?.objectList === null || !res[0]?.objectList?.length) {
        pageRef.current = NOT_MORE_DATA;
      }
      if (initData) {
        setLeftListData(res[0]?.objectList || []);
      } else {
        setLeftListData((state) => [...state, ...res[0]?.objectList || []]);
      }
      setTotalInfo({
        openStoreCount: res[1]?.statistics?.openStoreCount,
        totalNum: res[1]?.statistics?.planClusterCount
      });

    }).finally(() => {
      setLoading(false);
    });
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
      // todo 第一次请求加一个请求详细数据的参数
      getPolygon({ ...params, page: curPage, onlyLatLng: curPage !== 1 }),
      getPolygon({ ...params, page: curPage + 1 }),
      getPolygon({ ...params, page: curPage + 2 }),
      getPolygon({ ...params, page: curPage + 3 }),
      // getPolygon({ ...params, page: curPage + 4 }),
      // getPolygon({ ...params, page: curPage + 5 }),
    ]).then((res) => {
      const newArr = [...res[0], ...res[1], ...res[2], ...res[3], ...lastData];
      if (res[3].length === size) {
        // 还有数据，接着请求
        getListData(curPage + 4, newArr);
      } else {
        setListData(newArr);
        // 放这里，保证先请求getPolygon的数据，将这个请求后置
        // getRightListData(true);
      }
    });
  };
  // 获取地图市场容量（商区围栏）数据
  const getAreaData = async() => {
    if (level < DISTRICT_LEVEL) return;
    const data = await getCapacityArea({
      ...commonParamsRef.current,
      businessAreaIds: Array.from(businessAreaMap?.keys())
    });
    setAreaData(data);
  };

  // 获取地图聚合数据
  const getCircleData = async() => {
    // getRightListData(true);
    // 在全国、省份和市情况下才需要获取
    if (level >= DISTRICT_LEVEL) return;
    const data = await getAreaMapData(commonParamsRef.current);
    setCircleData(data);
  };

  // 处理机会点跳转网规地图，此处根据planClusterId获取其他接口参数相关信息放入CompanyBrandParams
  const handleChancePointJumpMap = async() => {
    const detail = await getPlanClusterDetail({ id: planClusterId });
    const permission = await getPermission();
    setCompanyBrandParams({
      ...detail,
      parentCompanyPlanned: +permission?.parentCompanyPermission || null,
      childCompanyPlanned: +permission?.branchCompanyPermission || null
    });
    setSearchModalData((state) => {
      return {
        ...state,
        detail: {
          ...state.detail,
          ...detail,
          parentCompanyPlanned: +permission?.parentCompanyPermission || null,
          childCompanyPlanned: +permission?.branchCompanyPermission || null
        }
      };
    });
  };
  // 处理绘制商圈中禁止点击其他操作
  const handlePreventdefault = (e) => {
    const mapDom:any = document.querySelector(`.${mapCon}`);
    const addBusinessBtn:any = document.querySelector(`.${addBusiness}`);
    if (!mapDom.contains(e.target) && !addBusinessBtn.contains(e.target)) {
      V2Message.warning(`请先完成新增商圈信息填写或删除该商圈`);
      message.config({ maxCount: 1 });
      e.preventDefault();
      e.stopPropagation();
    }
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
  // 处理省市区、地图级别、商圈类型、搜索项、状态更新后重新请求接口
  useDebounceEffect(() => {
    if (!amapIns) return;
    if (originPath === 'chancepoint' && !companyParams) return;// 从机会点跳转网规地图
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
    const clusterTypes = isArray(businessTypeList) && !businessTypeList.length ? { firstLevelCategoryIdList: [-1] } : { secondLevelCategoryIdList: businessTypeList };
    let commonParams = {
      parentCompanyPlanned: parentCompanyPlanned || companyParams?.parentCompanyPlanned,
      childCompanyPlanned: childCompanyPlanned || companyParams?.childCompanyPlanned,
      branchCompanyId: +branchCompanyId || companyParams?.branchCompanyId,
      planId: +planId || companyParams?.planId,
      isOpenStore,
      isPlanned,
      otherKeys,
      ...clusterTypes,
      ...searchParams, // 筛选项相关参数
      ...mapParams, // 地图级别、城市id参数
    };
    if (originPath === 'chancepoint') {
      commonParams = {
        ...commonParams,
        isPlanned: 1
      };
    }
    commonParamsRef.current = commonParams;
    getRightListData(true);
    getListData();
    getCircleData();
  }, [amapIns, district?.id, level, businessTypeList, companyParams, searchParams, isReset, bounds, isBusinessZoom], 100);

  // 处理机会点跳入网规页面
  useEffect(() => {
    if (lng && lat && amapIns && originPath === 'chancepoint') {
      amapIns.setZoomAndCenter(BUSINESS_FIT_ZOOM, [lng, lat], true);
      const customIcon = new window.AMap.Icon({
        size: new window.AMap.Size(41, 48.5),
        image: `https://staticres.linhuiba.com/project-custom/store-assistant-h5/shop_location@2x.png`,
        imageSize: new window.AMap.Size(41, 48.5),
      });

      const marker = new window.AMap.Marker({
        position: new window.AMap.LngLat(lng, lat),
        icon: customIcon,
        offset: new window.AMap.Pixel(-41 / 2, -48.5),
      });
      amapIns.add(marker);
      handleChancePointJumpMap();
    }
  }, [lng, lat, amapIns]);

  // 处理绘制商圈中禁止点击其他操作
  useEffect(() => {
    const dom:any = document.querySelector(`.${networkMapContainer}`);

    if (isDraw) {
      // 除地图元素和新增商圈外
      // ps:React 的事件不是绑定在元素上的，而是统一绑定在顶部容器上，在 react v17 之前是绑定在 document 上的，在 react v17 改成了 app 容器上，所以此处的handlePreventdefault会比子元素的onClick先触发
      dom.addEventListener('click', handlePreventdefault);
    }
    return () => {
      dom.removeEventListener('click', handlePreventdefault);
    };
  }, [isDraw]);

  useEffect(() => {
    if (originPath === 'chancepoint' && !companyParams) return;// 从机会点跳转网规地图
    Promise.all([
      // module 1 网规相关，2行业商圈 （通用版）
      getSelection({ module: 1 }),
      getTreeSelection({
        planId: planId || companyParams?.planId,
        type: 1,
        childCompanyId: branchCompanyId || companyParams?.branchCompanyId
      }),
    ]).then(res => {
      selectionsRef.current = ({ ...res[0], cities: res[1] });
    });
  }, [companyParams]);

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
    listData.map((item) => {
      if (!item.businessAreaId) return;
      if (map.has(item.businessAreaId)) {
        const arr = map.get(item.businessAreaId);
        map.set(item.businessAreaId, [...arr, item.id]);
        return;
      }
      map.set(item.businessAreaId, [item.id]);
    });
    setBusinessAreaMap(map);
  }, [listData]);
  useEffect(() => {
    // 如果数量大于maxAddressMarkerCount，此时不会显示市场容量
    if (listData.length >= maxAddressMarkerCount) return;
    getAreaData();
  }, [businessAreaMap]);

  useEffect(() => {
    if (selectedBusinessDistrict.visible && selectedBusinessDistrict.businessAreaId) {
      const valueArr = businessAreaMap.get(selectedBusinessDistrict.businessAreaId);
      const list:any = [];
      listData.map((item) => {
        if (valueArr?.includes(item.id)) {
          list.push(item);
        }
      });
      setCurSelectRightList(list);
    }
  }, [businessAreaMap, selectedBusinessDistrict.id, listData]);

  useDebounceEffect(() => {
    if (city?.province && city?.name) {
      V2Message.info(`当前已切换到${city?.province}/${city?.name}`);
    }
    message.config({ maxCount: 1 });
  }, [city?.id], 300);

  return (
    <MapHelpfulContextProvider
      helpInfo={mapontext}
      stateEvent={setMapontext}
    >
      <div className={cs(styles.container, networkMapContainer)}>
        <Loading amapIns={amapIns}/>
        {/* 除右侧列表和地图外的页面的所有操作入口 */}
        <OperateBox
          amapIns={amapIns}
          city={city}
          level={level}
          setBusinessTypeList={setBusinessTypeList}
          setMapShowType={setMapShowType}
          isBranch={isBranch}
          searchModalData={searchModalData}
          planId={planId}
          branchCompanyId={branchCompanyId}
          setSearchParams={setSearchParams}
          setSearchModalData={setSearchModalData}
          setIsOpenHeatMap={setIsOpenHeatMap}
          setIsShape={setIsShape}
          isShape={isShape}
          setIsDraw={setIsDraw}
          setIsReset={setIsReset}
          isSelectToolBox={isSelectToolBox}
          setIsSelectToolBox={setIsSelectToolBox}
          drawedRef={drawedRef}
          selections={selectionsRef.current}
          setRightDrawerVisible={setRightDrawerVisible}
          isShowBusinessDistrict={isShowBusinessDistrict}
          setIsShowBusinessDistrict={setIsShowBusinessDistrict}
          companyParams={companyParams}
          originPath={originPath}
        />
        {/* 右侧-列表数据及详情 */}
        <MapSearchList
          planId={planId}
          branchCompanyId={branchCompanyId}
          loading={loading}
          setIsReset={setIsReset}
          data={leftListData}
          appendData={getRightListData}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          setDetailData={setDetailData}
          detailData={detailData}
          isBranch={Boolean(isBranch)}
          pageRef={pageRef}
          totalInfo={totalInfo}
          isActive={isActive}
          isShape={isShape}
          setRightDrawerVisible={setRightDrawerVisible}
          rightDrawerVisible={rightDrawerVisible}
          selectedBusinessDistrict={selectedBusinessDistrict}
          setSelectedBusinessDistrict={setSelectedBusinessDistrict}
          curClickTypeRef={curClickTypeRef}
          curSelectRightList={curSelectRightList}
        />
        <MapCon
          setAmapIns={setAmapIns}
          amapIns={amapIns}
          level={level}
          listData={listData}
          circleData={circleData}
          setDetailData={setDetailData}
          detailData={detailData}
          planClusterId={planClusterId}
          city={city}
          leftListData={leftListData}
          isOpenHeatMap={isOpenHeatMap}
          isBranch={isBranch}
          mapShowType={mapShowType}
          // polygonListData={polygonListData}
          isShape={isShape}
          isSelectToolBox={isSelectToolBox}
          drawedRef={drawedRef}
          selectionsRef={selectionsRef}
          isBusinessZoom={isBusinessZoom}
          isShowBusinessDistrict={isShowBusinessDistrict}
          setSelectedBusinessDistrict={setSelectedBusinessDistrict}
          selectedBusinessDistrict={selectedBusinessDistrict}
          curClickTypeRef={curClickTypeRef}
          areaData={areaData}
          businessAreaMap={businessAreaMap}
        />

      </div>
    </MapHelpfulContextProvider>
  );
};

export default NetworkPlanEditMap;
