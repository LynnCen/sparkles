import { Table } from 'antd';
import { ColumnType } from 'antd/es/table/interface';
import { FC } from 'react';

interface DetailTableProps {
  columns?: ColumnType<any>;
  dataSource?: any[];
}

const DetailTable: FC<DetailTableProps> = ({ dataSource, columns }) => {
  return (
    <>
      {!!dataSource && (
        <Table
          sticky
          dataSource={dataSource}
          scroll={{ y: 200 }}
          pagination={false}
          rowKey={() => {
            // 采用随机生成key，由于接口请求都会触发render不需要考虑key的全量变动
            return Math.random().toString(36).slice(3, 8);
          }}
          columns={(columns as any)?.map(item => ({
            ...item,
            align: 'left'
          }))} />
      )}
    </>
  );
};

export default DetailTable;
