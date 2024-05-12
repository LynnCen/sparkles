/**
 * @Description 获取租户类型
 */
import {
  useMemo,
  useContext
} from 'react';
import UserInfoContext from '@/layout/context';


export function useTenantType() {
  const userInfo: any = useContext(UserInfoContext); // 获取用户信息

  return useMemo(() => {
    // tenantStatus 0:试用企业，1：正式企业； 默认1
    return { tenantStatus: userInfo?.tenantStatus };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo?.id]);

}

