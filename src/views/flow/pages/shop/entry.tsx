import { FC, useState } from 'react';
import { useMethods } from '@lhb/hook';
// import { dispatchNavigate } from '@/common/document-event/dispatch';
import { storeList } from '@/common/api/flow';
import styles from './entry.module.less';
import Search from './components/Search';
import Table from './components/Table';
import { KeepAlive } from 'react-activation';

const Manage: FC<any> = () => {
  const [searchParams, setSearchParams] = useState<any>({
    name: '',
    tenantName: '', // 租户简称
    source: '', // 摄像头类型
    deviceStatus: '', // 摄像头状态
    status: '' // 营业状态
  });

  // methods
  const { loadData, searchChange } = useMethods({
    loadData: async (params: any) => {
      const searchObj = { ...searchParams, ...params };
      const { objectList, totalNum } = await storeList(searchObj);
      return {
        dataSource: objectList || [],
        count: totalNum,
      };
    },
    searchChange: (fieldsValue: Record<string, any>) => {
      const { name, tenantName, source, deviceStatus, status } = fieldsValue || {};
      const params: any = {
        name,
        tenantName, // 简称
        source, // 摄像头类型
        deviceStatus, // 摄像头状态
        status // 营业状态
      };
      setSearchParams(params);
    },
  });

  // const jumpDetail = () => {
  //   dispatchNavigate('/flow/detail?id=1');
  // };

  return (
    <KeepAlive saveScrollPosition>
      <div className={styles.container}>
        <Search change={searchChange}/>
        <Table
          searchParams={searchParams}
          loadData={loadData}/>
      </div>
    </KeepAlive>
  );
};

export default Manage;
