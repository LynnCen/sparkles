/**
 * @description 新网规地图
 */
import { FC, useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import MapCon from './components/MapCon';
import { useAmapLevelAndCityNew } from '@/common/hook/useAmapLevelAndCityNew';
import MapSearchList from './components/MapSearchList';
import { getAreaMapData, getAreaPaging, getPolygon, getSelection, getTreeSelection } from '@/common/api/networkplan';
import { debounce } from '@lhb/func';
import Loading from '@/common/components/AMap/Loading';
import { DISTRICT_LEVEL, PROVINCE_LEVEL, CITY_LEVEL, BUSINESS_ZOOM } from '@/common/components/AMap/ts-config';
import cs from 'classnames';
import { useDebounceEffect } from '@/common/hook/useEffectDebounce';
import { DISTRICT_ZOOM } from '@/common/components/AMap/ts-config';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { message } from 'antd';

const networkMapContainer = 'networkMapContainer';
const MapContainer: FC<any> = ({
  companyDetails,
  approvalDetail,
  getApprovalDetails
}) => {

  const [amapIns, setAmapIns] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);// 列表loading
  const [listData, setListData] = useState<any>([]);// 列表-具体商圈addressMarker数据
  const [leftListData, setLeftListData] = useState<any>([]);// 左侧数据-分页
  const [totalInfo, setTotalInfo] = useState<any>(null);// 总计商圈数和已开门店数
  const [circleData, setCircleData] = useState<any>([]);// 省市聚合数据
  const [detailData, setDetailData] = useState<any>({
    visible: false,
    id: null,
  }); // 列表详情页相关（与地图联动）
  const [isReset, setIsReset] = useState<boolean>(false); // 是否需要更新数据
  const [rightDrawerVisible, setRightDrawerVisible] = useState<boolean>(true);// 右侧列表及详情收缩按钮
  const [isBusinessZoom, setIsBusinessZoom] = useState<boolean>(false);// 判断当前zoom是否可显示商圈围栏

  const [bounds, setBounds] = useState<any>(null);// 地图可视范围
  const { level, city, district } = useAmapLevelAndCityNew(amapIns, false, true);

  const pageRef = useRef<number>(1); // 虚拟列表下拉筛选的分页page
  const commonParamsRef = useRef<any>(null);// 存放共同的params，减少到处拼凑params
  const selectionsRef = useRef<any>({});// 筛选项大全


  /**
   * @description 右侧列表数据-分页，initData是否初始化，此页面page不会跟着地址改变
   * @param initData 是否初始化数据
   */
  const getRightListData = async() => {
    // page不会跟着地址，可视范围重新请求
    const _commonParams = {
      ...commonParamsRef.current,
      districtIdList: undefined,
      cityIds: undefined,
      provinceIdList: undefined,
      maxLat: undefined,
      minLat: undefined,
      maxLng: undefined,
      minLng: undefined,
    };

    const params:any = {
      page: pageRef.current,
      size: 20,
      // ...commonParamsRef.current
      ..._commonParams
    };

    setLoading(true);
    const data = await getAreaPaging(params).finally(() => {
      setLoading(false);
    });
    setLeftListData(data?.objectList);
    setTotalInfo(data?.totalNum);
    // Promise.all([getAreaPaging(params), getMapStatisticsInfo(params)]).then((res) => {
    //   if (res[0]?.objectList === null || !res[0]?.objectList?.length) {
    //     pageRef.current = NOT_MORE_DATA;
    //   }
    //   if (initData) {
    //     setLeftListData(res[0]?.objectList || []);
    //   } else {
    //     setLeftListData((state) => [...state, ...res[0]?.objectList || []]);
    //   }
    //   setTotalInfo({
    //     openStoreCount: res[1]?.statistics?.openStoreCount,
    //     totalNum: res[1]?.statistics?.planClusterCount
    //   });

    // }).finally(() => {
    //   setLoading(false);
    // });
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
      getPolygon({ ...params, page: curPage, onlyLatLng: false }),
      getPolygon({ ...params, page: curPage + 1 }),
      getPolygon({ ...params, page: curPage + 2 }),
      getPolygon({ ...params, page: curPage + 3 }),
    ]).then((res) => {
      const newArr = [...res[0], ...res[1], ...res[2], ...res[3], ...lastData];
      if (res[3].length === size) {
        // 还有数据，接着请求
        getListData(curPage + 4, newArr);
      } else {
        setListData(newArr);
      }
    });
  };

  // 获取地图聚合数据
  const getCircleData = async() => {
    if (level >= DISTRICT_LEVEL) return;
    const data = await getAreaMapData(commonParamsRef.current);
    setCircleData(data);
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
    const commonParams = {
      branchCompanyId: +companyDetails?.branchCompanyId,
      planId: +companyDetails?.planId,
      planClusterIds: companyDetails?.planClusterIds,
      secondLevelCategoryIdList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], // 此页面不可修改商圈类型默认全选
      ...mapParams, // 地图级别、城市id参数
    };

    commonParamsRef.current = commonParams;
    getRightListData();
    getListData();
    getCircleData();
  }, [amapIns, district?.id, level, isReset, bounds, isBusinessZoom], 100);

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
    Promise.all([
      // module 1 网规相关，2行业商圈 （通用版）
      getSelection({ module: 1 }),
      getTreeSelection({
        planId: companyDetails?.planId,
        type: 1,
        childCompanyId: companyDetails?.branchCompanyId,
      }),
    ]).then(res => {
      selectionsRef.current = ({ ...res[0], cities: res[1] });
    });
  }, []);

  useDebounceEffect(() => {
    if (city?.province && city?.name) {
      V2Message.info(`当前已切换到${city?.province}/${city?.name}`);
    }
    message.config({ maxCount: 1 });

  }, [city?.id], 300);
  return (
    <div className={cs(styles.container, networkMapContainer)}>
      <Loading amapIns={amapIns}/>

      {/* 右侧-列表数据及详情 */}
      <MapSearchList
        loading={loading}
        setIsReset={setIsReset}
        data={leftListData}
        appendData={getRightListData}
        setDetailData={setDetailData}
        detailData={detailData}
        pageRef={pageRef}
        totalInfo={totalInfo}
        setRightDrawerVisible={setRightDrawerVisible}
        rightDrawerVisible={rightDrawerVisible}
        approvalDetail={approvalDetail}
        getApprovalDetails={getApprovalDetails}
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
        selectionsRef={selectionsRef}
        isBusinessZoom={isBusinessZoom}
      />

    </div>
  );
};

export default MapContainer;
