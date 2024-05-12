import { get, post } from '@/common/request/index';

/**
 * 角色列表
 * https://yapi.lanhanba.com/project/297/interface/api/33461
 */
export function roleList(params?: any) {
  return get('/role/list', { ...params }, true);
}

/**
 * 角色详情
 * https://yapi.lanhanba.com/project/297/interface/api/33462
 */
export function roleDetail(params?: any) {
  return get('/role/detail', { ...params }, true);
}

/**
 * 数据权限枚举
 * https://yapi.lanhanba.com/project/297/interface/api/51148
 */
export function roleScopes(params?: any) {
  return get('/role/scopes', { ...params }, true);
}


/**
 * 绑定部门岗位
 * https://yapi.lanhanba.com/project/297/interface/api/62523
 */
export function roleBindOfDepartmentAndPost(params?: any) {
  return post('/role/bindDepart', { ...params }, true);
}

