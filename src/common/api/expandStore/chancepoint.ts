/**
 * @Description 拓店-标准版本-机会点
 */

import { get, post } from '@/common/request/index';



/**
 * @description 机会点管理-机会点列表
 * @yapi https:// yapi.lanhanba.com/project/532/interface/api/55509
 */
export function getChancePointList(params?:any) {
  return post('/standard/chancePoint/page', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 机会点管理-机会点详情
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/55530
 */
export function getChancePointDetail(params) {
  return post('/standard/chancePoint/detail', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * 创建踩点任务
 * https://yapi.lanhanba.com/project/532/interface/api/55628
 */
export function footprintCreate(params: any) {
  return post('/standard/checkSpotProject/create', params, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
    isZeus: false,
  });
}

/**
 * 机会点表单页
 * https://yapi.lanhanba.com/project/532/interface/api/55908
 */
export function getFormDetail(params:any) {
  return post(`/standard/chancePoint/formDetail`, params, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
    isZeus: false,
  });
}

/**
 * PC模版列表
 * https://yapi.lanhanba.com/project/532/interface/api/55831
 */

export function getTemplateLists() {
  return post('/standard/template/lists', {}, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}
/**
 * PC模版详情
 * https://yapi.lanhanba.com/project/532/interface/api/55838
 */
export function getTemplateDetail(params:any) {
  return post(`/standard/template/query`, params, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}
/**
 * PC机会点保存
 * https://yapi.lanhanba.com/project/532/interface/api/55796
 */
export function saveChancePoint(params:any) {
  return post(`/standard/chancePoint/save`, params, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}


/**
 * @description 机会点详情-模板导出
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/55852
 */
export function exportTemplateChancePoint(params) {
  return post('/standard/template/export', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 机会点详情-机会点导入
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/55866
 */
export function importChancePoint(params) {
  return post('/standard/chancePoint/import', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 机会点详情-机会点导入历史
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/55880
 */
export function importChancePointRecords(params) {
  return get('/standard/chancePoint/import/records', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 机会点详情-机会点模板状态
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/55859
 */
export function importChancePointStatus(params) {
  return post('/standard/chancePoint/import/status', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * PC端机会点分页(动态配置列)
 * https://yapi.lanhanba.com/project/532/interface/api/59317
 */
export function getDynamicDetail(params) {
  return post(`/standard/chancePoint/dynamicPage`, params, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * PC端机会点机会点下拉框
 * https://yapi.lanhanba.com/project/532/interface/api/59583
 */
export function getChancepointSelection(params) {
  return get(`/standard/chancePoint/selection`, params, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * 导出机会点
 * https://yapi.lanhanba.com/project/532/interface/api/63300
 */
export function chancepointExport(params) {
  return post(`/standard/chancePoint/export`, params, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * 根据机会点经纬度查询最近的规划商圈
 * https://yapi.lanhanba.com/project/532/interface/api/60479
 */
export function chancepointPlanCluster(params) {
  return post(`/standard/chancePoint/planCluster`, params, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * 根据机会点经纬度获取预估销售额
 * https://yapi.lanhanba.com/project/532/interface/api/60577
 */
export function chancepointSaleAmount(params) {
  return post(`/standard/chancePoint/saleAmount`, params, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
    needCancel: false,
  });
}

/**
 * 根据机会点经纬度获取获取客群质量评分
 * https://yapi.lanhanba.com/project/532/interface/api/61375
 */
export function chancepointFlowScore(params) {
  return post(`/standard/chancePoint/flowScore`, params, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
    needCancel: false,
  });
}
/**
 * PC录入的集客点详情
 * https://yapi.lanhanba.com/project/546/interface/api/62271
 */
export function getSpotRelationDetail(params) {
  return get(`/plan/spot/relation/detail`, params, {
    isMock: false,
    mockId: 546,
    mockSuffix: '/api',
    needHint: true,
    needCancel: false,
  });
}

/**
 * 根据机会点经纬度查询最近的选址地图商圈
 * https://yapi.lanhanba.com/project/532/interface/api/69544
 */
export function chancepointModelCluster(params) {
  return post(`/standard/chancePoint/modelCluster`, params, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
    needCancel: false,
  });
}


/**
 * 机会点报告首页
 * https://yapi.lanhanba.com/project/532/interface/api/70685
 */
export function chancepointReportHomeData(params) {
  return post(`/standard/chancePoint/report/home`, params, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
    needCancel: false,
  });
}
