/**
 * @Description
 */
import { FC, useEffect, useRef } from 'react';
import styles from './index.module.less';
import AMap from '@/common/components/AMap';
import { isArray } from '@lhb/func';
import ReactDOM from 'react-dom';
import { v4 } from 'uuid'; // 用来生成不重复的key
import MapLabel from './MapLabel';
import { useStadiometry } from '@/common/hook/Amap/useStadiometry';

export const CITY_LEVEL = 3;

const MapCon:FC<any> = ({
  setAmapIns,
  amapIns,
  level,
  planId,
  branchCompanyId,
  checkCity,
  areaData,
  setRefresh,
  curSelectedRef,
  isBranch
}) => {
  const addressMarkerRef = useRef<any>([]);
  const polygonRef = useRef<any>([]);
  const infoLabelRef = useRef<any>(null);
  const mapLoadedHandle = (mapIns: any) => {
    setAmapIns(mapIns);
  };
  const isStadiometry: any = useStadiometry(); // 是否在使用测距功能
  const isStadiometryRef = useRef(isStadiometry);
  // 绘制地图marker
  const createAddressMarker = () => {
    addressMarkerRef.current?.map((item) => {
      amapIns.remove(item);
    });
    addressMarkerRef.current = [];
    areaData.forEach((item, index) => {
      const marker = new window.AMap.Marker({
        position: [item.lng, item.lat],
        anchor: 'top-center',
        bubble: true, // 允许冒泡
      });
      marker.setContent(`<div class="label"><div class="triangle"></div>${item.areaName}${item?.isPlaned ? `<span class='planned'>已规划</span>` : ''}</div>`);
      addressMarkerRef.current.push(marker);
      marker.on('click', (e) => {
        if (isStadiometryRef.current) return;
        clickMarker(item, index, e);
      });
      amapIns.add(marker);
      // hover后变橙色
      marker.on('mouseover', () => {
        // 如果已选中某个，则直接返回
        if (curSelectedRef.current?.index === 0 || curSelectedRef.current?.index) return;
        marker.setContent(`
        <div class="orangeLabel">
        <div class="orangeTriangle"></div>
        <div class="content">
          <span class="areaName">${item.areaName}</span>
          ${item?.isPlaned ? `<span class='planned'>已规划</span>` : ''}
        </div>
        </div>`);
      });
      // 将hover后的橙色恢复成蓝色
      marker.on('mouseout', () => {
        // 如果已选中某个，则直接返回
        if (curSelectedRef.current?.index === 0 || curSelectedRef.current?.index) return;
        marker.setContent(`<div class="label"><div class="triangle"></div>${item.areaName}${item?.isPlaned ? `<span class='planned'>已规划</span>` : ''}</div>`);
      });
    });

    // amapIns.setFitView(addressMarkerRef.current);
  };

  // marker点击事件
  const clickMarker = (item, index, e) => {
    if (!(isArray(addressMarkerRef.current) && addressMarkerRef.current?.length)) return;
    // 当index相同，且点击的不是名称label就return
    // 此处的orangeLabel取自MapLabel中的className，改动时需要注意
    if (curSelectedRef.current?.index === index && !e?.originEvent?.target?.className.includes('orangeLabel')) {
      return;
    }
    // 当index相同，且点击的是名称label 就变成蓝色
    if (curSelectedRef.current?.index === index && e?.originEvent?.target?.className.includes('orangeLabel')) {
      addressMarkerRef.current[curSelectedRef.current?.index].setContent(`<div class="label"><div class="triangle"></div>${curSelectedRef.current.areaName}${curSelectedRef.current?.isPlaned ? `<span class='planned'>已规划</span>` : ''}</div>`);
      addressMarkerRef.current[curSelectedRef.current?.index].setzIndex(12);// 默认12
      curSelectedRef.current = null;
      return;
    }

    // 点击不同item的时候，恢复之前那个item恢复成蓝色
    if (curSelectedRef.current?.areaName) {
      addressMarkerRef.current[curSelectedRef.current?.index].setContent(`<div class="label"><div class="triangle"></div>${curSelectedRef.current.areaName}${curSelectedRef.current?.isPlaned ? `<span class='planned'>已规划</span>` : ''}</div>`);
      addressMarkerRef.current[curSelectedRef.current?.index].setzIndex(12);// 默认12
    }

    // 设置当前选中item
    const uid:any = v4();
    addressMarkerRef.current[index].setContent(`<div id="${uid}"></div>`);
    ReactDOM.render(<MapLabel
      isBranch={isBranch}
      checkCity={checkCity}
      detail={item}
      planId={planId}
      branchCompanyId={branchCompanyId}
      infoLabelRef={infoLabelRef}
      setRefresh={setRefresh}/>, document.getElementById(uid));
    addressMarkerRef.current[index].setzIndex(20);// 默认值为12
    curSelectedRef.current = {
      ...item,
      index,
    };

  };

  // 绘制围栏
  const drawSelected = () => {
    areaData.forEach((item) => {
      if (!item?.polygon) {
        drawAddressCircle(item);
      } else {
        drawPolygon(item);
      }
    });
    const overlayGroups = new window.AMap.OverlayGroup(polygonRef.current);
    amapIns.add(overlayGroups);
  };
  // 绘制围栏
  const drawPolygon = (item) => {
    const lnglatArr = item?.polygon?.map((item) => {
      return [+item.lng, +item.lat];
    });
    const polygon = new window.AMap.Polygon({
      fillColor: '#006AFF',
      strokeOpacity: 1,
      fillOpacity: 0.1,
      strokeColor: '#006AFF',
      strokeWeight: 1,
      strokeStyle: 'dashed',
      zIndex: 60,
      anchor: 'bottom-center',
      bubble: true,
    });
    polygon.setPath(lnglatArr);
    polygonRef.current.push(polygon);
  };
  // 绘制半径圆圈
  const drawAddressCircle = (value) => {
    const circle = new window.AMap.Circle({
      center: [value?.lng, value?.lat],
      radius: value?.radius, // 半径（米）
      strokeColor: '#006AFF',
      strokeWeight: 2,
      strokeOpacity: 1,
      fillOpacity: 0.2,
      strokeStyle: 'dashed',
      strokeDasharray: [10, 10],
      fillColor: '#006AFF',
      zIndex: 50,
    });
    polygonRef.current.push(circle);
  };

  useEffect(() => {
    if (!amapIns) return;
    isArray(addressMarkerRef.current) && addressMarkerRef.current.length &&
    addressMarkerRef.current.map((item) => {
      amapIns.remove(item);
    });
    addressMarkerRef.current = [];
    isArray(polygonRef.current) && polygonRef.current.length &&
    polygonRef.current.map((item) => {
      amapIns.remove(item);
    });
    polygonRef.current = [];
    if (isArray(areaData) && areaData.length && level >= CITY_LEVEL) {
      createAddressMarker();
      drawSelected();
    }
  }, [areaData, amapIns]);

  useEffect(() => {
    if (!amapIns) return;
    return () => {
      amapIns?.destroy();
      setAmapIns(null);
    };
  }, [amapIns]);

  useEffect(() => {
    isStadiometryRef.current = isStadiometry;
  }, [isStadiometry]);

  return <div className={styles.mapCon} >
    <AMap
      mapOpts={{
        zoom: 4.33,
        zooms: [3.5, 20],
        center: [92.747068, 37.784754] // 默认地图的中心位置，使中国地图处于地图正中央
      }}
      loaded={mapLoadedHandle}
      plugins={[
        'AMap.RangingTool',
        'AMap.DistrictSearch',
        'AMap.Geocoder',
        'AMap.PlaceSearch',
        'AMap.HeatMap',
        'AMap.Driving', // 驾车
        'AMap.Riding', // 骑行
        'AMap.Walking', // 走路
        'AMap.MouseTool',
        'AMap.PolygonEditor',
        'AMap.CircleEditor'
      ]}>

    </AMap>
  </div>;
};
export default MapCon;
