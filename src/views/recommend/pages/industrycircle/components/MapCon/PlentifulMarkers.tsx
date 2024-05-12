/**
 * @Description 区域级别时所有的商圈覆盖物
 * 不开启《只展示商圈围栏》开关时，到区级别时默认只展示商圈覆盖物，不展示围栏覆盖物群组，当缩放级别再大一些时（BUSINESS_ZOOM）才显示围栏
 * 当开启《只展示商圈围栏》开关，到区级别时也要展示商圈
 * 点击地图的商圈|围栏的的选中状态、右侧商圈列表的点击后地图中的商圈同步高亮逻辑
 */
import { FC, useEffect, useRef } from 'react';
import { DISTRICT_LEVEL } from '@/common/components/AMap/ts-config';
import { isArray } from '@lhb/func';
import { markerDefaultColorOption, markerActiveColorOption } from '@/views/recommend/pages/industrycircle/ts-config';

const defaultMarkerZIndex = 12;
const PlentifulMarkers: FC<any> = ({
  mapIns, // 地图实例
  businessAreaData, // 商圈数据
  getIconColor, // 获取对应商圈类型的icon和颜色
  level,
  detailData, // 详情数据，用来判断当前的点的收藏|已收藏的更新
  showRailPath, // 是否显示商圈围栏的开关
  setDetailData, // 设置详情
  isSelectToolBox,
  showRailForSelf, // 控制显示围栏的时机
}) => {
  const businessAreaRef: any = useRef(); // 商圈的覆盖物群组
  const businessAreaNameRef: any = useRef(); // 商圈名字
  const curViewMarkerRef: any = useRef(); // 当前查看的商圈|围栏商圈
  const haveViewMarkerRef: any = useRef<any[]>([]); // 已经看过的商圈
  const businessAreaRailRef: any = useRef(); // 商圈围栏的覆盖物群组
  const isDetailRef: any = useRef(false); // 是否处于详情查看模式
  const curIsSelectToolBoxRef = useRef<any>(null);
  const showRailPathRef: any = useRef(showRailPath);

  useEffect(() => {
    curIsSelectToolBoxRef.current = isSelectToolBox;
  }, [isSelectToolBox]);

  useEffect(() => { // 清空覆盖物
    if (level < DISTRICT_LEVEL) {
      businessAreaRef.current && (mapIns.remove(businessAreaRef.current));
      businessAreaRailRef.current && mapIns.remove(businessAreaRailRef.current);
    }
  }, [level]);

  // 显示围栏的逻辑
  useEffect(() => {
    if (!mapIns) return;
    showRailPathRef.current = showRailPath;
    // 只要开启了《只展示商圈围栏》，showRailForSelf就失效
    if (showRailPath) {
      businessAreaRailRef.current ? businessAreaRailRef.current.show() : drawBusinessAreaRail();
      businessAreaRef.current && businessAreaRef.current.hide();
      return;
    };
    // 未开启《只展示商圈围栏》时，满足展示围栏时
    if (showRailForSelf) {
      businessAreaRef.current && businessAreaRef.current.show();
      businessAreaRailRef.current && businessAreaRailRef.current.show();
      return;
    }
    businessAreaRef.current && businessAreaRef.current.show();
    businessAreaRailRef.current && businessAreaRailRef.current.hide();
  }, [showRailPath, showRailForSelf]);

  // 绘制商圈覆盖物(包含商圈 + 商圈围栏)
  useEffect(() => {
    if (!mapIns) return;
    if (!(isArray(businessAreaData) && businessAreaData.length)) {
      // 清空覆盖物
      businessAreaRef.current && (mapIns.remove(businessAreaRef.current));
      businessAreaRailRef.current && mapIns.remove(businessAreaRailRef.current);
      curViewMarkerRef.current && (curViewMarkerRef.current = null);
      return;
    }
    if (level < DISTRICT_LEVEL) return; // 注意某些异步请求逻辑的阻断
    drawBusinessArea(); // 绘制商圈
    drawBusinessAreaRail(); // 绘制围栏
  }, [mapIns, businessAreaData]);

  // 右侧商圈列表点击详情触发的地图渲染逻辑
  useEffect(() => {
    const { detail, id } = detailData;
    if (!detail) return;
    // 匹配到对应的商圈
    const target = businessAreaData.find((item: any) => item.id === id);
    if (!target) return;
    // 找到对应的商圈marker
    const targetMarker = targetMarkerInOverlays(id, businessAreaRef.current);
    if (!targetMarker) return;
    isDetailRef.current = true; // 右侧抽屉展示的是详情
    if (curViewMarkerRef.current) { // 之前已经有选中,取消之前的商圈和围栏的选中状态
      const lastMarkerId = getMarkerId(curViewMarkerRef.current); // 存储上一个marker的id
      // 设置为null的逻辑是：只有点击下一个商圈时才将上一个商圈设置为已查看
      curViewMarkerRef.current = null; // 当前选中项需要重置为null
      const lastAreaMarker = targetMarkerInOverlays(lastMarkerId, businessAreaRef.current);
      const lastRailMarker = targetMarkerInOverlays(lastMarkerId, businessAreaRailRef.current);
      if (!hasPushInCacheMarkers(lastAreaMarker)) { // 通过右侧抽屉点击时
        haveViewMarkerRef.current.push(lastAreaMarker); // 上一个通过右侧抽屉选中的marker存为已看过
      }
      const lastAreaMarkerExtraData = getMarkerExtData(lastAreaMarker);
      // 更新商圈样式
      lastAreaMarker && lastAreaMarker.setContent(businessAreaItemMarkerContent(lastAreaMarkerExtraData));
      // 更新商圈围栏样式
      lastRailMarker && lastRailMarker.setOptions(markerDefaultColorOption);
    }
    curViewMarkerRef.current = targetMarker; // 当前选中项
    curViewMarkerRef.current.setContent(businessAreaItemMarkerContent(detail));
    // 将详情数据的isFavourate字段赋值给businessAreaData中对应商圈的isFavourate
    target.isFavourate = detail.isFavourate;
    // 将商圈围栏也选中
    const targetRailMarker = targetMarkerInOverlays(getMarkerId(targetMarker), businessAreaRailRef.current);
    targetRailMarker && targetRailMarker.setOptions(markerActiveColorOption);
  }, [detailData, businessAreaData]); // 将businessAreaData设为依赖项，是因为异步的问题，选择商圈后，地图切换到对应的区域后会有一次刷新businessAreaData的异步请求

  // 绘制商圈覆盖物群组
  const drawBusinessArea = () => {
    const markers: any = []; // 商圈排名覆盖物
    businessAreaData.forEach((item) => {
      const marker: any = createBusinessAreaItemMarker(item); // 绘制商圈排名覆盖物
      marker && markers.push(marker);
    });
    const overlayGroups = new window.AMap.OverlayGroup(markers); // 商圈排名覆盖物群组
    mapIns.add(overlayGroups); // 先添加，在清除
    businessAreaRef.current && (mapIns.remove(businessAreaRef.current)); // 清除上一次的
    businessAreaRef.current = overlayGroups;
    // 只显示围栏
    if (showRailPath) {
      businessAreaRef.current && businessAreaRef.current.hide();
      return;
    };
    businessAreaRef.current && businessAreaRef.current.show();
  };
  // 绘制围栏覆盖物群组
  const drawBusinessAreaRail = () => {
    const markers: any = []; // 围栏覆盖物
    businessAreaData.forEach((item) => {
      let marker;
      const { radius, polygon } = item;
      if (radius) { // 显示圆
        marker = createBusinessAreaItemCircleMarker(item); // 绘制商圈围栏（圆）覆盖物
      } else if (isArray(polygon) && polygon.length) { // 显示多边形
        marker = createBusinessAreaItemPolygonMarker(item); // 绘制商圈围栏（多边形）覆盖物
      }
      marker && markers.push(marker);
    });
    const railOverlayGroups = new window.AMap.OverlayGroup(markers); // 围栏覆盖物群组
    mapIns.add(railOverlayGroups); // 添加到地图
    businessAreaRailRef.current && (mapIns.remove(businessAreaRailRef.current)); // 清除上一次的
    businessAreaRailRef.current = railOverlayGroups;
    // 只显示围栏
    if (showRailPath) {
      businessAreaRef.current && businessAreaRef.current.hide();
      return;
    };
    if (showRailForSelf) { // 到达显示商圈围栏的缩放级别时
      businessAreaRailRef.current && businessAreaRailRef.current.show();
      return;
    }
    businessAreaRailRef.current && businessAreaRailRef.current.hide();
    businessAreaRef.current && businessAreaRef.current.show();
  };
  // 生成商圈Item
  const createBusinessAreaItemMarker = (item: any) => {
    const { lng, lat, } = item;
    if (!(+lng && +lat)) return;
    const lnglat = [+lng, +lat];
    const marker = new window.AMap.Marker({
      position: lnglat,
      anchor: 'center',
      extData: item,
      content: businessAreaItemMarkerContent(item, true),
    });

    marker.on('click', () => businessAreaItemMarkerClick(item, marker));
    // hover后显示商圈名字
    marker.on('mouseover', () => {
      marker.setzIndex(100);
      const labelMarker = new window.AMap.Marker({
        position: lnglat,
        anchor: 'center',
        offset: [0, 32],
        content: `<div class='businessAreaItemNameMarker'>
          ${item.areaName}
        </div>`,
      });
      mapIns.add(labelMarker);
      businessAreaNameRef.current = labelMarker;
    });
    // 恢复
    marker.on('mouseout', () => {
      businessAreaNameRef.current && mapIns.remove(businessAreaNameRef.current);
      marker.setzIndex(defaultMarkerZIndex);
    });
    return marker;
  };
  // 商圈|商圈围栏点击事件
  const businessAreaItemMarkerClick = (item, marker, isRailMarker = false) => {
    const { id } = item;
    // 工具箱使用中时不支持点击打开详情
    if (curIsSelectToolBoxRef.current) return;
    const lastMarker = curViewMarkerRef.current; // 上一个商圈marker
    const railMarker = targetMarkerInOverlays(id, businessAreaRailRef.current); // 查找商圈围栏marker
    // 如果是同一个，样式重置为已看过
    if (lastMarker && getMarkerId(lastMarker) === getMarkerId(marker)) {
      curViewMarkerRef.current = null;

      !isRailMarker && marker.setContent(businessAreaItemMarkerContent(item)); // 更新content
      isDetailRef.current = !isDetailRef.current; // 取反
      if (isDetailRef.current) {
        setDetailData({
          id: item?.id,
          visible: true,
          detail: item
        });
        railMarker.setOptions(markerActiveColorOption);
        return;
      }
      setDetailData({
        id: null,
        visible: false,
        detail: null
      });
      railMarker.setOptions(markerDefaultColorOption);
      return;
    };
    setDetailData({
      id: item?.id,
      visible: true,
      detail: item
    });
    // railMarker.setOptions(markerDefaultColorOption);
    isDetailRef.current = true;
    curViewMarkerRef.current = marker; // 存储当前选中的marker
    if (lastMarker) { // 如果上一个marker存在，就将上一个maker变为已点击过状态
      const { _opts } = lastMarker;
      const { extData } = _opts || {};
      !isRailMarker && lastMarker.setContent(businessAreaItemMarkerContent(extData)); // 更新content
      const lastRailMarker = targetMarkerInOverlays(getMarkerId(lastMarker), businessAreaRailRef.current);
      lastRailMarker && lastRailMarker.setOptions(markerDefaultColorOption);
    }
    if (!hasPushInCacheMarkers(marker)) {
      haveViewMarkerRef.current.push(marker); // 当前选中的marker存为已看过
    }
    !isRailMarker && marker.setContent(businessAreaItemMarkerContent(item)); // 更新content
    railMarker && railMarker.setOptions(markerActiveColorOption); // 选中
  };

  const businessAreaItemMarkerContent = (item: any, isShowRender = false) => {
    const isHasClickStatus = isHaveClicked(item); // 是否是已点击过的
    const isCurClickStatus = isCurClick(item); // 是否是当前点击的
    const color = getIconColor(item?.firstLevelCategoryId)?.color; // 商圈类型对应的颜色
    const icon = getIconColor(item?.firstLevelCategoryId)?.icon; // 商圈类型对应的icon
    const hasViewColor = getIconColor(item?.firstLevelCategoryId)?.hasViewColor; // 已经看过的颜色
    // marker分三个状态，默认、当前点击、已点击，当前点击时样式优先级最高
    const clickStyle = isCurClickStatus
      ? `background: ${color};color: #fff`
      : (isHasClickStatus ? `background: ${hasViewColor};color: #fff;` : '');
    const iconStyle = isCurClickStatus
      ? `background: #fff;color: ${color}`
      : (isHasClickStatus ? `background: #fff;color: ${hasViewColor};` : `background: ${color}`);
    const clickTriangleStyle = isCurClickStatus
      ? `border-top-color: ${color}`
      : (isHasClickStatus ? `border-top-color: ${hasViewColor};` : '');

    return `
      <div class='businessAreaItemRankMarkerWrapper ${isShowRender ? 'isScale' : ''}'>
        <div
          class='businessAreaItemRankMarker'
          style='${clickStyle}'
          >
          <div
            class='businessAreaItemIcon'
            style='${iconStyle}'
          >
            <svg
              class='iconSvg'
              aria-hidden>
              <use xlink:href='#${icon}' />
            </svg>
          </div>
          <div class='font-weight-500 pl-4'>
            NO.${item?.mainBrandsRank}
          </div>
          <div class='${item?.isFavourate ? 'show' : 'hide'}'>
            <span class='font-weight-500 pl-4'>
              |
            </span>
            <span class='font-weight-500 pl-4'>已收藏</span>
          </div>
        </div>
        <div class='triangleOrnamental' style='${clickTriangleStyle}'></div>
      </div>`
    ;
  };

  const createBusinessAreaItemCircleMarker = (item: any) => {
    const { lng, lat } = item;
    if (!(+lng && +lat)) return;
    const lnglat = [+lng, +lat];
    const marker = new window.AMap.Circle({
      // zooms: [BUSINESS_ZOOM, 20],
      center: lnglat,
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
      extData: item
    });
    marker.on('click', () => businessAreaItemMRailarkerClick(item, marker));
    return marker;
  };

  const createBusinessAreaItemPolygonMarker = (item: any) => {
    const path = item?.polygon?.map((item) => {
      return [+item.lng, +item.lat];
    });
    const polygon = new window.AMap.Polygon({
      // zooms: [BUSINESS_ZOOM, 20],
      path,
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
    polygon.on('click', () => businessAreaItemMRailarkerClick(item, polygon));
    return polygon;
  };

  const businessAreaItemMRailarkerClick = (item: any, marker: any) => {
    if (!showRailPathRef.current) return; // 显示围栏开关时才能点击
    businessAreaItemMarkerClick(item, marker, true);
  };

  const isHaveClicked = (item: any) => { // 是否已点击过
    const { id } = item;
    const target = haveViewMarkerRef.current.find((markerItem: any) => {
      const { _opts } = markerItem || {};
      const { extData } = _opts || {};
      const { id: markerId } = extData || {};
      return markerId === id;
    });
    return !!target;
  };

  const isCurClick = (item: any) => { // 是否是当前点击项
    const { id } = item;
    if (!curViewMarkerRef.current) return false;
    const { _opts } = curViewMarkerRef.current;
    const { extData } = _opts || {};
    const { id: markerId } = extData || {};
    return markerId === id;
  };

  const getMarkerId = (marker: any) => { // 获取marker的商圈id
    const { _opts } = marker || {};
    const { extData } = _opts || {};
    return extData?.id;
  };
  // 获取marker中绑定的数据
  const getMarkerExtData = (marker: any) => {
    const { _opts } = marker || {};
    const { extData } = _opts || {};
    return extData;
  };
  // 获取覆盖物群组中指定的覆盖物
  const targetMarkerInOverlays = (id: number, targetOverlays: any) => {
    if (!id) return null;
    const { _overlays } = targetOverlays || {};
    if (!(isArray(_overlays) && _overlays.length)) return null;
    return _overlays.find((item: any) => getMarkerId(item) === id);
  };

  const hasPushInCacheMarkers = (marker: any) => { // 是否已经添加到已查看的覆盖物的缓存
    let hasPush = false;
    const caches = haveViewMarkerRef.current;
    const len = caches.length;
    for (let i = 0; i < len; i++) {
      const cacheItem = caches[i];
      if (getMarkerId(cacheItem) === getMarkerId(marker)) {
        hasPush = true;
        break;
      }
    }
    return hasPush;
  };
  return (
    <></>
  );
};

export default PlentifulMarkers;
