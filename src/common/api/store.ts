import { get, post } from '@/common/request/index';

/**
 * 门店管理 - 门店列表：https://yapi.lanhanba.com/project/297/interface/api/33381
 */
export function getStoreList(params: Record<string, any>) {
  return get('/store/list', params);
}

/**
 * 门店管理 - 设置管理员：https://yapi.lanhanba.com/project/297/interface/api/33382
 */
export function postStoreManagers(params: Record<string, any>) {
  return post('/store/manager', params);
}

/**
 * 门店对比 - 客流数据：https://yapi.lanhanba.com/project/297/interface/api/33371
 */
export function compareStores(params: Record<string, any>) {
  return post('/store/compare', params);
}

/**
 * 校验行业：https://yapi.lanhanba.com/project/297/interface/api/33374
 */
export function checkIndustry(params: Record<string, any>) {
  return get('/store/check/industry', params);
}

/**
 * 门店下的设备列表：https://yapi.lanhanba.com/project/297/interface/api/33301
 */
export function storeDevices(params: Record<string, any>) {
  return get('/store/devices', params);
}
/**
 * 门店下拉选项：https://yapi.lanhanba.com/project/297/interface/api/33569
 */
export function storeSelection() {
  return get('/store/selection', {});
}

/**
 * 订单相关权限：https://yapi.lanhanba.com/project/297/interface/api/54816
 */
export function storePermission() {
  return get('/store/permission', {});
}

/**
 * 概览-动态配置项：https://yapi.lanhanba.com/project/297/interface/api/54893
 */
export function dynamicStatistics() {
  return get('/store/statistics/dynamic', {});
}

/**
 * 设备摄像头截图列表：https://yapi.lanhanba.com/project/297/interface/api/56979
 */
export function storeDeviceHistoryHeatMap(params) {
  return post('/store/device/images', { ...params });
}
