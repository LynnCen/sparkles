import { FC, useMemo } from 'react';
import styles from '../entry.module.less';
import Header from '../Header';
import ChaptersCover from '../ChaptersCover';
import DoubleCircle from '../DoubleCircle';
import Radar from './components/Radar';
import ReceiveScore from './components/ReceiveScore';
import cs from 'classnames';

const Overview: FC<any> = ({
  detailInfo,
  name,
  isIntegration
}) => {

  // const [state, setState] = useState<>();
  const overviewInfo = useMemo(() => (detailInfo?.report || {}), [detailInfo]);

  return (
    <div className={styles.tradingAreaCon}>
      <div className={cs(styles.overviewCon, isIntegration && styles.integration)}>
        <Header name={name}/>
        <ChaptersCover
          sectionVal='01'
          title='商圈评估概览'
          subheadingEn='Business evaluate report'/>
        <DoubleCircle/>
      </div>
      <div className={cs(styles.contentCon, isIntegration && styles.integration)}>
        <Header
          hasIndex
          indexVal='01'
          name='商圈评估概览'/>
        <div className={styles.flexCon}>
          <Radar info={overviewInfo}/>
          <ReceiveScore info={overviewInfo}/>
        </div>
        <DoubleCircle isRight/>
      </div>
    </div>
  );
};

export default Overview;
