import { FC, useEffect, useState } from 'react';
import styles from '../../entry.module.less';
import Funnel from './components/Funnel';
import Map from './components/Map';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import DataOverview from './components/DataOverview';
import { get } from '@/common/request';

const DataPanel: FC<any> = ({ searchParams, funnelData }) => {
  const setCityId = () => {};

  const [nationalDate, setNationalDate] = useState<any>({});
  const loadNationalData = async () => {
    // https://yapi.lanhanba.com/project/497/interface/api/51477
    const result: any = await get(
      '/yn/franchisee/home/data',
      {},
      {
        isMock: false,
        mockId: 497,
        mockSuffix: '/api',
        isZeus: true
      }
    );
    setNationalDate(result);
  };

  useEffect(() => {
    loadNationalData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.dataPanelCon}>
      <div className={styles.contentCon}>
        <TitleTips name={'全国开发转化漏斗'} showTips={false} className={styles.titleTips} />
        {/* 漏斗 */}
        <Funnel funnelData={funnelData} />
        {/* 地图 */}
        <Map searchParams={searchParams} setCityId={setCityId} nationalDate={nationalDate}/>
        {/* 数据概览 */}
        <DataOverview nationalDate={nationalDate}/>
      </div>
    </div>
  );
};

export default DataPanel;
