import request from '@/utils/request';
// import md5 from 'js-md5';
import type { QueryParamsType, ResData } from './data';
import { PostJson } from '@/ts_pkc/ts-baselib';
import userspace from '@/userspace';

export async function queryList(params?: QueryParamsType): Promise<ResData> {
  const net = userspace.current?.nf.get('main')

  return request('/schedule/version', {
    params,
    method: 'GET',
  });
}
