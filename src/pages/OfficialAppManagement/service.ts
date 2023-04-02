import request from '@/utils/request';
import { QueryType, EditType } from './data';

export async function queryList(params?: QueryType) {
  return request('/merchant/app/list', {
    params,
    method: 'GET',
  });
}
export async function queryInfoById(id?: string) {
  return request('/merchant/app', {
    params: { id },
    method: 'GET',
  });
}

export async function updateById(params?: EditType) {
  return request('/merchant/app/update', {
    data: params,
    method: 'POST',
  });
}
export async function addNew(params?: EditType) {
  return request('/merchant/app', {
    data: params,
    method: 'POST',
  });
}

export async function deleteById(params: { _id: string }) {
  return request('/merchant/app/list', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function setStatusById(params: { id: string; status: number }) {
  return request('/merchant/app/forbidden', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function queryAllMerchant(params?: QueryType) {
  return request('/merchant/info/all', {
    params,
    method: 'GET',
  });
}
