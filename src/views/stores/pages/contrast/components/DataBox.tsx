import React from 'react';
import { Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import cs from 'classnames';
import { DataBoxProps } from '../ts-config';
import styles from './index.module.less';

const DataBox: React.FC<DataBoxProps> = ({ title = '', tip = '', className, children }) => {
  return (
    <div className={cs(styles.dataBox, className)}>
      <div className={styles.topBar}>
        <span className={styles.title}>{title}</span>
        {tip && (
          <Tooltip placement='bottom' title={tip}>
            <ExclamationCircleOutlined />
          </Tooltip>
        )}
      </div>
      {children}
    </div>
  );
};

export default DataBox;
