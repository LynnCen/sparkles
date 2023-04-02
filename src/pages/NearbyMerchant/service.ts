import request from '@/utils/request';
import { QueryType, EditType } from './data';

export async function queryList(params?: QueryType) {
  return request('/nearby/business/list', {
    params,
    method: 'GET',
  });
}

export async function queryInfoById(id: string) {
  return request('/nearby/business', {
    method: 'GET',
    params: { id },
  });
}

export async function updateById(params: EditType) {
  return request('/nearby/business/update', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addNew(params: EditType) {
  return request('/nearby/business', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function deleteById(params: { id: string }) {
  return request('/nearby/business', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function setStatusById(params: { id: string; status: number }) {
  return request('/nearby/business/forbidden', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
