/**
 * @Description 地图相关内容入口
 */
import { FC, useContext, useEffect, useMemo, useState } from 'react';
import styles from './index.module.less';
import AMap from '@/common/components/AMap';
import DistrictBounds from './DistrictBounds';
import DistrictColor from './DistrictColor';
import ClusterMarker from './ClusterMarker';
import { isArray } from '@lhb/func';
import ClusterMarkerOfDistrict from './ClusterMarkerOfDistrict';
import PlentifulMarkers from './PlentifulMarkers';
import { CITY_LEVEL } from '@/common/components/AMap/ts-config';
import { useDebounceEffect } from '@/common/hook/useEffectDebounce';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { message } from 'antd';
import { allData, businessStatus, collecting, creating, isResetContext, mapCon } from '../../ts-config';
import cs from 'classnames';
const MapCon:FC<any> = ({
  mapIns,
  setMapIns,
  mapHelpfulInfo,
  curSelectDistrict,
  circleData,
  firstLevelCategory,
  showRail,
  districtData,
  itemData,
  setItemData,
  locationInfo,
  setBounds,
  polygonData,
  isPositioning,
  rankSort,
  setDistrictCluster,
  isShape
}) => {
  const { collectList }: any = useContext(isResetContext);

  const [pointData, setPointData] = useState<any[]>([]);
  const [curBounds, setCurBounds] = useState<any>();// 存放高德获取到的bounds，与entry的bounds(最大最小经纬度)不同
  const { city, level } = mapHelpfulInfo;
  // 过滤排名数据
  const districtDataRank = useMemo(() => {
    const { value } = rankSort;
    // if (value > 0) {
    return districtData.filter((item) => {
      if (value === creating) { // 生成中的数据
        return item?.status === businessStatus.NEW;
      } else if (value === collecting) { // 被收藏的数据
        return collectList.includes(item?.id);
      } else if (value === allData) { // 全部数据
        return true;
      } else {
        return item.rank < value;
      }
    });
    // }
    // return districtData;
  }, [rankSort, districtData]);
  const polygonDataRank = useMemo(() => {
    const ids = districtDataRank.map((item) => item.id);
    return polygonData.filter((item) => ids.includes(item.id));
  }, [polygonData, districtDataRank]);

  // 地图加载完成
  const mapLoadedHandle = (ins: any) => {
    ins && setMapIns(ins);
  };

  useEffect(() => {
    if (!mapIns) return;
    if (isPositioning) {
      moveEndHandle();
    }
    mapIns.on('moveend', moveEndHandle);
    mapIns.on('zoomend', moveEndHandle);
  }, [mapIns, isPositioning]);

  useDebounceEffect(() => {
    if (city?.province && city?.name) {
      V2Message.info(`当前已切换到${city?.province}/${city?.name}`);
    }
    message.config({ maxCount: 1 });
  }, [city?.id], 300);

  const moveEndHandle = () => {
    const bounds = mapIns?.getBounds(); // 获取地图可视区域的坐标
    /**
       *  当一个屏幕在zoom为BUSINESS_ZOOM的情况下，
       *  maxLat-minLat约为0.05、maxLng-minLng约为0.1
       *  四个角各取1/4增大范围，能让用户在小范围移动时，已经提前加载出点位，同时能够让点位中心不在可视范围，但商圈围栏在可视范围内的也展示出来
       */
    const target = {
      minLat: bounds?.southWest.lat - 0.05 / 8,
      maxLat: bounds?.northEast.lat + 0.05 / 8,
      minLng: bounds?.southWest.lng - 0.1 / 8,
      maxLng: bounds?.northEast.lng + 0.1 / 8,

    };
    setBounds(target);
    setCurBounds(bounds);
  };

  useEffect(() => {
    const res = districtDataRank.filter((item) => item?.lng && item?.lat && curBounds?.contains(new window.AMap.LngLat(item.lng, item.lat)));
    setPointData(level <= CITY_LEVEL ? [] : res);
  }, [curBounds, districtDataRank, level]);

  const getIconColor = (firstLevelCategoryId: number) => {
    if (!(isArray(firstLevelCategory) && firstLevelCategory.length)) return null;
    return firstLevelCategory.find((item: any) => item.id === firstLevelCategoryId);
  };

  return <div className={cs(styles.mapCon, mapCon)}>
    {/* 这里不需要设置地图中心点，会影响定位当前用户位置时的获取区域的逻辑 */}
    <AMap
      mapOpts={{
        zooms: [3.5, 20],
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
        'AMap.MarkerCluster', // 聚合插件
        'AMap.TileLayer', // 卫星图
        'AMap.HeatMap', // 热力图
        'AMap.MouseTool', // 鼠标工具-新增商圈
        'AMap.CircleEditor', // 圆形编辑
        'AMap.PolygonEditor', // 多边形编辑
      ]}>
    </AMap>
    {/* 省市区聚合 */}
    <ClusterMarker
      amapIns={mapIns}
      circleData={circleData}
      level={level}
      cityData={city}
      getIconColor={getIconColor}
      setDistrictCluster={setDistrictCluster}
    />
    {/* 数据量比较大时的区级别聚合 */}
    <ClusterMarkerOfDistrict
      mapIns={mapIns}
      businessAreaData={pointData}
      showRail={showRail}
    />
    {/* 非聚合状态下显示的商圈 */}
    <PlentifulMarkers
      mapIns={mapIns}
      showRail={showRail}
      businessAreaData={pointData}
      level={level}
      itemData={itemData}
      setItemData={setItemData}
      locationInfo={locationInfo}
      polygonData={polygonDataRank}
      allPointData={districtDataRank}
      isShape={isShape}
      // getIconColor={getIconColor}
    />

    {/* 行政区围栏-左侧筛选选中时，会绘制该行政区围栏 */}
    <DistrictBounds
      mapIns={mapIns}
      mapHelpfulInfo={mapHelpfulInfo}
      curSelectDistrict={curSelectDistrict}
    />
    {/* 行政区色块围栏-市级状态下，会绘制该市的所有行政区围栏（不同颜色） */}
    <DistrictColor
      mapIns={mapIns}
      mapHelpfulInfo={mapHelpfulInfo}
    />
  </div>;
};
export default MapCon;
