import { FC } from 'react';
import { urlParams } from '@lhb/func';
import styles from './entry.module.less';
import Detail from '../demandManagement/components/Detail';

const DemandManagementDetail: FC<any> = () => {
  const id: number| string = urlParams(location.search)?.id;


  return (<div className={styles.demandManagementDetail}>
    <Detail data={{ id }} />
  </div>);
};

export default DemandManagementDetail;
