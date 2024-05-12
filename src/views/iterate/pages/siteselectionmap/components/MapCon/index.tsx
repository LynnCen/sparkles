/**
 * @Description 地图
 */

import { FC, useEffect, useRef, useState, useMemo } from 'react';
import { isArray } from '@lhb/func';
import { CITY_LEVEL } from '@/common/components/AMap/ts-config';
import { CLUSTER_CRITICAL_COUNT } from '../../ts-config';
import { districtColor, drawDistrictPath } from '@/common/utils/map';
// import cs from 'classnames';
import styles from './index.module.less';
import AMap from '@/common/components/AMap';
import ClusterMarker from './ClusterMarker';
import PlentifulMarkers from './PlentifulMarkers';
import DetailOverviewInMap from './DetailOverviewInMap';
import ClusterMarkerOfDistrict from './ClusterMarkerOfDistrict';

const MapCon: FC<any> = ({
  mapIns,
  mapHelpfulInfo,
  showRail, // 是否显示围栏
  selection, // 筛选项
  districtDataInMap, // 地图上区级别的数据
  detailData, // 详情
  circleData, // 省市区聚合的数据
  searchParams,
  setDetailData,
  setSearchParams,
  setMapIns,
  labelOptionsChanged,
  setAreaChangedLabels, // 某个商圈标签变动
}) => {
  const districtLayerRef = useRef<any>(null);// 行政区围栏
  const numRef: any = useRef(0);
  const { level, city } = mapHelpfulInfo;
  const levelRef: any = useRef(level);
  const [moveendState, setMoveendState] = useState<number>(0);

  // 绘制城市下面的行政区
  useEffect(() => {
    if (!mapIns) return;
    levelRef.current = level;
    drawLayer();
  }, [city?.id, level]);
  // 是否是区级别聚合
  const isDistrictCluster = useMemo(() => {
    return districtDataInMap?.length >= CLUSTER_CRITICAL_COUNT;
  }, [districtDataInMap]);

  // 是否是满足区聚合状态下而且达到了显示点的状态
  const isClusterOfShowPoints = useMemo(() => {
    return showRail && isDistrictCluster;
  }, [districtDataInMap, showRail]);
  // 地图移动完成后，是否满足区聚合状态下而且达到了显示点的状态，通过setSearchParams触发接口请求，
  useEffect(() => {
    if (isClusterOfShowPoints) {
      const { southWest, northEast } = mapIns.getBounds(); // 获取地图可视区域的坐标
      const target = {
        minLat: southWest.lat,
        maxLat: northEast.lat,
        minLng: southWest.lng,
        maxLng: northEast.lng,
      };
      setSearchParams((state) => ({ ...state, ...target }));
    }
  }, [moveendState, isClusterOfShowPoints]);
  // 区聚合状态下重新回到聚合状态
  useEffect(() => {
    if (!showRail) { // 只在区聚合状态下会传minLat、maxLat、minLng、maxLng
      const { minLat, maxLat, minLng, maxLng } = searchParams;
      if (minLat || maxLat || minLng || maxLng) {
        setSearchParams((state) => ({ ...state, ...{
          minLat: null,
          maxLat: null,
          minLng: null,
          maxLng: null,
        } }));
      }
    }
  }, [showRail]);

  // 地图加载完成
  const mapLoadedHandle = (mapIns: any) => {
    mapIns && setMapIns(mapIns);
    mapIns.on('moveend', moveendHandle);
  };
  // 地图移动完
  const moveendHandle = () => {
    numRef.current++;
    setMoveendState(numRef.current);
  };

  const drawLayer = async() => { // 绘制行政区
    districtLayerRef.current?.setMap(null);
    if (city?.name && levelRef.current === CITY_LEVEL) {
      const districtLayer = await drawDistrictPath(mapIns, city?.name, districtColor, {
        customOpenCQCheck: city?.name === '重庆市'
      });
      //  过快的滑动会出现页面有多个行政区色块的场景
      districtLayerRef.current?.setMap(null);
      districtLayerRef.current = districtLayer;
      // 异步问题的处理
      if (levelRef.current !== CITY_LEVEL) {
        districtLayerRef.current?.setMap(null);
      }
    }
  };

  const getIconColor = (firstLevelCategoryId: number) => {
    const { firstLevelCategory } = selection;
    if (!(isArray(firstLevelCategory) && firstLevelCategory.length)) return null;
    return firstLevelCategory.find((item: any) => item.id === firstLevelCategoryId);
  };

  return (
    <div className={styles.mapCon}>
      <AMap
        mapOpts={{
          // zoom: centerOfChinaZoom,
          // zooms: [3.5, 20],
          // 这里不需要设置地图中心点，会影响定位当前用户位置时的获取区域的逻辑
          // center: centerOfChina // 默认地图的中心位置，使中国地图处于地图正中央
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
          'AMap.DistrictSearch',
          'AMap.MarkerCluster', // 聚合插件
          'AMap.TileLayer', // 卫星图
          'AMap.HeatMap', // 热力图
        ]}>
        {/* 省市区聚合 */}
        <ClusterMarker
          amapIns={mapIns}
          circleData={circleData}
          level={level}
          getIconColor={getIconColor}
        />
        {/* 数据量比较大时的区级别聚合 */}
        <ClusterMarkerOfDistrict
          mapIns={mapIns}
          businessAreaData={districtDataInMap}
          showRail={showRail}
        />
        {/* 非聚合状态下显示的商圈 */}
        <PlentifulMarkers
          mapIns={mapIns}
          showRail={showRail}
          businessAreaData={districtDataInMap}
          level={level}
          detailData={detailData}
          setDetailData={setDetailData}
          getIconColor={getIconColor}
        />
        {/* 详情概览 */}
        <DetailOverviewInMap
          mapIns={mapIns}
          detailData={detailData}
          labelOptionsChanged={labelOptionsChanged}
          setAreaChangedLabels={setAreaChangedLabels}
        />
      </AMap>
    </div>
  );
};

export default MapCon;
