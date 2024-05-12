// 部门管理表格
export interface RoleTableProps {
  setOperateRole: Function;
  loadData: Function;
  params: any;
  onSearch: Function;
  mainHeight: number;
  departmentListData: any[]; // 部门列表
  postListData: any[]; // 岗位列表
}

// 新增/编辑角色
export interface RoleModalValuesProps extends RoleListRecords {
  visible: boolean;
}

// 筛选需要的/默认
export interface FilterProps {
  onSearch?: Function; // 筛选项改变-点击查询/重置按钮
}

export interface RoleModalProps {
  setOperateRole: Function;
  operateRole: RoleModalValuesProps;
  onSearch: Function;
}

// 弹窗状态/新建/编辑/删除
export enum ModalStatus {
  ADD = 'add', // 新建
  EDIT = 'edit', // 编辑
  DELETE = 'delete', // 删除
}

export interface RoleProps {
  tenantId?: string | number;
}

export interface RolePermissionProps {
  rolePermission: any;
  onClose: Function;
}

export interface OperateRoleParams {
  /**
   * 备注
   */
  desc?: string;
  /**
   * 角色编码
   */
  encode: string;
  /**
   * 菜单ID列表
   */
  moduleIds?: number[];
  /**
   * 角色名称
   */
  name: string;
  /**
   * 权限ID列表
   */
  permissionIds?: number[];
  /**
   * 租户ID
   */
  tntInstId?: number;
}

export interface RoleListProps {
  /**
   * 列表权限
   */
  metaInfo?: MetaInfo;
  /**
   * 角色列表
   */
  roleList?: RoleListRecords[];
}

/**
 * 列表权限
 */
export interface MetaInfo {
  /**
   * 按钮权限
   */
  permissions?: MetaInfoPermission[];
}

export interface MetaInfoPermission {
  event?: string;
  name?: string;
}

export interface RoleListRecords {
  /**
   * 描述
   */
  desc?: string;
  /**
   * 编码
   */
  encode?: string;
  /**
   * 创建时间
   */
  gmtCreate?: string;
  /**
   * 角色ID
   */
  id?: number;
  /**
   * 名称
   */
  name?: string;
  /**
   * 按钮权限
   */
  permissions?: RoleListPermission[];
  /**
   * 租户ID
   */
  tntInstId?: number;
}

export interface RoleListPermission {
  event: string;
  name: string;
}
