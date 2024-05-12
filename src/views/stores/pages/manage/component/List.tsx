import React from 'react';
import Table from '@/common/components/FilterTable';
import Operate from '@/common/components/Operate';

import { ListProps, ListRecordProps, ObjectProps } from '../ts-config';
import styles from './index.module.less';
import { useMethods } from '@lhb/hook';
import { refactorPermissions } from '@lhb/func';

const List: React.FC<ListProps> = ({
  params,
  loadData,
  setManager,
  setCounterpart,
  mainHeight,
}) => {
  const columns = [
    { key: 'name', title: '店铺名称', width: 250, fixed: 'left' },
    { key: 'number', title: '店铺编号', width: 120 },
    {
      title: '营业时间',
      key: 'startAt',
      width: 160,
      render: (cur: string, record: any) => {
        return `${record.startAt || ''} - ${record.endAt || ''}`;
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
        return cur || '-';
      }
    },
    { key: 'statusName', title: '营运状态', width: 100 },
    { key: 'startDate', title: '开始日期', width: 120, sorter: true, render: (value) => value || '-' },
    { key: 'endDate', title: '结束日期', width: 120, sorter: true, render: (value) => value || '-' },
    {
      key: 'boothAddress',
      title: '营运地址',
      width: 250,
      render: (value) => value || '-',
    },
    {
      key: 'promotionPurposes',
      title: '推广目的',
      width: 120,
      render: (value) => value || '-',
    },
    {
      key: 'managers',
      title: '管理员',
      width: 200,
      render: (value: Array<ObjectProps>) =>
        Array.isArray(value) && value.length ? value.map((itm: ObjectProps) => itm.name).join('、') : '',
    },
    {
      key: 'maintainers',
      title: '异常对接人',
      width: 200,
      render: (managers: Array<any>) => {
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
        <Operate operateList={refactorPermissions(value)} onClick={(btn: any) => methods[btn.func](record)} />
      ),
    },
  ];

  const { ...methods } = useMethods({
    handleSetStoreManager(record: ListRecordProps) {
      setManager(record);
    },
    handleSetStoreMaintainer(record: ListRecordProps) {
      const { id, maintainers } = record;
      setCounterpart({
        visible: true,
        managers: maintainers,
        id: id
      });
    },
  });

  return (
    <div className={styles.list}>
      <Table scroll={{ x: 'max-content', y: mainHeight - 64 - 42 }} rowKey='id' onFetch={loadData} filters={params} columns={columns} />
    </div>
  );
};

export default List;
