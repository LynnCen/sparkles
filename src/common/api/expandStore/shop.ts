/**
 * @Description 标准版-门店管理
 */

import { post } from '@/common/request/index';

/**
 * @description 门店列表
 * https://yapi.lanhanba.com/project/532/interface/api/60878
 */
export function getShopList(params?:any) {
  return post('/standard/shop/page', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 更新门店名称
 * https://yapi.lanhanba.com/project/532/interface/api/60885
 */
export function updateShopName(params?:any) {
  return post('/standard/shop/update/name', params, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 更新门店状态
 * https://yapi.lanhanba.com/project/532/interface/api/60892
 */
export function updateShopStatus(params?:any) {
  return post('/standard/shop/update/status', params, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 状态记录
 * https://yapi.lanhanba.com/project/532/interface/api/60913
 */
export function shopStatusRecords(params?:any) {
  return post('/standard/shop/status/record', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 可变更的状态列表
 * https://yapi.lanhanba.com/project/532/interface/api/60920
 */
export function shopStatusList(params?:any) {
  return post('/standard/shop/status/list', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 筛选项列表
 * https://yapi.lanhanba.com/project/532/interface/api/60941
 */
export function shopSelection(params?:any) {
  return post('/standard/shop/selection/list', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}
