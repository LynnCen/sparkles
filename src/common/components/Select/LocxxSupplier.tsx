/**
 * locxx供应商列表
 */
import React from 'react';
import Fuzzy from './Fuzzy';
import { post } from '@/common/request';

const Supplier: React.FC<any> = ({
  extraParams = {},
  ...props
}) => {
  // 获取供应商列表
  const loadData = async (keyword: string) => {
    const params = {
      keyword,
      ...extraParams,
    };
    const result = await post('/common/tenant/search', params, { proxyApi: '/zhizu-api' });
    return Promise.resolve(result.objectList);
  };

  return (
    <Fuzzy
      loadData={loadData}
      mode='multiple'
      fieldNames={{
        label: 'name',
        value: 'id'
      }}
      {...props} />
  );
};

export default Supplier;
