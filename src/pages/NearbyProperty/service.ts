import request from '@/utils/request';
import { ItemParamsType } from './data';

export async function queryList(params?: ItemParamsType) {
  return request('/nearby/property/list', {
    params,
    method: 'GET',
  });
}

export async function getInfoById(id: string) {
  return request('/nearby/property', {
    params: { id },
    method: 'GET',
  });
}

export async function updateById(params: ItemParamsType) {
  return request('/nearby/property/update', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addNew(params: ItemParamsType) {
  return request('/nearby/property', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function setStatusById(params: { id: number; status: number }) {
  return request('/nearby/property/forbidden', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}
