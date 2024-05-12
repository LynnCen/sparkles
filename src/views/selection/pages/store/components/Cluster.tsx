import { storeCount } from '@/common/api/selection';
import { CITY_ZOOM, COUNTRY_LEVEL, PROVINCE_LEVEL } from '@/common/components/AMap/ts-config';
import { useMethods } from '@lhb/hook';
import { FC, useEffect, useRef, useState } from 'react';
const Cluster: FC<{
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
  }, [_mapIns, checkedList, city, level]);
  const {
    switchLevel,
    drawCluster
  } = useMethods({
    switchLevel: async () => {
      groupIns && groupIns.clearOverlays();
      if (!checkedList.length) return;
      switch (level) {
        case COUNTRY_LEVEL:
          const provinceRes = await storeCount({ attributeIds: checkedList });
          drawCluster(provinceRes, 'provinceName');
          break;
        case PROVINCE_LEVEL:
          const cityRes = await storeCount({ provinceId: city.provinceId, attributeIds: checkedList });
          drawCluster(cityRes, 'cityName');
          break;
      }
    },
    drawCluster(list, key) {
      const markerList: any = [];
      list.forEach((item) => {
        const { lng, lat, data } = item;
        const total = data.reduce((prev, next) => prev + next.count, 0);
        const marker = new window.AMap.Marker({
          zooms: [2, CITY_ZOOM],
          content: `<div class='circlebox'>
          <div class='whiteBg'>
          <p class='text-name'>${item[key]}</p>
          <p class='text-total'>${total || ''}</p>
          </div>
          </div>`,
          anchor: 'bottom-center',
          position: new window.AMap.LngLat(lng, lat),
          offset: [0, -6]
        });
        let labelContent = `<div class='label'>`;
        data.forEach(status => {
          labelContent += `<div class='item'>
          <div>
          <svg width=14px height=14px style="" fill="${status.color}" aria-hidden >
            <use xlink:href='#${status.icon}' />
          </svg>
          </div>
          <div>
            <span>${status.name}：${status.count || '-'}</span>
          </div>
          </div>`;
        });
        labelContent += '</div>';
        marker.on('mouseover', () => {
          labelMarkerRef.current.setPosition(new window.AMap.LngLat(lng, lat));
          labelMarkerRef.current.setContent(labelContent);
          labelMarkerRef.current.setOffset(new window.AMap.Pixel(-34, 6));
        });
        marker.on('mouseout', () => {
          labelMarkerRef.current.setContent(' ');
        });
        markerList.push(marker);
      });
      groupIns && groupIns.addOverlays(markerList);
    },
  });
  return <></>;
};

export default Cluster;
