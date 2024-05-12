import V2AMap from '@/common/components/Map/V2AMap';
import { useMethods } from '@lhb/hook';
import React, { useEffect, useState } from 'react';

export interface PolygonMapValue {
  path: any;
}

export interface PolygonMapProps {
  value?: PolygonMapValue;
}

const PolygonMap: React.FC<PolygonMapProps> = ({ value }) => {
  const [center, setCenter] = useState<any>([116.397428, 39.90923]);

  const methods = useMethods({
    mapLoadedHandle(map,) {
      const _path:number|string[][] = [];

      // 将坐标数组转换为二维数组
      value?.path.map(item => _path.push([item.longitude, item.latitude]));

      const polygon = new window.AMap.Polygon({
        path: _path,
        fillOpacity: 0.5,
        strokeOpacity: 1,
        fillColor: '#ccebc5',
        strokeColor: '#2b8cbe',
        strokeWeight: 1,
        strokeStyle: 'dashed',
        strokeDasharray: [5, 5],
      });

      // 将以上覆盖物添加到地图上
      map.add(polygon);

      map.setFitView(polygon);
    }
  });

  useEffect(() => {
    if (value && value.path) {
      setCenter([value.path[0].longitude, value.path[0].latitude]);
    }
    // eslint-disable-next-line
  }, [value]);

  return (
    <div style={{ width: '400px', height: '200px' }}>
      <V2AMap loaded={methods.mapLoadedHandle} mapOpts={{
        zoom: 15, // 级别
        center: center, // 中心点坐标
      // viewMode:'3D'//使用3D视图
      }}/>
    </div>
  );
};
export default PolygonMap;
