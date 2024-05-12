import {
  FC,
  // useEffect,
  useMemo
} from 'react';
import { showTargetChart } from '@/common/utils/ways';
import styles from '../entry.module.less';
import Overview from './components/Overview';
import Person from './components/Person';
import AverageDaily from './components/AverageDaily';
import WorkdayAverageDaily from './components/WorkdayAverageDaily';
import HolidayAverageDaily from './components/HolidayAverageDaily';
import Catalog from '../Catalog';

const CrowdFlow: FC<any> = ({
  detailInfo,
  name,
  isIntegration
}) => {
  const info = useMemo(() => (detailInfo?.preference || {}), [detailInfo]);
  const personData = useMemo(() => (info.person || []), [info]);

  // 人口占比
  const showPerson = useMemo(() => {
    return showTargetChart(personData);
  }, [personData]);

  return (
    <div className={styles.crowdFlowCon}>
      <Catalog detailInfo={detailInfo} name={name} pageIndex={4}/>
      <Overview info={info} isIntegration={isIntegration}/>
      { showPerson ? <Person
        person={personData}
        showPerson={showPerson}
        isIntegration={isIntegration}/>
        : null }
      {/* 日均 */}
      <AverageDaily info={info} isIntegration={isIntegration}/>
      {/* 工作日日均 */}
      <WorkdayAverageDaily info={info} isIntegration={isIntegration}/>
      {/* 节假日日均 */}
      <HolidayAverageDaily info={info} isIntegration={isIntegration}/>
    </div>
  );
};

export default CrowdFlow;
