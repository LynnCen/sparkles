/**
 * @Description 审批工作台接口
*/

import { get, post } from '@/common/request/index';

/**
 * @description 审批列表
 * @yapi https://yapi.lanhanba.com/project/497/interface/api/50343
 */
export function getTabsApproveList(params:any) {
  return get('/yn/approval/pages', { ...params }, {
    needHint: true,
  });
}

/**
 * @description 审批列表-消息tab
 * @yapi https://yapi.lanhanba.com/project/497/interface/api/50343
 */
export function getTabsMsgList(params:any) {
  return get('/message/page', { ...params }, {
    needHint: true,
  });
}

/**
 * @description 审批列表-消息tab-设置消息已读
 * @yapi https://yapi.lanhanba.com/project/497/interface/api/50343
 */
export function setMsgRead(params:any) {
  return post('/message/setAllRead', { ...params }, {
    needHint: true,
  });
}


/**
 * @description 审批列表-tab 数量
 * @yapi https://yapi.lanhanba.com/project/497/interface/api/53283
 */
export function getTabsCount() {
  return post('/yn/approval/count', {}, {
    needHint: true,
  });
}

/**
 * 调研报告评分详情PC端
 * https://yapi.lanhanba.com/project/497/interface/api/53185
 */
export function shopEvaluationDetail(params?: any) {
  return post('/yn/shopEvaluation/scoreDetail', { ...params }, {
    needHint: true,
  });
}

/**
 * 调研报告评分审批详情（PC端）
 * https://yapi.lanhanba.com/project/497/interface/api/53115
 */
export function shopEvaluationSimpleDetail(params?: any) {
  return post('/yn/shopEvaluation/simple/scoreDetail', { ...params }, {
    needHint: true,
  });
}

/**
 * 审批详情（PC端）
 * https://yapi.lanhanba.com/project/497/interface/api/53122
 */
export function approvalDetail(params?: any) {
  return get('/yn/approval/detail', { ...params }, {
    needHint: true,
  });
}

/**
 * 审批通过(PC端)
 * https://yapi.lanhanba.com/project/497/interface/api/53129
 */
export function approvalPass(params?: any) {
  return post('/yn/approval/pass', { ...params }, {
    needHint: true,
  });
}

/**
 * 审批拒绝(PC端)
 * https://yapi.lanhanba.com/project/497/interface/api/53136
 */
export function approvalDeny(params?: any) {
  return post('/yn/approval/deny', { ...params }, {
    needHint: true,
  });
}

/**
 * 审批驳回(PC端)
 * https://yapi.lanhanba.com/project/497/interface/api/53143
 */
export function approvalReject(params?: any) {
  return post('/yn/approval/reject', { ...params }, {
    needHint: true,
  });
}

/**
 * 撤销审批(PC端)
 * https://yapi.lanhanba.com/project/497/interface/api/53150
 */
export function approvalRevoke(params?: any) {
  return post('/yn/approval/revoke', { ...params }, {
    needHint: true,
  });
}

/**
 * 店铺评估分页接口（PC端）
 * https://yapi.lanhanba.com/project/497/interface/api/53157
 */
export function shopEveluationList(params?: any) {
  return post('/yn/shopEvaluation/pages', { ...params }, {
    needHint: true
  });
}

/**
 * 调研报告表单页(PC)
 * https://yapi.lanhanba.com/project/497/interface/api/53164
 */
export function shopEveluationFormDetail(params?: any) {
  return post('/yn/shopEvaluation/formDetail', { ...params }, {
    needHint: true
  });
}

/**
 * 调研报告保存（PC）
 * https://yapi.lanhanba.com/project/497/interface/api/53171
 */
export function shopEveluationSave(params?: any) {
  return post('/yn/shopEvaluation/dataSave', { ...params }, {
    needHint: true,
  });
}

/**
 * 发起审批（点位评估申请/提前设计申请/合同申请）PC端
 * https://yapi.lanhanba.com/project/497/interface/api/53178
 */
export function createApprovalShop(params?: any) {
  return post('/yn/approval/create/shopEvaluation', { ...params }, {
    needHint: true,
  });
}

/**
 * 查询提前设计表单(PC端)
 * https://yapi.lanhanba.com/project/497/interface/api/53220
 */
export function shopDesignAdvance(params?: any) {
  return post('/yn/shopEvaluation/queryDesignAdvance', { ...params }, {
    needHint: true,
  });
}

/**
 * 保存提前设计表单(PC端)
 * https://yapi.lanhanba.com/project/497/interface/api/53227
 */
export function saveShopDesignAdvance(params?: any) {
  return post('/yn/shopEvaluation/saveDesignAdvance', { ...params }, {
    needHint: true,
  });
}

/**
 * 查询合同表单(PC端)
 * https://yapi.lanhanba.com/project/497/interface/api/53234
 */
export function shopContract(params?: any) {
  return post('/yn/shopEvaluation/queryContract', { ...params }, {
    needHint: true,
  });
}

/**
 * 保存合同表单(PC端)
 * https://yapi.lanhanba.com/project/497/interface/api/53241
 */
export function saveShopContract(params?: any) {
  return post('/yn/shopEvaluation/saveContract', { ...params }, {
    needHint: true,
  });
}

/**
 * 保存合同表单时提示信息(PC端)
 * https://yapi.lanhanba.com/project/497/interface/api/53248
 */
export function checkShopContractRent(params?: any) {
  return post('/yn/shopEvaluation/contract/checkRent', { ...params }, {
    needHint: true,
  });
}
