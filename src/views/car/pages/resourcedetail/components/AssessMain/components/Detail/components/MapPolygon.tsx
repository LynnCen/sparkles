/**
 * @Description 业务组件：多边形矢量物的绘制
 * 该组件是从中台迁移过来的代码用的组件，原本是用的react-amap，因为与当前项目的高德组件加载方式不同，高德会报 禁止多种API加载方式混用，所以需要统一加载方式，重构了该组件，源组件内容注释
 */

import { FC, useEffect, useState } from 'react';
// import { Map, Polygon, PolygonPath } from 'react-amap';
import { isArray } from '@lhb/func';
import Amap from '@/common/components/AMap';
interface MapPolygonProps {
  path?: any[];
}

const MapPolygon: FC<MapPolygonProps> = ({ path = [] }) => {
  const [amapIns, setAmapIns] = useState<any>();
  // const [firstPath] = path || [];
  // const { longitude, latitude }: any = firstPath || {};
  // const center = longitude && latitude ? { longitude, latitude } : undefined;
  useEffect(() => {
    if (!amapIns) return;
    if (!(isArray(path) && path.length)) return;
    drawPolygon();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amapIns, path]);
  // 地图加载完毕
  const loadedMapHandle = (ins: any) => {
    ins && setAmapIns(ins);
  };
  // 绘制多边形
  const drawPolygon = () => {
    const pathArr = path.map((item: any) => ([item.longitude, item.latitude]));
    // https://lbs.amap.com/demo/javascript-api-v2/example/overlayers/polygon-draw
    const polygonMarker = new window.AMap.Polygon({
      path: pathArr,
      strokeColor: '#2b8cbe', // 线颜色
      strokeOpacity: 1, // 线透明度
      strokeWeight: 1, // 线粗细度
      fillColor: '#ccebc5', // 填充颜色
      fillOpacity: 0.5, // 填充透明度
      strokeStyle: 'dashed',
      strokeDasharray: [5, 5],
    });
    amapIns.add(polygonMarker); // 添加到地图中
    amapIns.setFitView(); // 将地图缩放到合适的级别以显示覆盖物
  };

  return (
    // <div style={{ height: 200 }}>
    //   <Map
    //     amapkey={'b72172f99d385ee31127670c92e177b7'}
    //     zoom={13}
    //     center={center}>
    //     <Polygon
    //       path={path}
    //       style={{
    //         fillOpacity: 0.5,
    //         strokeOpacity: 1,
    //         fillColor: '#ccebc5',
    //         strokeColor: '#2b8cbe',
    //         strokeWeight: 1,
    //         strokeStyle: 'dashed',
    //         strokeDasharray: [5, 5],
    //       }}
    //     >
    //     </Polygon>
    //   </Map>
    // </div>
    <div style={{ height: '200px' }}>
      <Amap
        loaded={loadedMapHandle}/>
    </div>
  );
};

export default MapPolygon;
