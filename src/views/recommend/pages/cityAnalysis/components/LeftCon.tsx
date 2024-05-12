/**
 * @Description 城市分析地图左侧内容
 */
import V2Tabs from '@/common/components/Data/V2Tabs';
import styles from './index.module.less';
import { useState } from 'react';
import { tabOptions } from '../ts-config';
import CityOverview from './CityOverview';
import DistrictOverview from './DistrictOverview';

const LeftCon = ({ cityId }: any) => {
  /* status */
  const [tabActive, setTabActive] = useState('1');

  /* methods */
  const tabChange = (val: string) => {
    setTabActive(val);
  };

  return (
    <div className={styles.leftContainer}>
      <V2Tabs className={styles.tabContent} items={tabOptions} activeKey={tabActive} onChange={tabChange} />
      { tabActive === '1' && <CityOverview cityId={cityId} /> }
      { tabActive === '2' && <DistrictOverview cityId={cityId} />}
    </div>
  );
};

export default LeftCon;
