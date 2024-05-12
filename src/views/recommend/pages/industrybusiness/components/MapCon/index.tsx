/**
 * @Description 地图相关
 */
import { FC, useEffect, useRef } from 'react';
import styles from './index.module.less';
import AMap from '@/common/components/AMap';
import { isArray } from '@lhb/func';
import { drawDistrictPath } from '@/common/utils/map';
import ClusterMarker from './ClusterMarker';
import AddressMarker from './AddressMarker';
import { CITY_LEVEL } from '@/common/components/AMap/ts-config';
import DistrictCluster from './DistrictCluster';
// const addressMarkerZIndex = 10;
const MapCon:FC<any> = ({
  setAmapIns,
  amapIns,
  level,
  listData,
  circleData,
  setDetailData,
  detailData,
  city,
  leftListData,
  isOpenHeatMap, // 此处与其他网规地图不同，其他无工具箱，可以把行政区图层单独拿出
  mapShowType,
  // polygonListData,
  selectionsRef,
  isSelectToolBox, // 是否已打开工具箱（标记、测距）
  isBusinessZoom
}) => {
  // const [isBusinessZoom, setIsBusinessZoom] = useState<boolean>(false);

  const addressMarkerRef = useRef<any>([]);// 商圈marker
  const polygonMarkerRef = useRef<any>([]);// 商圈围栏
  // const signMarkerRef = useRef<any>([]);// 商圈标记图标marker
  const polymerizationRef = useRef<any>(null);// 聚合商圈（省市区）
  const districtLayerRef = useRef<any>(null);// 行政区围栏
  const districtClusterRef = useRef<any>(null);// 区级别以下的聚合
  // const businessDistrictMarkerRef = useRef<any>([]);// 市场容量围栏


  const mapLoadedHandle = (mapIns: any) => {
    setAmapIns(mapIns);
  };

  const clearAllMarker = (obj) => {
    const {
      hidePolymerizationRef = true, // 隐藏聚合商圈（省市区）
      hideAddressMarkerRef = true, // 隐藏商圈点位
      hidePolygonMarkerRef = true, // 隐藏商圈围栏
      // hideBusinessDistrictMarkerRef = true, // 隐藏市场容量围栏
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

    // if (hideBusinessDistrictMarkerRef) {
    //   if (isArray(businessDistrictMarkerRef.current) && businessDistrictMarkerRef.current.length) {
    //     businessDistrictMarkerRef.current.map((item) => {
    //       amapIns.remove(item);
    //     });
    //   }
    //   businessDistrictMarkerRef.current = [];
    // }

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

  // 以避免高德地图在新数据获取到之前，根据旧数据重新聚合，导致页面前后两次聚合
  useEffect(() => {
    amapIns?.on('zoomend', clearDistrictCluster);
    return () => {
      amapIns?.off('zoomend', clearDistrictCluster);
    };
  }, [amapIns]);

  useEffect(() => {
    if (!amapIns) return;
    drawLayer();
  }, [city?.id, level, isOpenHeatMap]);
  return <div className={styles.mapCon}>
    <AMap
      mapOpts={{
        zoom: 4.56,
        zooms: [3.5, 20],
        center: [113.920639, 37.290792] // 默认地图的中心位置，使中国地图处于地图正中央
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
        // 'AMap.MouseTool',
        // 'AMap.PolygonEditor',
        // 'AMap.CircleEditor',
        'AMap.MarkerCluster'
      ]}>

    </AMap>
    <ClusterMarker
      amapIns={amapIns}
      circleData={circleData}
      level={level}
      // planClusterId={planClusterId}
      polymerizationRef={polymerizationRef}
      clearAllMarker={clearAllMarker}
    />
    <AddressMarker
      amapIns={amapIns}
      listData={listData}
      addressMarkerRef={addressMarkerRef}
      polygonMarkerRef={polygonMarkerRef}
      clearAllMarker={clearAllMarker}
      isSelectToolBox={isSelectToolBox}
      setDetailData={setDetailData}
      level={level}
      detailData={detailData}
      leftListData={leftListData}
      mapShowType={mapShowType}
      // polygonListData={polygonListData}
      polymerizationRef={polymerizationRef}
      selectionsRef={selectionsRef}
      isBusinessZoom={isBusinessZoom}
    />
    {/* 区级别以下的聚合 */}
    <DistrictCluster
      amapIns={amapIns}
      districtClusterRef={districtClusterRef}
      // isShowDistrictCluster={isShowDistrictCluster}
      listData={listData}
      clearAllMarker={clearAllMarker}
    />
  </div>;
};
export default MapCon;
