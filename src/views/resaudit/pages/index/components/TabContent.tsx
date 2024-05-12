import { auditList } from '@/common/api/audit';
import { useMethods } from '@lhb/hook';
import { FC } from 'react';
import AuditTable from './AuditTable';
import { ResourceApprovalType } from '.././ts-config';

const TabContent: FC<any> = ({ resourceType, status, params, onChangeWaitCount }) => {
  const { loadData } = useMethods({
    loadData: async (params: any) => {
      const result = await auditList(params);
      status === ResourceApprovalType.WAIT && onChangeWaitCount(result.totalNum);
      return {
        dataSource: result.objectList,
        count: result.totalNum,
      };
    },
  });

  return (
    <AuditTable loadData={loadData} resourceType={resourceType} status={status} params={params} />
  );
};

export default TabContent;
