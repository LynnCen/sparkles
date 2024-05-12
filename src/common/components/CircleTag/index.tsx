/**
 * @Description  圆点类型标签
 */
import { FC } from 'react';
import styles from './index.module.less';
import cs from 'classnames';

export type CircleTagPros = {
  name: string; // 标签名称
  color: string; // 圆点颜色
  className?: any;
}

const CircleTag: FC<CircleTagPros> = ({ name, color, className, ...props }) => {
  return (
    <div className={cs(styles.circleTag, className)} { ...props }>
      <div className={styles.circleTagDot} style={{ backgroundColor: color }} />
      { name }
    </div>
  );
};

export default CircleTag;
