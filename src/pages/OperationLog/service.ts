import request from '@/utils/request';
import { QueryParams } from '@/pages/OperationLog/data';
import { PostJson } from '@/ts_pkc/ts-baselib';

export async function queryList(params?: QueryParams): Promise<any> {

  // return PostJson(
  //   '/log/list',
  //   params,

  // )
  return request('/log/list', {
    params,
    method: 'GET',
  });
}
