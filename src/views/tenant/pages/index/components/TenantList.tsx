/**
 * @Description : 租户管理Table list
 */
import React, { useState } from 'react';
import { Badge } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import FollowerModal from '@/common/components/Modal/FollowerModal';

import { useMethods } from '@lhb/hook';
import { TenantListProps, ModalStatus } from '../ts-config';
import styles from './index.module.less';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import V2Table from '@/common/components/Data/V2Table';


const TenantList: React.FC<TenantListProps> = ({
  params,
  onChangeRowSelect,
  disableTenant,
  recoverTenant,
  onSearch,
  loadData,
  mainHeight
}) => {
  /* data */
  // 修改跟进人
  const [editFollower, setEditFollower] = useState<any>({
    visible: false,
    id: undefined,
    follower: {},
  });
  const columns: any[] = [
    { key: 'id', title: '租户ID', fixed: 'left', width: 100 },
    { key: 'name', title: '租户名称/团队名称', width: 150, render: (_:string, __:any) => detailItem(_, __) },
    { key: 'number', title: '编号', width: 120 },
    { key: 'channel', title: '创建渠道', width: 100 },
    { key: 'grantApps', title: '已授权应用', width: 120, render: (value) => !value?.length ? '-' : value.join('、') },
    { key: 'certificateStatusName', title: '企业认证状态', width: 100 },
    { key: 'statusName', title: '状态', render: (value, record) => renderStatus(value, record), width: 100 },
    { key: 'crtor', title: '创建人', width: 100 },
    {
      key: 'follower',
      title: '跟进人',
      width: 120,
      render: (value, records) => renderFollower(value, records),
    },
    { key: 'gmtCreate', title: '创建时间', width: 180 },
  ];
  // 多选
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      const names = selectedRows.map((item) => item.name);
      onChangeRowSelect({ ids: selectedRowKeys, names: names });
    },
  };

  const detailItem = (name:string, data:any) => {
    // 用户有权限时才显示蓝色按钮跳转详情
    if (data?.permissions.find(item => item.event === 'tenant:show')) {
      return <span className='pointer color-primary' onClick={() => methods.handleShow(data)}>{name}</span>;
    } else {
      return <span >{name}</span>;
    }
  };

  /* methods */
  const { renderStatus, renderFollower, onOk, ...methods } = useMethods({
    renderStatus(value, record) {
      // 状态渲染
      return (
        <>
          {record.status !== 0 && <Badge status={record.status === 1 ? 'success' : 'error'} />}
          {value}
        </>
      );
    },
    renderFollower(value: { name: string } | null, record: any) {
      // 跟进人渲染
      return (
        <div className={styles.followerWrap}>
          <span onClick={() => setEditFollower({ visible: true, id: record.id, follower: value })}>
            {value?.name}
            <EditOutlined />
          </span>
        </div>
      );
    },
    renderCertificateStatus(value, record) {
      // 企业认证状态
      return (
        <>
          {record.certificateStatus !== 0 && <Badge status={record.certificateStatus === 1 ? 'success' : 'error'} />}
          {record.certificateStatus === 1 ? '已认证' : '未认证'}
        </>
      );
    },
    handleShow(record: any) {
      // 跳转去详情
      dispatchNavigate(`/tenant/detail?id=${record.id}`);
    },
    handleDisable(record: any) {
      // 操作停用按钮
      disableTenant(ModalStatus.ONE, [record.id], [record.name]);
    },
    handleEnable(record: any) {
      // 操作可用按钮
      recoverTenant(ModalStatus.ONE, [record.id], [record.name]);
    },
    onOk() {
      // 确认认领-刷新页面
      onSearch({});
    },
  });

  return (
    <>
      <V2Table
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        rowKey='id'
        filters={params}
        hideColumnPlaceholder
        scroll={{ y: mainHeight - 128 }}
        defaultColumns={columns}
        onFetch={loadData}
        className={styles.tableWrap}
      />
      <FollowerModal editFollower={editFollower} onClose={setEditFollower} onOk={onOk} />
    </>
  );
};
export default TenantList;
