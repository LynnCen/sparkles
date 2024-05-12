import { FC, useState } from 'react';
import { demoData } from '@/common/components/Demo/StoreManage/ts-config';
import styles from './entry.module.less';
import AreaOverview from '@/common/components/Demo/StoreManage/AreaOverview';
import ProgressModule from '@/common/components/Demo/StoreManage/ProgressModule';
import StatisticsModule from '@/common/components/Demo/StoreManage/StatisticsModule';
import TableModule from '@/common/components/Demo/StoreManage/TableModule';

const Plan: FC<any> = () => {
  const [taregtData, setTaregtData] = useState<any>(demoData[0]);
  return (
    <div className={styles.container}>
      <AreaOverview demoData={demoData} setTaregtData={setTaregtData}/>
      <ProgressModule/>
      <StatisticsModule isFunnel taregtData={taregtData}/>
      <TableModule/>
    </div>
  );
};

export default Plan;
