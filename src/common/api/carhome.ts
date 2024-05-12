import { get, post } from '@/common/request/index';

/**
 * 汽车行业首页 selections接口
 * https://yapi.lanhanba.com/project/455/interface/api/44638
 */
export function carHomeSelections() {
  return get(
    '/carStore/selection',
    {},
    {
      isMock: false,
      mockId: 455,
      mockSuffix: '/api',
      needHint: true,
    }
  );
}

/**
 * 汽车行业首页地图门店数量
 * https://yapi.lanhanba.com/project/455/interface/api/45184
 */
export function carHomeMapCount(params) {
  return post('/carStore/map/count', { ...params });
}

/**
 * 汽车行业首页地图门店poi点位
 * https://yapi.lanhanba.com/project/455/interface/api/45184
 */
export function carHomeMapPoi(params) {
  return post('/carStore/map', { ...params });
}

/**
 * 汽车行业首页地图门店漏斗图
 * https://yapi.lanhanba.com/project/455/interface/api/45226
 */
export function carHomeFunnel(params) {
  return post('/carStore/funnel', { ...params });
}

/**
 * 汽车行业首页转化及成本分析table
 * https://yapi.lanhanba.com/project/455/interface/api/45226
 */
export function carHomeTable(params) {
  return post(
    '/carStore/top',
    { ...params },
    {
      needCancel: false,
    }
  );
}
