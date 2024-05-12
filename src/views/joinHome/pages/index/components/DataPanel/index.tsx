import { FC, } from 'react';
import styles from '../../entry.module.less';
import Funnel from './components/Funnel';
import Map from './components/Map';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import DataOverview from './components/DataOverview';

const DataPanel: FC<any> = ({
  searchParams,
  funnelTitle,
  funnelData
}) => {
  const setCityId = () => {};

  return (
    <div className={styles.dataPanelCon}>
      <div className={styles.contentCon}>
        <TitleTips
          name={`${funnelTitle}门店转换漏斗`}
          showTips={false}
          className={styles.titleTips}/>
        {/* 漏斗 */}
        <Funnel funnelData={funnelData}/>
        {/* 地图 */}
        <Map
          searchParams={searchParams}
          setCityId={setCityId}
        />
        {/* 数据概览 */}
        <DataOverview/>
      </div>
    </div>
  );
};

export default DataPanel;
