import { get } from '@/common/request/index';

/**
 * 资源类目列表
 * https://yapi.lanhanba.com/mock/289/api/res/api/category/list
 */

export function getCategoryRes(params?: any) {
  return get('/category/list', { ...params }, { isMock: false, needCancel: false, needHint: true });
}
