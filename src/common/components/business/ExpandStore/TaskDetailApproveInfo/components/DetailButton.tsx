/**
 * @Description 拓店任务详情--查看详情按钮
 *    展示标题和右箭头， 比如"去更换>"
 */

import { FC } from 'react';
import IconFont from '@/common/components/IconFont';
import styles from '../index.module.less';
import cs from 'classnames';

const DetailButton: FC<any> = ({
  text,
  onClick,
  className = '',
  textClassName = 'fs-12',
  iconClassName = 'fs-10',
}) => {
  return (
    <div className={cs(styles.detailButton, 'pointer', className)} onClick={() => onClick && onClick()}>
      <span className={cs('c-006', textClassName)}>{text}</span>
      <IconFont iconHref='iconarrow-right' className={cs('c-006', iconClassName)} />
    </div>
  );
};

export default DetailButton;
