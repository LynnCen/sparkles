import request from '@/utils/request';
import { QueryParamsType, EditType } from './data';

export async function queryList(params?: QueryParamsType) {
  return request('/setting/promote/list', {
    params,
    method: 'GET',
  });
}
export async function queryInfoById(id?: string) {
  return request('/setting/promote', {
    params: { id },
    method: 'GET',
  });
}

export async function updateById(params?: EditType) {
  return request('/setting/promote/update', {
    data: params,
    method: 'POST',
  });
}
export async function addNew(params?: EditType) {
  return request('/setting/promote', {
    data: params,
    method: 'POST',
  });
}

export async function deleteById(params: { _id: string }) {
  return request('/setting/promote/list', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function setStatusById(params: { id: string; status: number }) {
  return request('/setting/promote/forbidden', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}
