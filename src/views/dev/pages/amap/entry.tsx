import { FC, useState } from 'react';
import AMap from '@/common/components/AMap';
import { useAmapLevelAndCityNew } from '@/common/hook/useAmapLevelAndCityNew';

import styles from './entry.module.less';
const Amap: FC<any> = () => {
  const [amapIns, setAmapIns] = useState<any>(null);
  const cityAndLevel = useAmapLevelAndCityNew(amapIns, true, true);
  console.log(`cityAndLevel更新频率`, cityAndLevel);

  const mapLoadedHandle = (amapIns: any) => {
    setAmapIns(amapIns);
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
        // plugins={['AMap.HeatMap', 'AMap.DistrictSearch', 'AMap.Geocoder', 'AMap.RangingTool', 'AMap.PlaceSearch']}
      >

      </AMap>
    </div>
  );
};

export default Amap;
