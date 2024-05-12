export interface DepartmentProps {
  tenantId?: string | number;
}

export interface FilterParams {
  keyword?: string;
}

// 选择用户弹窗的参数
export interface ChooseUserModalValuesProps {
  visible: boolean;
  users: any[];
}

export interface ChooseUserModalProps {
  setChooseUserValues: Function;
  chooseUserValues: ChooseUserModalValuesProps;
  title: string;
  type?: 'ONE' | 'MORE'; // 单选/多选 默认为单选
}

// 新增/编辑部门
export interface DepartmentModalValuesProps extends Datum {
  visible: boolean;
}

export interface DepartmentModalProps {
  setOperateDepartment: Function;
  operateDepartMent: DepartmentModalValuesProps;
  onSearch: Function;
}

// 部门管理表格
export interface DepartmentTableProps {
  setOperateDepartment: Function;
  loadData: Function;
  params: object;
  onSearch: Function;
  mainHeight: number;
}

// 弹窗状态/新建/编辑/删除
export enum ModalStatus {
  ADD = 'add', // 新建
  EDIT = 'edit', // 编辑
  DELETE = 'delete', // 删除
}

// 筛选需要的/默认
export interface FilterProps {
  onSearch?: Function; // 筛选项改变-点击查询/重置按钮
}

// 部门列表返回结果
export interface DepartMentResult {
  meta: Meta;
  objectList: Datum[];
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

export interface Datum {
  /**
   * 子部门
   */
  children?: Child[];
  /**
   * 备注
   */
  desc?: null;
  /**
   * 编码
   */
  encode?: string;
  /**
   * 创建时间
   */
  gmtCreate?: string;
  /**
   * 修改时间
   */
  gmtModified?: string;
  /**
   * 部门ID
   */
  id?: number;
  /**
   * 管理员
   */
  manager?: string;
  /**
   * 名称
   */
  name?: string;
  /**
   * 父级部门
   */
  parent?: { [key: string]: any };
  permissions?: DatumPermission[];
}

export interface Child {
  children?: string[];
  desc?: null;
  encode?: string;
  gmtCreate?: string;
  gmtModified?: string;
  id?: number;
  manager?: string;
  name?: string;
  parent?: ListResultParent;
  /**
   * 按钮列表
   */
  permissions?: ChildPermission[];
}

export interface ListResultParent {
  children?: null;
  desc?: null;
  encode?: string;
  gmtCreate?: string;
  gmtModified?: string;
  id?: number;
  manager?: null;
  name?: string;
  parent?: null;
  permissions?: null;
}

export interface ChildPermission {
  event: string;
  name: string;
}

export interface DatumPermission {
  event: string;
  name: string;
}

export interface DepartMentResultPermission {
  event?: string;
  name?: string;
}

// 部门详情
export interface DepartmentDetail {
  /**
   * 备注
   */
  desc?: null;
  /**
   * 编码
   */
  encode?: string;
  /**
   * ID
   */
  id?: number;
  /**
   * 管理员列表
   */
  managerList?: ManagerList[];
  /**
   * 名称
   */
  name?: string;
  /**
   * 父级部门
   */
  parent?: Parent;
}

export interface ManagerList {
  /**
   * ID
   */
  id: number;
  /**
   * 手机号
   */
  mobile?: string;
  /**
   * 姓名
   */
  name: string;
}

/**
 * 父级部门
 */
export interface Parent {
  desc?: null;
  encode?: string;
  id?: number;
  managerList?: string[];
  name?: string;
  parent?: null;
}
