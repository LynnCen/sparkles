import React, { FC } from 'react';
import styles from './index.module.less';

export interface TitleProps {
  /**
   * @description 样式
   */
  style?: React.CSSProperties;
  children?: any; // 类似vue的slot
}

const DetailTitle: FC<TitleProps> = ({
  children,
  style
}) => {
  return (
    <div className={styles.title} style={style}>
      {children}
      <i className={styles.leftBorder}></i>
    </div>
  );
};

export default DetailTitle;
