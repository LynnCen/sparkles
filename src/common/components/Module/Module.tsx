/**
 * 模块
 */
import React from 'react';
import { ModuleProps } from './ts-config';

import styles from './index.module.less';

const Module: React.FC<ModuleProps> = ({ title, titleRight, children, style }) => {
  return (
    <div className={styles.module} style={style}>
      <div className={styles['module-header']}>
        <span className={styles['module-header__left']}>
          {title}
        </span>
        <span>
          {titleRight}
        </span>
      </div>
      <div className={styles['module-content']}>
        {children}
      </div>
    </div>
  );
};

export default Module;
