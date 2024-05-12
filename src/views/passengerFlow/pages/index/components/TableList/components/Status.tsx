import { FC } from 'react';
import styles from '../../../entry.module.less';
import cs from 'classnames';
import IconFont from '@/common/components/IconFont';
const Status: FC<any> = ({ item }) => {
  const csName = styles[`status${item.status}`];
  return <div className={styles.statusOuter}>
    <IconFont className={cs(styles.status, csName)} iconHref='icon-a-bianzu131' />{item.statusName}
  </div>;
};

export default Status;
