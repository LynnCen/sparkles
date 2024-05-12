/**
 * @Description 点位marker
 */
import { DISTRICT_ZOOM } from '@/common/components/AMap/ts-config';
import { FC, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styles from './index.module.less';
import { v4 } from 'uuid';
import { isArray } from '@lhb/func';
import cs from 'classnames';
import { StatusColor, status } from '../ts-config';
const defaultIndex = 100;

const PointMarker:FC<any> = ({
  mapIns,
  pointData,
  setEnterDrawerOpen, // 打开录入抽屉
  level,
  setItemData,
  itemData
}) => {

  const markerGroupRef = useRef<any>([]);
  const polygonListRef = useRef<any>([]);
  const curSelectRef = useRef<any>(null);
  const labelMarkerRef = useRef<any>(null);

  const drawPointMarker = () => {
    const markerArr:any = [];
    pointData.map((item) => {
      if (!item.lng || !item.lat) return;

      const marker = new window.AMap.Marker({
        position: [+item.lng, +item.lat],
        zIndex: defaultIndex,
        zooms: [DISTRICT_ZOOM + 0.1, 20],
        extData: item
      });



      marker.on('mouseover', () => {
        marker.setzIndex(defaultIndex + 1);
      });

      marker.on('mouseout', () => {
        marker.setzIndex(defaultIndex);
      });
      marker.on('click', () => clickAddressMarker(item));

      markerArr.push(marker);
      // 绘制圆圈
      if (item?.radius) {
        drawCircle(item);
        return;
      }
      // 绘制围栏
      if (item?.polygon) {
        drawPolygon(item);
        return;
      }
    });
    markerGroupRef.current = markerArr;
    // 展示点位
    const markerGroup = new window.AMap.OverlayGroup(markerArr);
    mapIns.add(markerGroup);
    // 展示圆圈和围栏
    const polygonGroup = new window.AMap.OverlayGroup(polygonListRef.current);
    mapIns.add(polygonGroup);

    // 使用 ReactDOM.render 去绘制高德marker，必须先将marker加载到地图上，否则getElementById会找不到
    markerArr.forEach((marker) => {
      const uuid = v4();
      marker.setContent(`<div id="${uuid}"></div>`);
      ReactDOM.render(
        <PointElement value={marker.getExtData()}/>
        , document.getElementById(uuid));
    });
  };
  const drawCircle = (value) => {
    const circle = new window.AMap.Circle({
      center: [value?.lng, value?.lat],
      radius: value?.radius, // 半径（米）
      strokeColor: '#006AFF',
      strokeWeight: 2,
      strokeOpacity: 1,
      fillOpacity: 0.2,
      strokeStyle: 'dashed',
      strokeDasharray: [10, 10],
      zooms: [DISTRICT_ZOOM + 0.1, 20],
      fillColor: '#006AFF',
      zIndex: 50,
      extData: value
    });
    circle.on('click', () => clickAddressMarker(value));

    polygonListRef.current.push(circle);
  };
  const drawPolygon = (value) => {
    const arr = value?.polygon?.map((item) => {
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
      zooms: [DISTRICT_ZOOM + 0.1, 20],
      anchor: 'bottom-center',
      bubble: true,
      extData: value
    });
    polygon.on('click', () => clickAddressMarker(value));

    polygonListRef.current.push(polygon);
  };
  const clickAddressMarker = (item) => {
    // 去匹配到businessAreaData中对应数据的id，然后去该项作为item
    let curValue:any = null;
    pointData.map((cur) => {
      if (cur?.planClusterId === item.planClusterId) {
        curValue = cur;
      }
    });
    // 工具箱使用中时不支持点击打开详情
    if (recover(item)) {
      // 设置detail，detail会触发useEffect 去执行对应的方法
      setItemData({
        id: curValue?.planClusterId,
        detail: curValue,
        visible: true,
        isFirst: false
      });
    }
  };
  // 恢复被选中样式，且返回true、false表示是否往下执行
  const recover = (item) => {
    if (!(isArray(markerGroupRef.current) && markerGroupRef.current?.length)) return false;
    labelMarkerRef.current && mapIns.remove(labelMarkerRef.current);
    labelMarkerRef.current = null;
    // 先恢复上一次的item，此时curSelectedRef未重新赋值，所以还是上一次的
    if (curSelectRef.current?.planClusterId === 0 || curSelectRef.current?.planClusterId) {
      markerGroupRef.current.map((addressMarker) => {
        if (addressMarker.getExtData()?.planClusterId === curSelectRef.current.planClusterId) {
          const uuid = v4();
          addressMarker.setContent(`<div id="${uuid}"></div>`);
          ReactDOM.render(
            <PointElement value={addressMarker.getExtData()}/>
            , document.getElementById(uuid));
          addressMarker.setzIndex(defaultIndex);
        }
      });
      curSelectRef.current?.border?.setOptions({
        strokeColor: '#006AFF',
        fillColor: '#006AFF'
      });
    }
    // 取消选中
    if (curSelectRef.current?.planClusterId === item?.planClusterId && curSelectRef.current?.planClusterId) {
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
    // 绘制选中样式
  const drawSelected = (item) => {
    if (!(isArray(markerGroupRef.current) && markerGroupRef.current?.length)) return;
    let pointMarker = null;
    // 绘制下一个item的marker
    markerGroupRef.current.map((addressMarker) => {
      if (addressMarker.getExtData()?.planClusterId === item?.planClusterId) {
        const uuid = v4();
        addressMarker.setContent(`<div id="${uuid}"></div>`);
        ReactDOM.render(
          <PointElement value={addressMarker.getExtData()} isSelected/>
          , document.getElementById(uuid));
        addressMarker.setzIndex(defaultIndex);
        addressMarker.setzIndex(defaultIndex + 1);
        pointMarker = addressMarker;
      }
    });

    // 绘制下一个item的围栏或圆圈
    let border = null;
    polygonListRef.current.map((polygonMarker) => {
      if (polygonMarker.getExtData()?.planClusterId === item?.planClusterId) {
        border = polygonMarker;
        polygonMarker.setOptions({
          strokeColor: '#FC7657',
          fillColor: '#FC7657',
        });
      }
    });
    // 缩放到合适的视角
    if (curSelectRef.current?.planClusterId !== itemData.planClusterId) {
      if (border) {
        mapIns.setFitView(border);
      } else {
        +item?.lng && +item?.lat && mapIns.setZoomAndCenter(17, [+item?.lng, +item?.lat], 200);
      }
    }
    createLabelInfo(item);
    // 在将这个item赋值给curSelectedRef
    curSelectRef.current = {
      ...item,
      border,
      pointMarker,
    };
  };

  const createLabelInfo = (value) => {
    const marker = new window.AMap.Marker({
      position: [+value.lng, +value.lat],
      zIndex: defaultIndex,
      offset: [0, 120],
      zooms: [DISTRICT_ZOOM + 0.1, 20],
      extData: value
    });
    mapIns.add(marker);
    labelMarkerRef.current = marker;
    const uuid = v4();
    marker.setContent(`<div id="${uuid}"></div>`);
    ReactDOM.render(<LabelElement
      value={value}
      setEnterDrawerOpen={setEnterDrawerOpen}
    />, document.getElementById(uuid));
  };

  // 拿到数据绘制
  useEffect(() => {
    // 当地图实例未加载、pointData没有数据、或者当且层级不为4的时候 直接return,不执行下面的操作
    if (!mapIns || !pointData?.length || level !== 4) return;
    // 绘制
    drawPointMarker();
    // 清除
    return () => {
      markerGroupRef.current?.forEach((marker) => {
        mapIns.remove(marker);
      });
      markerGroupRef.current = [];
      polygonListRef.current?.forEach((marker) => {
        mapIns.remove(marker);
      });
      polygonListRef.current = [];
    };
  }, [pointData, mapIns, level]);

  // 处理选中
  useEffect(() => {
    if (!mapIns) return;
    if (itemData.visible) {
      if (curSelectRef.current?.planClusterId !== itemData?.planClusterId) {
        recover(itemData.detail);
      }
      drawSelected(itemData.detail);
    } else {
      // detail为null，则对应的index也不存在
      recover(itemData.detail);
    }
  }, [itemData, pointData]);


  return <> </>;
};
const PointElement = ({
  value,
  isSelected = false
}) => {
  return <div className={cs(styles.pointCon, isSelected ? styles.active : '')}>
    <div className={styles.triangle}></div>
    <div className={styles.text}>{value?.name}</div>
  </div>;
};
const LabelElement = ({
  value,
  setEnterDrawerOpen
}) => {
  return <div className={styles.labelCon}>
    <div className={styles.triangle}></div>
    <div className={styles.title}>
      <span className={styles.name}>{value?.name}</span>
      <span className={styles.score}>{value?.totalScore}分</span>
    </div>
    <div className={styles.area}>
      {value?.city}-{value?.district}
    </div>
    <div className={styles.bottom}>
      <span className='c-666'>已提交：</span>
      <span className={cs('pointer', value?.relationSpots ? 'c-006' : '')}>
        {value?.relationSpots}
      </span>
      <span className='c-666 ml-16'>状态：</span>
      <span
        style={{
          color: StatusColor?.[value?.spotStatus]?.color
        }}
      >
        {value?.spotStatusName}
      </span>
      { value?.spotStatus === status.APPROVAL || value?.spotStatus === status.DENY ? <></> : <span
        className={styles.btn}
        onClick={() => {
          setEnterDrawerOpen({
            visible: true,
            value,
          });
        }}>
        去录入</span>}
    </div>

  </div>;
};
export default PointMarker;
