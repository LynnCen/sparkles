import AMap from '@/common/components/AMap';
import { useMapLevelAndCity } from '@/common/hook/useMapLevelAndCity';
import { FC, useEffect, useState } from 'react';
import styles from './entry.module.less';
import { COUNTRY_LEVEL, PROVINCE_ZOOM, PROVINCE_LEVEL, CITY_ZOOM, CITY_LEVEL, DISTRICT_ZOOM, DISTRICT_LEVEL } from '@/common/components/AMap/ts-config';
import TopCon from '@/common/components/AMap/components/TopCon';
import { useMethods } from '@lhb/hook';
import LevelLayer from '@/common/components/AMap/components/LevelLayer';
import Left from './components/Left';
import Cluster from './components/Cluster';
import MassMarker from './components/MassMarker';
const Storemap: FC<any> = () => {
  const [amapIns, setAmapIns] = useState<any>(null);
  const { city, level } = useMapLevelAndCity(amapIns);
  const [checkedList, setCheckList] = useState<any>([]);
  const {
    mapLoadedHandle,
    toCenterAndLevel,
    clearClickEvent,
    addClickEvent
  } = useMethods({
    mapLoadedHandle: (mapIns: any) => {
      setAmapIns(mapIns);
    },
    toCenterAndLevel: (e) => {
      if (level === DISTRICT_LEVEL) return;
      const { lnglat } = e;
      let zoom = 4;
      switch (level) {
        case COUNTRY_LEVEL:
          zoom = PROVINCE_ZOOM;
          break;
        case PROVINCE_LEVEL:
          zoom = CITY_ZOOM;
          amapIns.setZoom(CITY_ZOOM);
          break;
        case CITY_LEVEL:
          zoom = DISTRICT_ZOOM;
          break;
      };
      amapIns.setZoomAndCenter(zoom, lnglat, false, 300);
    },
    clearClickEvent: () => {
      amapIns && amapIns.off('click', toCenterAndLevel);
    },
    addClickEvent: () => {
      amapIns && amapIns.on('click', toCenterAndLevel);
    },
  });

  useEffect(() => {
    if (!amapIns) return;
    addClickEvent();
    return () => {
      clearClickEvent();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amapIns]);
  useEffect(() => {
    return () => {
      amapIns && amapIns.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <AMap
        loaded={mapLoadedHandle}
        mapOpts={{
          zoom: 4,
          zooms: [4, 20],
          center: [103.826777, 36.060634]
        }}
        plugins={[
          'AMap.PlaceSearch',
          'AMap.DistrictSearch',
          'AMap.Geocoder',
          'AMap.RangingTool',
          'AMap.HeatMap',
          'AMap.Driving', // 驾车
          'AMap.Riding', // 骑行
          'AMap.Walking' // 走路
        ]} >
        {/* 顶部搜索+工具箱 */}
        <TopCon
          clearClickEvent={clearClickEvent}
          addClickEvent={addClickEvent}
          level={level}
          city={city} />
        {/* 行政区背景色插件 */}
        <LevelLayer
          level={level}
          city={city} />
        <Left
          setCheckList={setCheckList}
          level={level}
          city={city}
        />
        <Cluster
          checkedList={checkedList}
          level={level}
          city={city} />
        <MassMarker
          checkedList={checkedList}
          level={level}
          city={city} />
      </AMap>
    </div>
  );
};

export default Storemap;
