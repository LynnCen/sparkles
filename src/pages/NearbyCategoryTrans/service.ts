import request from '@/utils/request';
import { NearbyCategoryTransParams, EditType } from './data';

export async function queryList(params?: NearbyCategoryTransParams) {
  return request('/nearby/cate_trans/list', {
    params,
    method: 'GET',
  });
}

export async function getInfoById(id: string) {
  return request('/nearby/cate_trans', {
    params: { id },
    method: 'GET',
  });
}

export async function updateById(params: EditType) {
  return request('/nearby/cate_trans/update', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addNew(params: EditType) {
  return request('/nearby/cate_trans', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function deleteById(params: { _id: string }) {
  return request('/nearby/cate_trans', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function setStatusById(params: { id: string; status: number }) {
  return request('/nearby/cate_trans/forbidden', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getAllCategory() {
  return request('/nearby/business/cate', { method: 'GET' });
}

export async function getAllProperty() {
  return request('/nearby/business/property', { method: 'GET' });
}
