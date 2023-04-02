import request from '@/utils/request';

export function query() {
  return request('/setting/spider', { method: 'GET' });
}

export function update(data: any) {
  return request('/setting/spider/update', { method: 'POST', data });
}
