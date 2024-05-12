import { get } from '@/common/request/index';

/**
 * 标签分类列表
 * https://yapi.lanhanba.com/mock/289/api/labelClassification/list
 */

export function labelClassificationList(params?: any) {
  return get('/labelClassification/list', { ...params }, { isMock: false, needHint: true });
}
