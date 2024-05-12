import { get } from '@/common/request/index';

/**
 * 岗位列表
 * https://yapi.lanhanba.com/project/297/interface/api/33454
 */

export function positionList(params?: any) {
  return get('/position/pageQuery', { ...params }, true);
}

/**
 *
 * 岗位搜索
 * https://yapi.lanhanba.com/project/297/interface/api/33459
 */
export function positionSearch(params?: any) {
  return get('/position/search', { ...params }, true);
}
