import React from 'react';
import Table from '@/common/components/FilterTable';
import { ApplistProps } from '../ts-config';
import { Button, Space } from 'antd';
import { dispatchNavigate } from '@/common/document-event/dispatch';

const AppList: React.FC<ApplistProps> = ({ loadData }) => {
  const columns = [
    { key: 'name', title: '应用名', width: 120 },
    { key: 'code', title: '编码', width: 200 },
    { key: 'creator', title: '创建人', width: 120 },
    { key: 'gmtCreate', title: '创建时间', width: 200 },
    { key: 'desc', title: '说明', width: 200, ellipsis: true },
    {
      title: '操作',
      key: 'id',
      dataIndex: 'action',
      align: 'center',
      with: 200,
      render(_, record: any) {
        const { id } = record;
        // 路由跳转
        const handleManagementMenuClick = () => {
          dispatchNavigate(`/application/menu-managent?appId=${id}`);
        };
        return (
          <Space>
            <Button type='link' onClick={handleManagementMenuClick}>菜单管理</Button>
          </Space>
        );
      },
    }
  ];

  return <Table rowKey='id' scroll={{ x: false }} pagination={false} onFetch={loadData} columns={columns} />;
};
export default AppList;
