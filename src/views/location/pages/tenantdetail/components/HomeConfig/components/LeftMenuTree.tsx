import React from 'react';

import styles from './index.module.less';
interface LeftMenuTreeProps {

}
const LeftMenuTree: React.FC<LeftMenuTreeProps> = () => {
  return <aside className={styles.leftMenuTreeProps}>
    left
  </aside>;
};

export default LeftMenuTree;
