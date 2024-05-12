/**
 * @Description 存量门店存续比例分布
 */

import { FC } from 'react';
import { CardLayout } from '../Layout';
import styles from './index.module.less';
import { floorKeep } from '@lhb/func';

interface StockBusinessProps{
  [k:string]:any
}
const StockBusiness: FC<StockBusinessProps> = ({
  detail,
}) => {

  const rateColor = (val) => {
    switch (true) {
      case val <= 0.2:
        return '#D2E4FD';
      case val <= 0.4:
        return '#A8CDFF';
      case val <= 0.6:
        return '#7AB2FF';
      case val <= 0.8:
        return '#579EFF';
      default:
        return '#358AFF';
    }
  };
  return (
    <CardLayout title='存量门店存续比例分布'>
      <div className={styles.rateContent}>
        <div className={styles.rateHeader}>
          <div className={styles.headerItem}>门店数</div>
          <div className={styles.headerItem}>1年</div>
          <div className={styles.headerItem}>2年</div>
          <div className={styles.headerItem}>3年</div>
          <div className={styles.headerItem}>4年</div>
          <div className={styles.headerItem}>4年以上</div>
        </div>
        <div className={styles.rateItemWrap}>
          { detail.map((item: any, index: number) => (
            <div key={index} className={styles.rateItemList}>
              <div className={styles.itemLeft}>{ item.categoryName }</div>
              <div className={styles.itemRight}>
                <div className={styles.rateItem}>{ item.poiNum }</div>
                <div className={styles.rateItem} style={{ backgroundColor: rateColor(item.oneYearRate) }}>{ floorKeep(item.oneYearRate, 100, 3, 1) }%</div>
                <div className={styles.rateItem} style={{ backgroundColor: rateColor(item.twoYearRate) }}>{ floorKeep(item.twoYearRate, 100, 3, 1) }%</div>
                <div className={styles.rateItem} style={{ backgroundColor: rateColor(item.threeYearRate) }}>{ floorKeep(item.threeYearRate, 100, 3, 1) }%</div>
                <div className={styles.rateItem} style={{ backgroundColor: rateColor(item.fourYearRate) }}>{ floorKeep(item.fourYearRate, 100, 3, 1) }%</div>
                <div className={styles.rateItem} style={{ backgroundColor: rateColor(item.fiveYearRate) }}>{ floorKeep(item.fiveYearRate, 100, 3, 1) }%</div>
              </div>
            </div>
          )) }
        </div>
      </div>
    </CardLayout>

  );
};

export default StockBusiness;
