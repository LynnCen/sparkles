import React, { useState } from 'react';
import { Badge, Button, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import Table from '@/common/components/FilterTable';
import FollowerModal from '@/common/components/Modal/FollowerModal';

import { TenantListProps } from '../ts-config';
import styles from '../entry.module.less';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { useMethods } from '@lhb/hook';
import { tenantPagesByKey, updateFollower, tenantFollower } from '@/common/api/location';
import ConfigModal from './ConfigModal';

const TenantList: React.FC<TenantListProps> = ({ params, onSearch }) => {
  /* data */
  // 修改跟进人
  const [editFollower, setEditFollower] = useState<any>({
    visible: false,
    id: undefined,
    follower: {},
  });
  const [showConfigModal, setShowConfigModal] = useState<any>({
    id: null,
    visible: false
  });

  const columns: any[] = [
    { key: 'id', title: '租户ID', fixed: 'left' },
    { key: 'name', title: '租户名称/团队名称' },
    { key: 'number', title: '编号' },
    { key: 'channelName', title: '创建渠道' },
    { key: 'certificateStatusName', title: '企业认证状态' },
    { key: 'statusName', title: '状态', render: (value, record) => renderStatus(value, record), width: 100 },
    { key: 'creator', title: '创建人' },
    {
      key: 'follower',
      title: '跟进人',
      width: 120,
      render: (value, records) => renderFollower(value, records),
    },
    {
      key: 'permissions',
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 250,
      render: (_, record) => (
        <Space>
          <Button type={'link'} onClick={() => onClickDetail(record)}>
            详情
          </Button>
          <Button type={'link'} onClick={() => {
            setShowConfigModal({
              id: record.id,
              visible: true,
            });
          }}>
            配置初始化
          </Button>
        </Space>
      ),
    },
  ];
  /* methods */
  const { renderStatus, renderFollower, onOk, loadData, onClickDetail } = useMethods({
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
    onOk() {
      // 确认认领-刷新页面
      onSearch({});
    },
    loadData: async (params: any) => {
      const { objectList, totalNum } = await tenantPagesByKey(params);
      // setTableData(objectList);
      return {
        dataSource: objectList,
        count: totalNum,
      };
    },
    onClickDetail: (record) => {
      dispatchNavigate(`/location/tenantdetail?id=${record.id}`);
    },
  });
  return (
    <>
      <Table rowKey='id' onFetch={loadData} filters={params} columns={columns} className={styles.tableWrap} />
      <FollowerModal
        updateRequest={updateFollower}
        getUserListFunc={tenantFollower}
        editFollower={editFollower}
        onClose={setEditFollower}
        onOk={onOk}
      />
      <ConfigModal
        showConfigModal={showConfigModal}
        setShowConfigModal={setShowConfigModal}
      />
    </>
  );
};
export default TenantList;
