import React, { useEffect } from 'react';
import './index.module.less';
import { isArray } from '@lhb/func';

export interface V2PointClusterProps {
  /**
   * @description 地图示例（若不主动传，需将组件作为AMap的子组件）
   */
  _mapIns?: any;
  /**
   * @description 点聚合数据
   */
  pointClusterData: any[];
  /**
   * @description 点聚合marker配置，具体请参考https://lbs.amap.com/api/javascript-api-v2/documentation#markercluster
   */
  markerClusterConfig?: any;
  /**
   * @description 外部获取点聚合实例
   */
  setMarkerCluster?: Function;
  /**
   * @description 自义定点击事件
   */
  handleClick?: Function;
}
/**
 * @description 便捷文档地址
 * @see https://reactpc.lanhanba.net/components/Map/v2point-cluster
 */

const V2PointCluster: React.FC<V2PointClusterProps> = ({
  pointClusterData,
  markerClusterConfig,
  setMarkerCluster,
  handleClick,
  ...props
}) => {
  const { _mapIns } = props;

  const drawMarker = () => {
    const markerCluster = new window.AMap.MarkerCluster(_mapIns, pointClusterData, {
      gridSize: 100, // 聚合网格像素大小
      renderClusterMarker: customClusterMarker, // 自定义聚合点样式(群组)
      renderMarker: customClusterMarker, // 自定义非聚合点样式(单个)
      ...markerClusterConfig,
    });
    markerCluster.setMap(_mapIns);
    setMarkerCluster && setMarkerCluster(markerCluster);
  };

  const customClusterMarker = (context: any) => {
    /**
     * context 结构，有两种情况，区别是renderMarker调用时没有clusterData，而是data
     * {
     *  clusterData: [{xxx}, {xxx}...] // renderClusterMarker调用时有该字段，值等同于businessAreaData
     *  data: [], // renderMarker调用时有该字段，值等同于businessAreaData
     *  count: 20, // 聚合的数量
     *  indexs: xxx,
     *  marker: {}, // 当前覆盖物
     * }
     */
    const { marker, count } = context;
    marker?.setContent(`<div class="clusterMarker">${count}</div>`);

    context.marker.on('click', (e) => {
      if (handleClick) {
        handleClick(e, context, _mapIns);
        return;
      }
      _mapIns.setZoomAndCenter(_mapIns.getZoom() + 1, e?.lnglat, false, 200);
    });
  };

  useEffect(() => {
    if (isArray(pointClusterData) && pointClusterData.length > 0) {
      drawMarker();
    }
  }, [pointClusterData]);
  return <></>;
};

export default V2PointCluster;
