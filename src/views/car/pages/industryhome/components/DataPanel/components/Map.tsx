import {
  FC,
  useEffect,
  useState,
  useMemo,
} from 'react';
// import { isArray } from '@lhb/func';
import { useMapLevelAndCity } from '@/common/hook/useMapLevelAndCity';
import {
  COUNTRY_LEVEL,
  PROVINCE_LEVEL,
  CITY_LEVEL,
  PROVINCE_ZOOM,
  CITY_ZOOM,
  DISTRICT_ZOOM,
  // DISTRICT_LEVEL
} from '@/common/components/AMap/ts-config';
import styles from '../../../entry.module.less';
import AMap from '@/common/components/AMap';
import LevelLayer from '@/common/components/AMap/components/LevelLayer';
import OverviewCount from './OverviewCount';
import Points from './Points';
import ProvinceListForMap from '@/common/components/AMap/components/ProvinceListForMap';

const Map: FC<any> = ({
  searchParams,
  setCityId,
  setFunnelTitle
}) => {
  const [amapIns, setAmapIns] = useState<any>(null);
  const { city, level } = useMapLevelAndCity(amapIns); // 当前地图的缩放级别及城市
  // level对应的地图缩放值
  const targetZoom = useMemo(() => {
    if (level === COUNTRY_LEVEL) return PROVINCE_ZOOM;
    if (level === PROVINCE_LEVEL) return CITY_ZOOM;
    if (level === CITY_LEVEL) return DISTRICT_ZOOM;
    return PROVINCE_ZOOM;
  }, [level]);

  useEffect(() => {
    // 地图显示省份门店数量时，清空漏斗里的城市id
    if (level === COUNTRY_LEVEL) {
      setCityId(0);
      return;
    }
    city?.id && setCityId(city?.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city?.id, level]);

  // useEffect(() => {
  //   // 地图显示省份门店数量时，清空漏斗里的城市id
  //   if (level === COUNTRY_LEVEL) {
  //     setCityId(0);
  //   }
  // }, [level]);

  const mapLoadedHandle = (mapIns: any) => {
    setAmapIns(mapIns);
  };

  return (
    <div className={styles.mapCon}>

      <AMap
        mapOpts={{
          zoom: 3.5,
          zooms: [3.5, 20],
          center: [103.826777, 36.060634] // 默认地图的中心位置，使中国地图处于地图正中央
        }}
        loaded={mapLoadedHandle}
        plugins={[
          'AMap.HeatMap',
          'AMap.DistrictSearch',
          'AMap.Geocoder',
          'AMap.RangingTool',
          'AMap.PlaceSearch']}>
        {/* 绘制行政区颜色 */}
        <LevelLayer
          level={level}
          city={city}
          isAllLevel
        />
        {/* 门店数量卡片覆盖物 */}
        <OverviewCount
          // dataRef={dataRef}
          // battleIds={battleIds}
          // start={start}
          // end={end}
          searchParams={searchParams}
          targetZoom={targetZoom}
          city={city}
          level={level}
          setFunnelTitle={setFunnelTitle}/>
        {/* 门店点位覆盖物 */}
        <Points
          searchParams={searchParams}
          targetZoom={targetZoom}
          city={city}
          level={level}
          setFunnelTitle={setFunnelTitle}/>
        {/* 省市区选择 */}
        <ProvinceListForMap
          type={1}
          _mapIns={amapIns}
          city={city}
          level={level}
          className={styles.provinceForm}
        />

      </AMap>
    </div>
  );
};

export default Map;
