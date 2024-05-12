/**
 * 邻汇吧项目列表
 */
import React from 'react';
import Fuzzy from './Fuzzy';
import { post } from '@/common/request';

const UserList: React.FC<any> = ({
  extraParams = {},
  ...props
}) => {
  // 获取邻汇吧项目列表
  const loadData = async (keyword: string) => {
    const params = {
      keyword,
      ...extraParams,
    };
    const result = await post('/project/queryList', params, { proxyApi: '/lcn-api' });
    return Promise.resolve(result);
  };

  return (
    <Fuzzy
      loadData={loadData}
      fieldNames={{
        label: 'name',
        value: 'id'
      }}
      {...props} />
  );
};

export default UserList;
