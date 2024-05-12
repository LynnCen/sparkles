/**
 * @Description 市场容量（商区围栏）详情 顶部
 */
import { FC } from 'react';
import styles from './index.module.less';
import V2Title from '@/common/components/Feedback/V2Title';
const BusinessDistrictDetail:FC<any> = ({
  detail,
  backList,
  businessDistrictRef
}) => {
  return <div className={styles.BDcontainer} ref={businessDistrictRef || null}>
    <div className={styles.goBack} onClick={() => backList()}>返回商圈列表</div>
    <div className={styles.content}>
      <V2Title divider type='H3'>
        <div className='bold c-222'>{detail.name}</div>
      </V2Title>
      <div className={styles.cards}>
        <div className={styles.card}>
          <span className={styles.label}>市场容量值</span>
          <span className={styles.value}>{detail?.circleCapacity || '-'}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.label}>商圈数</span>
          <span className={styles.value}>{detail?.planClusterNum || '-'}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.label}>容量进度</span>
          <span className={styles.value}>{detail?.planProgress || '-'}</span>
        </div>
      </div>
    </div>
  </div>;
};
export default BusinessDistrictDetail;
