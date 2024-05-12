import { get, post } from '@/common/request/index';

/**
 * 审核列表
 * https://yapi.lanhanba.com/project/289/interface/api/33316
 */
export function auditList(params?: any) {
  return get('/examineOrder/page', params, true);
}

/**
 * 资源审核详情（编辑）
 * https://yapi.lanhanba.com/project/321/interface/api/33902
 */
export function auditDetail(params?: any) {
  return get('/resource/examine/detail', params, true);
}

/**
 * 资源审核详情
 * https://yapi.lanhanba.com/project/321/interface/api/33902
 */
export function examineOrderDetail(params?: any) {
  return get('/examineOrder/detail', params, true);
}

/**
 * 获取场地相似资源
 * https://yapi.lanhanba.com/project/321/interface/api/33868
 */
export function getSimilarPlace(params?: any) {
  return get('/place/similar/page', params, true);
};

/**
 * 获取点位相似资源
 * https://yapi.lanhanba.com/project/321/interface/api/33869
 */
export function getSimilarSpot(params?: any) {
  return get('/spot/similar/page', params, true);
};

/**
 * 获取相似资源对比字段
 * https://yapi.lanhanba.com/project/321/interface/api/33870
 */
export function getResourceCompare(params?: any) {
  return get('/resource/compare', params, true);
};

/**
 * 资源审核通过（新增）
 * https://yapi.lanhanba.com/project/321/interface/api/33871
 */
export function postExaminePass(params?: any) {
  return post('/resource/examine/pass/insert', params, true);
};

/**
 * 资源审核通过（编辑）
 * https://yapi.lanhanba.com/project/321/interface/api/33948
 */
export function postExaminePassUpdate(params?: any) {
  return post('/resource/examine/pass/update', params, true);
};

/**
 * 保存资源审核信息
 * https://yapi.lanhanba.com/project/321/interface/api/33904
 */
export function postExamineSave(params?: any) {
  return post('/resource/examine/save', params, true);
};
