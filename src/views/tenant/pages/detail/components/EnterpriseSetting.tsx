/* 企业设置 */
import { FC, useState } from 'react';
import { Tabs } from 'antd';
import Department from '@/views/organization/pages/department/entry';
import Post from '@/views/organization/pages/post/entry';
import Role from '@/views/organization/pages/role/entry';
import User from '@/views/organization/pages/user/entry';
import Permission from '@/views/organization/pages/permission/entry';
import { TenantDetailProps } from '../ts-config';
import styles from './index.module.less';

const { TabPane } = Tabs;

const TABS = [
  { key: 'department', tab: '部门管理', component: Department },
  { key: 'post', tab: '岗位管理', component: Post },
  { key: 'user', tab: '员工管理', component: User },
  { key: 'role', tab: '角色管理', component: Role },
  { key: 'permission', tab: '权限管理', component: Permission },
];

const EnterpriseSetting: FC<TenantDetailProps> = ({ tenantId }) => {
  const [currentTab, setCurrentTab] = useState<string>('department');
  const onChangeTab = (key: string) => {
    setCurrentTab(key);
  };

  return (
    <div className={styles.enterpriseSetting}>
      TODO: 等用起来之后需要更改为 4.24.3+用法
      <Tabs tabPosition='left' activeKey={currentTab} onChange={onChangeTab}>
        {TABS.map((item) => (
          <TabPane tab={item.tab} key={item.key}>
            {item.key === currentTab ? <item.component tenantId={tenantId} /> : null}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default EnterpriseSetting;
