import { useRef, } from 'react';
import { CircleBusinessZoom } from '../CircleBusinessMap/ts-config';
import { v4 } from 'uuid'; // 用来生成不重复的key
import styles from './index.module.less';
import { ShopItem } from '@/common/components/business/ExpandStore/CircleBasicInfo/ts-config';
import ReactDOM from 'react-dom';

export function useHoverMarker(map) {
  const hoverMarkerRef = useRef<any>(null);

  const createHoverMarker = (info:ShopItem) => {
    const uid:any = v4();
    if (hoverMarkerRef.current && hoverMarkerRef.current._opts.extData === info.id) return;
    if (hoverMarkerRef.current && hoverMarkerRef.current._opts.extData !== info.id)removeHoverMarker();
    const marker = new window.AMap.Marker({
      zooms: [CircleBusinessZoom.MinZomm, 20],
      anchor: 'center',
      position: new window.AMap.LngLat(+info.lng, +info.lat),
      extData: info.id,
      offset: [0, 30],
      content: `<div id=${uid}></div>`
    });
    map.add(marker); // 添加到地图
    hoverMarkerRef.current = marker;
    const Node = <div className={styles.hoverMarkerWrapper}>{info.address}</div>;
    ReactDOM.render(Node, document.getElementById(uid));

  };

  const removeHoverMarker = () => {
    if (hoverMarkerRef.current) {
      map.remove(hoverMarkerRef.current);
      hoverMarkerRef.current = null;
    }

  };

  return {
    hoverMarker: hoverMarkerRef.current,
    createHoverMarker,
    removeHoverMarker
  };
}
