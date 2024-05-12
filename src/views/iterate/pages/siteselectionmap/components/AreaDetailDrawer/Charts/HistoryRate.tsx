/**
 * @Description 历史各业态门店存续比例分布
 */
import cs from 'classnames';
import styles from './index.module.less';
import { floorKeep, isArray } from '@lhb/func';
import { useMemo, useState } from 'react';
const Stock = '1';
const History = '2';
const tabItems = [
  { key: Stock, label: '存量' },
  { key: History, label: '历史' }];
const HistoryRate = ({
  list,
  historyList,
}) => {
  const [tabActiveKey, setTabActiveKey] = useState<string>('1');

  const showList = useMemo(() => {
    const data = tabActiveKey === '1' ? list : historyList;
    return isArray(data) ? data : [];
  }, [tabActiveKey]);

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
    <div className={cs(styles.chartWrapper, styles.historyChartWrap, 'pd-16')}>
      <div className={styles.chartTitleRow}>
        <span className='fs-14 c-222 bold'>各业态门店存续比例分布</span>
        <div className={styles.tabs}>
          {
            tabItems.map((item, index: number) => <span
              key={index}
              className={cs(styles.card, tabActiveKey === item.key ? styles.active : '')}
              onClick={() => { setTabActiveKey(item.key); }}
            >
              {item.label}
            </span>)
          }
        </div>
      </div>
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
          { showList.map((item: any, index: number) => (
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
    </div>
  );
};

export default HistoryRate;
