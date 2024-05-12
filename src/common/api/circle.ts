import { get } from '@/common/request/index';

/**
 * 商圈列表
 * https://yapi.lanhanba.com/mock/289/api/businessCircle/list
 */

export function circleList(params?: any) {
  return get('/businessCircle/list', { ...params }, { isMock: false, needHint: true });
}
