import request from '@/utils/request';
// import md5 from 'js-md5';
import type { QueryParamsType, EditType, AddNewType, ItemType } from './data';

export async function queryList(params?: QueryParamsType) {
  return request('/merchant/info/list', {
    params,
    method: 'GET',
  });
}

export async function queryInfoById(id: string): Promise<ItemType> {
  return request('/merchant/info', {
    params: { id },
    method: 'GET',
  });
}

export async function updateById(params: EditType) {
  return request('/merchant/info/update', {
    method: 'POST',
    data: {
      ...params,
      password: params.password === '' ? undefined : params.password,
    },
  });
}

export async function addNew(params: Partial<AddNewType>) {
  return request('/merchant/info', {
    method: 'POST',
    data: {
      ...params,
      // password: params.password && md5(params.password),
    },
  });
}

export async function deleteById(params: { id: string }) {
  return request('/merchant/info', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function setStatusById(params: { id: string; status: number }) {
  return request('/merchant/info/forbidden', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function queryRoleOrg() {
  return request('/role/org', { method: 'GET' });
}
