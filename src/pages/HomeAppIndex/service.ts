import request from '@/utils/request';
import { QueryType, EditType, ItemInfoType } from './data';

export async function queryList(params?: QueryType) {
  return request('/oplapplet/recommend/list', {
    params,
    method: 'GET',
  });
}
export async function queryInfoById(id?: string): Promise<ItemInfoType> {
  return request('/oplapplet/recommend', {
    params: { id },
    method: 'GET',
  });
}

export async function updateById(params?: EditType) {
  return request('/oplapplet/recommend/update', {
    data: params,
    method: 'POST',
  });
}
export async function addNew(params?: EditType) {
  return request('/oplapplet/recommend', {
    data: params,
    method: 'POST',
  });
}

export async function deleteById(params: { id: string }) {
  return request('/applet/applet/delete', {
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

export async function setStatusById(params: { id: string; status: number }) {
  return request('/oplapplet/recommend/changestatus', {
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
