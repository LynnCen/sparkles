import request from '@/utils/request';
import { QueryParamsType, EditType } from './data';

export async function queryList(params?: QueryParamsType) {
  return request('/setting/copywriting/list', {
    params,
    method: 'GET',
  });
}
export async function queryInfoById(id?: string) {
  return request('/setting/copywriting', {
    params: { id },
    method: 'GET',
  });
}

export async function updateById(params?: EditType) {
  return request('/setting/copywriting/update', {
    data: params,
    method: 'POST',
  });
}
export async function addNew(params?: EditType) {
  return request('/setting/copywriting', {
    data: params,
    method: 'POST',
  });
}

export async function setStatusById(params: { id: string; status: number }) {
  return request('/setting/copywriting/forbidden', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
