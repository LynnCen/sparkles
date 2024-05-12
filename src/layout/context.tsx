import * as React from 'react';
import { UserInfoProps } from '.';

/**
 * 用法：
 * import { useContext } from 'react';
 * import UserInfoContext from '@/layout/context';
 * const userInfo: Record<string, any> = useContext(UserInfoContext);
 */

const UserInfoContext = React.createContext<UserInfoProps>({ menusItems: [], });

export const UserInfoContextProvider: React.FC<{ userInfo: UserInfoProps, getTenantDetail: any }> = ({ children, userInfo, getTenantDetail }) => (
  // 一个 React 组件可以订阅 context 的变更
  <UserInfoContext.Consumer>
    {(defaultData) => {
      const context = userInfo || defaultData;
      context.getTenantDetail = getTenantDetail;
      return <UserInfoContext.Provider value={context} >{children}</UserInfoContext.Provider>;
    }}
  </UserInfoContext.Consumer>
);

export default UserInfoContext;
