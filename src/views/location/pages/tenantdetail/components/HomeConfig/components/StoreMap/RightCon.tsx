/**
 * @Description
 */
import { FC } from 'react';
import styles from './index.module.less';
import cs from 'classnames';
import V2Table from '@/common/components/Data/V2Table';
const RightCon:FC<any> = () => {
  const defaultColumns = [
    { key: 'rank', title: '排名', dragChecked: true, width: 100 },
    { key: 'province', title: '省份名称', dragChecked: true, width: 100 },
    { key: 'total', title: '门店数', dragChecked: true, width: 100 },
    { key: 'rate', title: '占比', dragChecked: true, width: 100 },
  ];
  const loadData = () => {
    const data = Array.from({ length: 30 }).map((_, index) => ({
      rank: index + 1,
      province: `省份${index}`,
      total: index,
      rate: index,
    }));
    return {
      dataSource: data,
      count: data.length,
    };
  };
  return <div className={styles.right}>
    <div className={styles.top}>
      <div className={styles.storeCard}>
        <span className='fs-20 bold pb-8'>1928</span>
        <span className='c-666'>在营门店数</span>
      </div>
      <div className={styles.storeCard}>
        <span className='fs-20 bold pb-8'>124</span>
        <span className='c-666'>覆盖城市</span>
      </div>
      <div className={styles.storeCard}>
        <span className='fs-20 bold pb-8'>32</span>
        <span className='c-666'>覆盖省份</span>
      </div>
    </div>
    <div className={styles.bottom}>
      <div className={styles.title}>排名</div>
      <div className={styles.btn}>
        <span className={cs(styles.active, styles.btnCard)}>省份</span>
        <span className={styles.btnCard}>城市等级</span>
      </div>
      <V2Table
        rowKey='name'
        scroll={{ y: 384 }}
        defaultColumns={defaultColumns}
        className={styles.table}
        pagination={false}
        hideColumnPlaceholder
        onFetch={loadData}
      />
    </div>
  </div>;
};
export default RightCon;
