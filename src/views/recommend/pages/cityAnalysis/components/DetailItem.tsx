/**
 * @Description 城市分析Item项
 */
import styles from './index.module.less';

const DetailItem = ({ title, value }) => {
  return (
    <div className={styles.detailItem}>
      <div className={styles.label}>{ title }：</div>
      <div className={styles.value}>{ value || '-' }</div>
    </div>
  );
};

export default DetailItem;
