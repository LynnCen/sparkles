/**
 * @Description  地图相关
 */
import { useEffect, useRef } from 'react';
import styles from './index.module.less';
import AMap from '@/common/components/AMap';
import { isArray } from '@lhb/func';
import { drawDistrictPath } from '@/common/utils/map';
import ClusterMarker from './ClusterMarker';
import AddressMarker from './AddressMarker';
import { CITY_LEVEL } from '@/common/components/AMap/ts-config';
import cs from 'classnames';
import { mapCon } from '../../ts-config';
import DistrictCluster from './DistrictCluster';

const MapCon = ({
  setAmapIns,
  amapIns,
  level,
  listData,
  circleData,
  setDetailData,
  detailData,
  city,
  leftListData,
  selectionsRef,
  isBusinessZoom,
}) => {

  const addressMarkerRef = useRef<any>([]);// 商圈marker
  const polygonMarkerRef = useRef<any>([]);// 商圈围栏
  const polymerizationRef = useRef<any>(null);// 聚合商圈（省市区）
  const districtLayerRef = useRef<any>(null);// 行政区围栏
  const districtClusterRef = useRef<any>(null);// 区级别以下的聚合


  const mapLoadedHandle = (mapIns: any) => {
    setAmapIns(mapIns);
  };

  const clearAllMarker = (obj) => {
    const {
      hidePolymerizationRef = true, // 隐藏聚合商圈（省市区）
      hideAddressMarkerRef = true, // 隐藏商圈点位
      hidePolygonMarkerRef = true, // 隐藏商圈围栏
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

    // 隐藏区级别以下聚合
    if (hideDistrictClusterRef) {
      districtClusterRef.current?.setMap(null);
    }
  };

  const drawLayer = async() => {
    districtLayerRef.current?.setMap(null);
    // if (isOpenHeatMap) return;
    if (city?.name && level === CITY_LEVEL) {
      // 直辖市得用city?.province
      const districtLayer = await drawDistrictPath(amapIns, city?.name || city?.province);
      //  获取后再次清空后再赋值（drawDistrictPath太慢，会出现触发多次请求但数据后置的情况，导致页面有多个行政区色块）
      districtLayerRef.current?.setMap(null);
      districtLayerRef.current = districtLayer;
    }
  };

  useEffect(() => {
    if (!amapIns) return;
    drawLayer();
  }, [city?.id, level]);

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
      polymerizationRef={polymerizationRef}
      clearAllMarker={clearAllMarker}
    />
    <AddressMarker
      amapIns={amapIns}
      listData={listData}
      addressMarkerRef={addressMarkerRef}
      polygonMarkerRef={polygonMarkerRef}
      clearAllMarker={clearAllMarker}
      setDetailData={setDetailData}
      level={level}
      detailData={detailData}
      leftListData={leftListData}
      selectionsRef={selectionsRef}
      isBusinessZoom={isBusinessZoom}
    />
    {/* 区级别以下的聚合 */}
    <DistrictCluster
      amapIns={amapIns}
      districtClusterRef={districtClusterRef}
      listData={listData}
      clearAllMarker={clearAllMarker}
    />
  </div>;
};
export default MapCon;
