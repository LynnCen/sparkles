/**
 * @Description 周边详情各tab主内容
 */

import { FC } from 'react';
import styles from '../index.module.less';

const Main: FC<any> = ({
  children,
  mainHeight
}) => {
  return (
    <div className={styles.contents} style={{
      height: `${mainHeight}px` || 'auto'
    }}>
      {children}
    </div>
  );
};

export default Main;
