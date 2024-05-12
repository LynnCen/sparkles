import { get } from '@/common/request/index';

/**
 * 岗位列表
 * http://yapi.lanhanba.com/project/289/interface/api/33068
 */

export function positionList(params?: any) {
  return get('/position/list', { ...params }, {
    needHint: true,
    proxyApi: '/mirage'
  });
}

/**
 *
 * 岗位搜索
 * https://yapi.lanhanba.com/project/289/interface/api/33215
 */
export function positionSearch(params?: any) {
  return get('/position/search', { ...params }, {
    needHint: true,
    proxyApi: '/mirage'
  });
}
