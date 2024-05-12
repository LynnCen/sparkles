import { get, post } from '../request';

/**
 * 门店管理—门店客流分析-https://yapi.lanhanba.com/project/455/interface/api/44400
 */
export function storeFlowList(params?:any) {
  return get('/carStore/carStoreFlow', params, {
    isMock: false,
    mockId: 455,
    mockSuffix: '/api',
    needHint: true
  });
}

/**
 * 门店管理—门店客流分析-https://yapi.lanhanba.com/project/455/interface/api/44631
 */
export function storeCostList(params?:any) {
  return get('/carStore/carStoreCost', params, {
    isMock: false,
    mockId: 455,
    mockSuffix: '/api',
    needHint: true
  });
}

/**
 * 机会点详情-https://yapi.lanhanba.com/project/353/interface/api/34428
 */
export function getDetail(params:any) {
  return post(`/chancePoint/detail`, params, {
    isMock: false,
    mockId: 353,
    mockSuffix: '/api',
    needHint: true
  });
}


/**
 * 商场初筛-场地详情中的-资源库商场详情入口-https://yapi.lanhanba.com/project/329/interface/api/52177
 */
export function getPlaceDetailResourceStore(params:any) {
  return post(`/place/coarseSieve/appraisalReportTop`, params, {
    isMock: false,
    mockId: 353,
    mockSuffix: '/api',
    needHint: true
  });
}

/**
 * 导出pdf的url - https://yapi.lanhanba.com/project/329/interface/api/39990
 */
export function getExportUrl(params:any) {
  return post(`/checkSpot/review/exportUrl`, params);
}

/**
 * 踩点任务分时段客流列表 - https://yapi.lanhanba.com/project/329/interface/api/56615
 */
export function getProjectInfo(params:any) {
  return post(`/checkSpot/project/flow`, params);
}

/**
 * 从商场粗筛跳场地详情 -- https://yapi.lanhanba.com/project/329/interface/api/52149
 */
export function getPlaceDetail(params:any) {
  return post(`/place/coarseSieve/show`, params);
}

/**
 * 场地竞争力报告 --- https://yapi.lanhanba.com/project/329/interface/api/52170
 */
export function getAppraisalReport(params:any) {
  return post(`/place/coarseSieve/appraisalReport`, params);
}

/**
 * 商场poi点位列表
 * https://yapi.lanhanba.com/project/331/interface/api/58057
 */
export function getPoiList(params:any) {
  return post(`/place/coarseSieve/poi`, params);
}

/**
 * 视频文件hash查询
 * https://yapi.lanhanba.com/project/329/interface/api/70293
 */
export function getVideoHashData(params: any) {
  return post(`/checkSpot/video/hash`, params);
}
