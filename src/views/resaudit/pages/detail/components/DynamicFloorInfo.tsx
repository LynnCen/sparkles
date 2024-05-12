import { Table } from 'antd';
import { FC } from 'react';
import { deepCopy } from '@lhb/func';

interface DynamicFloorInfoProps {
  value: string;
}

const DynamicFloorInfo: FC<DynamicFloorInfoProps> = ({ value }) => {
  const columns = [
    { key: 'floor', dataIndex: 'floor', title: '楼层' },
    { key: 'name', dataIndex: 'name', title: '店铺名称' },
    { key: 'labelName', dataIndex: 'labelName', title: '品牌名称' },
    { key: 'industryName', dataIndex: 'industryName', title: '所属行业' },
    { key: 'type', dataIndex: 'type', title: '店铺类型' },
  ];
  return (
    <>
      <Table
        rowKey='id'
        dataSource={deepCopy(JSON.parse(value))}
        columns={columns}
        pagination={false}
        size='small' />
    </>
  );
};

export default DynamicFloorInfo;
