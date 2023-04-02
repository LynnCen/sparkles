import request from '@/utils/request';
import { QueryType, EditType } from './data';

export async function queryList(params?: QueryType) {
  return request('/oplapplet/highlyrecommend/list', {
    params: { ...params, type: 1 },
    method: 'GET',
  });
}
export async function queryInfoById(id?: string) {
  return request('/oplapplet/highlyrecommend', {
    params: { id },
    method: 'GET',
  });
}

export async function updateById(params?: EditType) {
  return request('/oplapplet/highlyrecommend/update', {
    data: { ...params, type: 1 },
    method: 'POST',
  });
}
export async function addNew(params?: EditType) {
  return request('/oplapplet/highlyrecommend', {
    data: { ...params, type: 1, status: 1 },
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
  return request('/oplapplet/highlyrecommend/changestatus', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
