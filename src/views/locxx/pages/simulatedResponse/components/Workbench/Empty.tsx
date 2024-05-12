import { FC } from 'react';

import styles from './index.module.less';
import IconFont from 'src/common/components/Base/IconFont/index';

const Empty:FC<{ add: Function, text?: string }> = ({ add, text = '暂无数据~' }) => {
  return <div className={styles.empty} onClick={() => add instanceof Function && add()}>
    <IconFont iconHref='icon-ic_add' className={styles.emptyAddIcon} />{text}
  </div>;
};
export default Empty;
