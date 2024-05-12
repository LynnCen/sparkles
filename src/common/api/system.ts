import { get, post } from '@/common/request/index';

/**
 * 获取租户详情
 * // https://yapi.lanhanba.com/project/297/interface/api/34308
 */
export function getTenantInfo() {
  return get('/tenant/info', {}, { needCancel: false });
}

/**
 * 租户设置logo
 * https://yapi.lanhanba.com/project/297/interface/api/34307
 */
export function setLogo(params: any) {
  return post('/tenant/setLogo', params, true);
}

/**
 * 按钮权限
 * // https://yapi.lanhanba.com/project/331/interface/api/34326
 */
export function getTenantType() {
  return get('/shop/type/list', {}, true);
}

/**
 * POI品牌列表
 * https://yapi.lanhanba.com/project/349/interface/api/40151
 */
export function getBrandList(params: any) {
  return get('/shop/map/brand/list', params, true);
}
/**
 * 品牌分类树
 * https://yapi.lanhanba.com/project/349/interface/api/40214
 */
export function getCategoryTree() {
  return get('/shop/map/category/tree', {}, true);
}

/**
 * 创建POI品牌
 * https://yapi.lanhanba.com/project/349/interface/api/39752
 */
export function addBrand(params: any) {
  return post('/shop/map/brand/create', params, true);
}

/**
 * 编辑POI品牌
 * https://yapi.lanhanba.com/project/349/interface/api/39766
 */
export function updateBrand(params: any) {
  return post('/shop/map/brand/update', params, true);
}

/**
 * POI品牌详情
 * https://yapi.lanhanba.com/project/349/interface/api/
 */
export function poiBrandDetail(params: { id: number }) {
  return get('/shop/map/brand/show', params, true);
}

/**
 * POI 数据导入 https://yapi.lanhanba.com/project/349/interface/api/39731
 */
export function importFile(params: any) {
  return post('/shop/map/poi/import', params, true);
}

/**
 * 删除 POI 品牌 https://yapi.lanhanba.com/project/349/interface/api/40221
 */
export function deletePoiBrand(params: any) {
  return post('/shop/map/brand/delete', params, true);
}

/**
 * 行业品牌分页 https://yapi.lanhanba.com/project/349/interface/api/40368
 */
export function getIndustryBrand(params?: any) {
  return get('/industry/brand/page', params, true);
}

/**
 * 行业品牌显示切换 https://yapi.lanhanba.com/project/349/interface/api/42377
 */
export function updateIndustryBrandShowStatus(params?: any) {
  return post('/industry/brand/switch', params, true);
}

/**
 * 行业地图商圈显示切换 https://yapi.lanhanba.com/project/349/interface/api/42384
 */
export function updateAreaAndRankStatus(params?: any) {
  return post('/industry/area/switch', params, true);
}

/**
 *  编辑品牌信息 https://yapi.lanhanba.com/project/349/interface/api/40361
 */
export function updateIndustryBrand(params: any) {
  return post('/industry/brand/update', params, true);
}

/**
 *  创建品牌信息 https://yapi.lanhanba.com/project/349/interface/api/40361
 */
export function addIndustryBrand(params: any) {
  return post('/industry/brand/create', params, true);
}

/**
 * 行业品牌信息详情 https://yapi.lanhanba.com/project/349/interface/api/40375
 */
export function industryBrandDetail(params: any) {
  return get('/industry/brand/show', params, true);
}
/**
 *  删除行业品牌 https://yapi.lanhanba.com/project/349/interface/api/40382
 */
export function deleteIndustryBrand(params: any) {
  return post('/industry/brand/delete', params, true);
}
/**
 *  导入行业品牌  https://yapi.lanhanba.com/project/349/interface/api/40389
 */
export function importIndustryBrand(params: any) {
  return post('/industry/brand/import', params, true);
}

/**
 * 商圈分页 https://yapi.lanhanba.com/project/349/interface/api/40424
 */
