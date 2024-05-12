import { get, post } from '@/common/request/index';

/**
 * 数据报表 - 模板列表：https://yapi.lanhanba.com/project/297/interface/api/33354
 */
export function reportTempList(params: Record<string, any>) {
  return get('/report/template/list', params, { needCancel: false });
}

/**
 * 数据报表 - 添加模板：https://yapi.lanhanba.com/project/297/interface/api/33357
 */
export function createReportTemp(params: Record<string, any>) {
  return post('/report/template/create', params);
}

/**
 * 数据报表-模板详情（编辑）：https://yapi.lanhanba.com/project/297/interface/api/33356
 */
export function reportTempDetail(params: Record<string, any>) {
  return get('/report/template/edit/show', params);
}

/**
 * 数据报表 - 编辑模板：https://yapi.lanhanba.com/project/297/interface/api/33361
 */
export function updateReportTemp(params: Record<string, any>) {
  return post('/report/template/update', params);
}

/**
 * 数据报表 - 删除模板：https://yapi.lanhanba.com/project/297/interface/api/33362
 */
export function deleteReportTemp(params: Record<string, any>) {
  return post('/report/template/delete', params);
}

/**
 * 数据报表 - 数据项：https://yapi.lanhanba.com/project/297/interface/api/33363
 */
export function getReportTempOptions(params: Record<string, any>) {
  return get('/report/template/options', params);
}

/**
 * 数据报表 - 导出报表：https://yapi.lanhanba.com/project/297/interface/api/33364
 */
export function exportReportTemp(params: Record<string, any>) {
  return post('/report/template/export', params);
}
