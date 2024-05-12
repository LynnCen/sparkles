import React, { useState, useMemo } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import Operate from '@/common/components/Operate';
import Filters from './components/Filters';
import OperateTenantModal from './components/Modal/OperateTenant';
import DisableModal from './components/Modal/DisableModal';
import RecoverModal from './components/Modal/RecoverModal';
import TenantList from './components/TenantList';
import { KeepAlive } from 'react-activation';

import { get } from '@/common/request';
import { useMethods } from '@lhb/hook';
import {
  OperateTenantTypes,
  DealWithTenantTypes,
  ModalStatus,
  TenantFilterProps,
  TenantResponseListProps,
} from './ts-config';
import styles from './entry.module.less';
import CertificationModal from './components/Modal/CertificationModal';
import V2Container from '@/common/components/Data/V2Container';
import { refactorPermissions } from '@lhb/func';
import dayjs from 'dayjs';

const TenantIndex = () => {
  /* data */
  const [mainHeight, setMainHeight] = useState<number>(0);
  // 搜索params
  const [params, setParams] = useState<TenantFilterProps>({});
  // 已选租户
  const [selectTenantIds, setSelectTenantIds] = useState<{ ids: React.Key[]; names: string[] }>({
    ids: [],
    names: [],
  });
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
  const { handleAddUpdate, onSearch, handleCertificate, loadData, ...methods } = useMethods({
    handleBatchDisable: (type: string, id?: number, name?: string) => {
      // 唤起停用弹窗
      setDisableTenant({
        ids: id || selectTenantIds.ids,
        names: name || selectTenantIds.names,
        type,
        visible: true,
      });
    },
    handleBatchEnable: (type: string, id?: number, name?: string) => {
      // 唤起恢复弹窗
      setRecoverTenant({
        ids: id || selectTenantIds.ids,
        names: name || selectTenantIds.names,
        type,
        visible: true,
      });
    },

    // 新建/编辑租户信息
    handleAddUpdate(type: string, record = {}) {
      setOperateTenant({
        record: record,
        type,
        visible: true,
      });
    },
    // 企业认证弹窗
    handleCertificate(id?: number, name?: string) {
      setShowCertification({
        id: id || selectTenantIds.ids,
        names: name || selectTenantIds.names,
        visible: true,
      });
    },
    onSearch(values:any = {}) {
      const { createTime, ...others } = values;
      setParams({
        ...params,
        ...others,
        createStart: createTime?.length ? dayjs(createTime[0]).format('YYYY-MM-DD') : null,
        createEnd: createTime?.length ? dayjs(createTime[1]).format('YYYY-MM-DD') : null,
      });
    },
    loadData: async (params: any) => {
      // https://yapi.lanhanba.com/project/289/interface/api/33081
      const { objectList = [], totalNum = 0, meta }: TenantResponseListProps = await get('/tenant/list', params, {
        needHint: true,
        proxyApi: '/mirage'
      });
      if (!operateList.length) {
        setOperateExtra(meta?.permissions || []);
      }
      return {
        dataSource: objectList,
        count: totalNum,
      };
    },
  });
  /* computed */
  const [operateExtra, setOperateExtra] = useState<any>([]);
  const operateList: any = useMemo(() => {
    const list = refactorPermissions(operateExtra);
    return list.map((item) => {
      const res: any = {
        name: item.text,
        disabled: item.isBatch ? !selectTenantIds.ids.length : false,
        type: item.isBatch ? 'default' : 'primary',
        onClick: () => methods[item.func](ModalStatus.ALL),
      };
      if (item.event === ModalStatus.ADD) {
        res.icon = <PlusOutlined />;
        res.onClick = () => handleAddUpdate(ModalStatus.ADD);
      }
      return res;
    });
    // eslint-disable-next-line
  }, [operateExtra, selectTenantIds]);
  /* render */
  return (
    <>
      <V2Container
        className={(styles.container)}
        emitMainHeight={(h) => setMainHeight(h)}
        style={{ height: 'calc(100vh - 80px)' }}
        extraContent={{
          top: <>
            <Filters onSearch={onSearch} />
            <Operate operateList={operateList} showBtnCount={4} />
          </>,
        }}>
        <TenantList
          params={params}
          onChangeRowSelect={setSelectTenantIds}
          handleAddUpdate={handleAddUpdate}
          disableTenant={methods.handleBatchDisable}
          recoverTenant={methods.handleBatchEnable}
          handleCertificate={handleCertificate}
          onSearch={onSearch}
          loadData={loadData}
          mainHeight={mainHeight}
        />
      </V2Container>
      <OperateTenantModal onOk={() => onSearch({})} operateTenant={operateTenant} onClose={setOperateTenant} />
      <CertificationModal onOk={() => onSearch({})} certification={certification} onClose={setShowCertification} />
      <DisableModal onOk={onSearch} disableTenant={disableTenant} onClose={setDisableTenant} />
      <RecoverModal onOk={onSearch} recoverTenant={recoverTenant} onClose={setRecoverTenant} />
    </>
  );
};


export default ({ location }) => (
  <KeepAlive saveScrollPosition='screen' name={location.pathname}>
    <TenantIndex />
  </KeepAlive>
);
