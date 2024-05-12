import V2AMap, { Path } from '@/common/components/Map/V2AMap';
import { useMethods } from '@lhb/hook';
import { FC } from 'react';

interface MapPolygonProps {
  path?: Path|[Path, Path];
}

const MapPolygon: FC<MapPolygonProps> = ({ path = [] }) => {
  const [firstPath] = path || [];
  const { longitude, latitude }: any = firstPath || {};
  const center = longitude && latitude ? [longitude, latitude] : undefined;


  const methods = useMethods({
    mapLoadedHandle(map,) {
      const _path:number|string[][] = [];

      // 将坐标数组转换为二维数组
      path.map(item => _path.push([item.longitude, item.latitude]));


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

  return (
    <div style={{ height: 200 }}>
      <V2AMap loaded={methods.mapLoadedHandle} mapOpts={{
        zoom: 13, // 级别
        center: center, // 中心点坐标
      // viewMode:'3D'//使用3D视图
      }}/>
    </div>
  );
};

export default MapPolygon;
