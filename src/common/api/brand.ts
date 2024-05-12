import { get, post } from '@/common/request/index';

/**
 * 品牌列表
 * https://yapi.lanhanba.com/project/289/interface/api/33235
 */
export function brandList(params?: any) {
  return get('/resource/brand/page', { ...params, size: 100 }, { isMock: false, needHint: true });
}


export function brandSearch(params?: any) {
  return post('/resource/brand/list', { ...params, size: 100 }, { isMock: false, needHint: true });
}



/**
 * 应用版本下拉框列表
 * https://yapi.lanhanba.com/project/378/interface/api/52100
 */
export function appVersionList(params?: any) {
  return get('/app/selectList/appVersion', { ...params }, { isMock: false, needHint: true, proxyApi: '/mirage' });
}
