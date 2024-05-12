import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { Button, Space, Table } from 'antd';
import { FC, useEffect, useState } from 'react';
import { HistoryPriceModalInfo } from '../ts-config';
import HistoryPriceModal from './Modal/HistoryPriceModal';
import { PlusOutlined } from '@ant-design/icons';
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

const DynamicHistoryPrice: FC<any> = ({ value, onChange }) => {
  const columns = [
    { key: 'brandName', dataIndex: 'brandName', title: '品牌', width: '200px' },
    { key: 'industryName', dataIndex: 'industryName', title: '行业', width: '200px' },
    { key: 'industryName', dataIndex: 'totalCost', title: '成本价', width: '200px', render: (value, record) => {
      let total = 0;
      if (record.cost) {
        total = total + record.cost;
      }
      if (record.approvalFee) {
        total = total + record.approvalFee;
      }
      if (record.specialApprovalFee) {
        total = total + record.specialApprovalFee;
      }
      return <span>{total.toFixed(2)}元</span>;
    } },
    {
      key: 'cost',
      title: '场地成本',
      width: '200px',
      render: (value, record) => {
        if (record.cost === 0) {
          return '0元';
        }
        return record.cost ? record.cost + '元' : '-';
      },
    },
    {
      key: 'specialApprovalFee',
      title: '特殊报批费',
      width: '220px',
      render: (value, record) => {
        if (record.specialApprovalFee === 0) {
          return '0元';
        }
        return record.specialApprovalFee ? record.specialApprovalFee + '元' : '-';
      },
    },
    {
      key: 'approvalFee',
      title: '报批费',
      width: '200px',
      render: (value, record) => {
        if (record.approvalFee === 0) {
          return '0元';
        }
        return record.approvalFee ? record.approvalFee + '元' : '-';
      },
    },
    {
      key: 'price',
      title: '销售额',
      width: '200px',
      render: (value, record) => {
        if (record.price === 0) {
          return '0元';
        }
        return record.price ? record.price + '元' : '-';
      },
    },
    {
      key: 'spec',
      title: '规格',
      width: '180px',
      render: (value, record) => {
        return record.spec && record.spec.l ? record.spec.l + '*' + record.spec.w : '-';
      },
    },
    {
      key: 'area',
      title: '面积',
      width: '180px',
      render: (value, record) => {
        return record.spec && record.spec.l ? record.spec.l * record.spec.w + 'm²' : '-';
      },
    },
    {
      key: 'time',
      title: '活动时间',
      width: '380px',
      render: (value, record) => {
        return record.time[0] + '-' + record.time[1];
      },
    },
    {
      key: 'time',
      title: '活动天数',
      width: '200px',
      render: (value, record) => {
        if (record.time && record.time.length) {
          const start = record.time[0].split('.');
          const end = record.time[1].split('.');
          const ss = new Date(start).getTime();
          const se = new Date(end).getTime();
          return Math.ceil((se - ss) / 86400000) + 1;
        }
        return '-';
      },
    },
    {
      key: 'permissions',
      title: '操作',
      width: '200px',
      render: (value, record) => (
        <Operate operateList={operateList} onClick={(btn: any) => methods[btn.func](record)} />
      ),
    },
  ];
  const [historyPriceModalInfo, setHistoryPriceModalInfo] = useState<HistoryPriceModalInfo>({ visible: false });
  const [data, setData] = useState<any>();

  const { add, ...methods } = useMethods({
    add() {
      setHistoryPriceModalInfo({ visible: true });
    },
    // 编辑
    handleEdit(record: any) {
      console.log(123, record);
      setHistoryPriceModalInfo({ ...record, visible: true });
    },
    // 删除
    handleDelete(record: any) {
      ConfirmModal({
        onSure: (modal) => {
          const copyData = deepCopy(value);
          const filterData = copyData.filter((item) => item.id !== record.id);
          setData(filterData);
          onChange(filterData);
          modal.destroy();
        },
      });
    },
  });

  useEffect(() => {
    if (value) {
      setData(value);
    }
  }, [value]);

  return (
    <>
      <div style={{ width: '1000px' }}>
        <Table rowKey='id' dataSource={data} columns={columns} pagination={false} size='small' />
      </div>
      <Space style={{ marginTop: 10, width: '1000px' }}>
        <div style={{ width: '1000px' }}>
          <Button type='dashed' onClick={add} block icon={<PlusOutlined />}>
            新增
          </Button>
        </div>
      </Space>
      <HistoryPriceModal
        data={data || []}
        setData={setData}
        onChange={onChange}
        historyPriceModalInfo={historyPriceModalInfo}
        setHistoryPriceModalInfo={setHistoryPriceModalInfo}
      />
    </>
  );
};

export default DynamicHistoryPrice;
