/**
 * @Description 省市区聚合
 */
import { FC, useEffect, useRef } from 'react';
import { CITY_FIT_ZOOM, CITY_LEVEL, COUNTRY_LEVEL, DISTRICT_FIT_ZOOM, DISTRICT_LEVEL, PROVINCE_FIT_ZOOM, PROVINCE_LEVEL } from '@/common/components/AMap/ts-config';
import { isArray } from '@lhb/func';
import { v4 } from 'uuid'; // 用来生成不重复的key
import styles from './index.module.less';
import ReactDOM from 'react-dom';
import IconFont from '@/common/components/IconFont';

const defaultZIndex = 12;
const ClusterMarker: FC<any> = ({
  amapIns,
  circleData,
  level,
  getIconColor
}) => {
  const polymerizationRef = useRef<any>(null);// 聚合商圈（省市区）
  const onlyOneProvinceRef = useRef<boolean>(true);// 当只有一个省的情况下，默认跳转到当前省中，且仅会在页面初次加载的时候

  useEffect(() => {
    if (!amapIns) return;
    if (level === DISTRICT_LEVEL) return;
    // 当只有一个省的情况下，默认跳转到当前省中，且仅会在页面初次加载的时候
    if (level === COUNTRY_LEVEL && circleData.length === 1 && onlyOneProvinceRef.current) {
      onlyOneProvinceRef.current = false;
      amapIns.setZoomAndCenter(PROVINCE_FIT_ZOOM, [circleData[0].lng, circleData[0].lat], false, 200);
    }
    createCircle();
  }, [circleData, amapIns]);

  useEffect(() => {
    if (level === DISTRICT_LEVEL) {
      clearClusterMarker();
    }
  }, [level]);

  const clearClusterMarker = () => {
    polymerizationRef.current && amapIns.remove(polymerizationRef.current);
  };
  // 绘制聚合圆圈
  const createCircle = () => {
    clearClusterMarker();
    if (!(isArray(circleData) && circleData.length)) return;
    const arr:any = [];
    const labelMarker = new window.AMap.Marker({
      anchor: 'bottom',
      zIndex: defaultZIndex + 1,
      offset: [-30, 70]
    });
    amapIns.add(labelMarker);
    if (circleData.length === 1) {
      amapIns.setCenter([circleData[0].lng, circleData[0].lat]);
    }
    circleData?.map((item) => {
      if (item.total === 0) return;
      const marker = new window.AMap.Marker({
        // zooms: [3.5, DISTRICT_FIT_ZOOM - 0.2], // 控制到区级别时就不显示
        position: new window.AMap.LngLat(+item?.lng, +item?.lat),
        anchor: 'top-center',
        zIndex: defaultZIndex,
        content: circleContent(item)
      });

      marker.on('click', () => {
        clickCircle([item.lng, item.lat]);
      });
      marker.on('mouseover', () => {
        labelMarker.setPosition(new window.AMap.LngLat(+item?.lng, +item?.lat));
        // 设置当前选中item
        const uid:any = v4();
        labelMarker.setContent(`<div id="${uid}"></div>`);
        ReactDOM.render(<CircleLabelContent detail={item} getIconColor={getIconColor}/>, document.getElementById(uid));

        marker.setzIndex(100);
      });
      marker.on('mouseout', () => {
        labelMarker.setContent(` `);
        marker.setzIndex(defaultZIndex);
      });
      arr.push(marker);
    });
    const overlayGroups = new window.AMap.OverlayGroup(arr);
    // 一次性添加到地图上
    amapIns.add(overlayGroups);
    polymerizationRef.current = overlayGroups;
  };
  // 聚合marker样式
  const circleContent = (value) => {
    let total = 0;
    let lDeg = 0;
    let rDeg = 0;
    // 需要先遍历求和 count
    value.countList.map((item) => {
      total += item.total;
    });

    const styleList: any = [];
    // 先计算每个圈的占比样式
    if (total !== 0) {
      value.countList.map((item, index) => {
        // 计算出每个选中的条目在所有选中项中的比重
        item.scale = item.total / total;
        rDeg = rDeg + 360 * item.scale;
        styleList.push(`${item.color} ${lDeg}deg ${rDeg}deg`);
        // 每隔一个留4度的白色
        if (index !== value.countList.length - 1 && item.total) {
          styleList.push(`#FFFFFF ${rDeg}deg ${rDeg + 4}deg`);
        }
        lDeg = rDeg + 4;
      });
    }
    const content = `<div style='background: conic-gradient(${styleList.join(',')});' class='circlebox'>
    <div class='whiteBg'><p class='text-name '>${value.areaName}</p><p class='text-total'>${total}</p></div>
    </div>`;
    return content;
  };
  // 聚合marker点击事件
  const clickCircle = (lnglat) => {
    let zoom = 4;
    switch (level) {
      // 全国范围，点击省份marker跳到省份范围，市区数据
      case COUNTRY_LEVEL:
        zoom = PROVINCE_FIT_ZOOM;
        break;
        // 省份范围，点击城市marker跳到市范围
      case PROVINCE_LEVEL:
        zoom = CITY_FIT_ZOOM;
        break;
        // 市范围，点击区跳到具体商圈
      case CITY_LEVEL:
        zoom = DISTRICT_FIT_ZOOM;
        break;
    };
    amapIns.setZoomAndCenter(zoom, lnglat, false, 300);
  };
  return <></>;
};
const CircleLabelContent = ({
  detail,
  getIconColor
}) => {
  return <div className={styles.mapLabel}>
    <div className={styles.triangle}></div>
    {detail?.countList?.map((item, index) => <div key={index} className={styles.line}>
      {
        getIconColor(item?.firstLevelCategoryId)
          ? <IconFont
            iconHref={getIconColor(item?.firstLevelCategoryId)?.icon}
            style={{
              color: getIconColor(item?.firstLevelCategoryId)?.color
            }}
            className='fs-14'
          />
          : <span
            style={{
              backgroundColor: item.color
            }}
            className={styles.colorCircle} ></span>
      }
      <span className='pl-4'>{item.firstLevelCategory}</span>
      <span className={styles.rightLine}></span>
      <span className={styles.rightBorder}>{item.total}</span>
      <span className={styles.rightLine}></span>
      <span className='pl-4'>{(+item?.scale * 100).toFixed(1)}%</span>
    </div>
    )}
  </div>;
};
export default ClusterMarker;
