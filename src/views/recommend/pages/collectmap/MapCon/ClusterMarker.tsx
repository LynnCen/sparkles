/**
 * @Description 区聚合圈
 */
import { BUSINESS_FIT_ZOOM, DISTRICT_ZOOM } from '@/common/components/AMap/ts-config';
import { FC, useEffect, useRef } from 'react';
const defaultIndex = 10;
const ClusterMarker:FC<any> = ({
  mapIns,
  clusterData,
}) => {
  const markerGroupRef = useRef<any>(null);

  // 绘制marker
  const drawClusterMarker = (clusterData) => {
    const markerArr:any = [];
    clusterData.map((item) => {
      if (!item.lng || !item.lat) return;
      if (item.total === 0) return;
      const marker = new window.AMap.Marker({
        position: [+item.lng, +item.lat],
        zIndex: defaultIndex,
        zooms: [1, DISTRICT_ZOOM]
      });

      marker.setContent(`<div class="clusterCon"><div class="areaName">${item.areaName}</div><div class="total">${item.total}</div></div>`);

      marker.on('mouseover', () => {
        marker.setzIndex(defaultIndex + 1);
      });

      marker.on('mouseout', () => {
        marker.setzIndex(defaultIndex);
      });

      marker.on('click', () => {
        if (+item.lng && +item.lat) {
          mapIns.setZoomAndCenter(BUSINESS_FIT_ZOOM, [+item.lng, +item.lat]);
        }
      });

      markerArr.push(marker);
    });
    markerGroupRef.current = new window.AMap.OverlayGroup(markerArr);
    mapIns.add(markerGroupRef.current);
  };

  useEffect(() => {
    if (!mapIns || !clusterData?.length) return;
    drawClusterMarker(clusterData);// 绘制marker
    // 清除marker
    return () => {
      markerGroupRef.current?.clearOverlays();
      markerGroupRef.current = null;
    };
  }, [clusterData, mapIns]);
  return <div>

  </div>;
};
export default ClusterMarker;