export function getIndustryArea(params?: any) {
  return get('/industry/area/page', params, true);
}
/**
 * 编辑商圈 https://yapi.lanhanba.com/project/349/interface/api/40403
 */
export function updateIndustryArea(params: any) {
  return post('/industry/area/update', params, true);
}
/**
 * 导入商圈 https://yapi.lanhanba.com/project/349/interface/api/40417
 */
export function importIndustryArea(params: any) {
  return post('/industry/area/import', params, true);
}
/**
 * 创建商圈 https://yapi.lanhanba.com/project/349/interface/api/40396
 */
export function addIndustryArea(params: any) {
  return post('/industry/area/create', params, true);
}
/**
 * 删除商圈 https://yapi.lanhanba.com/project/349/interface/api/40410
 */
export function deleteIndustryArea(params: any) {
  return post('/industry/area/delete', params, true);
}
/**
 * 商圈详情 https://yapi.lanhanba.com/project/349/interface/api/40564
 */
export function industryAreaDetail(params: any) {
  return get('/industry/area/show', params, true);
}
/**
 * 模版分页
 * https://yapi.lanhanba.com/project/349/interface/api/47305
 */
export function getTemplate(params?: any) {
  return get('/industry/template/pages', params);
}

/**
 * 商场综合体分页 https://yapi.lanhanba.com/project/349/interface/api/40459
 */
export function getIndustryMall(params?: any) {
  return get('/industry/mall/page', params, true);
}
/**
 * 创建商场综合体 https://yapi.lanhanba.com/project/349/interface/api/40431
 */
export function addIndustryMall(params: any) {
  return post('/industry/mall/create', params, true);
}
/**
 * 编辑商场综合体 https://yapi.lanhanba.com/project/349/interface/api/40438
 */
export function updateIndustryMall(params: any) {
  return post('/industry/mall/create', params, true);
}
/**
 * 商场综合体详情 https://yapi.lanhanba.com/project/349/interface/api/40802
 */
export function industryMallDetail(params: any) {
  return get('/industry/mall/show', params, true);
}
/**
 * 导入商场综合体 https://yapi.lanhanba.com/project/349/interface/api/40452
 */
export function importIndustryMall(params: any) {
  return post('/industry/mall/import', params, true);
}
/**
 * 删除商场综合体 https://yapi.lanhanba.com/project/349/interface/api/40445
 */
export function deleteIndustryMall(params: any) {
  return post('/industry/mall/delete', params, true);
}
/**
 * 导出全部行业品牌 https://yapi.lanhanba.com/project/349/interface/api/40928
 */
export function exportAllBrand() {
  return post('/industry/brand/export', {}, true);
}
/**
 * 导出全部商圈 https://yapi.lanhanba.com/project/349/interface/api/40935
 */
export function exportAllArea() {
  return post('/industry/area/export', {}, true);
}
/**
 * 品牌置顶 https://yapi.lanhanba.com/project/349/interface/api/52121
 */
export function brandSetTop(params) {
  return post(`/industry/brand/set/top`, params, true);
}
/**
 * 品牌交换顺序 https://yapi.lanhanba.com/project/349/interface/api/52128
 */
export function brandReorder(params) {
  return post(`/industry/brand/reorder`, params, true);
}

/**
 * 行业品牌分公司设置
 * https://yapi.lanhanba.com/project/349/interface/api/60402
 */
export function setCompanyBrand(params) {
  return post(`/industry/brand/company/set`, params);
}

/**
 * 门店地图配置信息列表
 * https://yapi.lanhanba.com/project/532/interface/api/61179
 */

export function getStoreMapConfigList(params?) {
  return post(`/standard/shop/setting/list`, params);
}

/**
 * 删除配置信息
 * https://yapi.lanhanba.com/project/532/interface/api/61186
 */

export function deleteStoreMapConfig(params?) {
  return post(`/standard/shop/setting/delete`, params);
}

/**
 * 保存配置信息
 * https://yapi.lanhanba.com/project/532/interface/api/61172
 */

