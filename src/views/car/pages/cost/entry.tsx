// 门店客流成本分析
import { storeCostList } from '@/common/api/car';
import {
  FC,
  useState,
} from 'react';
import { useTenantType } from '@/common/hook/business/useTenantType';
import styles from './entry.module.less';
import Search from './components/Search';
import Table from './components/Table';
import HeadAlert from '@/common/components/business/HeadAlert';

const Cost: FC<any> = () => {
  const [params, setParams] = useState<any>({});
  // tenantStatus 0:试用企业，1：正式企业； 默认1
  const { tenantStatus } = useTenantType(); // 租户类型
  const onSearch = (values:any) => {
    setParams(values);
  };
  const loadData = async (params) => {
    const result: any = await storeCostList(params);
    return {
      dataSource: result?.objectList || [],
      count: result?.totalNum || 0,
    };
  };
  return (
    <>
      <HeadAlert />
      <div className={styles.container}>
        <Search
          onSearch={onSearch}
        />
        <Table
          params={params}
          tenantStatus={tenantStatus}
          loadData={loadData}
        />
      </div>
    </>
  );
};

export default Cost;
