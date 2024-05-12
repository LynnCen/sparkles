/* (批量)停用租户  */
import React from 'react';
import { Modal, message } from 'antd';
import { post } from '@/common/request';
import { DealWithTenantProps, ModalStatus } from '../../ts-config';
import CheckTenant from './CheckTenant';

const DisableModal: React.FC<DealWithTenantProps> = ({ disableTenant, onClose, onOk }) => {
  // 取消
  const onCancel = () => {
    onClose({ ...disableTenant, visible: false });
  };
  // 确定
  const onSubmit = () => {
    // 提交停用请求
    // https://yapi.lanhanba.com/project/289/interface/api/33085
    post('/tenant/disable', { ids: disableTenant.ids }, {
      needHint: true,
      proxyApi: '/mirage'
    }).then(() => {
      message.success('租户停用成功');
      onCancel();
      onOk();
    });
  };

  return (
    <Modal
      title={disableTenant.type === ModalStatus.ALL ? '批量停用租户' : '停用租户'}
      open={disableTenant.visible}
      onCancel={onCancel}
      onOk={onSubmit}
    >
      确定停用
      {disableTenant.type === ModalStatus.ALL ? '以下租户' : `「${disableTenant.names[0]}」`}
      的租户使用权限？停用后该租户将无法进行任何操作
      <CheckTenant type={disableTenant.type} list={disableTenant.names} />
    </Modal>
  );
};

export default DisableModal;
