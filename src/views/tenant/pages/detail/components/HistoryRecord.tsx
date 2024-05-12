import { useTable } from '@lhb/hook';
import { Table, Button } from 'antd';
import { FC, useState } from 'react';
import { historyRecordStore } from '../../../store';
import styles from '../components/index.module.less';

const { getList } = historyRecordStore;

interface HistoryRecordProps {
  tenantId: number
}


const HistoryRecord: FC<HistoryRecordProps> = ({ tenantId }) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const getListByTenantId = async (current: number, pageSize: number) => {
    if (!tenantId) {
      return;
    }
    return getList(tenantId, { page: current, size: pageSize });
  };

  const [searchParams] = useState<any>({});
  const [{ loading, pagination }, result] = useTable(getListByTenantId, searchParams);
  const { objectList: tableData } = result;

  const onExpandedRowsChange = (expandedRowKeys: any) => {
    setExpandedRowKeys(expandedRowKeys);
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      align: 'center',

    },
    {
      title: '操作类型',
      dataIndex: 'category',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render(_: any, record: any) {
        const { id } = record;
        const onClick = () => {
          // @ts-ignore
          onExpandedRowsChange([...expandedRowKeys, id]);
        };

        return (
          <Button
            onClick={onClick}
            type='link'>
              查看操作内容
          </Button>
        );
      }
    }
  ];

  const expandedColumns = [
    {
      dataIndex: 'field',
      title: '变更项',
      align: 'center',
    },
    {
      dataIndex: 'original',
      title: '原内容',
      align: 'center',
    },
    {
      dataIndex: 'current',
      title: '新内容',
      align: 'center',
    },
  ];

  const expandedRowRender = (record) => {
    const { content } = record;
    const newConteent = content.map((item, index: number) => ({ ...item, id: index }));
    return <Table
      className={styles.filterTable}
      columns={expandedColumns as any}
      dataSource={newConteent}
      rowKey='id'
      pagination={false} />;
  };

  return (
    <Table
      dataSource={tableData}
      rowKey='id'
      loading={loading}
      expandable={{
        expandedRowRender,
        expandedRowKeys,
        onExpandedRowsChange,
      }}
      columns={columns as any}
      pagination={pagination}/>
  );
};

export default HistoryRecord;
