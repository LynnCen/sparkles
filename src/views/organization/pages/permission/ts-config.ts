import { Key } from 'react';

export interface PermissionTreeProps {
  treeData: any[]; // 树数据
  expandedKeys: any[]; // 展开的节点
  changeExpandedKeys: Function; // 改变展开的节点
  checkedKeys: Key[]; // 选择的节点
  changeCheckedKeys: Function; // 改变选择的节点
  fieldNames?: object; // 树节点的fieldNames
  loading?: boolean;
  changeHalfParentIds?: Function;
}

export interface CheckKeysProps {
  moduleIds: Key[];
  permissionIds: Key[];
  roleIds: Key[];
}

// 操作区
export interface OperatePermissionProps {
  changeCheckKeys: Function; // 更改选择的key
  current: number; // 当前步骤
  changeStep: Function; // 改变步骤
  steps: number; // 总的步数
  treeData: any[]; // 树数据
  onOk: Function; // 确定
  expendKeys: Function; // 更改展开的key
}

export interface PermissionProps {
  tenantId?: string | number;
  appId?: number;
  roleId?: number;
  onClose?: Function;
}

export interface AppMenuResult {
  /**
   * 菜单列表
   */
  moduleList?: ModuleList[];
  /**
   * 角色信息
   */
  roleInfo?: RoleInfo;
}

export interface ModuleList {
  /**
   * 应用ID
   */
  appId: null;
  /**
   * 子菜单
   */
  children: Child[];
  /**
   * 编码
   */
  encode: string;
  /**
   * icon
   */
  icon: string;
  /**
   * 菜单ID
   */
  id: number;
  /**
   * 菜单名称
   */
  name: string;
  /**
   * 父菜单ID
   */
  parentId: null;
  /**
   * 排序码
   */
  sortNum: string;
  /**
   * 跳转uri
   */
  uri: string;
}

export interface Child {
  appId: null;
  children: string[];
  encode: string;
  icon: null;
  id: number;
  name: string;
  parentId: number;
  permissions?: string[];
  sortNum: string;
  uri: string;
}

/**
 * 角色信息
 */
export interface RoleInfo {
  /**
   * 菜单ID集合
   */
  moduleIdList?: number[];
}

export interface AppBtnPermissionResult {
  /**
   * 菜单列表
   */
  moduleList?: PermissionList[];
  /**
   * 角色信息
   */
  roleInfo?: PermissionRoleInfo;
}

export interface PermissionList {
  /**
   * 子菜单
   */
  children?: { [key: string]: any }[];
  /**
   * 编码
   */
  encode?: string;
  /**
   * icon
   */
  icon?: string;
  /**
   * 菜单ID
   */
  id?: number;
  /**
   * 名称
   */
  name?: string;
  /**
   * 权限点集合
   */
  permissions?: Permission[];
  /**
   * 排序码
   */
  sortNum?: string;
  /**
   * 跳转uri
   */
  uri?: string;
}

export interface Permission {
  /**
   * 编码
   */
  encode: string;
  /**
   * 权限ID
   */
  id: number;
  /**
   * 权限名称
   */
  name: string;
}

/**
 * 角色信息
 */
export interface PermissionRoleInfo {
  /**
   * 菜单ID集合
   */
  moduleIdList?: number[];
  /**
   * 权限ID集合
   */
  permissionIdList?: number[];
}
