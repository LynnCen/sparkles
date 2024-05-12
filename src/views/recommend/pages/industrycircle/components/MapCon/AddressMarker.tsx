/**
 * @Description 已废弃，无用
 */
import { DISTRICT_LEVEL } from '@/common/components/AMap/ts-config';
import { BUSINESS_ZOOM } from '@/common/components/AMap/ts-config';
import { isArray } from '@lhb/func';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { RankStatus, businessType, colorStatus } from '../../ts-config';
const addressMarkerZIndex = 10;
// 普通形态的地图点位marker
// 创建、移出hover、恢复状态下 的 ,status传normal
// hover status传入hover
// 选中 status传入 selected
const Normal = Symbol('normal');
const Selected = Symbol('selected');
const Hover = Symbol('hover');
const addressMarker = (node, status, isCreate, hasHoverListRef) => {
  const classNameObj = {
    [Hover]: {
      label: node?.isPlaned ? 'label bigLabel' : 'noPlanLabel bigLabel',
      triangle: node?.isPlaned ? 'bigTriangle' : 'noPlanBigTriangle',
      areaName: 'bigAreaName',
      planned: 'bigPlanned'
    },
    [Selected]: {
      label: 'orangeLabel bigLabel',
      triangle: 'orangeBigTriangle',
      areaName: 'bigAreaName',
      planned: 'bigPlanned'
    },
    // normal是除hover和selected的状态
    [Normal]: {
      label: node?.isPlaned ? 'label' : 'noPlanLabel',
      triangle: node?.isPlaned ? 'triangle' : 'noPlanBigTriangle',
      areaName: 'areaName',
      planned: 'planned'
    }
  };
  return `<div class='
  ${classNameObj[status].label} 
  ${isCreate ? 'isScale' : ''} 
  ${hasHoverListRef.current.includes(node?.id) ? 'opacity' : ''}'>
  <div class="
  ${classNameObj[status].triangle} 
  ${hasHoverListRef.current.includes(node?.id) ? 'opacity' : ''}"></div>
  <div class="content">
    <span class=${classNameObj[status].areaName}>${node.areaName}</span>
  </div>
  </div>`;
};
// RankMarker有奶茶行业评分排名和益禾堂评分排名,通过传入rankType区分，
const RankMarker = (node, status, rankType, isCreate, hasHoverListRef) => {
  const classNameObj = {
    [Hover]: {
      label: 'bigLabel',
      triangle: 'bigTriangle',
      areaName: 'bigAreaName',
      planned: 'bigPlanned'
    },
    [Selected]: {
      label: 'bigLabel',
      triangle: 'bigTriangle',
      areaName: 'bigAreaName',
      planned: 'bigPlanned'
    },
    // normal是除hover和selected的状态
    [Normal]: {
      label: 'label',
      triangle: 'triangle',
      areaName: 'areaName',
      planned: 'planned'
    }
  };
  const content = () => {
    const rank = `NO.${rankType === RankStatus.brandRank ? node.mainBrandsRank : node.yhtRank}`;
    return node.type === businessType.DIYBusiness ? '新增商圈' : rank;
  };
  return `<div class="
  ${classNameObj[status].label} 
  ${isCreate ? 'isScale' : ''} " 
  style='background-color: ${hasHoverListRef.current.includes(node?.id) ? colorStatus[node.firstLevelCategoryId].selectedColor : colorStatus[node.firstLevelCategoryId]?.color}'>
  <div class="
  ${classNameObj[status].triangle} 
  ${hasHoverListRef.current.includes(node?.id) ? 'opacity' : ''}" 
     style='border-color: ${hasHoverListRef.current.includes(node?.id) ? colorStatus[node.firstLevelCategoryId].selectedColor : colorStatus[node.firstLevelCategoryId]?.color};       
            border-bottom-color: transparent;
            border-left-color: transparent;
            border-right-color: transparent;'></div>
  <div class="content">
    <span class=${classNameObj[status].areaName}>${content()}</span>
  </div>
  </div>`;
};
const AddressMarker:FC<any> = ({
  amapIns,
  listData,
  addressMarkerRef,
  polygonMarkerRef,
  clearAllMarker,
  // isBranch,
  setDetailData,
  level,
  detailData,
  leftListData,
  // planClusterId,
  mapShowType,
  polygonListData
}) => {
  const [isBusinessZoom, setIsBusinessZoom] = useState<boolean>(false);
  const firstLoadRef = useRef<boolean>(true);// 根据url的商圈id在第一次加载的时候，定位到具体的商圈
  const curSelectedRef = useRef<any>(null);// 当前选中的商圈
  const hasHoverListRef = useRef<any>([]);

  const getContent = useCallback((node, status, isCreate) => {
    if (mapShowType === RankStatus.normal) {
      return addressMarker(node, status, isCreate, hasHoverListRef);
    }
    return RankMarker(node, status, mapShowType, isCreate, hasHoverListRef);
    // 根据不同的mapShowType返回不同的函数
  }, [mapShowType]);
  // 绘制具体商圈地址marker
  const createAddressMarker = () => {
    // 绘制前清空polymerizationRef、addressMarkerRef
    clearAllMarker();
    listData.forEach((item) => {
      createAddressLabelMarker(item);
    });
    const overlayGroups = new window.AMap.OverlayGroup(addressMarkerRef.current);
    amapIns.add(overlayGroups);

    // 再绘制完后，根据detail看是否选中
    // jumpToAddress(listData);
  };
  const createAddressLabelMarker = (item) => {
    const marker = new window.AMap.Marker({
      position: new window.AMap.LngLat(+item?.lng, +item?.lat),
      anchor: 'center',
      zIndex: addressMarkerZIndex,
      extData: {
        ...item
      }
    });
    // 切换展示商圈排名的时候，需要绘制之前已选中的
    marker.setContent(
      curSelectedRef.current?.id === item.id
        ? getContent(item, Selected, false)
        : getContent(item, Normal, true)
    );
    addressMarkerRef.current.push(marker);
    marker.on('click', () => {
      clickAddressMarker(item);
    });
    // hover后变橙色
    marker.on('mouseover', () => {
      // 如果已选中某个，则直接返回
      if (curSelectedRef.current?.id === item.id) return;
      marker.setContent(getContent(item, Hover, false));
      marker.setzIndex(addressMarkerZIndex + 1);
    });
    // 将hover后的橙色恢复成蓝色
    marker.on('mouseout', () => {
      // 如果已选中某个，则直接返回
      if (curSelectedRef.current?.id === item.id) return;
      marker.setContent(getContent(item, Normal, false));
      marker.setzIndex(addressMarkerZIndex);
    });
  };
  const createAddressPolygon = (item) => {
    const arr = item?.polygon?.map((item) => {
      return [+item.lng, +item.lat];
    });
    const polygon = new window.AMap.Polygon({
      path: arr,
      fillColor: '#006AFF',
      strokeOpacity: 1,
      fillOpacity: 0.1,
      strokeColor: '#006AFF',
      strokeWeight: 1,
      strokeStyle: 'dashed',
      zIndex: 60,
      anchor: 'bottom-center',
      bubble: true,
      extData: {
        id: item.id
      }
    });
    // 切换展示商圈排名的时候，需要绘制之前已选中的
    if (curSelectedRef.current?.id === item.id) {
      polygon.setOptions({
        strokeColor: '#FC7657',
        fillColor: '#FC7657',
      });
    }
    polygonMarkerRef.current.push(polygon);
  };
  const createAddressCircle = (item) => {
    const circle = new window.AMap.Circle({
      center: [item?.lng, item?.lat],
      radius: item?.radius, // 半径（米）
      strokeColor: '#006AFF',
      strokeWeight: 2,
      strokeOpacity: 1,
      fillOpacity: 0.2,
      strokeStyle: 'dashed',
      strokeDasharray: [10, 10],
      fillColor: '#006AFF',
      zIndex: 50,
      bubble: true, // 为了支持在商圈围栏上测距
      extData: {
        id: item.id
      }
    });
    // 切换展示商圈排名的时候，需要绘制之前已选中的
    if (curSelectedRef.current?.id === item.id) {
      circle.setOptions({
        strokeColor: '#FC7657',
        fillColor: '#FC7657',
      });
    }
    polygonMarkerRef.current.push(circle);
  };
  // marker点击事件
  const clickAddressMarker = (item) => {
    if (recover(item)) {
      // 设置detail，detail会触发useEffect 去执行对应的方法
      // hasHoverListRef.current.push(item.id);
      setDetailData({
        ...item,
        visible: true,
        // index,
      });
    }
  };
  // 恢复被选中样式，且返回true、false表示是否往下执行
  const recover = (item) => {
    if (!(isArray(addressMarkerRef.current) && addressMarkerRef.current?.length)) return false;
    // 先恢复上一次的item，此时curSelectedRef未重新赋值，所以还是上一次的
    hasHoverListRef.current.push(curSelectedRef.current?.id);

    if (curSelectedRef.current?.id === 0 || curSelectedRef.current?.id) {
      addressMarkerRef.current.map((addressMarker) => {
        if (addressMarker.getExtData()?.id === curSelectedRef.current.id) {
          addressMarker.setContent(getContent(addressMarker.getExtData(), Normal, false));
          addressMarker.setzIndex(addressMarkerZIndex);
        }
      });
      curSelectedRef.current?.border?.setOptions({
        strokeColor: '#006AFF',
        fillColor: '#006AFF',
      });
    }
    // 取消选中
    if (curSelectedRef.current?.id === item.id) {
      // amapIns.setZoomAndCenter(detailData?.zoom || BUSINESS_FIT_ZOOM, [curSelectedRef.current?.lng, curSelectedRef.current?.lat], false, 300);
      curSelectedRef.current = null;
      setDetailData({
        id: null,
        visible: false,
      });
      return false;
    }
    return true;
  };

  // 绘制选中样式
  const drawSelected = (item) => {
    if (!(isArray(addressMarkerRef.current) && addressMarkerRef.current?.length)) return;
    // 绘制下一个item
    addressMarkerRef.current.map((addressMarker) => {
      if (addressMarker.getExtData()?.id === item.id) {
        addressMarker.setContent(getContent(addressMarker.getExtData(), Selected, false));
        addressMarker.setzIndex(addressMarkerZIndex + 1);
        // todo，换id匹配
        // amapIns.setFitView(polygonMarkerRef.current[index]);
      }
    });
    let border = null;
    polygonMarkerRef.current.map((polygonMarker) => {
      if (polygonMarker.getExtData()?.id === item.id) {
        border = polygonMarker;
        polygonMarker.setOptions({
          strokeColor: '#FC7657',
          fillColor: '#FC7657',
        });
      }
    });
    // 在将这个item赋值给curSelectedRef
    curSelectedRef.current = {
      ...item,
      border,
    };

  };
  // 从外部带入planClusterId的时候跳转到具体的商圈
  const jumpToAddress = (data) => {
    // 当传入planClusterId的时候才定位到具体的商圈为止，且只会在进入的时候执行，后续切换城市不再执行
    // if (planClusterId && firstLoadRef.current) {
    //   data.map((item) => {
    //     if (item.planClusterId === planClusterId) {
    //       amapIns.setZoomAndCenter(BUSINESS_FIT_ZOOM, [item?.lng, item?.lat], false, 300);
    //       hasHoverListRef.current.push(planClusterId);
    //       setDetailData({
    //         ...item,
    //         visible: true,
    //       });
    //     }
    //   });
    // }
    // 当level为4的时候才会真正所要获取的list数据，此时加载到对应的具体商圈才生效
    if (firstLoadRef.current && isBusinessZoom) {
      firstLoadRef.current = false;
    }

    if (detailData.id) {
      data.map((item) => {
        if (item.planClusterId === detailData.id) {
          // 当选择中与当前detailData的id不同时，才触发setZoomAndCenter
          // if (curSelectedRef.current?.id !== detailData.id) {
          //   amapIns.setZoomAndCenter(BUSINESS_FIT_ZOOM, [item?.lng, item?.lat], false, 300);
          // }
          setDetailData({
            ...item,
            visible: true,
            // index,
          });
        }
      });
    }
  };
  useEffect(() => {
    if (!amapIns || level < DISTRICT_LEVEL) return;
    createAddressMarker();
  }, [listData, amapIns, mapShowType]);

  useEffect(() => {
    if (!amapIns || level < DISTRICT_LEVEL) return;
    if (!isBusinessZoom) {
      isArray(polygonMarkerRef.current) && polygonMarkerRef.current.length &&
      polygonMarkerRef.current.map((marker) => {
        amapIns.remove(marker);
      });
      polygonMarkerRef.current = [];
      return;
    };
    polygonListData.map((item) => {
      if (item?.radius) {
        createAddressCircle(item);
      } else {
        createAddressPolygon(item);
      }
    });
    const polygonGroups = new window.AMap.OverlayGroup(polygonMarkerRef.current);
    // 一次性添加到地图上
    amapIns.add(polygonGroups);
  }, [isBusinessZoom, polygonListData, amapIns, mapShowType]);
  useEffect(() => {
    if (!amapIns) return;
    if (isArray(addressMarkerRef.current) && addressMarkerRef.current.length && detailData.visible) {
      // 存在该值才绘制
      // hasHoverListRef.current.push(detailData.id);
      drawSelected(detailData);
    } else {
      // detail为null，则对应的index也不存在
      recover(detailData);
      curSelectedRef.current = null;
    }
  }, [detailData, amapIns, isBusinessZoom]);
  // // 选择列表某项时，定位到对应的商圈
  // useEffect(() => {
  //   if (!amapIns) return;
  //   const { visible, lng, lat } = detailData;
  //   if (!(visible && lng && lat)) return;
  //   amapIns?.setZoomAndCenter(BUSINESS_FIT_ZOOM, [+lng, +lat], false, 300);
  // }, [detailData]);
  useEffect(() => {
    if (!amapIns) return;
    // 监听地图缩放
    amapIns.on('zoomend', () => {
      const zoom = amapIns?.getZoom();
      setIsBusinessZoom(zoom > BUSINESS_ZOOM);
    });

  }, [amapIns]);
  useEffect(() => {
    if (isArray(leftListData) && leftListData.length) {
      // 左边数据加载完后触发
      jumpToAddress(leftListData);
    }
  }, [amapIns, leftListData]);
  return <div>

  </div>;
};
export default AddressMarker;
