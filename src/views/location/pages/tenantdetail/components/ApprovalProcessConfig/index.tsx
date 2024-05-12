/**
 * @Description 审批流程相关配置
 */

import V2Container from '@/common/components/Data/V2Container';
import V2Table from '@/common/components/Data/V2Table';
import V2Operate from '@/common/components/Others/V2Operate';
import { FC, useState } from 'react';
import { isNotEmptyAny, refactorPermissions } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import { getApprovalProceeTemplate } from '@/common/api/location';
import EditModal from './components/EditModal';
import { dispatchNavigate } from '@/common/document-event/dispatch';

interface Props {
  /** 租户ID */
  tenantId:string | number;
  mainHeight: number;
}

const ApprovalProcessConfig: FC<Props> = ({
  tenantId,
  mainHeight,
}) => {
  const isDemo = location.pathname.includes('flowEngine'); // 是否是demo页面
  const [innerMainHeight, setInnerMainHeight] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [record, setRecord] = useState<any>();
  const [filters, setFilters] = useState<any>();

  const methods = useMethods({
    handleEdit(record) {
      setRecord(record); // 保存当前操作的值
      setShowModal(true);
      return;
    },
    handleEditFlow(record:any) {

      const params = {
        appId: 1,
        tenantId,
        id: record.approvalFlowId,
        isDemo,
      };
      dispatchNavigate(`/flowEngine/edit?params=${decodeURI(JSON.stringify(params))}`);
    },
  });


  const loadData = async() => {
    const data = await getApprovalProceeTemplate({ tenantId });
    return {
      dataSource: data,
      count: data.length,
    };
  };

  const defaultColumns = [
    { key: 'name', title: '流程名称', dragChecked: true },
    { key: 'aliaName', title: '流程别名', dragChecked: true },
    { key: 'enable',
      title: '是否启用',
      dragChecked: true,
      width: 50,
      render: (value) => (value ? '是' : '否')
    },
    { key: 'approvalFlowId', title: '对应流程ID', dragChecked: true,
      render: (value) => (isNotEmptyAny(value) ? value : '-') },
    { key: 'updatedAt', title: '最近修改时间', dragChecked: true,
      render: (value) => (isNotEmptyAny(value) ? value : '-') },
    { key: 'updatedBy', title: '修改人', dragChecked: true,
      render: (value) => (isNotEmptyAny(value) ? value : '-') },
    { key: 'reason', title: '修改原因', width: 'auto', whiteTooltip: true, dragChecked: true,
      render: (value) => (isNotEmptyAny(value) ? value : '-') },
    {
      title: '操作',
      key: 'permissions',
      width: 220,
      dragChecked: true,
      fixed: 'right',
      render: (_, record) => {
        const operateList:any[] = [
          { event: 'edit', name: '编辑' },
        ];
        if (record.approvalFlowId) {
          operateList.push({ event: 'editFlow', name: '编辑审批流' });
        }

        return <V2Operate
          operateList={refactorPermissions(operateList)}
          onClick={(btn: any) => methods[btn.func](record)}
        />;
      }

    },
  ];

  return (
    <div>
      <V2Container
        style={{ height: mainHeight }}
        emitMainHeight={(h) => setInnerMainHeight(h)}
      >
        <V2Table
          defaultColumns={defaultColumns}
          filters={filters}
          onFetch={loadData}
          hideColumnPlaceholder
          pagination={false}
          scroll={{ y: innerMainHeight - 55 }}
        />
      </V2Container>

      <EditModal
        tenantId={tenantId}
        showModal={showModal}
        setShowModal={setShowModal}
        refresh={() => setFilters({})} // 更新列表
        record={record}/>
    </div>
  );
};

export default ApprovalProcessConfig;
