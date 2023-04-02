import request from '@/utils/request';
import { QueryType, EditType } from './data';

export async function queryList(params?: QueryType) {
  return request('/oplapplet/applet/list', {
    params,
    method: 'GET',
  });
}
export async function queryInfoById(id?: string) {
  return request('/oplapplet/applet', {
    params: { id },
    method: 'GET',
  });
}

export async function updateById(params?: EditType) {
  return request('/oplapplet/applet/update', {
    data: params,
    method: 'POST',
  });
}
export async function addNew(params?: EditType) {
  return request('/oplapplet/applet', {
    data: params,
    method: 'POST',
  });
}

export async function deleteById(params: { id: string }) {
  return request('/oplapplet/applet/delete', {
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
  return request('/oplapplet/applet/changestatus', {
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
