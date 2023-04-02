import request from '@/utils/request';
import { QueryType, EditType } from './data';

export async function queryList(params?: QueryType) {
  return request('/moment/ad/list', {
    params,
    method: 'GET',
  });
}
export async function queryInfoById(id?: string) {
  return request('/moment/ad', {
    params: { id },
    method: 'GET',
  });
}

export async function updateById(params?: EditType) {
  return request('/moment/ad/update', {
    data: params,
    method: 'POST',
  });
}
export async function addNew(params?: EditType) {
  return request('/moment/ad', {
    data: params,
    method: 'POST',
  });
}

export async function deleteById(params: { _id: string }) {
  return request('/moment/ad', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function setStatusById(params: { id: string; status: number }) {
  return request('/moment/ad/delete', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function queryAllCategory() {
  return request('/applet/category/all', {
    method: 'GET',
  });
}
