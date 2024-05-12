/* 租户详情页面 */
import { useState, useEffect, FC } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Tabs, Typography, Spin, Modal, message } from 'antd';
import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styles from './entry.module.less';
import FollowerModal from '@/common/components/Modal/FollowerModal';
import NotFound from '@/common/components/NotFound';
// 企业设置-v1.0版本暂时去除
// import EnterpriseSetting from './components/EnterpriseSetting';
import AppConfiguration from './components/AppConfiguration';
import BaseInfo from './components/BaseInfo';
import OpsAccount from './components/OpsAccount';

import { refactorPermissions, urlParams } from '@lhb/func';
import { get, post } from '@/common/request';
import { useMethods } from '@lhb/hook';
import HistoryRecord from './components/HistoryRecord';
import V2Operate from '@/common/components/Others/V2Operate';
import { FormattingPermission } from '@/common/components/Operate/ts-config';
import { DealWithTenantTypes, ModalStatus, OperateTenantTypes } from '../index/ts-config';
import CertificationModal from '../index/components/Modal/CertificationModal';
import DisableModal from '../index/components/Modal/DisableModal';
import RecoverModal from '../index/components/Modal/RecoverModal';
import OperateTenantModal from '../index/components/Modal/OperateTenant';

const { Title } = Typography;

interface IProps {
  location: any;
}

const Detail: FC<IProps> = ({
  location,
}) => {
  /* data */
  const tenantId: string | number = urlParams(location.search)?.id || '';
  const [currentTab, setCurrentTab] = useState<string>('app');
  // 修改跟进人
  const [editFollower, setEditFollower] = useState<any>({
    id: undefined,
    visible: false,
  });
  // 详情数据
  const [data, setData] = useState<{ detail: any; loading: boolean }>({ detail: {}, loading: true });
  // 新建&&编辑租户
  const [operateTenant, setOperateTenant] = useState<OperateTenantTypes>({
    record: {},
    type: '',
    visible: false,
  });
  // 停用租户
  const [disableTenant, setDisableTenant] = useState<DealWithTenantTypes>({
    ids: [],
    names: [],
    type: '',
    visible: false,
  });
  // 恢复租户
  const [recoverTenant, setRecoverTenant] = useState<DealWithTenantTypes>({
    ids: [],
    names: [],
    type: '',
    visible: false,
  });
  // 企业认证
  const [certification, setShowCertification] = useState<any>({
    ids: [],
    names: [],
    visible: false,
  });
  /* methods */
  const { showEditFollower, onOk, onChangeTab, ...methods } = useMethods({
    showEditFollower() {
      setEditFollower({
        visible: true,
        id: tenantId,
        follower: data.detail.follower,
      });
    },
    onOk() {
      getTenantDetail();
    },
    onChangeTab(key: string) {
      setCurrentTab(key);
    },
    // 唤起停用弹窗
    handleDisable(record: any) {
      setDisableTenant({
        ids: [record.id],
        names: [record.name],
        type: ModalStatus.ONE,
        visible: true,
      });
    },
    // 唤起恢复弹窗
    handleEnable(record: any) {
      setRecoverTenant({
        ids: [record.id],
        names: [record.name],
        type: ModalStatus.ONE,
        visible: true,
      });
    },
    // 编辑
    handleUpdate(record: any) {
      setOperateTenant({
        record: record,
        type: ModalStatus.UPDATE,
        visible: true,
      });
    },
    // 企业认证弹窗
    handleCertificate(record: any) {
      setShowCertification({
        id: record.id,
        names: record.name,
        visible: true,
      });
    },
    // 重置密码
    async handleResetPassword(record: any) {
      const { id, name } = record;
      Modal.confirm({
        title: '重置密码',
        icon: <ExclamationCircleOutlined />,
        content: `确定为「${name}」重置超管密码?`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          return resetPasswordByAdmin(id);
        }
      });
    },
  });

  const resetPasswordByAdmin = async (id: number) => {
    const success = await post('/tenant/resetPassword', { id }, {
      proxyApi: '/mirage',
      needHint: true
    });
    if (success) {
      message.success('重置密码已发送，请让联系人及时修改密码');
    }
  };

  // 租户详情
  const getTenantDetail = () => {
    if (!tenantId) return;
    // https://yapi.lanhanba.com/project/289/interface/api/33082
    get('/tenant/detail', { id: tenantId }, {
      needHint: true,
      proxyApi: '/mirage'
    }).then((data) => {
      const permissions = data.permissions?.map(item => {
        return {
          ...item,
          type: 'default', // 按钮类型
        };
      });
      setData({ detail: { ...data, permissions: permissions }, loading: false });
    });
  };

  useEffect(() => {
    getTenantDetail();
    // eslint-disable-next-line
  }, [tenantId]);

  return (
    <>
      <div className={styles.container}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to='/'>租户管理</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>租户详情</Breadcrumb.Item>
        </Breadcrumb>
        <Spin spinning={data.loading}>
          {tenantId ? (
            <>
              <div className={styles.titleBox}>
                <Title level={4}>
                  {data.detail.enterprise}【{data.detail.name}】
                </Title>
                <V2Operate
                  operateList={refactorPermissions(data.detail.permissions)}
                  onClick={(btn: FormattingPermission) => methods[btn.func](data.detail)}
                  showBtnCount={6}/>
              </div>
              <div className={styles.createInfo}>
              创建时间：{data.detail.gmtCreate}
                <span className={styles.followerWrap}>
                跟进人：
                  <span onClick={showEditFollower} className={styles.follower}>
                    {data.detail.follower?.name}
                    <EditOutlined />
                  </span>
                </span>
              </div>
              <Tabs activeKey={currentTab} onChange={onChangeTab} items={[
                { label: '基本信息', key: 'basic', children: <BaseInfo detail={data.detail} /> },
                { label: '应用配置', key: 'app', children: <AppConfiguration detail={data.detail} tenantId={tenantId} /> },
                { label: '运维账号', key: 'maintenance', children: currentTab === 'maintenance' && <OpsAccount tenantId={tenantId as number}/> },
                { label: '历史记录', key: 'record', children: currentTab === 'record' && <HistoryRecord tenantId={tenantId as number}/> },
              ]}/>
              <FollowerModal editFollower={editFollower} onOk={onOk} onClose={setEditFollower} />
            </>
          ) : (
            <NotFound text='暂无数据' />
          )}
        </Spin>
      </div>
      <OperateTenantModal onOk={() => getTenantDetail()} operateTenant={operateTenant} onClose={setOperateTenant} />
      <CertificationModal onOk={() => getTenantDetail()} certification={certification} onClose={setShowCertification} />
      <DisableModal onOk={() => getTenantDetail()} disableTenant={disableTenant} onClose={setDisableTenant} />
      <RecoverModal onOk={() => getTenantDetail()} recoverTenant={recoverTenant} onClose={setRecoverTenant} />
    </>
  );
};

export default Detail;
