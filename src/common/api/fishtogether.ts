import { get, post } from '@/common/request/index';

/**
 * 左侧属性个数
 * https://yapi.lanhanba.com/project/349/interface/api/50910
 */
export function storeTree(params: any) {
  return get('/map/shop/yn/attribute/count', params, {
    isMock: false,
    mockId: 349,
    mockSuffix: '/api',
    needHint: true,
    isZeus: true,
  });
}

/**
 * 左侧属性个数---门店地图演示demo
 * https://yapi.lanhanba.com/project/349/interface/api/50910
 */
export function storeTreeDemo(params: any) {
  return get('/map/shop/demo/attribute/count', params, {
    isMock: false,
    mockId: 349,
    mockSuffix: '/api',
    needHint: true,
    isZeus: true,
  });
}

/**
 * 地图区域点位聚合计算
 * https://yapi.lanhanba.com/project/349/interface/api/50924
 */
export function areaCount(params: any) {
  return get(`/map/shop/yn/area/count`, params, {
    isMock: false,
    mockId: 349,
    mockSuffix: '/api',
    needHint: true,
    isZeus: true,
  });
}

/**
 * 地图区域点位聚合计算---门店地图演示demo
 * https://yapi.lanhanba.com/project/349/interface/api/50924
 */
export function areaCountDemo(params: any) {
  return get(`/map/shop/demo/area/count`, params, {
    isMock: false,
    mockId: 349,
    mockSuffix: '/api',
    needHint: true,
    isZeus: true,
  });
}


/**
 * 地图门店搜索
 * https://yapi.lanhanba.com/project/349/interface/api/50917
 */
export function storePoint(params: any) {
  return get(`/map/shop/yn/search`, params, {
    isMock: false,
    mockId: 349,
    mockSuffix: '/api',
    needHint: true,
    isZeus: true,
  });
}

/**
 * 地图门店搜索---门店地图演示demo
 * https://yapi.lanhanba.com/project/349/interface/api/50917
 */
export function storePointDemo(params: any) {
  return get(`/map/shop/demo/search`, params, {
    isMock: false,
    mockId: 349,
    mockSuffix: '/api',
    needHint: true,
    isZeus: true,
  });
}


/**
 * 筛选项列表
 * https://yapi.lanhanba.com/project/497/interface/api/51540
 */
export function postYNSelectionList() {
  return post(
    `/yn/selection/list`,
    {},
    {
      // isMock: true,
      // mockId: 497,
      // mockSuffix: '/api',
      needHint: true,
      isZeus: true,
    }
  );
}

/**
 * 新增落位点位列表
 * https://yapi.lanhanba.com/project/497/interface/api/51337
 */
export function postYNTaskPoint(params = {}) {
  return post(`/yn/franchisee/form/task/point`, params, {
    // isMock: true,
    // mockId: 497,
    // mockSuffix: '/api',
    needHint: true,
    isZeus: true,
  });
}
/**
 * 新增落位点位列表导出
 * https://yapi.lanhanba.com/project/497/interface/api/51918
 */
export function postYNTaskPointExport(params = {}) {
  return post(`/yn/franchisee/form/task/point/export`, params, {
    // isMock: true,
    // mockId: 497,
    // mockSuffix: '/api',
    needHint: true,
    isZeus: true,
  });
}

/**
 * 新增提报明细列表
 * https://yapi.lanhanba.com/project/497/interface/api/51274
 */
export function postYNEvaluationReport(params = {}) {
  return post(`/yn/franchisee/form/evaluation/report`, params, {
    // isMock: true,
    // mockId: 497,
    // mockSuffix: '/api',
    needHint: true,
    isZeus: true,
  });
}
/**
 * 提报明细列表导出
 * https://yapi.lanhanba.com/project/497/interface/api/51561
 */
export function postYNEvaluationReportExport(params = {}) {
  return post(`/yn/franchisee/form/evaluation/report/export`, params, {
    // isMock: true,
    // mockId: 497,
    // mockSuffix: '/api',
    needHint: true,
    isZeus: true,
  });
}

/**
 * 测评点位列表
 * https://yapi.lanhanba.com/project/497/interface/api/51253
 */
export function postYNEvaluationPoint(params = {}) {
  return post(`/yn/franchisee/form/evaluation/point`, params, {
    // isMock: true,
    // mockId: 497,
    // mockSuffix: '/api',
    needHint: true,
    isZeus: true,
  });
}

/**
 * 测评点位列表导出
 * https://yapi.lanhanba.com/project/497/interface/api/51568
 */
export function postYNEvaluationPointExport(params = {}) {
  return post(`/yn/franchisee/form/evaluation/point/export`, params, {
    // isMock: true,
    // mockId: 497,
    // mockSuffix: '/api',
    needHint: true,
    isZeus: true,
  });
}

/**
 * 开发部绩效报表导出
 * https://yapi.lanhanba.com/project/497/interface/api/51582
 */
export function postYNDepartmentExport(params = {}) {
  return post(`/yn/franchisee/form/department/export`, params, {
    // isMock: true,
    // mockId: 497,
    // mockSuffix: '/api',
    needHint: true,
    isZeus: true,
  });
}

/**
 * 开发部绩效报表
 * https://yapi.lanhanba.com/project/497/interface/api/51547
 */
export function postYNDepartment(params = {}) {
  return post(`/yn/franchisee/form/department`, params, {
    // isMock: true,
    // mockId: 497,
    // mockSuffix: '/api',
    needHint: true,
    isZeus: true,
  });
}

/**
 * 开发人员绩效报表导出
 * https://yapi.lanhanba.com/project/497/interface/api/51589
 */
export function postYNPersonExport(params = {}) {
  return post(`/yn/franchisee/form/person/export`, params, {
    // isMock: true,
    // mockId: 497,
    // mockSuffix: '/api',
    needHint: true,
    isZeus: true,
  });
}

