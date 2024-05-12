import { FC } from 'react';
import styles from './index.module.less';

const TopTitle: FC<any> = ({
  children,
  number
}) => {
  return (
    <div className={styles.topTitle}>
      <div className={styles.topTitleText}>
        {children}
      </div>
      <div className={styles.topTitleNumber}>{number}</div>
    </div>
  );
};

export default TopTitle;
