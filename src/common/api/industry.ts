import { get } from '@/common/request/index';

/**
 * 标签分类列表
 * https://yapi.lanhanba.com/mock/289/api/industry/list
 */

export function industryList(params?: any) {
  return get('/resource/industry/list', { ...params }, { isMock: false, needHint: true });
}