/**
 * 开发人员绩效报表
 * https://yapi.lanhanba.com/project/497/interface/api/51554
 */
export function postYNPerson(params = {}) {
  return post(`/yn/franchisee/form/person`, params, {
    // isMock: true,
    // mockId: 497,
    // mockSuffix: '/api',
    needHint: true,
    isZeus: true,
  });
}

/**
 * 筛选项下拉框
 * https://yapi.lanhanba.com/project/497/interface/api/51386
 */
export function getYNChancepointSelection(params = {}) {
  return post(`/yn/chancePoint/selection`, params, {
    needHint: true,
  });
}

/**
 * 机会点列表（PC端）
 * https://yapi.lanhanba.com/project/497/interface/api/51386
 */
export function getYNChancepointList(params = {}) {
  return post(`/yn/chancePoint/gradePage`, params, {
    needHint: true,
  });
}

/**
 * 机会点评分详情（PC）
 * https://yapi.lanhanba.com/project/497/interface/api/51400
 */
export function getYNChancepointDetail(params = {}) {
  return post(`/yn/chancePoint/scoreDetail`, params, {
    needHint: true,
  });
}

/**
 * 审批流水记录(PC)
 * https://yapi.lanhanba.com/project/497/interface/api/51407
 */
export function getYNApprovalRecord(params = {}) {
  return post(`/yn/approval/record`, params, {
    needHint: true,
  });
}

/**
 * 导出机会点pdf
 * https://yapi.lanhanba.com/project/497/interface/api/51610
 */
export function exportYNChancepointPdf(params = {}) {
  return post(`/yn/exportYnUrl`, params, {
    needHint: true,
  });
}

/**
 * 门店周边点位列表-https://yapi.lanhanba.com/project/497/interface/api/51617
 */
export function storeRimPointOfYN(params: any) {
  return get(`/siteSelectionMap/search`, params, {
    isMock: false,
    mockId: 497,
    needHint: true,
    isSelf: false,
    isZeus: true,
  });
}

/**
 *  导入落位明细 https://yapi.lanhanba.com/project/497/interface/api/51911
 */
export function importPoint(params: any) {
  return post('/yn/point/import', params, { isZeus: true });
}

/**
 *  编辑拓店任务 https://yapi.lanhanba.com/project/497/interface/api/51708
 */
export function editTaskOfYN(params: any) {
  return post('/yn/task/update', params, { needHint: true });
}

/**
 * 创建机会点时选择的模版详情
 * https://yapi.lanhanba.com/project/497/interface/api/52856
 */
export function templateDetailOfYN(params: { id: number}) {
  return post('/yn/template/query', { ...params }, { needHint: true });
}

/**
 * 创建机会点时的保存
 * https://yapi.lanhanba.com/project/497/interface/api/52877
 */
export function savePointOfYN(params: any) {
  return post('/yn/chancePoint/dataSave', { ...params }, { needHint: true });
}

/**
 * 机会点详情
 * https://yapi.lanhanba.com/project/497/interface/api/52877
 */
export function pointDetailOfYN(id: number) {
  return post('/yn/chancePoint/formDetail', { id }, { needHint: true });
}

/**
 * 机会点模板导出
 * https://yapi.lanhanba.com/project/497/interface/api/52947
 */
export function pointTemplateExportOfYN(params: any) {
  return post('/yn/point/template/export', { ...params }, {
    needHint: true,
    isZeus: true,
  });
}

/**
 * 机会点导入记录 https://yapi.lanhanba.com/project/497/interface/api/52940
 */
export function getImportRecords(params: any) {
  return get('/yn/chancePoint/import/records', params, true);
}

/**
 * 加盟商分页列表 https://yapi.lanhanba.com/project/497/interface/api/56776
 */
export function franchiseeList(params: any) {
  return post('/yn/franchisee/page', params, { needHint: true });
}

/**
 * 加盟商tab列表 https://yapi.lanhanba.com/project/497/interface/api/56783
 */
export function franchiseeTab(params: any) {
  return post('/yn/franchisee/tab', params, { needHint: true });
}

/**
 * 加盟商展示 https://yapi.lanhanba.com/project/497/interface/api/56790
 */
export function franchiseeShow(params: any) {
  return post('/yn/franchisee/show', params, { needHint: true });
}

/**
 * 编辑加盟商 https://yapi.lanhanba.com/project/497/interface/api/56797
 */
export function franchiseeEdit(params: any) {
  return post('/yn/franchisee/edit', params, { needHint: true });
}

/**
 * 加盟商详情 https://yapi.lanhanba.com/project/497/interface/api/56748
 */
export function franchiseeDetail(params: any) {
  return get('/yn/franchisee/detail', params, { needHint: true });
}

/**
 * 加盟商拓店任务列表 https://yapi.lanhanba.com/project/497/interface/api/56804
 */
export function franchiseeTaskList(params: any) {
  return post('/yn/franchisee/task/list', params, { needHint: true });
}

/**
 * 拓店任务详情 https://yapi.lanhanba.com/project/497/interface/api/51379
 */
export function taskDetail(params: any) {
  return post('/yn/task/detail', params, { needHint: true });
}

/**
 * 机会点详情关联拓店任务-拓店任务列表 https://yapi.lanhanba.com/project/497/interface/api/58022
 */
export function getAssociatedTaskList(params: any) {
  return post('/yn/task/selectPage', params, { needHint: true });
}

/**
 * 机会点详情关联拓店任务-关联任务 https://yapi.lanhanba.com/project/497/interface/api/58022
 */
export function associatedTask(params: any) {
  return post('/yn/chancePoint/associate', params, { needHint: true });
}


