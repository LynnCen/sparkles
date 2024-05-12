import { FC } from 'react';
import { Button, Tooltip } from 'antd';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import Tables from '@/common/components/FilterTable';

const Table: FC<any> = ({ loadData, searchParams }) => {
  const columns = [
    {
      title: '店铺名称',
      key: 'name',
      // width: 200
    },
    { title: '店铺编号', key: 'number', width: 100 },
    { title: '租户简称', key: 'tenantName' },
    // { title: '营业时间', key: '' },
    {
      title: '营业时间',
      key: 'startAt',
      width: 160,
      render: (cur: string, record: any) => {
        return `${record.startAt || ''} - ${record.endAt || ''}`;
      }
    },
    {
      title: '摄像头品牌',
      key: 'sourceName',
      width: 100,
      render: (val: string) => {
        return val || '-';
      }
    },
    {
      title: '摄像头状态',
      key: 'deviceStatusName',
      width: 100,
      render: (cur: string, record: any) => {
        const { deviceStatus } = record;
        if (deviceStatus === 4 || deviceStatus === 5) { // 异常时要红色提示
          return (
            <span className='color-danger'>{cur}</span>
          );
        }
        return cur;
      }
    },
    { title: '营运状态', key: 'statusName', width: 80 },
    {
      title: '营业日期',
      key: 'startDate',
      width: 200,
      render: (cur: string, record: any) => {
        return `
        ${record.startDate ? record.startDate.replace(/-/g, '.') : ''}
        ${record.startDate && record.endDate ? '-' : ''}
        ${record.endDate ? record.endDate.replace(/-/g, '.') : ''}
        `;
      }
    },
    {
      title: '管理员',
      key: 'managers',
      width: 150,
      render: (managers: any) => {
        if (Array.isArray(managers) && managers.length) {
          return managers.map((manager: any) => manager.name || manager.mobile).join('、');
        }
        return '-';
      }
    },
    {
      key: 'permissions',
      title: '操作',
      width: 200,
      fixed: 'right',
      render: (value, record) => (
        renderButton(record)
      ),
    },
  ];

  const renderButton = (record) => {
    const { devices } = record;
    if (Array.isArray(devices) && devices.length) {
      return (
        <Button type='link' onClick={() => handleDetail(record)}>
            查看摄像头详情
        </Button>
      );
    }

    return (
      <Tooltip placement='top' title='未关联第三方设备'>
        <Button type='link' disabled>
            查看摄像头详情
        </Button>
      </Tooltip>
    );
  };

  const handleDetail = (record: any) => {
    const { id } = record;
    dispatchNavigate(`/flow/detail?id=${id}`);
  };

  return (
    <>
      <Tables
        columns={columns}
        onFetch={loadData}
        filters={searchParams}
        className='mt-20'
        rowKey='id'
        bordered={true}/>
    </>
  );
};

export default Table;
