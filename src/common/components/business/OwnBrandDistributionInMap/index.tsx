/**
 * @Description 本品牌分布在地图的显示，
 * 目前用到该业务组件的页面：
 * 'src/views/recommend/pages/industrycircle/entry.tsx' // 行业商圈（通用版）
 * 'src/views/iterate/pages/siteselectionmap/entry.tsx' // 选址地图
 * 补充：
 * 注意在引用该组件的页面引入对应的样式 @import '@/common/styles/amap-chance-point.less';
 * 点击标题行展示机会点详情
 */

import { FC, useEffect, useRef, useState } from 'react';
import { storeMapSearchStandard } from '@/common/api/storemap';
import { isArray } from '@lhb/func';
import { useStadiometry } from '@/common/hook/Amap/useStadiometry';
import { DISTRICT_ZOOM } from '../../AMap/ts-config';
// import cs from 'classnames';
// import styles from './entry.module.less';
import PointDetail from '@/common/components/business/ExpandStore/ChancePointDetail/components/Deatil';

const BrandInMap: FC<any> = ({
  mapIns,
  checkedIds, // 选中项
  cityInfo, // 城市信息
  setIsLoading, // 设置是否正在加载
}) => {
  const markersRef: any = useRef({
    last: null, // 上一次覆盖物群组
    cur: null // 当前覆盖物群组
  });
  const labelMarkerRef: any = useRef<any>();
  // const [pointId, setPointId] = useState<number>(0); // 机会点id
  const [detailVisible, setDetailVisible] = useState<boolean>(false); // 详情抽屉是否可见
  const isStadiometry: any = useStadiometry(); // 是否在使用测距功能
  const isStadiometryRef = useRef(isStadiometry);

  useEffect(() => {
    if (!mapIns) return;
    labelMarkerRef.current = new window.AMap.Marker({
      content: ' ',
      map: mapIns,
      anchor: 'top-left',
      offset: [-34, 6],
      zIndex: 15
    });
    // 监听地图缩放移动，手动缩放也会触发move
    mapIns.on('moveend', zoomEndHandle);
    return () => {
      mapIns && (mapIns.off('moveend', zoomEndHandle));
    };
  }, [mapIns]);

  useEffect(() => {
    // 数据变化或者城市切换时，清空已有的机会点概览
    labelMarkerRef.current && labelMarkerRef.current.setContent('<div></div>');
    if (isArray(checkedIds) && checkedIds.length && cityInfo?.id) {
      loadData();
      return;
    }
    clearMarkers();
  }, [checkedIds, cityInfo?.id]);

  useEffect(() => {
    isStadiometryRef.current = isStadiometry;
  }, [isStadiometry]);

  const zoomEndHandle = () => {
    const zoom = mapIns?.getZoom();
    if (zoom < DISTRICT_ZOOM) {
      labelMarkerRef.current && labelMarkerRef.current.setContent('<div></div>');
    }
  };

  const clearMarkers = () => {
    const { last, cur } = markersRef.current;
    mapIns && last && mapIns.remove(last);
    mapIns && cur && mapIns.remove(cur);
  };
  const loadData = async () => {
    setIsLoading(true);
    const list = await storeMapSearchStandard({
      ids: checkedIds,
      cityId: cityInfo?.id,
    });
    const markerList: any = [];
    // 根据返回值的type 1:机会点 2:门店	如果是2的时候，判断一下门店的时候，是否有机会点id
    list.forEach((item) => {
      // if (item?.type === 2 && !item?.chancePointId) return;
      const marker = new window.AMap.Marker({
        // 产品大鹏说的只在区以下显示
        zooms: [DISTRICT_ZOOM, 20],
        anchor: 'center',
        position: new window.AMap.LngLat(+item.lng, +item.lat),
        bubble: true, // 允许冒泡
        content: `
            <div class='universalMapIconCon'>
              <div class='placeholderCon'></div>
              <div class='iconBox'>
                <svg
                class="icon fs-32"
                aria-hidden="true"
                style='color: ${item.color}'>
                  <use xlink:href="#iconic_mendian"></use>
                </svg>
              </div>
            <div>
          `
      });

      marker.on('click', () => {
        // 在使用工具箱的测距功能时，不执行显示信息的逻辑
        if (isStadiometryRef.current) return;
        const labelContent = matchLabel(item);
        labelMarkerRef.current.setPosition(new window.AMap.LngLat(+item.lng, +item.lat));
        labelMarkerRef.current.setContent(labelContent);
        labelMarkerRef.current.setOffset(new window.AMap.Pixel(-100, 25));
        // setContent是字符串无法直接绑定事件
        const targetCloseEle = document.querySelector('.ant-layout-content .amap-maps .amap-layers .amap-markers #storemapMarkerCloseIcon');
        // const targetPoint = document.querySelector('.ant-layout-content .amap-maps .amap-layers .amap-markers #targetPointInMarkerItem');
        if (targetCloseEle) {
          targetCloseEle.addEventListener('click', (e: any) => {
            // 这里得加一个空的div，不加的话地图上会有默认的一个icon出现
            labelMarkerRef.current.setContent('<div></div>');
            e.stopPropagation();
          });
        }
        // 产品先隐藏点击出现详情，后续在根据是否存在id来决定是否显示
        // if (targetPoint) {
        //   targetPoint.addEventListener('click', () => {
        //     // 根据返回值的type 1:机会点 2:门店	如果是2的时候，chancePointId代表机会点id
        //     const { id, type, chancePointId } = item;
        //     setPointId(type === 2 ? chancePointId : id);
        //     setDetailVisible(true);
        //   });
        // }
      });
      markerList.push(marker);
    });
    // 添加覆盖物群组
    const overlayGroups = new window.AMap.OverlayGroup(markerList);
    if (markersRef.current.cur) { // 每次请求数据后将当前记为上一次
      markersRef.current.last = markersRef.current.cur;
    }
    markersRef.current.cur = overlayGroups; // 保存当前
    mapIns.add(overlayGroups); // 在地图上显示
    setIsLoading(false);
    markersRef.current.last && mapIns.remove(markersRef.current.last); // 清空上次
  };

  const matchLabel = (data) => {
    const {
      name,
      color,
      address,
      statusName,
      openDate,
      closeDate,
      closeReason,
      status,
      type // 1 机会点 2门店
    } = data;
      // 只有“营业中、已闭店”的门店显示此字段
    const showOpenDate = type === 2 && (status === 500 || status === 700);
    // 已闭店状态时才显示
    const showClose = type === 2 && status === 700;

    return `<div class='markerItemCon'>
        <div id='targetPointInMarkerItem' class='titleCon' style='background: ${color || '#333'}'>
          <div class='color-white fs-14 font-weight-500'>
            ${name}
          </div>
          <div id='storemapMarkerCloseIcon' class='pointer'>
            <svg
              class="icon fs-16 color-white"
              aria-hidden="true">
              <use xlink:href="#iconic_fail"></use>
            </svg>
          </div>
        </div>
        <div class="contentCon fs-12">
          <div class='abstractCon'>
            <div class='mr-16'>
              <div class='c-222 font-weight-500'>当前状态</div>
              <div class='c-ff8 mt-4'>${statusName}</div>
            </div>
            ${showOpenDate ? `<div class='mr-16'>
              <div class='c-222 font-weight-500'>开业时间</div>
              <div class='c-999 mt-4'>${openDate || '-'}</div>
            </div>` : ''}
            ${showClose ? `<div>
              <div class='c-222 font-weight-500'>闭店时间</div>
              <div class='c-999 mt-4'>${closeDate || '-'}</div>
            </div>` : ''}
          </div>
          ${showClose ? `<div class='mt-10'>
            <div class='c-222 font-weight-500'>闭店原因</div>
            <div class='c-999 mt-4' style="word-break: break-all">${closeReason || '-'}</div>
          </div>` : ''}
          <div class='mt-10'>
            <div class='c-222 font-weight-500'>门店地址</div>
            <div class='c-999 mt-4'>${address}</div>
          </div>
        </div>
      </div>`;
  };
  return (
    <>
      {/* 机会点详情展示 */}
      <PointDetail
        // id={pointId}
        open={detailVisible}
        setOpen={setDetailVisible}
        hideOperate
      />
    </>
  );
};

export default BrandInMap;
