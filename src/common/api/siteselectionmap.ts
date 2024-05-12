/**
 * @Description 选址地图（/iterate/siteselectionmap）
 */
import { get, post } from '@/common/request/index';


/**
 * 商圈缩略概览（除标签、业态分析外）
 * https://yapi.lanhanba.com/project/546/interface/api/67878
 */
export function businessAreaOverview(params: any) {
  return get('/modelCluster/preview', { ...params });
}


/**
 * /iterate/siteselectionmapb页面的商圈概览
 * https://yapi.lanhanba.com/project/546/interface/api/68333
 */
export function areaOverview(params: any) {
  return post('/modelCluster/overview', { ...params });
}

/**
 * 周边poi类目列表（包含数量）
 * https://yapi.lanhanba.com/project/511/interface/api/69782
 */
export function surroundPOICategoryList(params: any) {
  return post('/surround/poi/level_count', { ...params });
}

/**
 * 周边类目下的poi数据分页列表
 * https://yapi.lanhanba.com/project/511/interface/api/69789
 */
export function surroundCategoryPOIDataList(params: any) {
  return post('/surround/poi/level_page', { ...params });
}

/**
 * 选址地图模型 筛选模型 列表（餐饮/汽车/服装）
 * https://yapi.lanhanba.com/project/462/interface/api/70062
 */
export function getSiteModel() {
  return get('/site_model/screeningList', null, {
    isMock: true,
    mockId: 462,
    mockSuffix: '/api/api',
    needHint: true,
  });
}

/**
 * 为当前用户 将商圈 or 点位 移入/移出收藏夹
 * https://yapi.lanhanba.com/project/546/interface/api/70188
 */
export function handleCollectOfFetch(params: any) {
  return post('/clusterLocationFavor/update', { ...params }, {
    isMock: false,
    mockId: 462,
    mockSuffix: '/api/api',
    needHint: true,
  });
}

/**
 * 获取商圈下点位列表
 * https://yapi.lanhanba.com/project/546/interface/api/70160
 */
export function getAreaPoints(params: any) {
  return post('/modelCluster/mallLocation/list', { ...params }, {
    isMock: false,
    mockId: 546,
    mockSuffix: '/api',
    needHint: true,
  });
}


/**
 * 获取商圈下点位列表
 * https://yapi.lanhanba.com/project/546/interface/api/70160
 */
export function getFavoriteList(params: any) {
  return post('/clusterLocationFavor/folderList', { ...params }, {
    isMock: false,
    mockId: 546,
    mockSuffix: '/api',
    needHint: true,
  });
}


/**
 * 导出pdf（定制化:https://docs.lanhanba.net/fe/html2pdf?name=%2Fcustomization%2Fpdf）
 * https://yapi.lanhanba.com/project/546/interface/api/70818
 */
export function exportModelClusterPDF(params:any) {
  return post(`/modelCluster/export/pdf`, params);
}


/**
 * 导出pdf（异步）（定制化:https://docs.lanhanba.net/fe/html2pdf?name=%2Fcustomization%2Fpdf）
 * https://yapi.lanhanba.com/project/546/interface/api/70993
 */
export function exportModelClusterPDFAsync(params:any) {
  return post(`/standard/pdf/export/async`, params);
}

/**
 * 创建自定义新增商圈
 * https://yapi.lanhanba.com/project/546/interface/api/70944
 */
export function createCustomModelCluster(params:any) {
  return post(`/modelCluster/createCustom`, params);
}
