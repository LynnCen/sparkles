/**
 * @Description 机会点地图
 * TODO 经纬度
 */

import { FC, useEffect, useState } from 'react';
import { useMethods } from '@lhb/hook';
// import { isArray } from '@lhb/func';
import { v4 } from 'uuid';
// import cs from 'classnames';
import styles from './index.module.less';
import ReactDOM from 'react-dom';
import AMap from '@/common/components/AMap/index';
import { isArray } from '@lhb/func';
// import IconFont from '@/common/components/IconFont';

const Map: FC<any> = ({
  data,
  businessDetail, // 商圈详情
}) => {
  const [mapIns, setMapIns] = useState<any>();
  const loadedMapHandle = (ins: any) => {
    ins && setMapIns(ins);
  };

  useEffect(() => {
    if (!mapIns) return;
    if (businessDetail && isArray(data) && data.length) {
      renderMarkers();
    }
  }, [data, mapIns, businessDetail]);

  const {
    renderMarkers,
    addItemMarker,
    addPolygon,
    addCircle,
    // addEllipse,
  } = useMethods({
    renderMarkers: () => {
      const markers: any[] = [];
      const { lng, lat, radius, borders } = businessDetail;
      // 显示机会点
      data.forEach((item: any, index: number) => {
        const markerItem = addItemMarker(item, index);
        markerItem && (markers.push(markerItem));
      });
      // 显示围栏
      if (isArray(borders) && borders.length) {
        const targetMarker = addPolygon(borders);
        markers.push(targetMarker);
      } else if (+lng && +lat && radius) {
        const targetMarker = addCircle(+lng, +lat, radius);
        markers.push(targetMarker);
      }
      const overlayGroups = new window.AMap.OverlayGroup(markers);
      mapIns.add(overlayGroups);
      mapIns.setFitView(markers, true);
    },
    addItemMarker: ({ lng, lat }, index) => {
      if (!(+lng && +lat)) return null;
      const uid:any = v4();

      const marker = new window.AMap.Marker({
        position: new window.AMap.LngLat(lng, lat),
        // anchor: 'bottom-center',
        // offset: [0, -52],
      });
      mapIns.add(marker); // 先添加到地图上
      marker.setContent(`<div id="${uid}"></div>`);
      ReactDOM.render(<div className={styles.textMarkerWrapper}>
        <div className={styles.textMarkerCon}>
          {index + 1}
        </div>
      </div>, document.getElementById(uid));
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
        strokeWeight: 2, // isCustom ? 10 : 2,
        strokeOpacity: 1,
        fillOpacity: 0.2,
        strokeStyle: 'dashed',
        strokeDasharray: [10, 10],
        fillColor: '#006AFF',
      });
    },
  });
  return (
    <div className={styles.mapCon }>
      <AMap
        loaded={loadedMapHandle}
        mapOpts={{
          WebGLParams: { preserveDrawingBuffer: true }
        }}
      />
    </div>
  );
};

export default Map;
