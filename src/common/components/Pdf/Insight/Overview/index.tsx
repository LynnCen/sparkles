import { FC, useMemo } from 'react';
import styles from '../entry.module.less';
import Header from '../Header';
import ChaptersCover from '../ChaptersCover';
import DoubleCircle from '../DoubleCircle';
import Radar from './components/Radar';
import ReceiveScore from './components/ReceiveScore';
import cs from 'classnames';
import Catalog from '../Catalog';

const Overview: FC<any> = ({
  name,
  detailInfo,
  isIntegration
}) => {

  const overviewInfo = useMemo(() => (detailInfo?.report || {}), [detailInfo]);

  return (
    <div className={styles.tradingAreaCon}>
      <div className={cs(styles.overviewCon, isIntegration && styles.integration)}>
        <ChaptersCover
          sectionVal='03'
          title='周边分析'
          subheadingEn='Perimeter analysis '/>
      </div>
      <Catalog detailInfo={detailInfo} name={name} />
      <div className={cs(styles.contentCon, isIntegration && styles.integration)}>
        <Header
          hasIndex
          indexVal='01'
          name='商圈评估概览'/>
        <div className={styles.flexCon}>
          <Radar info={overviewInfo}/>
          <ReceiveScore info={overviewInfo}/>
        </div>
        <div className={styles.footer}>
          <DoubleCircle layout='vertical'/>
        </div>
      </div>
    </div>
  );
};

export default Overview;
