import { getSalseOrderRecoder } from '@/common/api/sales';
import { useSearchForm } from '@/common/hook';
import { Table, Button } from 'antd';
import { FC, useState } from 'react';
import styles from './index.module.less';

interface RecordProps {
  id?: number
}


const Record: FC<RecordProps> = ({ id }) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const [tableProps] = useSearchForm(getSalseOrderRecoder, () => {
    return {
      id
    };
  });


  const onExpandedRowsChange = (expandedRowKeys: any) => {
    setExpandedRowKeys(expandedRowKeys);
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'creator',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
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
      dataIndex: 'origin',
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
      rowKey='id'
      {...tableProps}
      expandable={{
        expandedRowRender,
        expandedRowKeys,
        onExpandedRowsChange,
      }}
      columns={columns as any}/>
  );
};

export default Record;
