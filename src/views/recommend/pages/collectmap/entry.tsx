import { FC, useEffect, useState } from 'react';
import styles from './entry.module.less';
import MapCon from './MapCon';
import TopCon from './TopCon';
import RightCon from './RightCon';
import { useAmapLevelAndCityNew } from '@/common/hook/useAmapLevelAndCityNew';
import { useCurLocation } from '@/common/hook/Amap/useCurLocation';
import { CITY_FIT_ZOOM, DISTRICT_LEVEL } from '@/common/components/AMap/ts-config';
import { getMapPage, getCollectMapData, getStatistic, getSpotDetail, getClusterDetail } from '@/common/api/networkplan';
import PlanSpotDetail from '@/common/components/business/ExpandStore/PlanSpotDetail';
import V2Drawer from '@/common/components/Feedback/V2Drawer';

const CollectMap: FC<any> = () => {
  const [mapIns, setMapIns] = useState<any>(null);
  const [clusterData, setClusterData] = useState<any[]>([]);// 区聚合
  const [pointData, setPointData] = useState<any[]>([]);// 点位数据
  const [enterDrawerOpen, setEnterDrawerOpen] = useState({
    visible: false,
    value: null
  });// 维护表单抽屉开关及详情数据
  const [detailDrawer, setDetailDrawer] = useState({
    visible: false,
    value: null,
    id: null
  });// 点击的时候设置id,等拿到数据后再设置visible为true（无法直接从对应的点击元素中拿到所有的数据）
  const [topInfo, setTopInfo] = useState<any>(null);
  const [options, setOptions] = useState<any>({
    // 默认undefined,不会传入接口
    isOpenStore: undefined,
    relationSpotsList: undefined,
    spotStatusList: undefined
  });
  const [itemData, setItemData] = useState<any>({
    visible: false, // 是否显示详情
    id: null,
    detail: null, // 存放详情相关字段
  });

  const mapHelpfulInfo = useAmapLevelAndCityNew(mapIns, true, true); // 监听地图相关的数据

  const { level, city, district } = mapHelpfulInfo;
  const locationInfo = useCurLocation(mapIns, {
    panToLocation: false, // 定位成功后不自动移动到响应位置
    zoomToAccuracy: false, // 定位成功后不自动放大到响应精度
  }); // 定位信息


  const getParams = () => {
    const params: any = {
      level: level <= 3 ? 3 : 4,
      cityId: city?.id,
      ...options
    };
    if (level === 4) {
      params.districtId = district?.id;
    }
    return params;
  };

  // 获取聚合数据--只有区聚合，在getParams里面处理了
  const getClusterMap = async (params) => {
    const _params = {
      ...params,
      childCompanyPlanned: 1,
    };
    const data = await getCollectMapData(_params);
    setClusterData(data);
  };

  // 获取右侧列表和点位数据
  const handleGetMapPage = async (params, curPage = 1,) => {
    const size = 200;
    const _params = {
      ...params,
      page: curPage,
      size: size
    };
    delete _params.level;
    const data = await getMapPage(_params);
    if (curPage === 1) {
      setPointData(data.objectList);
    } else {
      setPointData((state) => (
        [...state || [], ...data.objectList]
      ));
    }
    if (data.objectList?.length === size) {
      handleGetMapPage(params, curPage + 1);
    }
  };
  // 获取顶部数据
  const handleGetStatistic = async (params) => {
    delete params.level;
    const { data } = await getStatistic(params);
    setTopInfo(data);
  };

  // 刷新列表和顶部信息
  const onRefresh = () => {
    const params = getParams();

    if (level < DISTRICT_LEVEL) {
      getClusterMap(params);
    }
    handleGetMapPage(params);
    handleGetStatistic(params);
  };

  const handleGetDetail = async() => {
    const data = await getSpotDetail({ planClusterId: detailDrawer.id });
    // 这里用来获取radius和polygon
    const clusterData = await getClusterDetail({ planClusterId: detailDrawer.id });
    const value = {
      ...data,
      radius: clusterData?.radius,
      polygon: clusterData?.polygon,
    };
    setDetailDrawer({
      visible: true,
      value,
      id: detailDrawer.id
    });
  };

  // 初始化到定位城市的市级别
  useEffect(() => {
    if (!Object.keys(locationInfo || {}).length) return;
    mapIns.setZoom(CITY_FIT_ZOOM);
  }, [locationInfo]);

  useEffect(() => {
    if (!Object.keys(locationInfo || {}).length || !level) return;
    const params = getParams();
    if (level < DISTRICT_LEVEL) {
      getClusterMap(params);
    }
    handleGetMapPage(params);
    handleGetStatistic(params);

  }, [level, district, locationInfo, options]);

  // 当detailDrawer.id存在的时候，获取详情数据
  useEffect(() => {
    if (detailDrawer.id) {
      handleGetDetail();
    }
  }, [detailDrawer.id]);

  return (
    <div className={styles.container}>
      <MapCon
        mapIns={mapIns}
        setMapIns={setMapIns}
        clusterData={clusterData}
        pointData={pointData}
        setEnterDrawerOpen={setEnterDrawerOpen}
        level={level}
        setItemData={setItemData}
        itemData={itemData}
      />
      <TopCon
        mapIns={mapIns}
        mapHelpfulInfo={mapHelpfulInfo}
        setOptions={setOptions}
      />
      <RightCon
        pointData={pointData}
        setEnterDrawerOpen={setEnterDrawerOpen}
        enterDrawerOpen={enterDrawerOpen}
        topInfo={topInfo}
        city={city}
        setDetailDrawer={setDetailDrawer}
        onRefresh={onRefresh}
        setItemData={setItemData}
        mapIns={mapIns}
        itemData={itemData}
      />
      <V2Drawer
        open={detailDrawer.visible}
        onClose={() => setDetailDrawer({
          visible: false,
          value: null,
          id: null
        })}
        destroyOnClose
      >
        {detailDrawer.visible ? <PlanSpotDetail
          aprDetail={null}
          detail={detailDrawer.value}
        /> : <></>}
      </V2Drawer>

    </div>
  );
};

export default CollectMap;
