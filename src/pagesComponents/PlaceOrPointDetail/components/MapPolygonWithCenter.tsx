/**
 * @Description 商圈围栏
 */
import AMap from '@/common/components/AMap';
import { FC, useEffect, useState } from 'react';
// https://elemefe.github.io/react-amap/components/polygon
// import { LngLat, PolygonPath } from 'react-amap';
import styles from './style/map-polygon.module.less';

interface MapPolygonWithCenterProps{
  data:MapObj
}

interface MapObj {
  path?: any; // 围栏
  center?: any; // 中心点
}

const MapPolygonWithCenter: FC<MapPolygonWithCenterProps> = ({ data }) => {
  const [amapIns, setAmapIns] = useState<any>(null); // 地图实例
  const { path = [], center }: any = data;
  const loadData = async () => {
    if (path?.length) {
      const polygon = new window.AMap.Polygon({
        path: path.map(item => {
          return new window.AMap.LngLat(item.longitude, item.latitude);
        }),
        fillOpacity: 0.5,
        strokeOpacity: 1,
        fillColor: '#ccebc5',
        strokeColor: '#2b8cbe',
        strokeWeight: 1,
        strokeStyle: 'dashed',
        strokeDasharray: [5, 5],
      });
      amapIns.add(polygon);
    }
  };
  useEffect(() => {
    if (!amapIns) return;
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amapIns]);
  const amapCreated = (ins: any) => {
    setAmapIns(ins);
  };

  return (
    <div className={styles['map-polygon-wrapper']} style={{ height: '100%' }}>
      <AMap
        loaded={amapCreated}
        mapOpts={{
          zoom: 16,
          center: center ? [center.longitude, center.latitude] : undefined
        }}>
      </AMap>
    </div>
  );
};

export default MapPolygonWithCenter;
