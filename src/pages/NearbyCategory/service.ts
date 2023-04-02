import request from '@/utils/request';
import { NearbyCategoryParams, EditType } from './data';

export async function queryList(params?: NearbyCategoryParams): Promise<any> {
  return request('/nearby/cate/list', {
    params,
    method: 'GET',
  });
}

export async function getInfoById(id: string) {
  return request('/nearby/cate', {
    params: { id },
    method: 'GET',
  });
}

export async function updateById(params: EditType) {
  return request('/nearby/cate/update', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addNew(params: EditType) {
  return request('/nearby/cate', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function deleteById(params: { _id: string }) {
  return request('/nearby/cate', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function setStatusById(params: { id: string; status: number }) {
  return request('/nearby/cate/forbidden', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
