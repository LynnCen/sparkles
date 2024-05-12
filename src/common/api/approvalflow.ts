/**
 * @Description 审批流相关接口
 */
import { post } from '@/common/request/index';

/**
 * @description 审批模板列表
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/62264
 */
export function approvalFlowTemplate(params:any) {
  return post('/approval/template/page', { ...params }, {
    needHint: true,
  });
}

/**
 * @description 审批模板详情
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/62264
 */
export function approvalFlowTemplateOfDetail(params:any) {
  return post('/approval/template/detail', { ...params }, {
    needHint: true,
  });
}

/**
 * @description 编辑审批模板
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/62306
 */
export function editApprovalFlowTemplate(params:any) {
  return post('/approval/template/update', { ...params }, {
    needHint: true,
  });
}

/**
 * @description 编辑审批模板
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/62285
 */
export function approvalFlowTemplateSelection() {
  return post('/approval/template/selection', {}, {
    needHint: true,
  });
}


