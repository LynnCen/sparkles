import { FC } from 'react';
import cs from 'classnames';
import styles from './entry.module.less';

const DoubleCircle: FC<any> = ({
  isRight = false
}) => {

  return (
    <div className={cs(styles.doubleCircleCon, isRight ? styles.isRight : '')}>
      <div className={styles.blueCircle}></div>
      <div className={styles.cyanCircle}></div>
    </div>
  );
};

export default DoubleCircle;
