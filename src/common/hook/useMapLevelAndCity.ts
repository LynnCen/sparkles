import { debounce, isEqual, isNotEmptyAny } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import { useState, useEffect, useRef } from 'react';
import { fetchCityIdByName } from '@/common/api/selection';
import { COUNTRY_LEVEL, PROVINCE_ZOOM, CITY_ZOOM, PROVINCE_LEVEL, DISTRICT_ZOOM, CITY_LEVEL, DISTRICT_LEVEL, City } from '@/common/components/AMap/ts-config';

/*
 * 获取地图当前等级和所处行政区
 */

export function useMapLevelAndCity(amapIns) {
  const [level, setLevel] = useState<number>(COUNTRY_LEVEL);
  const [city, setCity] = useState<City | undefined>();
  const firstRef = useRef(true);
  const nameRef = useRef();
  useEffect(() => {
    if (!amapIns) return;
    // 先执行一次，否则分享页的初始化拿不到最新的level
    if (firstRef.current) {
      zoomChange();
      centerChange();
      firstRef.current = false;
    }
    amapIns.on('zoomend', zoomChange);
    amapIns.on('moveend', centerChange);
    // 默认获取一次中心点行政区
    getCity();
    return () => {
      amapIns.off('zoomend', zoomChange);
      amapIns.off('moveend', centerChange);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amapIns]);
  const {
    zoomChange,
    centerChange,
    getCity,
  } = useMethods({
    zoomChange: debounce(() => {
      const curZoom = amapIns.getZoom();
      let curLevel = 0;
      if (curZoom < PROVINCE_ZOOM) {
        curLevel = COUNTRY_LEVEL;
      } else if (curZoom < CITY_ZOOM) {
        curLevel = PROVINCE_LEVEL;
      } else if (curZoom < DISTRICT_ZOOM) {
        curLevel = CITY_LEVEL;
      } else {
        curLevel = DISTRICT_LEVEL;
      };
      curLevel !== level && setLevel(curLevel);
      // 缩放中心点不在地图中心的时候会改变中心点的省市区
      getCity();
    }, 500),
    centerChange: debounce(() => {
      getCity();
    }, 500),
    getCity: () => {
      // 获取地图中心点的城市信息
      amapIns.getCity((val) => {
        if (!isEqual(val, city)) {
          // 部分市（一般是省直辖市）没有city值，取district，依然没有时取省份名
          // const name = val.city === '' ? val.province : val.city;
          const name = val.city || val.province;
          // 非有效省市区，不再处理，参照src/common/components/AMap/ts-config.ts
          if (!isNotEmptyAny(name)) return;
          // name没有变化时不重复请求接口
          if (nameRef.current === name) return;
          if (!name) return;
          nameRef.current = name;
          fetchCityIdByName({ name })
            .then((cityRes) => {
              // 台湾省无数据返回，暂时不做处理
              cityRes.id && setCity({ ...val, ...cityRes });
            });
        }
      });
    }
  });
  return {
    level,
    city
  };
}

