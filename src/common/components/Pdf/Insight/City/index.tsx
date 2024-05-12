import { FC, useMemo } from 'react';
import styles from '../entry.module.less';
import ChaptersCover from '../ChaptersCover';
import Basic from './components/Basic';
import Business from './components/Business';
import cs from 'classnames';

const City: FC<any> = ({
  isComplete,
  detailInfo,
  isIntegration
}) => {
  const info = useMemo(() => (detailInfo?.city || {}), [detailInfo]);

  return (
    <div className={styles.cityCon}>
      { !isComplete && <div className={cs(styles.sectionMainCon, isIntegration && styles.integration)}>
        <ChaptersCover
          sectionVal={isComplete ? '02' : ''}
          title='城市市场评估'
          subheadingEn='City evaluate report'/>
      </div>}
      <Basic info={info} isIntegration={isIntegration}/>
      <Business info={info} isIntegration={isIntegration}/>
    </div>
  );
};

export default City;
