/**
 * @Description 集客点信息
 */

import AMap from '@/common/components/AMap';
import { FC, useEffect, useState } from 'react';
import styles from '../index.module.less';
const color = ['#549BFF', '#FFC28E', '#7FCCB1'];
const LinesInfo: FC<any> = ({ detail }) => {
  const [mapIns, setMapIns] = useState<any>(null);
  const polyline = {
    strokeColor: color[0],
    strokeOpacity: 1,
    strokeWeight: 6,
    strokeStyle: 'solid',
    lineJoin: 'round', // 折线拐点
    lineCap: 'round', // 折线两端
    showDir: true,
    zIndex: 20,
  };
    // 绘制当前商圈的围栏
  const drawPolygon = () => {
    if (detail?.radius) {
      const circle = new window.AMap.Circle({
        center: [detail?.lng, detail?.lat],
        radius: detail?.radius, // 半径（米）
        strokeColor: '#006AFF',
        strokeWeight: 2,
        strokeOpacity: 1,
        fillOpacity: 0.2,
        strokeStyle: 'dashed',
        strokeDasharray: [10, 10],
        fillColor: '#006AFF',
        zIndex: 10,
      });
      // polygonRef.current = circle;
      mapIns.add(circle);
      mapIns.setFitView(circle, true);
      // ui觉得setFitView放大后的比例不合适，要在放大一级别
      setTimeout(() => {
        mapIns.zoomIn();
      }, 100);

      return;
    }
    if (detail?.polygon) {
      const polygon = new window.AMap.Polygon({
        path: detail?.polygon?.map((item) => {
          return [+item.lng, +item.lat];
        }),
        fillColor: '#006AFF',
        strokeOpacity: 1,
        fillOpacity: 0.1,
        strokeColor: '#006AFF',
        strokeWeight: 1,
        strokeStyle: 'dashed',
        zIndex: 20,
        anchor: 'bottom-center',
        bubble: true,
      });
      // polygonRef.current = polygon;
      mapIns.add(polygon);
      mapIns.setFitView(polygon, true);
      // ui觉得setFitView放大后的比例不合适，要在放大一级别
      setTimeout(() => {
        mapIns.zoomIn();
      }, 100);
      return;
    }
  };
  const drawPoint = (info, index) => {
    const lineMarker = new window.AMap.Marker({
      position: [+info.lng, +info.lat],
      anchor: 'center',
      content: `<div class="point"><div class="text">${index + 1}</div><img src="http://staticres.linhuiba.com/project-custom/locationpc/map/marker.png"/></div>`
    });
    mapIns.add(lineMarker);
  };

  const drawLine = (moveLineList, index) => {
    moveLineList?.map((line) => {
      const lineMarker = new window.AMap.Polyline({
        path: line.map((item) => [item.lng, item.lat]),
        ...polyline,
        strokeColor: color[index],
      });
      mapIns.add(lineMarker);
    });
  };
  useEffect(() => {
    if (!mapIns) return;
    drawPolygon();

    detail?.planSpots.map((info, index) => {
    // 绘制文本标记
      if (detail.lng && detail.lat) {
        drawPoint(info, index);
      }
      if (info?.moveLineList?.length) {
        drawLine(info.moveLineList, index);
      }
    });


  }, [mapIns, detail]);
  return (
    <div className={styles.mapCon}>
      <AMap loaded={setMapIns} />
    </div>
  );
};
export default LinesInfo;
