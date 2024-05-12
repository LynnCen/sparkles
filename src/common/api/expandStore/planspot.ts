/**
 * @Description 集客点相关接口
 */

import { get, post } from '@/common/request/index';
/**
 * 审批详情---集客点详情
 * https://yapi.lanhanba.com/project/532/interface/api/59758
 */
export function getPlanSpotDetail(params: any) {
  return post(`/approval/form/detail`, params);
}

/**
 * 集客点报表权限列表
 * https://yapi.lanhanba.com/project/546/interface/api/62880
 */
export function getReportPermission(params?: any) {
  return get('/plan/spot/report/permission', { ...params }, {
    needHint: true,
  });
}

/**
 * 集客点全国统计总计
 * https://yapi.lanhanba.com/project/546/interface/api/62887
 */
export function statisticsTotal(params?: any) {
  return post('/plan/spot/report/statistics/total', { ...params }, {
    needHint: true,
  });
}

/**
 * 集客点全国统计分页
 * https://yapi.lanhanba.com/project/546/interface/api/62894
 */
export function statisticsList(params?: any) {
  return post('/plan/spot/report/statistics/page', { ...params }, {
    needHint: true,
  });
}

/**
 * 集客点全国统计导出
 * https://yapi.lanhanba.com/project/546/interface/api/62901
 */
export function statisticsExport(params?: any) {
  return post('/plan/spot/report/statistics/export', { ...params }, {
    needHint: true,
  });
}


/**
 * 集客点明细查询分页
 * https://yapi.lanhanba.com/project/546/interface/api/62908
 */
export function detailedList(params?: any) {
  return post('/plan/spot/report/detailed/page', { ...params }, {
    needHint: true,
  });
}

/**
 * 集客点明细查询导出
 * https://yapi.lanhanba.com/project/546/interface/api/62943
 */
export function detailedExport(params?: any) {
  return post('/plan/spot/report/detailed/export', { ...params }, {
    needHint: true,
  });
}


/**
 * 集客点明细清单查询分页
 * https://yapi.lanhanba.com/project/546/interface/api/65155
 */
export function getPlanSpotDetailPage(params?: any) {
  return post('/plan/spot/report/info/page', { ...params }, {
    needHint: true,
  });
}

/**
 * 集客点明细清单导出
 * https://yapi.lanhanba.com/project/546/interface/api/65155
 */
export function exportPlanSpotDetail(params?: any) {
  return post('/plan/spot/report/info/export', { ...params }, {
    needHint: true,
  });
}
