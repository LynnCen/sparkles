import request from '@/utils/request';
import { QueryType, EditType, CateGoryInfo, CateType } from './data';

export async function queryList(params?: QueryType): Promise<{ data: CateType[] }> {
  return request('/oplapplet/category/list', {
    params,
    method: 'GET',
  });
}
export async function queryInfoById(id?: string): Promise<CateGoryInfo> {
  return request('/oplapplet/category', {
    params: { id },
    method: 'GET',
  });
}

export async function updateById(params?: EditType) {
  return request('/oplapplet/category/update', {
    data: params,
    method: 'POST',
  });
}
export async function addNew(params?: EditType) {
  return request('/oplapplet/category', {
    data: params,
    method: 'POST',
  });
}

export async function deleteById(params: { _id: string }) {
  return request('/applet/category/list', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function setStatusById(params: { id: string; status: number }) {
  return request('/oplapplet/category/changestatus', {
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
