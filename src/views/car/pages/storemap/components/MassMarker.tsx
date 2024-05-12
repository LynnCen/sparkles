import { storePoint } from '@/common/api/selection';
import { CITY_LEVEL, CITY_ZOOM } from '@/common/components/AMap/ts-config';
import { useMethods } from '@lhb/hook';
import { FC, useEffect, useRef, useState } from 'react';
const MassMarker: FC<{
  _mapIns?: any;
  checkedList: number[];
  city: any;
  level: number;
}> = ({
  _mapIns,
  checkedList,
  city,
  level
}) => {
  const labelMarkerRef = useRef<any>(null);
  const [groupIns, setGroupIns] = useState<any>(null);
  useEffect(() => {
    labelMarkerRef.current = new window.AMap.Marker({
      content: ' ',
      map: _mapIns,
      anchor: 'top-left',
      offset: [-34, 6],
      zIndex: 15
    });
    const group = new window.AMap.OverlayGroup();
    _mapIns.add(group);
    setGroupIns(group);
  }, [_mapIns]);
  useEffect(() => {
    switchLevel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_mapIns, checkedList, city?.citycode, level]);
  const {
    switchLevel,
    createMassMarker
  } = useMethods({
    switchLevel: async () => {
      groupIns && groupIns.clearOverlays();
      if (!checkedList.length) return;
      if (level >= CITY_LEVEL) {
        const res = await storePoint({
          attributeIds: checkedList,
          cityId: city.id,
          type: 2
        });
        createMassMarker(res);
      }
    },
    createMassMarker(list) {
      const markerList: any = [];
      list.forEach((item) => {
        const marker = new window.AMap.Marker({
          zooms: [CITY_ZOOM, 20],
          anchor: 'bottom-center',
          position: new window.AMap.LngLat(item.lng, item.lat),
          icon: new window.AMap.Icon({
            image: item.image,
            size: [28, 28],
            imageSize: [28, 28]
          }),
          bubble: true, // 允许冒泡
        });
        marker.on('mouseover', function () {
          const labelContent = `<div class='label'>
              <span class='title'>${item.name}</span>
              <div class='marker'>${item.address}</div>
              </div>`;
          labelMarkerRef.current.setPosition(new window.AMap.LngLat(item.lng, item.lat));
          labelMarkerRef.current.setContent(labelContent);
          labelMarkerRef.current.setOffset(new window.AMap.Pixel(-34, 6));
        });
        marker.on('mouseout', function () {
          labelMarkerRef.current.setContent(' ');
        });
        markerList.push(marker);
      });
      groupIns && groupIns.addOverlays(markerList);
    },
  });
  return <></>;
};

export default MassMarker;
