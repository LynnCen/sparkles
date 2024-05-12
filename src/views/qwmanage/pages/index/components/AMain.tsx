import React, { useState } from 'react';
import { useMethods } from '@lhb/hook';
import { message } from 'antd';
import V2Table from '@/common/components/Data/V2Table';
import BindTenantModal from './BindTenantModal';
import { get } from '@/common/request';
import V2Operate from '@/common/components/Others/V2Operate';
import { refactorPermissions } from '@lhb/func';

const AMain: React.FC<any> = ({
  mainHeight, // 从V2Container透传过来的，必须挂到scroll上
  filters,
  setFilters,
}) => {
  const [visible, setVisible] = useState(false);
  const [recordData, setRecordData] = useState<any>({});
  const methods = useMethods({
    async onFetch() {
      // https://yapi.lanhanba.com/project/378/interface/api/58743
      const data = await get('/tp/tenant/page', filters, {
        needHint: true,
        proxyApi: '/mirage'
      });
      return {
        dataSource: data.objectList,
        count: data.objectList.length,
      };
    },
    showIt(name) {
      message.info('点击了' + name);
    },
    onRefresh() {
      setFilters({ ...filters });
    },
    handleBind(record) {
      setRecordData(record);
      setVisible(true);
    },
    handleUpdate(record) {
      setRecordData(record);
      setVisible(true);
    },
    handleSync(record) {
      setRecordData(record);
      get('/tp/fetch/all', { corpId: record.corpId }, {
        needHint: true,
        proxyApi: '/mirage'
      }).then(() => {
        message.success('同步成功');
      });
    },
  });

  /* table header配模块 */
  const defaultColumns = [
    { key: 'corpName', title: '已授权企业', dragChecked: true, render: (val) => <span style={{ color: '#006AFF' }}>{val}</span> },
    { key: 'corpId', title: '企业Id', dragChecked: true, },
    { key: 'agentId', title: '应用ID', dragChecked: true },
    { key: 'addressSecret', title: '通讯录secret', dragChecked: true, },
    { key: 'tenantName', title: '绑定租户', dragChecked: true },
    { key: 'gmtCreate', title: '授权时间', dragChecked: true },
    { key: 'gmtModified', title: '绑定时间', dragChecked: true },
    // { key: 'operateUser', title: '操作人', dragChecked: true },
    { key: 'status', title: '状态', width: 102, fixed: 'right', dragDisabled: true, dragChecked: true, render: (val, record) => {
      return <span style={{ color: val && '#009C5E' }}>{ record.statusName }</span>;
    } },
    { key: 'operate', title: '操作', fixed: 'right', dragDisabled: true, dragChecked: true, render: (_, record) => {
      const operate: any = [];
      if (record.status === 1) {
        operate.push(
          { event: 'update', name: '编辑' },
          { event: 'sync', name: '同步通讯录' }
        );
      } else {
        operate.push({ event: 'bind', name: '去绑定' });
      }
      return <V2Operate
        operateList={refactorPermissions(operate)}
        onClick={(btn: any) => methods[btn.func](record)}
      />;
    } },
  ];
  // 模拟接口返回的配置表
  return <>
    <V2Table
      rowKey='name'
      filters={filters}
      // 勿删! 64：分页模块总大小、52:分页模块减去paddingBottom的值、42:table头部
      scroll={{ y: mainHeight - 64 - 42 }}
      defaultColumns={defaultColumns}
      // 重要：记得同步维护至 https://yapi.lanhanba.com/project/378/interface/api/46017
      tableSortapplication='saasManageQwManageDemo'
      onFetch={methods.onFetch}
    />
    <BindTenantModal
      visible={visible}
      setVisible={setVisible}
      onRefresh={methods.onRefresh}
      data={recordData}
    />
  </>;
};

export default AMain;
