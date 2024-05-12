import { FC, useMemo } from 'react';
import styles from '../entry.module.less';
import Header from '../Header';
import ChaptersCover from '../ChaptersCover';
import DoubleCircle from '../DoubleCircle';
import Basic from './components/Basic';
import Business from './components/Business';
import cs from 'classnames';

const City: FC<any> = ({
  isComplete,
  name,
  detailInfo,
  isIntegration
}) => {
  const info = useMemo(() => (detailInfo.city || {}), [detailInfo]);

  return (
    <div className={styles.cityCon}>
      <div className={cs(styles.sectionMainCon, isIntegration && styles.integration)}>
        <Header name={name}/>
        <ChaptersCover
          sectionVal={isComplete ? '02' : ''}
          title='城市市场评估'
          subheadingEn='City evaluate report'/>
        <DoubleCircle/>
      </div>
      <Basic info={info} isIntegration={isIntegration}/>
      <Business info={info} isIntegration={isIntegration}/>
    </div>
  );
};

export default City;
