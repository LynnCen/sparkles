/**
 * @Description 区以下聚合
 */
import { FC, useEffect, useRef } from 'react';
import { CLUSTER_CRITICAL_COUNT } from '@/views/iterate/pages/siteselectionmap/ts-config';
import { BUSINESS_ZOOM } from '@/common/components/AMap/ts-config';
import { useStadiometry } from '@/common/hook/Amap/useStadiometry';

const ClusterMarkerOfDistrict: FC<any> = ({
  mapIns,
  // showRail, // 是否达到BUSINESS_ZOOM的缩放级别
  businessAreaData, // 商圈数据
}) => {
  const clusterMarkerRef: any = useRef();
  const isStadiometry: any = useStadiometry(); // 是否在使用测距功能
  const isStadiometryRef = useRef(isStadiometry);
  // const clearDistrictCluster = () => {
  //   clusterMarkerRef.current?.setMap(null);
  // };

  useEffect(() => {
    if (!mapIns) return;
    const len = businessAreaData?.length; // 商圈数据个数
    // 不满足聚合条件
    if (len < CLUSTER_CRITICAL_COUNT) {
      clusterMarkerRef.current && clusterMarkerRef.current.setMap(null);
      return;
    }
    loadMarker();
  // }, [mapIns, businessAreaData, showRail]);
  }, [mapIns, businessAreaData]);

  useEffect(() => {
    isStadiometryRef.current = isStadiometry;
  }, [isStadiometry]);

  // 以避免高德地图在新数据获取到之前，根据旧数据重新聚合，导致页面前后两次聚合
  // useEffect(() => {
  //   mapIns?.on('zoomend', clearDistrictCluster);
  //   return () => {
  //     mapIns?.off('zoomend', clearDistrictCluster);
  //   };
  // }, [mapIns]);

  const loadMarker = () => {
    clusterMarkerRef.current && clusterMarkerRef.current.setMap(null);
    const points = businessAreaData.filter((item) => +item?.lng && +item?.lat).map((item: any) => ({
      ...item,
      lnglat: [+item.lng, +item.lat]
    }));
    const clusterMarker = new window.AMap.MarkerCluster(mapIns, points, {
      gridSize: 100, // 设置网格像素大小
      // maxZoom: BUSINESS_ZOOM, // 最大的聚合级别，大于等于该级别就不进行相应的聚合。
      maxZoom: 20, // 最大的聚合级别，大于等于该级别就不进行相应的聚合。
      // 注意这里高德内部有判断逻辑，如果的count是1时，会调用renderMarker的显示
      renderClusterMarker: customClusterMarker, // 自定义聚合点样式
      renderMarker: customClusterMarker, // 自定义非聚合点样式
    });
    clusterMarkerRef.current = clusterMarker;
    clusterMarkerRef.current.setMap(mapIns);
    // mapIns.add(clusterMarkerRef.current);
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
    marker && marker._opts && (marker._opts.bubble = true); // 允许冒泡
    marker?.setContent(`<div class="clusterMarkerOfDistrict">${count}</div>`);

    context.marker.on('click', (e) => {
      // 在使用工具箱的测距功能时，不执行点击后的逻辑
      if (isStadiometryRef.current) return;
      mapIns.setZoomAndCenter(BUSINESS_ZOOM, e?.lnglat, false, 100);
    });
  };

  return (
    <></>
  );
};

export default ClusterMarkerOfDistrict;

