import { get } from '@/common/request/index';

/**
 * 部门列表
 * https://yapi.lanhanba.com/project/297/interface/api/33449
 */

export function departmentList(params?: any) {
  return get('/department/list', { ...params }, true);
}
/**
 * 根据权限部门列表
 * https://yapi.lanhanba.com/project/297/interface/api/33449
 */

export function departmentPermissionList(params?: any) {
  return get('/department/permission/list', { ...params }, true);
}


/**
 * 部门数列表
 * https://yapi.lanhanba.com/project/297/interface/api/61340
 */

export function departmentTreeList(params?: any) {
  return get('/department/treeList', { ...params }, true);
}
