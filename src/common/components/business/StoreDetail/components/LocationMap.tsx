import { FC, useEffect, useRef, useState } from 'react';
import AMap from '@/common/components/AMap/index';

interface IProps {
  lng: number;
  lat: number;
  /**
   * @description 是否禁用,为 true 时仅展示不可点击
   * @default false
   */
  disabled?:boolean;
}
const LocationMap: FC<IProps> = ({ lng, lat, disabled = false }) => {
  const markerRef = useRef<any>(null);
  const [amapIns, setAmapIns] = useState<any>(null); // 地图实例

  useEffect(() => {
    if (!amapIns) return;
    !disabled && amapIns.on('click', onClick);
    if (lng && lat) {
      addMarker(lng, lat);
    }
    return () => {
      !disabled && amapIns.off('click', onClick);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amapIns]);

  // 添加详细地址的marker
  const addMarker = (lng, lat) => {
    const w = 41.0;
    const h = 48.5;
    const customIcon = new window.AMap.Icon({
      // 图标尺寸
      size: new window.AMap.Size(w, h),
      // 图标的取图地址
      image: `https://staticres.linhuiba.com/project-custom/store-assistant-h5/shop_location@2x.png`,
      // 图标所用图片大小
      imageSize: new window.AMap.Size(w, h),
      // 图标取图偏移量
      // imageOffset: new AMap.Pixel(0, 10)
    });

    const marker = new window.AMap.Marker({
      position: new window.AMap.LngLat(lng, lat),
      // 将一张图片的地址设置为 icon
      icon: customIcon,
      // 设置了 icon 以后，设置 icon 的偏移量，以 icon 的 [center bottom] 为原点
      offset: new window.AMap.Pixel(-w / 2, -h),
    });
    amapIns.add(marker);
    amapIns.setFitView(marker);
    markerRef.current = marker;
  };

  const onClick = (e) => {
    amapIns.panTo([e.lnglat.lng, e.lnglat.lat]);
    if (markerRef.current) {
      markerRef.current.setPosition([e.lnglat.lng, e.lnglat.lat]);
    } else {
      const option = {
        map: amapIns,
        position: [e.lnglat.lng, e.lnglat.lat]
      };
      markerRef.current = new window.AMap.Marker(option);
    }
  };

  const loadedMapHandle = (map) => {
    setAmapIns(map);
  };

  const options = lng && lat ? {
    center: [lng, lat]
  } : {};

  return (
    <div style={{ width: '100%', height: '208px' }}>
      <AMap
        loaded={loadedMapHandle}
        mapOpts={options}
      />
    </div>
  );
};

export default LocationMap;
