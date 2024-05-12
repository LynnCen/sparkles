import { useState } from 'react';
import { useMethods } from '@lhb/hook';
import styles from './entry.module.less';

import V2Container from '@/common/components/Data/V2Container';
import V2Table from '@/common/components/Data/V2Table';
import { getFlowTaskList } from '@/common/api/flowEngine';
import { matchQuery, refactorPermissions } from '@lhb/func';
import V2Operate from '@/common/components/Others/V2Operate';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { dispatchNavigate } from '@/common/document-event/dispatch';

// 右上角操作按钮
// const operateList:any[] = [
//   {
//     name: '新增模版', // 必填
//     event: 'add', // 必填
//     type: 'primary', //  非必填，默认为link
//     func: 'handleAdd',
//   },
// ];

// 表单列操作按钮
const tableOperateList:any[] = [
  {
    name: '详情', // 必填
    event: 'detail', // 必填
    func: 'handleDetail',
  },
];

const FlowEngine = () => {
  const appId = matchQuery(location.search, 'appId'); // 应用id
  const tenantId = matchQuery(location.search, 'tenantId'); // 租户id
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [filters, setFilters] = useState<{ [x: string]: string }>({});


  const defaultColumns: any[] = [
    { key: 'id', width: 60, title: 'ID', dragChecked: true, dragDisabled: false },
    { key: 'sponsorName', width: 90, title: '发起人名称', dragChecked: true, dragDisabled: false },
    { key: 'name', title: '审批任务名称', dragChecked: true, dragDisabled: false },
    { key: 'content', title: '关键信息', dragChecked: true, dragDisabled: false },
    { key: 'statusName', title: '状态中文', dragChecked: true, dragDisabled: false },
    { key: 'startTime', title: '创建时间', dragChecked: true, dragDisabled: false },
    { key: 'permission', width: 120, title: '操作', dragChecked: true, dragDisabled: false, render: (_:any, record:any) => <V2Operate
      operateList={refactorPermissions(tableOperateList)}
      onClick={(btns: { func: string | number }) => methods[btns.func](record)}/> },
  ];
  const methods = useMethods({
    async onFetch(params) {
      const _params = {
        appId,
        page: params.page,
        size: params.size,
      };
      const { objectList, totalNum } = await getFlowTaskList(_params);
      return {
        dataSource: objectList,
        count: totalNum,
      };
    },
    onRefresh() {
      setFilters({ ...filters });
    },
    handleDetail(record:any) {
      dispatchNavigate(`/flowEngine/detail?appId=${appId}&tenantId=${tenantId}&id=${record.id}`);
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
              <Breadcrumb.Item>流程任务列表</Breadcrumb.Item>
            </Breadcrumb>
            {/* <V2Operate
              operateList={refactorPermissions(operateList)}
              onClick={(btns: { func: string | number }) => methods[btns.func]()}/> */}
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
  </>;
};

export default FlowEngine;
