/**
 * @Description 首页地图
 */

import { FC, useEffect, useState } from 'react';
import { useMethods } from '@lhb/hook';
import { isArray } from '@lhb/func';
// import cs from 'classnames';
import styles from './home.module.less';
import AMap from '@/common/components/AMap/index';
import IconFont from '@/common/components/IconFont';

const HomeMap: FC<any> = ({
  dataInfo
}) => {
  const [mapIns, setMapIns] = useState<any>(); // 加盟商
  const loadedMapHandle = (ins: any) => {
    ins && setMapIns(ins);
  };

  useEffect(() => {
    if (!mapIns) return;
    if (!Object.keys(dataInfo)?.length) return;
    renderMarkers();
  }, [dataInfo, mapIns]);

  const {
    renderMarkers,
    addCenterMarker,
    addPolygon,
    addCircle,
  } = useMethods({
    renderMarkers: () => {
      const {
        chancePointLat,
        chancePointLng,
        polygon,
        clusterLng,
        clusterLat,
        radius,
      } = dataInfo;
      const markers: any[] = [];
      let targetMarker: any = null;
      let targetRailMarker: any = null;
      if (+chancePointLat && +chancePointLng) {
        targetMarker = addCenterMarker(+chancePointLng, +chancePointLat);
        markers.push(targetMarker);
      }
      // 优先展示围栏
      if (isArray(polygon) && polygon.length) {
        targetRailMarker = addPolygon(polygon.map((item) => [item.lng, item.lat]));
        markers.push(targetRailMarker);
      } else if (+clusterLng && +clusterLat && +radius > 0) { // 显示圆
        targetRailMarker = addCircle(+clusterLng, +clusterLat, +radius);
        markers.push(targetRailMarker);
      }
      const overlayGroups = new window.AMap.OverlayGroup(markers);
      mapIns.add(overlayGroups);
      mapIns.setFitView(markers, true);
    },
    addCenterMarker: (lng: number, lat: number) => {
      const AMap = window.AMap;
      const customIcon = new AMap.Icon({
      // 图标尺寸
        size: new AMap.Size(40, 40),
        // 图标的取图地址
        image: 'https://staticres.linhuiba.com/project-custom/locationpc/chancepointReport/chancepoint_report_marker@2x.png',
        // 图标所用图片大小
        imageSize: new AMap.Size(40, 40),
      // 图标取图偏移量
      // imageOffset: new AMap.Pixel(0, 10)
      });
      const marker = new AMap.Marker({
        position: new AMap.LngLat(lng, lat),
        // 将一张图片的地址设置为 icon
        icon: customIcon,
        // 设置了 icon 以后，设置 icon 的偏移量，以 icon 的 [center bottom] 为原点
        offset: new AMap.Pixel(-40 / 2, -40)
      });
      return marker;
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
    addCircle: (lng: number, lat: number, radius: number) => {
      return new window.AMap.Circle({
        center: [lng, lat],
        radius, // 半径（米）
        strokeColor: '#006AFF',
        strokeWeight: 2,
        strokeOpacity: 1,
        fillOpacity: 0.2,
        strokeStyle: 'dashed',
        strokeDasharray: [10, 10],
        fillColor: '#006AFF',
      });
    }
  });
  return (
    <div className={styles.mapCon}>
      <div className={styles.mapBox}>
        {
          dataInfo?.chancePointLat && dataInfo?.chancePointLng ? <AMap
            loaded={loadedMapHandle}
            mapOpts={{
              WebGLParams: { preserveDrawingBuffer: true }
            }}
          /> : <></>
        }
      </div>
      <div className={styles.lengedCon}>
        <div className={styles.aligningCon}>
          <IconFont
            iconHref='iconic_dianpu1'
            className='fs-24'
          />
          <span className='fs-14 c-333 pl-8'>机会点</span>
        </div>
        <div className={styles.aligningCon}>
          <div className={styles.railBox}></div>
          <div className='fs-14 c-333 pl-8'>商圈范围</div>
        </div>
      </div>
    </div>
  );
};

export default HomeMap;
