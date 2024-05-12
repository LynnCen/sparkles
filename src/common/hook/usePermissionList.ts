import { useState, useEffect } from 'react';
import { userPermissionList } from '@/common/api/permission';

/*
 * 获取权限列表
 *
 */

export function usePermissionList() {
  const [permissionResult, setPermissionResult] = useState([]);

  useEffect(() => {
    (async () => {
      const permissionResult: any = await userPermissionList();
      setPermissionResult(permissionResult);
    })();
  }, []);

  return permissionResult;
}
