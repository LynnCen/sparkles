/**
 * 预测
 */
import { get, post } from '@/common/request/index';

/**
  * 下拉框选项 https://yapi.lanhanba.com/project/331/interface/api/33934
  */
export function shopRecommendSelection(params: any) {
  return get('/shop/selection', { ...params },);
}

/**
 * 开店行业下拉选项 https://yapi.lanhanba.com/project/331/interface/api/34452
 */
export function shopRecommendIndustrySelection(params: any) {
  return get('/shop/custom/industry/list', { ...params },);
}

/**
  * 生成推荐区域 https://yapi.lanhanba.com/project/331/interface/api/33935
  */
export function shopRecommendGenerate(params: any) {
  return post('/shop/custom/generate', { ...params },);
}
/**
  * 报告详情 https://yapi.lanhanba.com/project/331/interface/api/33939
  */
export function shopRecommendDetail(params: any) {
  return post('/shop/custom/report', { ...params },);
}

/**
  * 区域聚合数据 https://yapi.lanhanba.com/project/331/interface/api/33952
  */
export function shopRecommendGrids(params: any) {
  return post('/shop/custom/grids', { ...params },);
}

/**
  * 点的数据 https://yapi.lanhanba.com/project/331/interface/api/33949
  */
export function shopRecommendPoints(params: any) {
  return post('/shop/custom/points', { ...params },);
}

/**
 * 已废弃，待删除
 * 拓店任务下拉框 https://yapi.lanhanba.com/project/208/interface/api/32906
 */
export function taskSelection(params: any) {
  return post('/selection/list', { ...params }, { isCheckSpot: true });
}

/**
 * 已废弃，待删除
 * 创建拓店任务 https://yapi.lanhanba.com/project/208/interface/api/27389
 */
export function taskCreate(params: any) {
  return post('/expand/task/create', { ...params }, { isCheckSpot: true });
}

/**
 * 已废弃，待删除
 * 拓店任务指派 https://yapi.lanhanba.com/project/208/interface/api/
 */
export function taskAssigned(params: any) {
  return post('/expand/task/assign', { ...params }, { isCheckSpot: true });
}

/**
 * 获取标准模型报告列表
 * https://yapi.lanhanba.com/project/331/interface/api/34614
 */
export function modelCircle(params: any) {
  return get('/shop/model/circle/list', { ...params }, {
    isMock: false,
    mockId: 331,
    mockSuffix: '/api',
    needHint: true
  });
}

/**
 * 获取标准模型报告POI统计(0104)
 * https://yapi.lanhanba.com/project/331/interface/api/67528
 */
export function modelCircleCount(params: any) {
  return post('/shop/model/report/attribute/list', { ...params }, {
    needCancel: false,
    isMock: false,
    mockId: 331,
    mockSuffix: '/api',
    needHint: true
  });
}

/**
 * 获取标准模型报告POI点位列表(0104)
 * https://yapi.lanhanba.com/project/331/interface/api/67528
 */
export function modelCirclePoiList(params: any) {
  return post('/shop/model/report/attribute/poi/page', { ...params }, {
    isMock: false,
    mockId: 331,
    mockSuffix: '/api',
    needHint: true
  });
}

/**
 * 模型推荐圈POI列表
 * https://yapi.lanhanba.com/project/331/interface/api/34628
 */
export function modelPOIList(params: any) {
  return get('/shop/model/poi/list', { ...params }, {
    isMock: false,
    mockId: 331,
    mockSuffix: '/api',
    needHint: true,
    needCancel: false
  });
}

// 可以删除掉！
/**
 * 获取门店json数据
 * https://yapi.lanhanba.com/project/331/interface/api/34978
 */
export function getPoiJson(params: any) {
  return get('/config/info', { ...params }, {
    isMock: false,
    mockId: 331,
    mockSuffix: '/api',
    needHint: true,
    needCancel: false
  });
}

/**
 * 根据区域code和品牌名获取区域内相关店铺信息
 * https://yapi.lanhanba.com/project/331/interface/api/35279
 */
export function getStorePoiByCodeAndName(params: any) {
  return post('/shop/poi/list', { ...params },);
}

/**
 * 标准模型报告列表
 * https://yapi.lanhanba.com/project/331/interface/api/34349
 */

