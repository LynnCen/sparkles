import AppList from './components/AppList';
import { getAppList } from '@/common/api/app';
import { AppListResult } from './ts-config';
import { KeepAlive } from 'react-activation';

import styles from './entry.module.less';

const ApplicationIndex = () => {
  const loadData = async (params: any) => {
    const result: AppListResult[] = await getAppList(params);
    return { dataSource: result || [] };
  };

  return (
    <KeepAlive saveScrollPosition>
      <div className={styles.container}>
        <AppList loadData={loadData} />
      </div>
    </KeepAlive>
  );
};

export default ApplicationIndex;
