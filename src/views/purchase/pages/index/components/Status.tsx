import { Space } from 'antd';
import { FC } from 'react';
import cs from 'classnames';
import styles from './status.module.less';

interface StatusProps {
  type: 'success' | 'error' | 'warning' | 'default' | 'processing',
  children?: string;
};

const Status: FC<StatusProps> = ({ type = 'default', children }) => {
  const className = cs(styles.status, styles[`status-${type}`]);
  return (
    <Space>
      <div className={className}>
      </div>
      {children}
    </Space>
  );
};

export default Status;
