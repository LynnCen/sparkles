import { FC, useEffect, useMemo, useRef } from 'react';
import { isArray } from '@lhb/func';
import {
  COUNTRY_LEVEL,
  PROVINCE_LEVEL,
  // CITY_LEVEL
} from '@/common/components/AMap/ts-config';
import { areaCount } from '@/common/api/fishtogether';

const OverviewCount: FC<any> = ({ _mapIns, level, targetZoom, city }) => {
  const markersGroup: any = useRef(null);
  const levelRef = useRef(level);

  // 是否展示卡片覆盖物
  const showCard = useMemo(() => {
    // 地图的缩放级别大于区级时不展示markers
    if (level > PROVINCE_LEVEL) return;
    return true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  useEffect(() => {
    if (showCard) {
      // 需要展示卡片覆盖物
      getShopsCount();
      return;
    }
    // 不展示markers
    markersGroup.current && markersGroup.current.clearOverlays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCard]);

  useEffect(() => {
    // 全国范围的缩放级别下，移动地图中心点不触发
    if (level === COUNTRY_LEVEL && levelRef.current === level) return;
    if (showCard) {
      getShopsCount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city?.id, level]);

  const getShopsCount = async () => {
    markersGroup.current && markersGroup.current.clearOverlays();
    const params: any = { attributeIds: [2, 9, 10] };

    const { provinceId } = city || {};
    // 省缩放级别
    if (level === PROVINCE_LEVEL && provinceId) {
      params.provinceId = provinceId;
    }

    levelRef.current = level; // 记录请求接口时的level值
    // try {
    const data = await areaCount(params);

    if (isArray(data)) {
      drawOverviewCount(data);
    }
  };

  const countTotal = (arr) => {
    if (arr && arr.length) {
      let total = 0;
      arr.forEach((item) => {
        total += item.count;
      });
      return total;
    }
    return 0;
  };

  // 绘制数量卡片覆盖物
  const drawOverviewCount = (data: Array<any>) => {
    const markers: Array<any> = [];
    data.forEach((item: any) => {
      const { lat, lng, cityId } = item;
      const count = countTotal(item.data);
      const name = item.cityName || item.provinceName;
      // 没有经纬度、数量时，跳过
      if (!(lat && lng && count > 0)) return;
      const marker = new window.AMap.Marker({
        // https://staticres.linhuiba.com/project-custom/locationpc/new/icon_active_card_markers.png
        content: `<div class='cardWrapper'>
          <div class='cardTitle ${city?.id === cityId ? `isCurrent` : ''}'>
            <div class='cardIcon'>
              <img
                src=${
  city?.id === cityId
    ? 'https://staticres.linhuiba.com/project-custom/locationpc/new/icon_active_card_markers.png'
    : 'https://staticres.linhuiba.com/project-custom/locationpc/new/icon_card_markers.png'
}
                width='100%'
                height='100%'/>
            </div>
            <div class='cardName'>
              ${name}
            </div>
          </div>
          <div class='cardVal'>${count}</div>
          </div>`,
        anchor: 'bottom-center',
        position: new window.AMap.LngLat(+lng, +lat),
        offset: [0, -6],
        zIndex: city?.id === cityId ? 99 : 12, // 12是默认值
      });
      marker.on('click', () => {
        _mapIns.setZoomAndCenter(targetZoom, [lng, lat]);
      });
      markers.push(marker);
    });
    // 覆盖物群组
    markersGroup.current = new window.AMap.OverlayGroup(markers);
    _mapIns.add(markersGroup.current);
  };

  return <></>;
};

export default OverviewCount;
