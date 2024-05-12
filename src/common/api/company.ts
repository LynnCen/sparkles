import { post } from '@/common/request/index';

export function companyCreate(params?: any) {
  return post('/company/create', { ...params }, true);
}

export function companyUpdate(params?: any) {
  return post('/company/update', { ...params }, true);
}

export function companyDelete(params?: any) {
  return post('/company/delete', { ...params }, true);
}

export function companyList(params?: any) {
  return post('/company/pages', { ...params }, true);
}
