/* (批量)恢复租户  */
import React from 'react';
import { Modal, message } from 'antd';
import { post } from '@/common/request';
import { RecoverTenantProps, ModalStatus } from '../../ts-config';
import CheckTenant from './CheckTenant';

const RecoverModal: React.FC<RecoverTenantProps> = ({ recoverTenant, onClose, onOk }) => {
  // 取消
  const onCancel = () => {
    onClose({ ...recoverTenant, visible: false });
  };

  // 确定
  const onSubmit = () => {
    // 提交恢复请求
    // https://yapi.lanhanba.com/project/289/interface/api/33086
    post('/tenant/enable', { ids: recoverTenant.ids }, {
      needHint: true,
      proxyApi: '/mirage'
    }).then(() => {
      message.success('租户恢复成功');
      onCancel();
      onOk();
    });
  };

  return (
    <Modal
      title={recoverTenant.type === ModalStatus.ALL ? '批量恢复租户' : '恢复租户'}
      open={recoverTenant.visible}
      onCancel={onCancel}
      onOk={onSubmit}
    >
      确定恢复
      {recoverTenant.type === ModalStatus.ALL ? '以下租户' : `「${recoverTenant.names[0]}」`}
      的租户使用权限？
      <CheckTenant type={recoverTenant.type} list={recoverTenant.names} />
    </Modal>
  );
};

export default RecoverModal;
