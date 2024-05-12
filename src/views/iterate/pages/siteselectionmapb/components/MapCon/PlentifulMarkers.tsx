/**
 * @Description 地图相关内容入口
 */
import { BUSINESS_ZOOM, DISTRICT_LEVEL, DISTRICT_ZOOM } from '@/common/components/AMap/ts-config';
import { isArray, isEqual } from '@lhb/func';
import { FC, useEffect, useRef } from 'react';
import { CLUSTER_CRITICAL_COUNT, businessStatus, newCreateIcon, rankIcon, selectRankIcon } from '../../ts-config';
import { useStadiometry } from '@/common/hook/Amap/useStadiometry';
import { bigdataBtn } from '@/common/utils/bigdata';

const pointMarkerZIndex = 10;

const PlentifulMarkers: FC<any> = ({
  mapIns,
  showRail,
  businessAreaData,
  level,
  itemData,
  setItemData,
  locationInfo,
  polygonData,
  allPointData,
  isShape
}) => {
  const pointListRef = useRef<any[]>([]);
  const polygonListRef = useRef<any[]>([]);
  const curSelectRef = useRef<any>(null);
  const isInitRef = useRef<boolean>(true);// 初始化时，默认点位距离最近的
  const allPointDataRef = useRef<any[]>([]);
  const isStadiometry: any = useStadiometry(); // 是否在使用测距功能
  const isStadiometryRef = useRef(isStadiometry);
  const isShapeRef = useRef<any>(null);

  const getImg = (value) => {
    // 前三名
    if (value.rank <= 3) {
      return rankIcon[value.rank].url;
    } else if (value?.status === businessStatus.COMPLETE) {
      // 新增的商圈
      return newCreateIcon;
    } else {
      return rankIcon[3].url;
    }
  };
  const getSelectImg = (value) => {
    // 前三名
    if (value.rank <= 3) {
      return selectRankIcon[value.rank].url;
    } else {
      return selectRankIcon[3].url;
    }
  };
  const pointStyle = (value, isSelect) => `${value.status === businessStatus.NEW
    ? `<div class="${isSelect ? 'label selectLabel' : 'label'}">
    <div class="triangle"></div>
<div class="name">
<span class="areaName">${value.areaName}</span>
<span>新增生成中</span>
</div>
    </div>`
    : `<div class="pointCon">
    <div class='iconText'>${value.rank >= 3 ? value.rank + 1 : ''}</div>
    <img src='${isSelect ? getSelectImg(value) : getImg(value)}'"/>
  </div>`
  }`;
  //   const selectedStyle = (value) => `<div class="pointCon">
  // <div class='iconText'>${value.rank >= 3 ? value.rank + 1 : ''}</div>
  // <img src='${getSelectImg(value)}'"/>
  // </div>`;
  const createPoint = () => {
    const newAddData: any = [];// 需要新加的数据
    const equalData: any = [];// 相同的数据id

    // 获取要新增的数据和相同的数据id
    businessAreaData.map((item) => {
      let isEqualFlag = false;
      pointListRef.current.forEach((marker) => {
        if (marker.getExtData()?.id === item?.id) {
          // 和旧数据完全相同
          if (isEqual(marker.getExtData(), item)) {
            equalData.push(item.id);
            isEqualFlag = true;
          }
        }
      });
      // 需要新增的数据
      if (!isEqualFlag) {
        newAddData.push(item);
      }
    });
    const newAddressMarker: any = [];
    // 移出不包括的旧数据
    pointListRef.current.map((marker) => {
      marker.show();// 这段代码用于新增商圈后addressMarker的显示
      if (!equalData.includes(marker.getExtData()?.id)) {
        marker.remove();
      } else {
        newAddressMarker.push(marker);
      }
    });
    pointListRef.current = newAddressMarker;
    newAddData.map((item) => {
      drawPoint(item);
    });
    pointListRef.current.map((marker) => {
      mapIns.add(marker);
    });
    initDistancePoint();
  };
  const initDistancePoint = () => {
    if (!isInitRef.current) return;
    // 存放距离最近的项
    let shortestDistanceItem: any = {
      distance: Number.MAX_VALUE
    };
    // 对需要新加的数据进行遍历
    allPointData.forEach((item) => {
      if (isInitRef.current && item?.lng && item?.lat && locationInfo?.lng && locationInfo?.lat) {
        const distance = window.AMap.GeometryUtil.distance([item.lng, item.lat], [locationInfo.lng, locationInfo.lat]);
        if (distance < shortestDistanceItem.distance) {
          shortestDistanceItem = {
            ...item,
            distance
          };
        }
      }
    });
    if (isInitRef.current && allPointData.length && +shortestDistanceItem?.lng && +shortestDistanceItem?.lat) {
      mapIns.setCenter([+shortestDistanceItem.lng, +shortestDistanceItem.lat], true);
      setItemData({
        id: shortestDistanceItem.id,
        detail: shortestDistanceItem,
        visible: true,
        isFirst: true,
      });
      isInitRef.current = false;
    }
  };
  // 绘制商圈点位marker
  const drawPoint = (value) => {

    const marker = new window.AMap.Marker({
      position: new window.AMap.LngLat(+value?.lng, +value?.lat),
      anchor: 'center',
      zIndex: pointMarkerZIndex,
      zooms: [DISTRICT_ZOOM, 20],
      bubble: true, // 允许冒泡
      extData: {
        ...value,
      }
    });
    mapIns.add(marker);

    marker.setContent(pointStyle(value, false));

    marker.on('mouseover', () => {
      if (curSelectRef.current?.id === value.id) return;
      marker.setContent(pointStyle(value, true));
      marker.setzIndex(pointMarkerZIndex + 1);
    });

    marker.on('mouseout', () => {
      if (curSelectRef.current?.id === value.id) return;
      marker.setContent(pointStyle(value, false));
      marker.setzIndex(pointMarkerZIndex);
    });

    marker.on('click', () => clickAddressMarker(value));
    pointListRef.current.push(marker);

  };
  const createPolygon = () => {
    const newAddData: any = [];// 需要新加的数据
    const equalData: any = [];// 相同的数据id

    // 获取要新增的数据和相同的数据id
    polygonData.map((item) => {
      let isEqualFlag = false;
      polygonListRef.current.forEach((marker) => {
        if (marker.getExtData()?.id === item?.id) {
          // 和旧数据完全相同
          if (isEqual(marker.getExtData(), item)) {
            equalData.push(item.id);
            isEqualFlag = true;
          }
        }
      });
      // 需要新增的数据
      if (!isEqualFlag) {
        newAddData.push(item);
      }
    });
    const newAddressMarker: any = [];
    // 移出不包括的旧数据
    polygonListRef.current.map((marker) => {
      marker.show();// 这段代码用于新增商圈后addressMarker的显示
      if (!equalData.includes(marker.getExtData()?.id)) {
        marker.remove();
      } else {
        newAddressMarker.push(marker);
      }
    });
    polygonListRef.current = newAddressMarker;

    // 对需要新加的数据进行遍历
    newAddData.forEach((item) => {
      if (item?.polygon) {
        drawPolygon(item);
        return;
      }
      if (item?.radius) {
        drawCircle(item);
        return;
      }
    });
    polygonListRef.current.map((polygon) => {
      mapIns.add(polygon);
    });
  };
  const drawCircle = (value) => {
    const circle = new window.AMap.Circle({
      center: [value?.lng, value?.lat],
      radius: value?.radius, // 半径（米）
      strokeColor: value?.userCustomFlag ? '#009963' : '#006AFF',
      strokeWeight: 2,
      strokeOpacity: 1,
      fillOpacity: 0.2,
      strokeStyle: 'dashed',
      strokeDasharray: [10, 10],
      zooms: [BUSINESS_ZOOM, 20],
      fillColor: value?.userCustomFlag ? '#009963' : '#006AFF',
      zIndex: 50,
      bubble: true, // 为了支持在商圈围栏上测距
      extData: value
    });
    circle.on('click', () => clickAddressMarker(value));

    polygonListRef.current.push(circle);
  };
  const drawPolygon = (value) => {
    const arr = value?.polygon?.map((item) => {
      return [+item?.lng, +item?.lat];
    });
    const polygon = new window.AMap.Polygon({
      path: arr,
      fillColor: value?.userCustomFlag ? '#009963' : '#006AFF',
      strokeOpacity: 1,
      fillOpacity: 0.1,
      strokeColor: value?.userCustomFlag ? '#009963' : '#006AFF',
      strokeWeight: 1,
      strokeStyle: 'dashed',
      zIndex: 60,
      zooms: [BUSINESS_ZOOM, 20],
      anchor: 'bottom-center',
      bubble: true,
      extData: value
    });
    polygon.on('click', () => clickAddressMarker(value));

    polygonListRef.current.push(polygon);
  };
  const clickAddressMarker = (item) => {
    if (isShapeRef.current) return;
    bigdataBtn('230b5afe-9c7d-1441-56d9-4dab3479188b', '选址地图', '地图中-商圈', '点击地图中-商圈');
    // 在使用工具箱的测距功能时，不执行选中/取消商圈的逻辑
    if (isStadiometryRef.current) return;
    // 去匹配到businessAreaData中对应数据的id，然后去该项作为item
    let curValue: any = null;
    allPointDataRef.current.map((cur) => {
      if (cur?.id === item.id) {
        curValue = cur;
      }
    });
    // 工具箱使用中时不支持点击打开详情
    if (recover(item)) {
      // 设置detail，detail会触发useEffect 去执行对应的方法
      setItemData({
        id: curValue?.id,
        detail: curValue,
        visible: true,
        isFirst: false
      });
    }
  };

  // 绘制选中样式
  const drawSelected = (item) => {
    if (!(isArray(pointListRef.current) && pointListRef.current?.length)) return;
    let pointMarker = null;
    // 绘制下一个item
    pointListRef.current.map((addressMarker) => {
      if (addressMarker.getExtData()?.id === item?.id) {
        //   addressMarker.setContent(`<div class="pointCon">
        //   <div class='iconText'>${item.rank >= 3 ? item.rank + 1 : ''}</div>
        //   <img src='${getSelectImg(item)}'"/>
        // </div>`);
        addressMarker.setContent(pointStyle(item, true));
        addressMarker.setzIndex(pointMarkerZIndex + 1);
        pointMarker = addressMarker;
      }
    });

    let border = null;
    polygonListRef.current.map((polygonMarker) => {
      if (polygonMarker.getExtData()?.id === item?.id) {
        border = polygonMarker;
        polygonMarker.setOptions({
          strokeColor: '#FC7657',
          fillColor: '#FC7657',
        });
      }
    });
    if (curSelectRef.current?.id !== itemData.id) {
      if (border) {
        mapIns.setFitView(border);
      } else {
        +item?.lng && +item?.lat && mapIns.setZoomAndCenter(17, [+item?.lng, +item?.lat], 100);
      }
    }

    // 在将这个item赋值给curSelectedRef
    curSelectRef.current = {
      ...item,
      border,
      pointMarker,
    };
  };
  // 恢复被选中样式，且返回true、false表示是否往下执行
  const recover = (item) => {
    if (!(isArray(pointListRef.current) && pointListRef.current?.length)) return false;
    // 先恢复上一次的item，此时curSelectedRef未重新赋值，所以还是上一次的
    if (curSelectRef.current?.id === 0 || curSelectRef.current?.id) {
      pointListRef.current.map((addressMarker) => {
        if (addressMarker.getExtData()?.id === curSelectRef.current.id) {
          //   addressMarker.setContent(`<div class="pointCon">
          //   <div class='iconText'>${addressMarker.getExtData().rank >= 3 ? addressMarker.getExtData().rank + 1 : ''}</div>
          //   <img src='${getImg(addressMarker.getExtData())}'"/>
          // </div>`);
          addressMarker.setContent(pointStyle(addressMarker.getExtData(), false));
          addressMarker.setzIndex(pointMarkerZIndex);
        }
      });
      curSelectRef.current?.border?.setOptions({
        strokeColor: curSelectRef.current?.userCustomFlag ? '#009963' : '#006AFF',
        fillColor: curSelectRef.current?.userCustomFlag ? '#009963' : '#006AFF',
      });
    }
    // 取消选中
    if (curSelectRef.current?.id === item?.id && curSelectRef.current?.id) {
      curSelectRef.current = null;
      setItemData({
        id: null,
        detail: null,
        visible: false,
        isFirst: false
      });
      return false;
    }
    return true;
  };
  // 绘制点位
  useEffect(() => {
    if (!mapIns) return;
    if (businessAreaData.length > CLUSTER_CRITICAL_COUNT) return;
    createPoint();
  }, [mapIns, businessAreaData]);

  // 绘制围栏
  useEffect(() => {
    if (!mapIns) return;
    if (polygonData.length > CLUSTER_CRITICAL_COUNT) return;
    if (showRail) {
      createPolygon();
    }
  }, [mapIns, showRail, polygonData]);

  // 清空逻辑
  useEffect(() => {
    if (level < DISTRICT_LEVEL || businessAreaData.length > CLUSTER_CRITICAL_COUNT) {
      pointListRef.current.map((marker) => {
        mapIns.remove(marker);
      });
      pointListRef.current = [];
      polygonListRef.current.map((marker) => {
        mapIns.remove(marker);
      });
      polygonListRef.current = [];
    }
  }, [level, businessAreaData]);


  useEffect(() => {
    if (!mapIns) return;
    if (itemData.visible) {
      if (curSelectRef.current?.id !== itemData?.id) {
        recover(itemData.detail);
      }
      // 存在该值才绘制
      drawSelected(itemData.detail);
    } else {
      // detail为null，则对应的index也不存在
      recover(itemData.detail);
    }
  }, [itemData, businessAreaData, polygonData]);

  useEffect(() => {
    allPointDataRef.current = allPointData;
  }, [allPointData]);

  useEffect(() => {
    isStadiometryRef.current = isStadiometry;
  }, [isStadiometry]);
  useEffect(() => {
    isShapeRef.current = isShape;
  }, [isShape]);
  return <div>

  </div>;
};
export default PlentifulMarkers;
