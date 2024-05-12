import { Divider } from 'antd';
import cs from 'classnames';
import React, { FC } from 'react';
import styles from './index.module.less';

interface ModuleInfoWrapperProps {
  theme?: 'default' | 'dark';
  className?: string;
  title: string;
  children?: React.ReactNode;
  hasDivider?: boolean;
}
const ModuleInfoWrapper: FC<ModuleInfoWrapperProps> = ({
  theme = 'default',
  title,
  children,
  hasDivider = false
}) => {


  return (
    <div className={cs('mb-20', styles['module-info-wrapper'])}>
      <div className={cs('fs-16', styles[`title-${theme}`])}>
        { title }
      </div>
      {children}
      {
        hasDivider && <Divider style={{ borderColor: '#EEE' }}/>
      }
    </div>
  );
};

export default ModuleInfoWrapper;
