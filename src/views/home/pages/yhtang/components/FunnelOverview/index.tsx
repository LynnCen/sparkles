/**
 * @Description 漏斗概览部分
 */
import { FC, useEffect, useState } from 'react';
import { Divider } from 'antd';
import {
  funnelOverview,
  annualObjectives
} from '@/common/api/yhtang';
import cs from 'classnames';
import styles from './index.module.less';
import LeftFunnel from './LeftFunnel';
import RightRing from './RightRing';

const FunnelOverview: FC<any> = ({
  searchParams
}) => {
  const [funnelData, setFunnelData] = useState<any[]>([]); // 网规漏斗
  const [ringData, setRingData] = useState<any>(null); // 年度目标数据

  useEffect(() => {
    const { start, end } = searchParams;
    if (!(start && end)) return;
    loadData();
  }, [searchParams]);

  const loadData = () => {
    // 网规漏斗
    funnelOverview(searchParams).then((data) => {
      const {
        allRecommendCount,
        parentRecommendCount,
        branchRecommendCount,
        targetRecommendCount,
        thisYearTargetCount
      } = data;
      // 确保顺序
      setFunnelData([
        {
          ...allRecommendCount,
          opacity: 0.5
        },
        {
          ...parentRecommendCount,
          width: '354px',
          opacity: 0.63,
          valMarginRight: '84px'
        },
        {
          ...branchRecommendCount,
          width: '309px',
          opacity: 0.74,
          valMarginRight: '61px'
        },
        {
          ...targetRecommendCount,
          width: '265px',
          opacity: 0.85,
          valMarginRight: '39px'
        },
        {
          ...thisYearTargetCount,
          width: '222px',
          opacity: 1,
          valMarginRight: '18px'
        }
      ]);
    });
    // 年度目标
    annualObjectives(searchParams).then((data) => {
      const {
        targetCount,
        thisYearTargetCount,
        nextYearTargetCount,
        theYearAfterNextTargetCount
      } = data;
      setRingData({
        targetCount,
        data: [
          { name: thisYearTargetCount.name, value: thisYearTargetCount.result },
          { name: nextYearTargetCount.name, value: nextYearTargetCount.result },
          { name: theYearAfterNextTargetCount.name, value: theYearAfterNextTargetCount.result },
        ]
      });
    });
  };
  return (
    <div className={cs(styles.overviewCon, 'mt-12')}>
      <div className='fs-16 c-222 bold'>
        网规漏斗
      </div>
      <Divider style={{ background: '#eee', margin: '16px 0 20px 0' }}/>
      <div className={styles.flexCon}>
        <LeftFunnel data={funnelData}/>
        <RightRing data={ringData}/>
      </div>
    </div>
  );
};

export default FunnelOverview;
