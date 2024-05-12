import { get, post } from '@/common/request/index';

/**
 * 属性分类列表
 * https://yapi.lanhanba.com/mock/289/api/propertyClassification/list
 */

export function propertyClassificationList(params?: any) {
  return get('/propertyClassification/list', { ...params }, { isMock: false, needHint: true });
}

export function propertyList(params?: any) {
  return get('/property/list', { ...params }, { isMock: false, needHint: true });
}

export function dynamicPropertyList(params?: any) {
  return post('/dynamic/property/query', { ...params }, { isMock: false, needHint: true, proxyApi: '/blaster' });
}
