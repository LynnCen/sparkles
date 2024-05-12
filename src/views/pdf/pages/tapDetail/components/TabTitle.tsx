import { FC } from 'react';
import styles from './index.module.less';

const TabTitle:FC<any> = ({ name }) => {
  return (
    <div className={styles.tabTitle}>{ name }</div>
  );
};

export default TabTitle;
