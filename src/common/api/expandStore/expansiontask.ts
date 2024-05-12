/**
 * @Description 标准版-拓店管理-拓店任务-接口
 */

import { get, post } from '@/common/request/index';

/**
 * @description 拓店任务列表
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/59415
 */
export function getExpansionTaskList(params?:any) {
  return post('/standard/task/page', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 拓店任务导出
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/63307
 */
export function taskListExport(params?:any) {
  return post('/standard/task/export', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 拓店任务下拉框
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/59387
 */
export function getTaskSelection(params?:any) {
  return get('/standard/task/selection', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 拓店任务类型列表
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/62852
 */
export function taskTypeList() {
  return get('/standard/task/typeList', {}, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 拓店签约类型列表
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/65085
 */
export function taskSignTypeList() {
  return get('/standard/task/signTypeList', {}, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 修改拓店任务类型
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/63146
 */
export function updateTaskType(params) {
  return post('/standard/task/updateType', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 拓店任务类型变更记录
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/63160
 */
export function taskTypeChangeRecords(params) {
  return post('/standard/task/typeChangeRecords', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 创建拓店任务
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/59380
 */
export function createExpansionTask(params?:any) {
  return post('/standard/task/create', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 拓店任务详情
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/59429
 */
export function getExpansionTaskDetail(params?:any) {
  return get('/standard/task/detail', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 更新拓店任务
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/59394
 */
export function updateExpansionTask(params?:any) {
  return post('/api/standard/task/update', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 添加沟通纪要
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/59401
 */
export function addCommunicateRecord(params?:any) {
  return post('/standard/task/addCommunicateRecord', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 获取可被关联的机会点列表
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/59443
 */
export function getTaskChancePointList(params?:any) {
  return post('/standard/task/chancePointPage', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 拓店任务关联的机会点
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/59450
 */
export function associateTask(params?:any) {
  return post('/standard/task/associate', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}


/**
 * @description 校验审批表单信息(校验必填项)
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/60143
 */
export function checkApprovalForm(params?:any) {
  return post('/approval/form/check', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 拓店任务历史列表
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/59597
 */
export function taskHistory(params?: any) {
  return get('/standard/task/history', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}


/**
 * 拓店任务&加盟商详情
 * https://yapi.lanhanba.com/project/532/interface/api/68963
 */
export function getTaskInfo(params:any) {
  return get(`/standard/task/detailWithFranchisee`, params);
}

/**
 * 拓店任务关联的机会点完成进度
 * https://yapi.lanhanba.com/project/532/interface/api/69243
 */
export function taskChancePointInfo(params:any) {
  return post(`/standard/task/chancePointCompletionInfo`, params, {
    needCancel: false
  });
}

/**
 * 查询沟通纪要
 * https://yapi.lanhanba.com/project/532/interface/api/69229
 */
export function taskRecords(params:any) {
  return get(`/standard/task/communicateRecords`, params);
}

/**
 * 创建卡旺卡拓店任务
 * https://yapi.lanhanba.com/project/532/interface/api/71427
 */
export function createCircleTask(params:any) {
  return post(`/direct/task/create`, params, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}



/**
 * 拓店任务详情
 * https://yapi.lanhanba.com/project/532/interface/api/71427
 */
export function getCircleTaskDetail(params:any) {
  return get(`/direct/task/detail`, params);
}

/**
 * 拓店任务下拉框
 * https://yapi.lanhanba.com/project/532/interface/api/71427
 */
export function getCircleOptions(params?:any) {
  return get(`/standard/task/selection`, params);
}