export function saveStoreMapConfig(params?) {
  return post(`/standard/shop/setting/save`, params);
}

/**
 * 门店地图配置信息详情
 * https://yapi.lanhanba.com/project/532/interface/api/61193
 */

export function getStoreMapConfigDetail(params?) {
  return post(`/standard/shop/setting/detail`, params);
}

/**
 * 门店地图配置筛选项列表
 * https://yapi.lanhanba.com/project/532/interface/api/61200
 */
export function getStoreMapConfigSelection(params?) {
  return post(`/standard/shop/setting/selection`, params);
}

/**
 * 门店地图配置员工权限判断
 * https://yapi.lanhanba.com/project/532/interface/api/61200
 */
export function setStoreMapConfigPermission(params?) {
  return post(`/standard/shop/setting/permission/set`, params);
}

/**
 * 导出员工列表
 * https://yapi.lanhanba.com/project/297/interface/api/61928
 */
export function getUersExcelUrl(params?) {
  return get(`/user/getExcelUrl`, params);
}

/**
 * 导入员工信息
 * https://yapi.lanhanba.com/project/297/interface/api/61935
 */
export function impotUersExcelUrl(params?) {
  return post(`/user/importExcel`, params);
}

/**
 * 员工信息导入记录
 * https://yapi.lanhanba.com/project/297/interface/api/61942
 */
export function getUersExcelRecords(params?) {
  return post(`/user/importRecords`, params);
}

/**
 * 系统日志分页列表
 * https://yapi.lanhanba.com/project/532/interface/api/62362
 */
export function getSystemLog(params?) {
  return post(`/operation/log/page`, params);
}


/**
 * 标准版-数据迁移-员工列表
 * https://yapi.lanhanba.com/project/532/interface/api/62488
 */
export function getEmployeeList(params?) {
  return post(`/standard/transfer/employee/page`, params);
}

/**
 * 标准版-数据迁移-任务列表
 * https://yapi.lanhanba.com/project/532/interface/api/62362
 */
export function getEmployeeTaskList(params?) {
  return post(`/standard/transfer/page`, params);
}

/**
 * 标准版-数据迁移-交接任务
 * https://yapi.lanhanba.com/project/532/interface/api/62502
 */
export function getEmployeeTransferTask(params?) {
  return post(`/standard/transfer/batch`, params);
}

/**
 * 标准版-数据迁移-任务类型筛选项下拉框
 * https://yapi.lanhanba.com/project/532/interface/api/62509
 */
export function getTaskTypeSelections(params?) {
  return get(`/standard/transfer/selection`, params);
}

/**
 * 标准版-数据迁移-部门筛选项下拉框
 * https://yapi.lanhanba.com/project/532/interface/api/62509
 */
export function getDepartmentTreeList(params?) {
  return get(`/department/treeList`, params);
}

/**
 * 城市类型配置---获取用户上一次/当前页面的excel
 * https://yapi.lanhanba.com/project/511/interface/api/63902
 */
export function getCityConfigLastExcel(params?) {
  return get(`/city/config/lastExcel`, params);
}

/**
 * 城市类型配置---导入excel
 * https://yapi.lanhanba.com/project/511/interface/api/63874
 */
export function postCityConfigImportExcel(params?) {
  return post(`/city/config/importExcel`, params);
}

/**
 * 城市类型配置---城市列表
 * https://yapi.lanhanba.com/project/511/interface/api/63811
 */
export function postCityConfigList(params?) {
  return post(`/city/config/list`, params);
}
/**
 * 城市类型配置---更改区域类型
 * https://yapi.lanhanba.com/project/511/interface/api/63867
 */
export function postChangeCityConfigTypes(params?) {
  return post(`/city/config/alterAreaTypes`, params);
}
/**
 * 城市类型配置---获取区域类型
 * https://yapi.lanhanba.com/project/511/interface/api/63895
 */
export function getCityCongigTypes (params?) {
  return get(`/city/config/areaTypes`, params);
}


