/**
 * 门店地图
*/
import { post } from '../request';

/**
 * 门店地图区域点位聚合计算---(通用版)
 * https://yapi.lanhanba.com/project/532/interface/api/60437
 */
export function areaCountStandard(params: any) {
  return post(`/standard/map/area/count`, params, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * 门店地图左侧属性个数---(通用版)
 * https://yapi.lanhanba.com/project/532/interface/api/60430
 */
export function storePointCountStandard(params: any) {
  return post(`/standard/map/count`, params, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}


/**
 * 门店地图城市点位搜索---(通用版)
 * https://yapi.lanhanba.com/project/532/interface/api/60444
 */
export function storeMapSearchStandard(params: any) {
  return post('/standard/map/search', params, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

