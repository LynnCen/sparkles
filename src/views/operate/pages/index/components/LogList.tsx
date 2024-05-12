import React from 'react';
import Table from '@/common/components/FilterTable';
import { LogListProps } from '../ts-config';

const LogList: React.FC<LogListProps> = ({ loadData, params }) => {
  const columns = [
    { key: 'index', title: '序号', width: 60, render: (text: string, record: any, index: number) => (index + 1) },
    { key: 'gmtCreate', title: '请求时间', width: 240 },
    { key: 'creator', title: '请求用户', width: 160 },
    { key: 'ip', title: '请求IP', width: 160 },
    { key: 'method', title: '请求类型', width: 100 },
    { key: 'uri', title: '请求地址', width: 400 },
  ];

  return (
    <>
      <Table
        rowKey='id'
        scroll={{ x: false }}
        onFetch={loadData}
        filters={params}
        columns={columns}
      />
    </>
  );
};

export default LogList;
