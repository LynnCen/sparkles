/**
 * @Description 行业商圈（通用版）地图逻辑
 */
import { FC, useEffect, useRef } from 'react';
import { CITY_LEVEL, centerOfChina, centerOfChinaZoom } from '@/common/components/AMap/ts-config';
import { isArray } from '@lhb/func';
import { drawDistrictPath } from '@/common/utils/map';
import styles from './index.module.less';
import AMap from '@/common/components/AMap';
import ClusterMarker from './ClusterMarker';
import PlentifulMarkers from './PlentifulMarkers';

const MapCon:FC<any> = ({
  setAmapIns,
  mapIns,
  businessAreaData, // 商圈数据
  level,
  selection, // 筛选项
  circleData, // 省市区时的聚合数据
  detailData, // 当前详情数据
  showRailPath, // 是否显示商圈围栏
  setDetailData, // 设置详情
  city,
  isOpenHeatMap, // 此处与其他网规地图不同，其他无工具箱，可以把行政区图层单独拿出
  isSelectToolBox, // 是否已打开工具箱（标记、测距）
  showRailForSelf, // 控制显示围栏的时机
}) => {
  const addressMarkerRef = useRef<any>([]);// 商圈marker
  const polygonMarkerRef = useRef<any>([]);// 商圈围栏
  const signMarkerRef = useRef<any>([]);// 商圈标记图标marker
  const polymerizationRef = useRef<any>(null);// 聚合商圈（省市区）
  const districtLayerRef = useRef<any>(null);// 行政区围栏

  // 绘制城市下面的行政区
  useEffect(() => {
    if (!mapIns) return;
    drawLayer();
  }, [city?.id, level, isOpenHeatMap]);

  const mapLoadedHandle = (mapIns: any) => {
    setAmapIns(mapIns);
  };

  const clearAllMarker = () => { // 清除所有覆盖物
    polymerizationRef.current && mapIns.remove(polymerizationRef.current);
    polymerizationRef.current = null;

    isArray(addressMarkerRef.current) && addressMarkerRef.current.length &&
      addressMarkerRef.current.map((item) => {
        mapIns.remove(item);
      });
    addressMarkerRef.current = [];

    isArray(polygonMarkerRef.current) && polygonMarkerRef.current.length &&
    polygonMarkerRef.current.map((item) => {
      mapIns.remove(item);
    });
    polygonMarkerRef.current = [];

    isArray(signMarkerRef.current) && signMarkerRef.current.length &&
    signMarkerRef.current.map((item) => {
      mapIns.remove(item);
    });
    signMarkerRef.current = [];
  };

  const drawLayer = async() => { // 绘制行政区
    districtLayerRef.current?.setMap(null);
    if (isOpenHeatMap) return;
    if (city?.name && level === CITY_LEVEL) {
      const districtLayer = await drawDistrictPath(mapIns, city?.name);
      //  过快的滑动会出现页面有多个行政区色块的场景
      districtLayerRef.current?.setMap(null);
      districtLayerRef.current = districtLayer;
    }
  };

  const getIconColor = (firstLevelCategoryId: number) => {
    const { firstLevelCategory } = selection;
    if (!(isArray(firstLevelCategory) && firstLevelCategory.length)) return null;
    return firstLevelCategory.find((item: any) => item.id === firstLevelCategoryId);
  };

  return <div className={styles.mapCon}>
    <AMap
      mapOpts={{
        zoom: centerOfChinaZoom,
        zooms: [3.5, 20],
        center: centerOfChina // 默认地图的中心位置，使中国地图处于地图正中央
      }}
      loaded={mapLoadedHandle}
      plugins={[
        // 'AMap.PlaceSearch',
        'AMap.RangingTool',
        'AMap.DistrictSearch',
        'AMap.Geocoder',
        'AMap.PlaceSearch',
        'AMap.HeatMap',
        'AMap.Driving', // 驾车
        'AMap.Riding', // 骑行
        'AMap.Walking', // 走路
        'AMap.DistrictSearch'
      ]}>
      {/* 省市区聚合状态的覆盖物 */}
      <ClusterMarker
        amapIns={mapIns}
        circleData={circleData}
        level={level}
        polymerizationRef={polymerizationRef}
        clearAllMarker={clearAllMarker}
        getIconColor={getIconColor}
      />
      {/* 区级别时的覆盖物 */}
      {/* <AddressMarker
        mapIns={mapIns}
        listData={listData}
        addressMarkerRef={addressMarkerRef}
        polygonMarkerRef={polygonMarkerRef}
        clearAllMarker={clearAllMarker}
        setDetailData={setDetailData}
        level={level}
        detailData={detailData}
        businessCircleData={businessCircleData}
        mapShowType={mapShowType}
        polygonListData={polygonListData}
      /> */}
      <PlentifulMarkers
        mapIns={mapIns}
        level={level}
        businessAreaData={businessAreaData}
        detailData={detailData}
        showRailPath={showRailPath}
        getIconColor={getIconColor}
        setDetailData={setDetailData}
        isSelectToolBox={isSelectToolBox}
        showRailForSelf={showRailForSelf}
      />
    </AMap>
  </div>;
};
export default MapCon;
