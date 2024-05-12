import { get, post } from '@/common/request/index';

/**
 * 机会点-下拉框 https://yapi.lanhanba.com/project/353/interface/api/37057
 */
export function chancePointSelection(params: { keys: Array<string> }) {
  return post('/chancePoint/selection', params);
}

/**
 * 亚瑟士机会点-下拉框 https://yapi.lanhanba.com/project/353/interface/api/46283
 */
export function chancePointAsicsSelection(params: { keys: Array<string> }) {
  return post('/chancePoint/asics/selection', params);
}

/**
 * 评分解读
 * https://yapi.lanhanba.com/project/353/interface/api/40984
 */

export function scoreInterpret(params) {
  return post('/chancePoint/scoreInterpret', { ...params });
}


/**
 * 亚瑟士评分解读
 * https://yapi.lanhanba.com/project/353/interface/api/46276
 */

export function scoreInterpretAsics(params) {
  return post('/chancePoint/asics/scoreInterpret', { ...params });
}


/**
 * 机会点评分解读
 * https://yapi.lanhanba.com/project/353/interface/api/47886
 */
export function getChancePoint(params) {
  return post(`/scoreInterpret/chancePoint`, params);
}

/**
 * 拓店调研报告评分解读
 * https://yapi.lanhanba.com/project/353/interface/api/47893
 */
export function getReportScore(params) {
  return post(`/scoreInterpret/report`, params);
}

/**
 * 亚瑟士机会点评分解读
 * https://yapi.lanhanba.com/project/353/interface/api/47900
 */
export function getChancePointAsics(params) {
  return post(`/scoreInterpret/asics/chancePoint`, params);
}
/**
 * 拓店调研报告评分解读
 * https://yapi.lanhanba.com/project/353/interface/api/47893
 */
export function getReportScoreAsics(params) {
  return post(`/scoreInterpret/asics/report`, params);
}

/**
 * 机会点详情
 * https://yapi.lanhanba.com/project/353/interface/api/34428
 */
export function getChancePointDetail(params) {
  return post(`/chancePoint/detail`, params);
}
/**
 * 备选址详情
 * https://yapi.lanhanba.com/project/353/interface/api/36812
 */
export function getAlternateDetail(params) {
  return post(`/expandShop/alternate/detail`, params);
}
/**
 * 储备点详情
 * https://yapi.lanhanba.com/project/353/interface/api/36805
 */
export function getReserveStoreDetail(params) {
  return post(`/expandShop/reserveStore/detail`, params);
}
/**
 * 机会点详情亚瑟士
 * https://yapi.lanhanba.com/project/353/interface/api/46262
 */
export function getChancePointDetailAsics(params) {
  return post(`/chancePoint/asics/detail`, params);
}
/**
 * 备选址详情亚瑟士
 * https://yapi.lanhanba.com/project/353/interface/api/46122
 */
export function getAlternateDetailAsics(params) {
  return post(`/expandShop/alternate/asics/detail`, params);
}
/**
 * 储备店详情
 * https://yapi.lanhanba.com/project/353/interface/api/46164
 */
export function getReserveStoreDetailAsics(params) {
  return post(`/expandShop/reserveStore/asics/detail`, params);
}

/**
 * 亚瑟士审批流水详情
 * https://yapi.lanhanba.com/project/353/interface/api/52037
 */
export function getApprovalRecordsAsics(params) {
  return post(`/expandShop/asics/report/approvalRecord`, params);
}


/**
 * 开店计划导入历史
 * https://yapi.lanhanba.com/project/532/interface/api/60899
 */
export function getStorePlan(params) {
  return post(`/openStorePlan/pages`, params);
}
/**
 * 开店计划导入
 * https://yapi.lanhanba.com/project/532/interface/api/60906
 */
export function importStorePlan(params) {
  return post(`/openStorePlan/importExcel`, params);
}
/**
 * 获取开店计划模板
 * https://yapi.lanhanba.com/project/532/interface/api/61088
 */
export function getTemplateExcelUrl() {
  return get(`/openStorePlan/getTemplateUrl`, {});
}
