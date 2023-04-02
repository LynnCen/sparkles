import request from '@/utils/request';
import { QueryType, EditType } from './data';

export async function queryList(params?: QueryType) {
  return request('/oplapplet/banner/list', {
    params,
    method: 'GET',
  });
}
export async function queryInfoById(id?: string) {
  return request('/oplapplet/banner', {
    params: { id },
    method: 'GET',
  });
}

export async function updateById(params?: EditType) {
  return request('/oplapplet/banner/update', {
    data: params,
    method: 'POST',
  });
}
export async function addNew(params?: EditType) {
  return request('/oplapplet/banner', {
    data: params,
    method: 'POST',
  });
}

export async function deleteById(params: { _id: string }) {
  return request('/applet/banner/list', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function queryAllMerchant(params?: QueryType) {
  return request('/merchant/info/all', {
    params,
    method: 'GET',
  });
}
export async function setStatusById(params: { id: string; status: number }) {
  return request('/oplapplet/banner/changestatus', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
