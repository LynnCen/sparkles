/**
 * @Description 周边详情
 */
import { get, post } from '@/common/request/index';

/**
 * 模版tab-https://yapi.lanhanba.com/project/511/interface/api/53500
 */
export function modelCategoryList(params?: any) {
  return get('/surround/model/category', params, {
    needHint: true,
    needCancel: false,
  });
}

/**
 * 周边poi点位查询-https://yapi.lanhanba.com/project/511/interface/api/53507
 */
export function categoryPoiList(params?: any) {
  return post('/surround/poi', params, {
    needHint: true
  });
}

/**
 * 周边人群-https://yapi.lanhanba.com/project/511/interface/api/53521
 */
export function surroundPopulation(params?: any) {
  return get('/surround/population', params, {
    needHint: true,
    isMock: false,
    mockId: 511,
    mockSuffix: '/api',
  });
}

/**
 * 城市信息-https://yapi.lanhanba.com/project/511/interface/api/53528
 */
export function surroundCity(params?: any) {
  return get('/surround/city', params, {
    needHint: true
  });
}

/**
 * 行政区信息-https://yapi.lanhanba.com/project/511/interface/api/55068
 */
export function surroundDistrict(params?: any) {
  return get('/surround/district', params, {
    needHint: true
  });
}

/**
 * 历史查询记录-https://yapi.lanhanba.com/project/511/interface/api/53535
 */
export function historyReports(params?: any) {
  return get('/surround/record/pages', params, {
    needHint: true
  });
}

/**
 * 查询记录保存-https://yapi.lanhanba.com/project/511/interface/api/53633
 */
export function saveSearchReport(params?: any) {
  return post('/surround/record/save', params, {
    needHint: true
  });
}

/**
 * 历史查询记录详情-https://yapi.lanhanba.com/project/511/interface/api/53570
 */
export function historyReportDetail(params?: any) {
  return get('/surround/record/detail', params, {
    needHint: true
  });
}

/**
 * 查询专业版洞察报告-https://yapi.lanhanba.com/project/511/interface/api/54921
 */
export function queryHistoryReport(params?:any) {
  return post(`/surround/businessReport/query`, params);
}

/**
 * 权益查询-https://yapi.lanhanba.com/project/511/interface/api/54907
 */
export function queryBenefit() {
  return get(`/surround/benefit/query`);
}

/**
 *购买专业版洞察报告-https://yapi.lanhanba.com/project/511/interface/api/54914
 */
export function createBusinessReport(params:any) {
  return post(`/surround/businessReport/create`, params);
}

/**
 * 导出洞察报告-https://yapi.lanhanba.com/project/511/interface/api/54928
 */
export function exportBusinessReport(params:any) {
  return get(`/surround/businessReport/export`, params);
}

/**
 * 表单组件-周边查询-https://yapi.lanhanba.com/project/532/interface/api/55621
 */
export function standardSurroundSearch(params:any) {
  return post(`/standard/surroundSearch`, params);
}


/**
 * 1207周边查询接口替换
 * poi tab统计
 * https://yapi.lanhanba.com/project/511/interface/api/64966
 */

export function getSourroundPoiCount(params:any) {
  return post(`/surround/poi/count`, params, {
    needCancel: false,
  });
}

/**
 * poi tab统计（比/api/surround/poi/count多统计一个维度）
 *  替换/surround/poi/count，多一个功能，可用于统计category对应的poi个数
 * https://yapi.lanhanba.com/project/511/interface/api/67948
 */

export function getSourroundPoiCount2Level(params:any) {
  return post(`/surround/poi/count/2levels`, params);
}

/**
 * 1207周边查询接口替换
 * poi分页列表
 * https://yapi.lanhanba.com/project/511/interface/api/64973
 */

export function getSourroundPois(params:any) {
  return post(`/surround/poi/page`, params);
}

/**
 *
 * 分类poi分页列表
 * https://yapi.lanhanba.com/project/511/interface/api/70825
 */

export function getSourroundPoiByCategory(params:any) {
  return post(`/surround/category/poi/page`, params);
}


/**
 * 老店明细：展示所在行业的存量门店明细
 * https://yapi.lanhanba.com/project/546/interface/api/70867
 */
export function getOldStoreDetail(params) {
  return get(`/surround/poi/old`, params);
}
