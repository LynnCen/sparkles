import React from 'react';

export interface BasicType {
  children?: React.ReactNode;
  location?: any;
  isOpen?: boolean;
}

export enum HeaderStatus {
  RESET_PASSWORD = 'resetPassword',
  LOGIN_OUT = 'loginOut',
}

export interface ModifyPasswordProps {
  visible: boolean;
  onClose: Function;
  loginOut: Function;
}

export interface CurrentUserResult {
  /**
   * 头像地址
   */
  avatar: string;
  /**
   * 部门id数组
   */
  departmentIds: number[];
  /**
   * 员工id
   */
  id: number;
  /**
   * 菜单数组
   */
  moduleList: ModuleList[];
  /**
   * 姓名
   */
  name: string;
  /**
   * 岗位id数组
   */
  positionIds: number[];
  /**
   * 角色id数字组
   */
  roleIds: number[];
}

export interface ModuleList {
  /**
   * 子菜单
   */
  children?: { [key: string]: any }[];
  /**
   * 编码
   */
  encode?: string;
  /**
   * 图标
   */
  icon: string;

  id?: string;
  /**
   * 名称
   */
  name: string;

  parent?: Parent;
  /**
   * 跳转地址
   */
  uri: string;
}

export interface Parent {
  encode: string;
  icon: string;
  id: string;
  name: string;
  uri: string;
}
