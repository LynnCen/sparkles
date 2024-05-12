/* 应用配置 */
import { FC, useState } from 'react';
import { message } from 'antd';
import Operate from '@/common/components/Operate';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import Table from '@/common/components/FilterTable';
import AuthorizeApp from './Modal/AuthorizeApp';
import CrowdStorehouse from './CrowdStorehouse/index';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { disableModule, enableModule, getAppList } from '@/common/api/app';
import { AppListResult } from '@/views/application/pages/index/ts-config';
import { AuthorizeModalProps, TenantDetailProps } from '../ts-config';
import styles from './index.module.less';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { deepCopy, refactorPermissions } from '@lhb/func';

const AppConfiguration: FC<TenantDetailProps> = ({ tenantId, detail }) => {
  const columns: any[] = [
    { key: 'name', title: '应用名' },
    { key: 'status', title: '授权状态',
      render(_: any, record: any) {
        const { status, end, start } = record;
        if (!end && !start) {
          return status;
        }

        return (
          <>
            {status}
            <a>({start}-{end})</a>
          </>
        );
      }
    },
    {
      key: 'permissions',
      title: '操作',
      render: (value, record) => {
        const _value = deepCopy(value);
        if (tenantId && +tenantId === 1165) {
          // 流程任务列表暂放，仅邻汇吧租户展示
          _value.push({ event: 'tenant:processList', name: '流程任务列表' });
        }
        return <Operate
          showBtnCount={4}
          operateList={refactorPermissions(_value)}
          onClick={(btn: any) => methods[btn.func](record)}
        />;
      },
    },
  ];

  // 应用授权弹窗
  const [authorizeModal, setAuthorizeModal] = useState<AuthorizeModalProps>({
    visible: false,
    type: 'add',
    tenantName: '',
    appName: '',
    roleId: 0,
  });

  const [params, setParams] = useState<any>({ tenantId });
  // 客流宝弹窗
  const [drawerVisible, setDrawerVisible] = useState(false);

  const { ...methods } = useMethods({
    // 修改授权
    handleReauthorize(record: any) {
      showAuthorizeAppModal('edit', record);

    },
    // 授权
    handleAuthorize(record: any) {
      showAuthorizeAppModal('add', record);
    },
    // 取消授权
    handleCancel(record: any) {
      cancelAuthorize(record);
    },
    handleFlow() {
      // 客流宝
      setDrawerVisible(true);
    },
    handleMenuManager(record:any) {
      // 租户菜单管理
      dispatchNavigate(`/tenant/menu-manager?appId=${record.id}&tntInstId=${tenantId}`);
    },
    handleEnableModule(record:any) {
      // 开启个性化菜单
      const params = {
        tenantId,
        appId: record.id
      };
      V2Confirm({
        onSure: (modal: any) => enableModule(params).then(() => {
          onSearch();
          modal.destroy();
        }, () => modal.destroy()),
        title: '开启个性化菜单',
        content: '开启后，租户下当前应用将不受统一菜单控制影响排序和名称，是否确认'
      });
    },
    handleDisableModule(record:any) {
      // 关闭个性化菜单
      const params = {
        tenantId,
        appId: record.id
      };
      V2Confirm({
        onSure: (modal: any) => disableModule(params).then(() => {
          onSearch();
          modal.destroy();
        }, () => modal.destroy()),
        title: '关闭个性化菜单',
        content: '关闭后，租户下当前应用将受统一菜单控制影响排序和名称，是否确认' });
    },
    handleProcessConfig(record:any) {
      // 流程配置
      dispatchNavigate(`/flowEngine?appId=${record.id}&tenantId=${tenantId}`);
    },
    handleProcessList(record:any) {
      // 流程配置
      dispatchNavigate(`/flowEngine/flowList?appId=${record.id}&tenantId=${tenantId}`);
    }
  });

  // 显示弹窗
  const showAuthorizeAppModal = (type: 'add' | 'edit', record: any) => {
    setAuthorizeModal({
      visible: true,
      ...record,
      type: type,
      id: record.id,
      tenantId: tenantId,
      tenantName: detail.name,
      appName: record.name,
      roleId: detail.roleId,
      time: [record.start, record.end],
      brandId: record.brandId,
      brandName: record.brandName,
      industryId: record.industryId,
      industryName: record.industryName,
    });
  };

  // 请求应用列表
  const loadData = async () => {
    // https://yapi.lanhanba.com/project/289/interface/api/33189
    const result: AppListResult[] = await getAppList({ tenantId });
    return {
      count: result.length || 0,
      dataSource: result,
    };
  };

  // 重新请求获取列表数据
  const onSearch = (filter?: any) => {
    setParams({ ...params, ...filter });
  };

  // 确定取消授权
  const onCancelAuthorize = (modal: any, record: any) => {
    // http://yapi.lanhanba.com/project/289/interface/api/33202
    post('/tenant/cancelApp', { tenantId: Number(tenantId), appId: record.id }, {
      needHint: true,
      proxyApi: '/mirage'
    }).then(() => {
      message.success('取消授权成功');
      modal.destroy();
      onSearch();
    });
  };

  // 取消授权弹窗
  const cancelAuthorize = (record: any) => {
    ConfirmModal({
      onSure: (modal) => onCancelAuthorize(modal, record),
      title: '取消授权',
      content: `确定为「${detail.name}」取消授权「${record.name}」应用？`,
    });
  };

  return (
    <div className={styles.enterpriseSetting}>
      <Table onFetch={loadData} rowKey='id' pagination={false} columns={columns} filters={params} />
      <AuthorizeApp modalParams={authorizeModal} onClose={setAuthorizeModal} onSearch={onSearch}/>
      {/* 客流宝 */}
      <CrowdStorehouse tenantId={+tenantId} visible={drawerVisible} drawerClose={() => setDrawerVisible(false)} />
    </div>
  );
};

export default AppConfiguration;
