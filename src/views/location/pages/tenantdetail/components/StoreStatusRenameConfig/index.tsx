/**
 * @Description  状态重命名
 */

import V2Container from '@/common/components/Data/V2Container';
import { getStatusRenameConfigList } from '@/common/api/location';
import V2Table from '@/common/components/Data/V2Table';
import { FC, useState } from 'react';
import RenameModal from './components/RenameModal';
import V2Operate from '@/common/components/Others/V2Operate';
import { useMethods } from '@lhb/hook';
import { refactorPermissions } from '@lhb/func';
import { enumTab } from '../../ts-config';

interface Props {
  // 在这里定义组件的属性（props）
  // 例如：title: string;
  tenantId:string | number; //
  mainHeight: number;
}

const StoreStatusRenameConfig: FC<Props> = ({
  tenantId,
  mainHeight,
}) => {
  const [innerMainHeight, setInnerMainHeight] = useState<number>(0);
  const [filters, setFilters] = useState<any>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [record, setRecord] = useState<any>();


  const methods = useMethods({
    handleEdit(record) {
      setRecord(record); // 保存当前操作的值
      setShowModal(true);
      return;
    },
  });

  const defaultColumns = [{
    key: 'status', title: '状态编号', width: 80, dragChecked: true
  },
  {
    key: 'name', title: '默认状态名称', dragChecked: true
  },
  {
    key: 'alias', title: '重命名', dragChecked: true
  },
  {
    title: '操作',
    key: 'permissions',
    width: 220,
    dragChecked: true,
    fixed: 'right',
    render: (_, record) => {
      const operateList:any[] = [
        { event: 'edit', name: '重命名' },
      ];
      return <V2Operate
        operateList={refactorPermissions(operateList)}
        onClick={(btn: any) => methods[btn.func](record)}
      />;
    }

  },
  ];

  const loadData = async() => {
    const data = await getStatusRenameConfigList({ tenantId });

    return {
      dataSource: data,
      count: data.length,
    };
  };

  // 在这里编写组件的逻辑和渲染
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
      <RenameModal
        tenantId={tenantId}
        record={record}
        showModal={showModal}
        setShowModal={setShowModal}
        refresh={() => setFilters({})}
        type={enumTab.STORE_STATUS_RENAME_CONFIG} />
    </div>
  );
};

export default StoreStatusRenameConfig;
