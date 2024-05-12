/**
 * 用户列表
 */
import React, { useRef, useImperativeHandle } from 'react';
import { userSearch } from '@/common/api/user';
import Fuzzy from './Fuzzy';

export interface UserListItem {
  /**
   * ID
   */
  id: number;
  /**
   * 手机号
   */
  mobile: string;
  /**
   * 姓名
   */
  name: string;
}

const UserList: React.FC<any> = ({
  extraParams = {},
  finallyData,
  getUserListFunc = userSearch,
  onRef,
  immediateOnce,
  needTenantLink,
  ...props
}) => {
  const fuzzyRef = useRef<any>();

  useImperativeHandle(onRef, () => ({
    addOption: fuzzyRef.current.addOption,
    setOptions: fuzzyRef.current.setOptions,
    getItem: fuzzyRef.current.getItem,
    reload: fuzzyRef.current.reload,
  }));

  // 获取用户列表
  const loadData = async (keyword: string) => {
    if (!extraParams.tenantId && needTenantLink) {
      finallyData && finallyData([]);
      return Promise.resolve([]);
    }
    const params = {
      keyword,
      ...extraParams,
    };
    const result = await getUserListFunc(params);
    finallyData && finallyData(result);
    return Promise.resolve(result);
  };

  return (
    <Fuzzy
      ref={fuzzyRef}
      loadData={loadData}
      fieldNames={{
        label: 'name',
        value: 'id'
      }}
      immediateOnce={immediateOnce}
      {...props} />
  );
};

export default UserList;
