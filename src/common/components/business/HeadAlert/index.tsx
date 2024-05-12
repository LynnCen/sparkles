/**
 * @Description 页面头部显示的提示语
 */
import { FC } from 'react';
import { Alert } from 'antd';
import cs from 'classnames';
import styles from './index.module.less';

const HeadAlert: FC<any> = ({
  type = 'warning',
  message = '温馨提示：以下数据为演示数据，仅供试用参考',
  showIcon = true,
  closable = true,
  className = {}
}) => {
  return (<Alert
    message={message}
    type={type as any}
    showIcon={showIcon}
    closable={closable}
    className={cs(styles.headAlert, className)}
  />);
};

export default HeadAlert;
