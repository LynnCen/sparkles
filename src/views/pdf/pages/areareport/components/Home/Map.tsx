/**
 * @Description 首页地图
 */

import { FC, useEffect, useMemo, useState } from 'react';
import { useMethods } from '@lhb/hook';
import { isArray } from '@lhb/func';
import { v4 } from 'uuid';
import cs from 'classnames';
import styles from './index.module.less';
import ReactDOM from 'react-dom';
import AMap from '@/common/components/AMap/index';
// import IconFont from '@/common/components/IconFont';

const HomeMap: FC<any> = ({
  dataInfo
}) => {
  const [mapIns, setMapIns] = useState<any>();
  const loadedMapHandle = (ins: any) => {
    ins && setMapIns(ins);
  };

  useEffect(() => {
    if (!mapIns) return;
    if (!Object.keys(dataInfo)?.length) return;
    renderMarkers();
  }, [dataInfo, mapIns]);

  const legendStr = useMemo(() => {
    const { borders, radius } = dataInfo || {};
    if (isArray(borders) && borders.length) return '围栏内';
    return radius ? `${radius}m` : '';
  }, [dataInfo]);

  const {
    renderMarkers,
    addNameMarker,
    addCenterMarker,
    addPolygon,
    addCircle,
    addEllipse,
  } = useMethods({
    renderMarkers: () => {
      const {
        resourceMallFlag, // 是否是商场
        borders, // 围栏
        radius,
        lng,
        lat,
        clusterName,
      } = dataInfo;
      const markers: any[] = [];
      let targetRailMarker: any = null;
      if (+lng && +lng) { // 中心点
        const targetMarker = addCenterMarker(+lng, +lat);
        markers.push(targetMarker);
        addNameMarker(+lng, +lat, clusterName);
      }
      // 逻辑来源：https://confluence.lanhanba.com/pages/viewpage.action?pageId=119148574
      // 优先展示围栏
      if (isArray(borders) && borders.length) {
        const targetMarker = addPolygon(borders);
        markers.push(targetMarker);
      } else if (+lng && +lat) {
        targetRailMarker = addCircle(+lng, +lat, radius);
        markers.push(targetRailMarker);
      }
      if (!resourceMallFlag) { // 非商场类型，显示白色椭圆marker
        const targetMarker = addEllipse(+lng, +lat, 500, true);
        markers.push(targetMarker);
      }
      const overlayGroups = new window.AMap.OverlayGroup(markers);
      mapIns.add(overlayGroups);
      mapIns.setFitView(markers, true);
    },
    addCenterMarker: (lng: number, lat: number) => {
      const AMap = window.AMap;
      const customIcon = new AMap.Icon({
      // 图标尺寸
        size: new AMap.Size(41, 48),
        // 图标的取图地址 area_report_map_ellipse@2x
        image: 'https://staticres.linhuiba.com/project-custom/store-assistant-h5/shop_location@2x.png',
        // 图标所用图片大小
        imageSize: new AMap.Size(41, 48),
      // 图标取图偏移量
      // imageOffset: new AMap.Pixel(0, 10)
      });
      const marker = new AMap.Marker({
        position: new AMap.LngLat(lng, lat),
        // 将一张图片的地址设置为 icon
        icon: customIcon,
        // 设置了 icon 以后，设置 icon 的偏移量，以 icon 的 [center bottom] 为原点
        offset: new AMap.Pixel(-41 / 2, -48)
      });
      return marker;
    },
    addNameMarker: (lng, lat, name) => {
      const uid:any = v4();

      const marker = new window.AMap.Marker({
        position: new window.AMap.LngLat(lng, lat),
        anchor: 'bottom-center',
        offset: [0, -52],
      });
      mapIns.add(marker); // 先添加到地图上
      marker.setContent(`<div id="${uid}"></div>`);
      ReactDOM.render(<div className={styles.textMarkerWrapper}>
        <div className={styles.textMarkerCon}>
          {name}
        </div>
      </div>, document.getElementById(uid));
    },
    addPolygon: (path: any[]) => {
      return new window.AMap.Polygon({
        path,
        fillColor: '#006AFF',
        strokeOpacity: 1,
        fillOpacity: 0.2,
        strokeColor: '#006AFF',
        strokeWeight: 1,
        strokeStyle: 'dashed',
        // zIndex: 60,
      });
    },
    addCircle: (lng: number, lat: number, radius: number, isCustom = false) => {
      return new window.AMap.Circle({
        center: [lng, lat],
        radius, // 半径（米）
        strokeColor: isCustom ? '#fefefe' : '#006AFF',
        strokeWeight: 2, // isCustom ? 10 : 2,
        strokeOpacity: 1,
        fillOpacity: 0.2,
        strokeStyle: isCustom ? 'soild' : 'dashed',
        strokeDasharray: [10, 10],
        fillColor: isCustom ? '#fff' : '#006AFF',
      });
    },
    addEllipse: (lng: number, lat: number) => {
      const AMap = window.AMap;
      const customIcon = new AMap.Icon({
      // 图标尺寸
        size: new AMap.Size(366, 366),
        image: 'https://staticres.linhuiba.com/project-custom/locationpc/areaReport/area_report_map_ellipse@2x.png',
        // 图标所用图片大小
        imageSize: new AMap.Size(366, 366),
      // 图标取图偏移量
      // imageOffset: new AMap.Pixel(0, 10)
      });
      const marker = new AMap.Marker({
        position: new AMap.LngLat(lng, lat),
        // 将一张图片的地址设置为 icon
        icon: customIcon,
        // 设置了 icon 以后，设置 icon 的偏移量，以 icon 的 [center bottom] 为原点
        offset: new AMap.Pixel(-366 / 2, -366 / 2)
      });
      return marker;
    },
  });
  return (
    <div className={styles.mapCon}>
      <div className={styles.mapBox}>
        {
          dataInfo?.lng && dataInfo?.lat ? <AMap
            loaded={loadedMapHandle}
            mapOpts={{
              WebGLParams: { preserveDrawingBuffer: true }
            }}
          /> : <></>
        }
      </div>
      <div className={styles.lengedCon}>
        <div className={styles.aligningCon}>
          <div className={styles.railBox}></div>
          <div className='fs-14 c-333 pl-8'>推荐位置：{legendStr}</div>
        </div>
        {
          dataInfo?.resourceMallFlag ? <></> : <div className={styles.aligningCon}>
            <div className={cs(styles.railBox, styles.railCustom)}></div>
            <div className='fs-14 c-333 pl-8'>覆盖范围：500m</div>
          </div>
        }
      </div>
    </div>
  );
};

export default HomeMap;