export function getModelReport(params: any) {
  return get('/shop/model/report', { ...params });
};

/**
 * 报告详情-点位信息
 * https://yapi.lanhanba.com/project/331/interface/api/36595
 */
export function getModelReportPOI(params: any) {
  return get('/shop/model/report/poi', { ...params }, {
    isMock: false,
    mockId: 331,
    mockSuffix: '/api',
    needCancel: false,
  },);
};

/**
 * 报告详情-城市信息
 * https://yapi.lanhanba.com/project/331/interface/api/36588
 */
export function getModelReportCity(params: any) {
  return get('/shop/model/report/city', { ...params }, {
    isMock: false,
    mockId: 331,
    mockSuffix: '/api',
  });
};

/**
 * 根据区域code和品牌名获取区域内相关店铺信息
 * https://yapi.lanhanba.com/project/331/interface/api/35279
 */
export function deleteReport(params: any) {
  return post('/shop/report/delete', { ...params },);
}

/**
 * 报告点位详情tab列表
 * https://yapi.lanhanba.com/project/331/interface/api/46290
 */
export function getCategoryList(params:any) {
  return get('/shop/report/category/list', params, {
    isMock: false,
    mockId: 331,
    mockSuffix: '/api'
  });
}

/**
 * 品牌
 *https://yapi.lanhanba.com/project/349/interface/api/46192
 */
export function getBrand(params:any) {
  return get(`/industry/brand/search`, params, { needCancel: false });
}

/**
 * 模型推荐
 *https://yapi.lanhanba.com/project/331/interface/api/34345
 */
export function generateReport(params:any) {
  return post(`/shop/model/report/generate`, params,);
}

/**
 * 推荐模型列表：https://yapi.lanhanba.com/project/331/interface/api/34329
 */
export function recommendModelList(params: any) {
  return get('/shop/model/list', params);
}

/**
 * 行业品牌对比 地图数量(全国/省份)
 * https://yapi.lanhanba.com/project/349/interface/api/56846
 */
export function getBrandCount(params:any) {
  return post(`/industry/brand/compare/map/count`, params, { needCancel: false });
}

/**
 * 行业品牌分组主力省市比较全国排名
 * https://yapi.lanhanba.com/project/349/interface/api/56909
 */
export function getBrandRank(params?:any) {
  return post(`/industry/brand/compare/rank`, params);
}

/**
 * 行业品牌对比统计数据
 * https://yapi.lanhanba.com/project/349/interface/api/56923
 */
export function getChartData(params?:any) {
  return post(`/industry/brand/compare/chart`, params, { needCancel: false });
}

/**
 * 行业品牌城市等级展示
 * https://yapi.lanhanba.com/project/349/interface/api/65008
 */
export function getCityTypeChartData(params?:any) {
  return post(`/industry/brand/shop/count/chart`, params, { needCancel: false });
}

/**
 * 行业品牌门店筛选项
 * https://yapi.lanhanba.com/project/349/interface/api/60521
 */
export function getBrandType() {
  return get(`/industry/brand/shop/compare/selection`);
}

/**
 * 行业品牌门店类型对比统计数据
 * https://yapi.lanhanba.com/project/349/interface/api/60500
 */
export function getStoreTypeData(params:any) {
  return post(`/industry/brand/shop/compare/chart`, params, { needCancel: false });
}

/**
 * 行业品牌门店新增统计数据
 * https://yapi.lanhanba.com/project/349/interface/api/60514
 */
export function getAddShopData(params:any) {
  return post(`/industry/brand/shop/add/chart`, params, {
    isMock: false,
    mockId: 349,
    mockSuffix: '/api',
    needHint: true
  });
}

/**
 * 行业品牌门店闭店统计数据
 * https://yapi.lanhanba.com/project/349/interface/api/70412
 */
export function getCloseShopData(params:any) {
  return post(`/industry/brand/shop/close/chart`, params, {
    isMock: false,
    mockId: 349,
    mockSuffix: '/api',
    needHint: true
  });
}

/**
 * 行业品牌区域分布门店分类排名详情
 * https://yapi.lanhanba.com/project/349/interface/api/60619
 */
export function getCompareBrandRank(params:any) {
  return post(`/industry/brand/shop/compare/rank`, params, { needCancel: false });
}
