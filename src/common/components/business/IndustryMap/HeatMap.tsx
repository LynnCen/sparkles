import { FC, useEffect, useState } from 'react';
import { get } from '@/common/request';
import { isNotEmptyAny } from '@lhb/func';
import { heatDemoCountry, heatDemoProvince } from '@/common/api/selection';
import { COUNTRY_LEVEL, PROVINCE_LEVEL, CITY_LEVEL, DISTRICT_LEVEL } from '@/common/components/AMap/ts-config';
const HeatMap: FC<any> = ({
  _mapIns, // 地图实例
  heatType,
  city,
  level
}) => {

  const [heatMapIns, setHeatMapIns] = useState<any>(null); // 热力图实例


  useEffect(() => {
    if (!_mapIns) return;
    const ins = new window.AMap.HeatMap(_mapIns, {
      radius: 25, // 给定半径, 默认30
      opacity: [0, 0.8]
    });
    setHeatMapIns(ins);
  }, [_mapIns]);
  useEffect(() => {
    if (!heatMapIns) return;
    if (heatType === '') {
      heatMapIns.hide();
      return;
    }
    switchLevel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heatType, heatMapIns, city, level]);
  const switchLevel = async () => {
    if (!isNotEmptyAny(city?.citycode)) return;
    let list: any;
    let jsonUrl;
    if (level === COUNTRY_LEVEL) {
      jsonUrl = await heatDemoCountry();
    } else {
      jsonUrl = await heatDemoProvince({ provinceId: city.provinceId, type: heatType });
    }
    switch (level) {
      case COUNTRY_LEVEL:
        let url = jsonUrl.hotMapUrl;
        heatType === 'activeVip' && (url = jsonUrl.activeHotMapUrl);
        heatType === 'address' && (url = jsonUrl.addressHotMapUrl);
        const countryCount = url && await get(url);
        heatMapIns.setDataSet({
          data: countryCount,
          max: 100
        });
        break;
      case PROVINCE_LEVEL:
      case CITY_LEVEL:
      case DISTRICT_LEVEL:
        const provinceCount = jsonUrl.hotMapUrl && await get(jsonUrl.hotMapUrl);
        list = provinceCount.data;
        break;
      // case CITY_LEVEL:
      // case DISTRICT_LEVEL:
      //   const count = await get(jsonUrl.hotMapUrl);
      //   count.districts.forEach(item => {
      //     if (item.name === (city.city === '' ? city.province : city.city)) {
      //       const data = item.districts.map(heatPoi => heatPoi.data);
      //       list = data.flat();
      //     }
      //   });
      //   break;
    };
    if (level === COUNTRY_LEVEL) {
      heatMapIns.show();
      return;
    }
    if (!list) return;
    heatMapIns.setDataSet({
      data: list,
      max: 100
    });
    heatMapIns.show();
  };
  return <></>;
};

export default HeatMap;
