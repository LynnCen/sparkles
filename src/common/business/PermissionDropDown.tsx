import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import React from 'react';

const PermissionDropDown: React.FC<any> = (
  { permissions, methods }) => {
  const menu = (
    <Menu>
      {permissions.map((permission) =>
        <Menu.Item key={permission.event}>
          <Button type='link' onClick={methods[permission.func]}>{permission.name}</Button>
        </Menu.Item>)}
    </Menu>
  );
  return (<Dropdown
    overlay={menu}
    placement='bottomRight'
    arrow
    trigger={['click']}>
    <EllipsisOutlined onClick={(e) => e.stopPropagation()}/>
  </Dropdown>
  );
};
export default PermissionDropDown;

