import { FC } from 'react';
import cs from 'classnames';
import styles from './entry.module.less';

interface DoubleCircleProps{
  /**
   * @description 布局
   * @default horizontal
   * @enum horizontal 横向, vertical 纵向
   */
  layout?: 'horizontal' | 'vertical';
}

const DoubleCircle: FC<DoubleCircleProps> = ({
  layout = 'horizontal'
}) => {

  return (
    <div className={cs(styles.doubleCircleCon, layout && styles[layout])}>
      <div className={styles.cyanCircle}></div>
      <div className={styles.blueCircle}></div>
    </div>
  );
};

export default DoubleCircle;
