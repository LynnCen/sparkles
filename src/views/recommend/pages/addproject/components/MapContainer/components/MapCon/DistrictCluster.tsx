/**
 * @Description 区级别以下聚合
 */
import { BUSINESS_ZOOM, DISTRICT_ZOOM } from '@/common/components/AMap/ts-config';
import { FC, useEffect } from 'react';
import { maxAddressMarkerCount } from '../../ts-config';
const DistrictCluster:FC<any> = ({
  amapIns,
  districtClusterRef,
  // isShowDistrictCluster,
  listData,
  clearAllMarker
}) => {
  const createMarkerCluster = () => {
    clearAllMarker();
    // districtClusterRef.current?.setMap(null);

    const points = listData.map((item) => {
      return {
        ...item,
        weight: 1,
        lnglat: [item.lng, item.lat]
      };
    });
    var count = points.length;
    var _renderClusterMarker = function (context) {
      // 聚合中点个数
      var clusterCount = context.count;
      var size = Math.round(25 + Math.pow(clusterCount / count, 1 / 5) * 40);

      context.marker.setOffset(new window.AMap.Pixel(-size / 2, -size / 2));
      context.marker.setContent(`<div class="clusterMarkerCon">${clusterCount}</div>`);

      context.marker.on('click', (e) => {
        // 这里的60是ui拍脑袋定的个数，当聚合个数不一样时，点击效果不同
        if (context.count > 60) {
          // 如果点击的聚合圈个数大于60，那么跳转到显示围栏的层级 即 BUSINESS_ZOOM
          amapIns.setZoomAndCenter(BUSINESS_ZOOM, e?.lnglat, true);
        } else {
          // 如果点击的聚合个数小于等于60，以该聚合的经纬度取最大最小构造bound，将地图缩放到该bound视角
          let minLng = 180; // 最小经度，默认为180度
          let maxLng = -180; // 最大经度，默认为-180度
          let minLat = 90; // 最小纬度，默认为90度
          let maxLat = -90; // 最大纬度，默认为-90度
          // 当总数不一样时，取的数据属性不一样
          const _data = context.count === 1 ? context?.data : context?.clusterData || [];
          _data.forEach((item) => {
            minLng = Math.min(minLng, item.lng);
            maxLng = Math.max(maxLng, item.lng);
            minLat = Math.min(minLat, item.lat);
            maxLat = Math.max(maxLat, item.lat);
          });
          // bound冗余 1/16的屏幕，否则点位会显示在屏幕的边上
          // 0.1和0.05是24寸屏幕 1k分辨率下 的一屏幕最大最小lng和最大最小lat差
          amapIns?.setBounds([minLng - 0.1 / 32, minLat - 0.05 / 32, maxLng + 0.1 / 32, maxLat + 0.05 / 32]);
        }
      });
    };

    districtClusterRef.current = new window.AMap.MarkerCluster(amapIns, points, {
      gridSize: 100, // 聚合网格像素大小
      renderClusterMarker: _renderClusterMarker, // 自定义聚合点样式
      renderMarker: _renderClusterMarker, // 自定义非聚合点样式
      zooms: [DISTRICT_ZOOM, 20],
    });

    districtClusterRef.current.setMap(amapIns);
  };

  useEffect(() => {
    if (!amapIns) return;
    if (listData.length >= maxAddressMarkerCount) {
      createMarkerCluster();
    }
  }, [listData, amapIns]);
  return <div>

  </div>;
};
export default DistrictCluster;
