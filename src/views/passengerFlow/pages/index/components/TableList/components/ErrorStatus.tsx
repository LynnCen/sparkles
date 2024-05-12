import { FC } from 'react';
import styles from '../../../entry.module.less';
import IconFont from '@/common/components/IconFont';
import cs from 'classnames';
const ErrorStatus: FC<any> = ({ item }) => {
  let csName = '';
  if (!item.deviceStatus) {
    csName = styles.statusUnBinding;
  } else if (item.deviceStatus === 2 || item.deviceStatus === 3) {
    csName = styles.statusOffLine;
  }
  return <span className={cs(styles.statusCommon, csName)}>
    {
      item.deviceStatus !== 1 && <IconFont iconHref='icon-warning_o' style={{ marginRight: '5px' }}/>
    }
    {item.deviceStatus === 1 ? <><span className={styles.statusOnLine}/>在线</> : item.deviceStatusName}
  </span>;
};

export default ErrorStatus;
