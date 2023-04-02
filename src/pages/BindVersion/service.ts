import request from '@/utils/request';
// import md5 from 'js-md5';
import type { QueryParamsType, BindVersionType } from './data';

export async function queryList(params?: QueryParamsType) {
  return request('/schedule/index/getfinishoptions', {
    params,
    method: 'GET',
  });
}
export async function bindVersion(params?: BindVersionType) {
  return request('/schedule/index/bindVersion', {
    data: {
      ...params,
    },
    method: 'POST',
  });
}
