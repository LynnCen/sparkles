import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { Button, Space, Table } from 'antd';
import { FC, useState } from 'react';
import { ChannelDescModalInfo } from '../ts-config';
import { deepCopy } from '@lhb/func';
import ChannelDescModal from './Modal/ChannelDescModal';

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

const DynamicChannelDesc: FC<any> = ({ value, onChange }) => {
  const columns = [
    { key: 'name', dataIndex: 'name', title: '通道名称', width: '180px' },
    { key: 'type', dataIndex: 'type', title: '通道类型', width: '180px' },
    { key: 'depth', dataIndex: 'depth', title: '进深(m)', width: '180px' },
    { key: 'width', dataIndex: 'width', title: '面宽(m)', width: '180px' },
    { key: 'height', dataIndex: 'height', title: '层高(m)', width: '180px' },
    {
      key: 'permissions',
      title: '操作',
      render: (value, record) => (
        <Operate operateList={operateList} onClick={(btn: any) => methods[btn.func](record)} />
      ),
      width: '180px',
    },
  ];
  const [channelDescModalInfo, setChannelDescModalInfo] = useState<ChannelDescModalInfo>({ visible: false });

  const { add, ...methods } = useMethods({
    add() {
      setChannelDescModalInfo({ visible: true });
    },
    // 编辑
    handleEdit(record: any) {
      setChannelDescModalInfo({ ...record, visible: true });
    },
    // 删除
    handleDelete(record: any) {
      ConfirmModal({
        onSure: (modal) => {
          const filterData = value.filter((item) => item.id !== record.id);
          onChange(filterData);
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
      <ChannelDescModal
        data={value}
        onChange={onChange}
        channelDescModalInfo={channelDescModalInfo}
        setChannelDescModalInfo={setChannelDescModalInfo}
      />
    </>
  );
};

export default DynamicChannelDesc;
