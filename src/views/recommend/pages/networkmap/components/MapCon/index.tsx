/**
 * @Description  地图相关
 */
import { FC, useEffect, useRef } from 'react';
import styles from './index.module.less';
import AMap from '@/common/components/AMap';
import { isArray } from '@lhb/func';
import { drawDistrictPath } from '@/common/utils/map';
import ClusterMarker from './ClusterMarker';
import AddressMarker from './AddressMarker';
import { CITY_LEVEL } from '@/common/components/AMap/ts-config';
import cs from 'classnames';
import { mapCon } from '../../ts-config';
import BusinessDistrict from './BusinessDistrict';
import DistrictCluster from './DistrictCluster';
import { useStadiometry } from '@/common/hook/Amap/useStadiometry';

const MapCon:FC<any> = ({
  setAmapIns,
  amapIns,
  level,
  listData,
  circleData,
  setDetailData,
  detailData,
  planClusterId,
  city,
  leftListData,
  isBranch,
  isOpenHeatMap,
  mapShowType,
  // polygonListData,
  isShape, // 是否选中绘制商圈
  isSelectToolBox, // 是否已打开工具箱（标记、测距）
  drawedRef,
  selectionsRef,
  isBusinessZoom,
  isShowBusinessDistrict, // 展示商区围栏
  setSelectedBusinessDistrict, // 设置市场容量（商区围栏）详情
  selectedBusinessDistrict, // 市场容量（商区围栏）详情
  curClickTypeRef, // 当前点击的是市场容量（商区围栏）还是商圈点位
  areaData, // 市场容量（商区围栏）数据
  businessAreaMap
}) => {

  const addressMarkerRef = useRef<any>([]);// 商圈marker
  const polygonMarkerRef = useRef<any>([]);// 商圈围栏
  const polymerizationRef = useRef<any>(null);// 聚合商圈（省市区）
  const districtLayerRef = useRef<any>(null);// 行政区围栏
  const districtClusterRef = useRef<any>(null);// 区级别以下的聚合
  const businessDistrictMarkerRef = useRef<any>([]);// 市场容量围栏
  const isStadiometry: any = useStadiometry(); // 是否在使用测距功能
  const isStadiometryRef = useRef(isStadiometry);

  const mapLoadedHandle = (mapIns: any) => {
    setAmapIns(mapIns);
  };

  const clearAllMarker = (obj) => {
    const {
      hidePolymerizationRef = true, // 隐藏聚合商圈（省市区）
      hideAddressMarkerRef = true, // 隐藏商圈点位
      hidePolygonMarkerRef = true, // 隐藏商圈围栏
      hideBusinessDistrictMarkerRef = true, // 隐藏市场容量围栏
      hideDistrictClusterRef = true, // 隐藏区级别以下聚合
    } = obj || {};
    // 隐藏聚合商圈（省市区
    if (hidePolymerizationRef) {
      polymerizationRef.current && amapIns.remove(polymerizationRef.current);
      polymerizationRef.current = null;
    }

    // 隐藏商圈点位
    if (hideAddressMarkerRef) {
      isArray(addressMarkerRef.current) && addressMarkerRef.current.length &&
      addressMarkerRef.current.map((item) => {
        amapIns.remove(item);
      });
      addressMarkerRef.current = [];
    }

    // 隐藏商圈围栏
    if (hidePolygonMarkerRef) {
      isArray(polygonMarkerRef.current) && polygonMarkerRef.current.length &&
      polygonMarkerRef.current.map((item) => {
        amapIns.remove(item);
      });
      polygonMarkerRef.current = [];
    }

    if (hideBusinessDistrictMarkerRef) {
      if (isArray(businessDistrictMarkerRef.current) && businessDistrictMarkerRef.current.length) {
        businessDistrictMarkerRef.current.map((item) => {
          amapIns.remove(item);
        });
      }
      businessDistrictMarkerRef.current = [];
    }

    // 隐藏区级别以下聚合
    if (hideDistrictClusterRef) {
      districtClusterRef.current?.setMap(null);
    }
  };

  const drawLayer = async() => {
    districtLayerRef.current?.setMap(null);
    if (isOpenHeatMap) return;
    if (city?.name && level === CITY_LEVEL) {
      // 直辖市得用city?.province
      const districtLayer = await drawDistrictPath(amapIns, city?.name || city?.province);
      //  获取后再次清空后再赋值（drawDistrictPath太慢，会出现触发多次请求但数据后置的情况，导致页面有多个行政区色块）
      districtLayerRef.current?.setMap(null);
      districtLayerRef.current = districtLayer;
    }
  };

  const clearDistrictCluster = () => {
    districtClusterRef.current?.setMap(null);
  };

  useEffect(() => {
    if (!amapIns) return;
    drawLayer();
  }, [city?.id, level, isOpenHeatMap]);

  // 以避免高德地图在新数据获取到之前，根据旧数据重新聚合，导致页面前后两次聚合
  useEffect(() => {
    amapIns?.on('zoomend', clearDistrictCluster);
    return () => {
      amapIns?.off('zoomend', clearDistrictCluster);
    };
  }, [amapIns]);

  useEffect(() => {
    isStadiometryRef.current = isStadiometry;
  }, [isStadiometry]);

  return <div className={cs(styles.mapCon, mapCon)}>
    <AMap
      mapOpts={{
        zoom: 4.56,
        zooms: [3.5, 20],
        center: [113.920639, 37.290792]
      }}
      loaded={mapLoadedHandle}
      plugins={[
        'AMap.RangingTool',
        'AMap.DistrictSearch',
        'AMap.Geocoder',
        'AMap.PlaceSearch',
        'AMap.HeatMap',
        'AMap.Driving', // 驾车
        'AMap.Riding', // 骑行
        'AMap.Walking', // 走路
        'AMap.DistrictSearch',
        'AMap.MouseTool',
        'AMap.PolygonEditor',
        'AMap.CircleEditor',
        'AMap.MarkerCluster'
      ]}>

    </AMap>
    <ClusterMarker
      amapIns={amapIns}
      circleData={circleData}
      level={level}
      planClusterId={planClusterId}
      polymerizationRef={polymerizationRef}
      isStadiometryRef={isStadiometryRef}
      clearAllMarker={clearAllMarker}
    />
    <AddressMarker
      amapIns={amapIns}
      listData={listData}
      addressMarkerRef={addressMarkerRef}
      polygonMarkerRef={polygonMarkerRef}
      clearAllMarker={clearAllMarker}
      isBranch={isBranch}
      isSelectToolBox={isSelectToolBox}
      setDetailData={setDetailData}
      level={level}
      detailData={detailData}
      leftListData={leftListData}
      planClusterId={planClusterId}
      mapShowType={mapShowType}
      // polygonListData={polygonListData}
      isShape={isShape}
      // polymerizationRef={polymerizationRef}
      drawedRef={drawedRef}
      selectionsRef={selectionsRef}
      isBusinessZoom={isBusinessZoom}
      isShowBusinessDistrict={isShowBusinessDistrict}
      curClickTypeRef={curClickTypeRef}
      businessAreaMap={businessAreaMap}
      areaData={areaData}
      selectedBusinessDistrict={selectedBusinessDistrict}
      setSelectedBusinessDistrict={setSelectedBusinessDistrict}
      // isShowDistrictCluster={isShowDistrictCluster}
    />
    {/* 区级别以下的聚合 */}
    <DistrictCluster
      amapIns={amapIns}
      districtClusterRef={districtClusterRef}
      isStadiometryRef={isStadiometryRef}
      // isShowDistrictCluster={isShowDistrictCluster}
      listData={listData}
      clearAllMarker={clearAllMarker}
    />
    {/* 市场容量 */}
    <BusinessDistrict
      amapIns={amapIns}
      businessDistrictMarkerRef={businessDistrictMarkerRef}
      isShowBusinessDistrict={isShowBusinessDistrict}
      curClickTypeRef={curClickTypeRef}
      selectedBusinessDistrict={selectedBusinessDistrict}
      setSelectedBusinessDistrict={setSelectedBusinessDistrict}
      areaData={areaData}
      isSelectToolBox={isSelectToolBox}
      setDetailData={setDetailData}
      detailData={detailData}
      // isShowDistrictCluster={isShowDistrictCluster}
      clearAllMarker={clearAllMarker}
      listData={listData}
    />
  </div>;
};
export default MapCon;
