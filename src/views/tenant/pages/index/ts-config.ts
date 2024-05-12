import React from 'react';

export type ObjectProps = { [propname: string]: any };
export interface FilterProps {
  onSearch: Function; // 搜索
}

// 租户表格
export interface TenantListProps extends FilterProps {
  params: ObjectProps;
  onChangeRowSelect: Function; // 多选改变
  handleAddUpdate: Function; // 编辑或新增
  disableTenant: Function; // 停用
  recoverTenant: Function; // 恢复
  loadData: Function; // 请求
  handleCertificate: Function; // 企业认证
  mainHeight: number; // container高度
}

// 弹窗需要的参数
export interface ModalProps {
  visible: boolean;
}

// 新增编辑/租户需要的参数
export interface OperateTenantTypes extends ModalProps {
  record: ObjectProps | undefined;
  type: string;
}
// 企业认证弹窗需要的参数
export interface CertificationModalTypes extends ModalProps {
  record: ObjectProps | undefined;
  id?:number
}

// 弹窗方法
interface ModalFunctionProps {
  onClose: Function; // 关闭弹窗
  onOk: Function; // 确定
}

// 新增/编辑租户弹窗
export interface OperateTenantProps extends ModalFunctionProps {
  operateTenant: OperateTenantTypes;
  record?: any;
}
// 企业认证弹窗
export interface CertificationModalProps extends ModalFunctionProps {
  certification:CertificationModalTypes;
  record?: any;
}

export interface DealWithTenantTypes extends ModalProps {
  ids: number | React.Key[];
  names: string | string[];
  type: string;
}

// 停用租户弹窗
export interface DealWithTenantProps extends ModalFunctionProps {
  disableTenant: DealWithTenantTypes;
}

// 停用租户弹窗
export interface RecoverTenantProps extends ModalFunctionProps {
  recoverTenant: DealWithTenantTypes;
}

// 弹窗状态/新建/编辑/批量/全部
export enum ModalStatus {
  ADD = 'create', // 新建租户
  UPDATE = 'update', // 编辑租户
  ALL = 'all', // 批量
  ONE = 'one', // 单个
  DISABLE = 'disable', // 停用
  RECOVER = 'enable', // 恢复
  DETAIL = 'show', // 详情
  CERTIFICATE = 'certificate', // 去认证
}

// 租户列表查询的入参
export interface TenantFilterProps {
  enterprise?: string; // 企业名称
  manager?: string; // 管理元姓名
  name?: string; // 租户简称
  regNum?: string; // 组织机构代码
  status?: string; // 状态
  createTime?:Date[]; // 创建时间
  createStart?:string; // 创建时间 - 开始时间
  createEnd?:string; // 创建时间 - 结束时间
}

// 租户列表返回数据结构
export interface TenantResponseListProps {
  meta: Meta;
  objectList?: ObjectList[];
  /**
   * 总页码
   */
  pageNum?: number;
  /**
   * 页面显示数量
   */
  pageSize?: number;
  /**
   * 总数量
   */
  totalNum?: number;
}

export interface Meta {
  /**
   * 按钮列表
   */
  permissions: MetaPermission[];
}

export interface MetaPermission {
  event: string;
  name: string;
}

export interface ObjectList {
  /**
   * 联系人
   */
  connector: null | string;
  /**
   * 联系人手机号
   */
  connectorMobile: null | string;
  /**
   * 创建人
   */
  crtor: string;
  /**
   * 企业名称
   */
  enterprise: string;
  /**
   * 跟进人
   */
  follower: Follower;
  /**
   * 创建时间
   */
  gmtCreate: string;
  /**
   * 更新时间
   */
  gmtModified: string;
  /**
   * 租户ID
   */
  id: number;
  /**
   * 营业执照
   */
  licenses: string[] | null;
  /**
   * 租户简称
   */
  name: string;
  /**
   * 操作按钮
   */
  permissions: ObjectListPermission[];
  /**
   * 组织机构代码
   */
  regNum: string;
  /**
   * 状态 1：正常  2：停用
   */
  status: number;
  /**
   * 状态中文
   */
  statusName: string;
}

/**
 * 跟进人
 */
export interface Follower {
  /**
   * ID
   */
  id: number;
  /**
   * 手机号
   */
  mobile: string;
  /**
   * 姓名
   */
  name: string;
}

export interface ObjectListPermission {
  /**
   * 英文名称
   */
  event: string;
  /**
   * 按钮名称
   */
  name: string;
}
