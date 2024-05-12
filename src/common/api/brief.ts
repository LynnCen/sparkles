import { get, post } from '@/common/request/index';

export interface CurrentUserInfo {
  /**
   * 头像地址
   */
  avatar?: null;
  /**
   * 所属部门
   */
  departmentIds?: string[];
  id?: number;
  /**
   * 手机号
   */
  mobile?: string;
  /**
   * 菜单权限列表
   */
  moduleList?: UserInfoModuleList[];
  /**
   * 姓名
   */
  name?: string;
  /**
   * 所属岗位
   */
  positionIds?: string[];
  /**
   * 所属角色
   */
  roleIds?: number[];
  /**
   * 企业名
   */
  tenant?: string;
  email?: string;
}

export interface UserInfoModuleList {
  children?: UserInfoChild[];
  encode?: string;
  icon?: string;
  id?: number;
  name?: string;
  parent?: null;
  sortNum?: string;
  uri: string;
}

export interface UserInfoChild {
  children: string[];
  encode: string;
  icon: null;
  id: number;
  name: string;
  parent: UserInfoParent;
  sortNum: string;
  uri: string;
}

export interface UserInfoParent {
  children?: null;
  encode?: string;
  icon?: string;
  id?: number;
  name?: string;
  parent?: null;
  sortNum?: string;
  uri?: string;
}

/**
 * 当前登录用户信息 https://yapi.lanhanba.com/project/297/interface/api/33423
 */
export function currentUserInfo() {
  return get('/user/currentUser', {}, true);
}

/**
 * 用户列表
 * https://yapi.lanhanba.com/project/297/interface/api/33443
 */

export function userList(params?: any) {
  return post('/user/list', { ...params }, true);
}

/**
 * 用户列表(根据账号权限)
 */

export function userPermissionList(params?: any) {
  return get('/user/permission/list', { ...params }, true);
}

/**
 * 用户搜索
 * https://yapi.lanhanba.com/project/297/interface/api/33385
 */
export function userSearch(params?: any) {
  return get('/user/search', { ...params });
}
