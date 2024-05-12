/* 角色管理-权限 */
import { FC } from 'react';

import Permission from '@/views/organization/pages/permission/entry';
import { RolePermissionProps } from '../ts-config';
import { Drawer } from 'antd';

const RoleManage: FC<RolePermissionProps> = ({ rolePermission, onClose }) => {
  return (
    <Drawer
      title={`角色权限-${rolePermission.title}`}
      placement='right'
      closable={true}
      keyboard={true}
      maskClosable={false}
      onClose={() => onClose()}
      open={rolePermission.visible}
      getContainer={false}
      width={'100%'}
      zIndex={100}
      style={{ position: 'absolute' }}>
      { rolePermission.visible && <Permission roleId={rolePermission.id} onClose={onClose}/> }
    </Drawer>
  );
};

export default RoleManage;
