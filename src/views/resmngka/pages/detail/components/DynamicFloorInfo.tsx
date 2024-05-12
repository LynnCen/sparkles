import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { Button, Space, Table } from 'antd';
import { FC, useState } from 'react';
import { FloorInfoModalInfo } from '../ts-config';
import FloorInfoModal from './Modal/FloorInfoModal';
import { deepCopy } from '@lhb/func';

const operateList = [
  {
    isBatch: false,
    event: 'edit',
    name: '编辑',
    text: '新建',
    func: 'handleEdit',
  },
  {
    isBatch: false,
    event: 'delete',
    name: '删除',
    text: '删除',
    func: 'handleDelete',
  },
];

const DynamicFloorInfo: FC<any> = ({ value, onChange }) => {
  const columns = [
    { key: 'floor', dataIndex: 'floor', title: '楼层' },
    { key: 'name', dataIndex: 'name', title: '店铺名称' },
    { key: 'labelName', dataIndex: 'labelName', title: '品牌名称' },
    { key: 'industryName', dataIndex: 'industryName', title: '所属行业' },
    { key: 'type', dataIndex: 'type', title: '店铺类型' },
    {
      key: 'permissions',
      title: '操作',
      render: (value, record) => (
        <Operate operateList={operateList} onClick={(btn: any) => methods[btn.func](record)} />
      ),
    },
  ];
  const [floorInfoModalInfo, setFloorInfoModalInfo] = useState<FloorInfoModalInfo>({ visible: false });
  const [data, setData] = useState<any>([]);

  const { add, ...methods } = useMethods({
    add() {
      setFloorInfoModalInfo({ visible: true });
    },
    // 编辑
    handleEdit(record: any) {
      setFloorInfoModalInfo({ ...record, visible: true });
    },
    // 删除
    handleDelete(record: any) {
      ConfirmModal({
        onSure: (modal) => {
          const filterData = data.filter((item) => item.id !== record.id);
          setData(filterData);
          modal.destroy();
        },
      });
    },
  });

  return (
    <>
      <Space style={{ marginBottom: 10 }}>
        <Button type='primary' onClick={add}>
          新增
        </Button>
      </Space>
      <Table rowKey='id' dataSource={deepCopy(value)} columns={columns} pagination={false} size='small' />
      <FloorInfoModal
        data={data}
        onChange={onChange}
        floorInfoModalInfo={floorInfoModalInfo}
        setFloorInfoModalInfo={setFloorInfoModalInfo}
      />
    </>
  );
};

export default DynamicFloorInfo;
