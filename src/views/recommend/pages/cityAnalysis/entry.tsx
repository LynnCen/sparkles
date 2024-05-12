import { FC, useEffect, useState } from 'react';
import styles from './entry.module.less';
import AMap from '@/common/components/AMap';
// import TopCon from '@/common/components/AMap/components/TopCon';
import LeftCon from './components/LeftCon';
import TopCon from './components/TopCon';
import { getCurPosition } from '@/common/utils/map';
import { useSelector } from 'react-redux';
import { treeFind } from '@lhb/func';
const CityAnalysis: FC<any> = () => {
  /* status */
  const cities = useSelector((state: any) => state.common.provincesCities);
  const [amapIns, setAmapIns] = useState<any>(null);
  const [cityInfoValue, setCityInfoValue] = useState<any>([]);
  const [curPosition, setCurPosition] = useState<any>(null);
  const [currentCityId, setCurrentCityId] = useState('');

  /* hooks */
  useEffect(() => {
    return () => {
      amapIns && amapIns.destroy();
    };
  }, []);

  useEffect(() => {
    if (cities?.length && curPosition) {
      const provinceId = treeFind(cities, (item) => item.name === curPosition.province)?.id;
      // 直辖市没有城市名
      const cityId = treeFind(cities, (item) => item.name === (curPosition.city || curPosition.province))?.id;
      setCityInfoValue([provinceId, cityId]);
      setCurrentCityId(cityId);
    }
  }, [cities, curPosition]);
  /* methods */
  const mapLoadedHandle = (mapIns: any) => {
    setAmapIns(mapIns);
    mapIns.addLayer(new window.AMap.TileLayer.Satellite({ visible: false }));
    // // 浏览器定位
    getCurPosition(mapIns, {
      // https://lbs.amap.com/api/javascript-api-v2/documentation#geolocation
      // 是否显示定位按钮
      showButton: false,
      // showCircle: false,
      showMarker: false
    }).then((res: any) => {
      setCurPosition(res);
      mapIns.setCity(res.city);
    });
  };
  const onCityChange = (val, record) => {
    setCityInfoValue(val);
    setCurrentCityId(val[val.length - 1]);
    amapIns.setCity(record[record.length - 1].name);
  };

  return (
    <div className={styles.container}>
      <AMap
        mapOpts={{
          zoom: 4,
          zooms: [4, 20],
          center: [103.826777, 36.060634], // 默认地图的中心位置，使中国地图处于地图正中央
        }}
        loaded={mapLoadedHandle}
        plugins={[
          'AMap.HeatMap',
          'AMap.DistrictSearch',
          'AMap.Geocoder',
          'AMap.RangingTool',
          'AMap.PlaceSearch',
          'AMap.Driving', // 驾车
          'AMap.Riding', // 骑行
          'AMap.Walking' // 走路
        ]}
      >
        {/* 左侧内容 */}
        <LeftCon cityId={currentCityId} />
        {/* 右侧内容 */}

        {/* 顶部搜索 */}
        <TopCon
          cityValue={cityInfoValue}
          onCityChange={onCityChange}
        />
        {/* 绘制热力图 */}
        {/* <HeatMap city={memoCity} level={memoLevel} heatType={heatType} /> */}
      </AMap>
    </div>
  );
};

export default CityAnalysis;
