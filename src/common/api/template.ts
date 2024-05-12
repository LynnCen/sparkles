import { get } from '@/common/request/index';

/**
 * 类目模板列表
 * https://yapi.lanhanba.com/mock/289/api/categoryTemplate/page
 */

export function resTemplateList(params?: any) {
  return get('/categoryTemplate/page', { ...params }, { isMock: false, needHint: true });
}

/**
 * 类目模板详情
 * https://yapi.lanhanba.com/mock/289/api/categoryTemplate/detail
 */

export function resTemplateDetail(params?: any) {
  return get('/categoryTemplate/detail', { ...params, needHint: true });
}
