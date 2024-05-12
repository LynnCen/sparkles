import { FC } from 'react';
import { Space } from 'antd';
import styles from './index.module.less';

const ContainerHeader: FC<any> = ({ title, className }) => {

  return (
    <div className={className}>
      <Space className={styles['container-header']}>
        <span className={styles['icon-line']}></span>
        <span className='title'>{title}</span>
      </Space>
    </div>
  );
};

export default ContainerHeader;
