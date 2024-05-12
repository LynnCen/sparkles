import { useState } from 'react';
import { useMethods } from '@lhb/hook';
import styles from './entry.module.less';

import V2Container from '@/common/components/Data/V2Container';
import V2Table from '@/common/components/Data/V2Table';
import { deleteTemplate, getTemplate } from '@/common/api/flowEngine';
import { matchQuery, refactorPermissions } from '@lhb/func';
import V2Operate from '@/common/components/Others/V2Operate';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { Breadcrumb, message } from 'antd';
import { Link } from 'react-router-dom';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import ChangeTemplate from './components/ChangeTemplate';
import { setStorage } from '@lhb/cache';

// 右上角操作按钮
const operateList:any[] = [
  {
    name: '新增模版', // 必填
    event: 'add', // 必填
    type: 'primary', //  非必填，默认为link
    func: 'handleAdd',
  },
];

// 表单列操作按钮
const tableOperateList:any[] = [
  {
    name: '编辑', // 必填
    event: 'edit', // 必填
    func: 'handleEdit',
  },
  {
    name: '删除', // 必填
    event: 'delete', // 必填
    func: 'handleDelete',
  },
];

const FlowEngine = () => {
  const appId = matchQuery(location.search, 'appId'); // 应用id
  const tenantId = matchQuery(location.search, 'tenantId'); // 租户id
  const isDemo = location.pathname.includes('flowEngine'); // 是否是demo页面
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [filters, setFilters] = useState<{ [x: string]: string }>({});
  const [templateModalData, setTemplateModalData] = useState<boolean>(false); // 选择模板弹窗


  const defaultColumns: any[] = [
    { key: 'id', width: 80, title: 'ID', dragChecked: true, dragDisabled: false },
    { key: 'name', title: '名称', dragChecked: true, dragDisabled: false },
    { key: 'code', title: '编码', dragChecked: true, dragDisabled: false },
    { key: 'formUri', title: '关联的表单地址', dragChecked: true, dragDisabled: false },
    { key: 'tntInstId', width: 80, title: '租户ID', dragChecked: true, dragDisabled: false },
    { key: 'appId', width: 80, title: '应用ID', dragChecked: true, dragDisabled: false },
    { key: 'permission', title: '操作', dragChecked: true, dragDisabled: false, render: (_:any, record:any) => <V2Operate
      operateList={refactorPermissions(tableOperateList)}
      onClick={(btns: { func: string | number }) => methods[btns.func](record)}/> },
  ];
  const methods = useMethods({
    async onFetch(params) {
      const _params = {
        page: params.page,
        size: params.size,
        appId,
        tenantId
      };
      const { objectList, totalNum } = await getTemplate(_params);
      return {
        dataSource: objectList,
        count: totalNum,
      };
    },
    onRefresh() {
      setFilters({ ...filters });
    },
    handleAdd() {
      setTemplateModalData(true);
    },
    handleEdit(record:any) {
      const params = {
        appId,
        tenantId,
        id: record.id,
        isDemo,
      };
      setStorage('formConditionFields', []);
      dispatchNavigate(`/flowEngine/edit?params=${decodeURI(JSON.stringify(params))}`);
    },
    handleDelete(record:any) {
      V2Confirm({
        onSure: (modal: any) => {
          deleteTemplate({ id: record.id, tenantId }).then(() => {
            message.success('删除成功');
            this.onRefresh();
            modal.destroy();
          });
        },
        content: '是否确认删除？'
      });

    },
  });

  return <>
    <V2Container
      className={styles.flowEngineContainer}
      emitMainHeight={(h) => setMainHeight(h)}
      style={{ height: 'calc(100vh - 88px)' }}
      extraContent={{
        top: <>
          <div className={styles.header}>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to={`/tenant/detail?id=${tenantId}`}>租户管理详情</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>流程配置列表</Breadcrumb.Item>
            </Breadcrumb>
            <V2Operate
              operateList={refactorPermissions(operateList)}
              onClick={(btns: { func: string | number }) => methods[btns.func]()}/>
          </div>
        </>
      }}>
      <V2Table
        rowKey='id'
        filters={filters}
        // 勿删! 64：分页模块总大小、52:分页模块减去paddingBottom的值、42:table头部
        scroll={{ y: mainHeight - 64 - 48 }}
        defaultColumns={defaultColumns}
        onFetch={methods.onFetch}
      />
    </V2Container>
    <ChangeTemplate
      templateModalData={templateModalData}
      setTemplateModalData={setTemplateModalData} />
  </>;
};

export default FlowEngine;
