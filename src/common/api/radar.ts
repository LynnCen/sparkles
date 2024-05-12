import { get, post } from '@/common/request/index';

/**
 * 地址获取
 * https://yapi.lanhanba.com/project/341/interface/api/34204
 */
export function radarAddressList(params?: any) {
  return get('/radar/addressLibrary', { ...params }, { isMock: false, isRadar: true, needHint: true });
}

/**
 * 获取类目列表
 * https://yapi.lanhanba.com/project/341/interface/api/34205
 */
export function radarCategoryList(params?: any) {
  return get('/radar/category', { ...params }, { isMock: false, isRadar: true, needHint: true });
}

/**
 * 获取任务列表
 * https://yapi.lanhanba.com/project/341/interface/api/34206
 */
export function radarList(params?: any) {
  return get('/radar/selectTasksByPage', { ...params }, { isMock: false, isRadar: true, needHint: true });
}

/**
 * 获取任务详情
 * https://yapi.lanhanba.com/project/341/interface/api/34207
 */
export function radarDetail(params?: any) {
  return get('/radar/selectTaskInfoById', { ...params }, { isMock: false, isRadar: true, needHint: true });
}

/**
 * 任务提交
 * https://yapi.lanhanba.com/project/341/interface/api/34224
 */
export function submitRadarTask(params?: any) {
  return post('/radar/submitTask', { ...params }, { isMock: false, isRadar: true, needHint: true });
}

/**
 * 任务终止
 * https://yapi.lanhanba.com/project/341/interface/api/34225
 */
export function stopRadarTask(params?: any) {
  return post('/radar/stopTask', { ...params }, { isMock: false, isRadar: true, needHint: true });
}
