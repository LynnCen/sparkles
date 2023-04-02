import request from '@/utils/request';
import { QueryParamsType, EditType } from './data';

export async function queryList(params?: QueryParamsType) {
  return request('/setting/jump_manage/list', {
    params,
    method: 'GET',
  });
}
export async function queryInfoById(id?: string) {
  return request('/setting/jump_manage', {
    params: { id },
    method: 'GET',
  });
}

export async function updateById(params?: EditType) {
  return request('/setting/jump_manage/update', {
    data: params,
    method: 'POST',
  });
}
export async function addNew(params?: EditType) {
  return request('/setting/jump_manage', {
    data: params,
    method: 'POST',
  });
}

export async function deleteById(params: { _id: string }) {
  return request('/setting/jump_manage/list', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function setStatusById(params: { id: string; status: number }) {
  return request('/setting/jump_manage/forbidden', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
