import request from '@/utils/request';
// import md5 from 'js-md5';
import type { QueryParamsType, EditType, AddNewType, ItemType } from './data';

export async function queryList(params?: QueryParamsType) {
  return request('/schedule/index', {
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
  return request('/schedule/index/update', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addNew(params: Partial<AddNewType>) {
  return request('/schedule/index', {
    method: 'POST',
    data: {
      ...params,
      // password: params.password && md5(params.password),
    },
  });
}

export async function deleteById(params: { id: string }) {
  return request('/schedule/index/delete', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function cancelCompleted(params: { id: string; status: number }) {
  return request('/schedule/index/update', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
