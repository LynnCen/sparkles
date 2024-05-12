import { FC } from 'react';
import { urlParams } from '@lhb/func';
import styles from './entry.module.less';
import CityInfo from '@/common/components/business/SurroundDrawer/components/City';
import SurroundPopulation from '@/common/components/business/SurroundDrawer/components/SurroundPopulation';
import RimShop from './components/RimShop';

const Attachment: FC<any> = () => {
  const query = urlParams(location.search);
  const { originType, cityId, lng, lat, address } = query || {};

  return (
    <div className={styles.container}>
      { // 1:"5公里鱼店状态"，
        +originType === 1 ? (<RimShop
          lng={+lng}
          lat={+lat}
          cityId={+cityId}/>) : null
      }
      { // 2:"城市信息"，
        +originType === 2 ? (<CityInfo
          detail={{
            lng: +lng,
            lat: +lat,
            radius: 1000, // 默认1公里
            address: decodeURI(address)
          }}
          cityId={+cityId}
          isActiveTab
          isFromImageserve
        />) : null
      }
      { // 3:"周边人群"，
        +originType === 3 ? (<SurroundPopulation
          lng={+lng}
          lat={+lat}
          cityId={+cityId}
          address={decodeURI(address)}
          isActiveTab
          isFromImageserve
        />) : null
      }
    </div>
  );
};

export default Attachment;
