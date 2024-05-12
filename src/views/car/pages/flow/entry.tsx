// 门店客流分析
import { storeFlowList } from '@/common/api/car';
import { FC, useState } from 'react';
import { useTenantType } from '@/common/hook/business/useTenantType';
import Search from './components/Search';
import Table from './components/Table';
import styles from './entry.module.less';
import HeadAlert from '@/common/components/business/HeadAlert';

const Flow: FC<any> = () => {
  // tenantStatus 0:试用企业，1：正式企业； 默认1
  const { tenantStatus } = useTenantType(); // 租户类型
  const [params, setParams] = useState<any>({});
  const onSearch = (values:any) => {
    setParams(values);
  };
  const loadData = async (params) => {
    const result: any = await storeFlowList(params);
    return {
      dataSource: result?.objectList || [],
      count: result?.totalNum || 0,
    };
  };
  return (
    <>
      <HeadAlert/>
      <div className={styles.container}>
        <Search
          onSearch={onSearch}
        />
        <Table
          tenantStatus={tenantStatus}
          params={params}
          loadData={loadData}
        />
      </div>
    </>

  );
};

export default Flow;
