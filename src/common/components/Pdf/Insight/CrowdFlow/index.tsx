import {
  FC,
  // useEffect,
  useMemo
} from 'react';
import { showTargetChart } from '@/common/utils/ways';
import styles from '../entry.module.less';
import Header from '../Header';
import ChaptersCover from '../ChaptersCover';
import DoubleCircle from '../DoubleCircle';
import Overview from './components/Overview';
import Person from './components/Person';
import AverageDaily from './components/AverageDaily';
import WorkdayAverageDaily from './components/WorkdayAverageDaily';
import HolidayAverageDaily from './components/HolidayAverageDaily';
import cs from 'classnames';

const CrowdFlow: FC<any> = ({
  detailInfo,
  name,
  isIntegration
}) => {
  const info = useMemo(() => (detailInfo.preference || {}), [detailInfo]);
  const personData = useMemo(() => (info.person || []), [info]);

  // 人口占比
  const showPerson = useMemo(() => {
    return showTargetChart(personData);
  }, [personData]);

  return (
    <div className={styles.crowdFlowCon}>
      <div className={cs(styles.sectionMainCon, isIntegration && styles.integration)}>
        <Header name={name}/>
        <ChaptersCover
          sectionVal='04'
          title='客群客流评估'
          subheadingEn='Passenger flow report'/>
        <DoubleCircle/>
      </div>
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
