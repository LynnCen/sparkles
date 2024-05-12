/**
 * @Description 拓店-标准版本-审批工作台接口
 */

import { post, get } from '@/common/request/index';


/**
 * @description 审批列表-tab 数量
 * @yapi https://yapi.lanhanba.com/project/497/interface/api/53283
 */
export function getTabsCount() {
  return post('/approval/count', {}, {
    needHint: true,
  });
}

/**
 * @description 审批列表筛选项
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/61956
 */
export function approvalSelection(params:any) {
  return get(`/approval/selection`, params, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 审批列表
 * @yapi https://yapi.lanhanba.com/project/497/interface/api/50343
 */
export function getTabsApproveList(params:any) {
  return post('/approval/list', { ...params }, {
    needHint: true,
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
  });
}


/**
 * 审批详情（PC端）
 * https://yapi.lanhanba.com/project/532/interface/api/55817
 */
export function getApprovalDetail(params?: any) {
  return post('/approval/detail', { ...params }, {
    needHint: true,
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
  });
}

/**
 * 审批流水记录(PC)
 * https://yapi.lanhanba.com/project/497/interface/api/51407
 */
export function getApprovalRecord(params = {}) {
  return post(`/approval/record`, params, {
    needHint: true,
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
  });
}


/**
 * 加签
 * https://yapi.lanhanba.com/project/532/interface/api/55691
 */
export function counterSign(params:any) {
  return post(`/approval/countersign`, params);
}

/**
 * 转交
 * https://yapi.lanhanba.com/project/532/interface/api/55684
 */
export function transfer(params:any) {
  return post(`/approval/transfer`, params);
}

/**
 * 通过
 * https://yapi.lanhanba.com/project/532/interface/api/55663
 */
export function passApproval(params:any) {
  return post(`/approval/pass`, params);
}
/**
 * 不通过
 * https://yapi.lanhanba.com/project/532/interface/api/55670
 */
export function denyApproval(params:any) {
  return post(`/approval/deny`, params);
}
/**
 * 驳回
 * https://yapi.lanhanba.com/project/532/interface/api/58764
 */
export function rebutApproval(params:any) {
  return post(`/approval/rebut`, params);
}
/**
 * 撤销审批
 * https://yapi.lanhanba.com/project/532/interface/api/55677
 */
export function revokeApproval(params:any) {
  return post(`/approval/revoke`, params);
}

/**
 * 提交审批
 * https://yapi.lanhanba.com/project/532/interface/api/55649
 */
export function createApproval(params:any) {
  return post(`/approval/create`, params);
}

/**
 * 提交合同审批
 * https://yapi.lanhanba.com/project/532/interface/api/60997
 */
export function contractApply(params:any) {
  return post(`/standard/chancePoint/contractApply`, params);
}

/**
 * 审批详情用的机会点详情
 * https://yapi.lanhanba.com/project/532/interface/api/59758
 */
export function chancepointApprovalDetail(params:any) {
  return post(`/approval/form/detail`, params);
}

/**
 * 审批详情用的保存机会点
 * https://yapi.lanhanba.com/project/532/interface/api/59751
 */
export function chancepointApprovalSave(params:any) {
  return post(`/approval/form/update`, params);
}

/**
 * 审批节点列表，文档用的是app端的文档，pc的没有v2
 * https://yapi.lanhanba.com/project/532/interface/api/65169
 */
export function approvalNodeList(params:any) {
  return post(`/approval/node/list`, params);
}

/**
 * 重启审批，文档用的是app端的文档，pc的没有v2
 * https://yapi.lanhanba.com/project/532/interface/api/65148
 */
export function approvalReboot(params:any) {
  return post(`/approval/reboot`, params);
}
