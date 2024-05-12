/**
 * @Description 地图相关
 */
import AMap from '@/common/components/AMap';
import { FC } from 'react';
import styles from './index.module.less';
import ClusterMarker from './ClusterMarker';
import PointMarker from './PointMarker';
const MapCon:FC<any> = ({
  mapIns,
  setMapIns,
  clusterData, // 区聚合数据
  pointData, // 点位数据
  setEnterDrawerOpen, // 打开录入抽屉
  level,
  setItemData,
  itemData,
}) => {
  // 地图加载
  const mapLoadedHandle = (ins: any) => {
    ins && setMapIns(ins);
  };
  return <div className={styles.mapCon}>
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
        'AMap.DistrictSearch',
      ]}>
    </AMap>
    <ClusterMarker
      mapIns={mapIns}
      clusterData={clusterData}
    />
    <PointMarker
      mapIns={mapIns}
      pointData={pointData}
      setEnterDrawerOpen={setEnterDrawerOpen}
      level={level}
      setItemData={setItemData}
      itemData={itemData}
    />
  </div>;
};
export default MapCon;
