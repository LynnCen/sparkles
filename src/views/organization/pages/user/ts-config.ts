// 弹窗状态/新建/编辑/删除
export enum ModalStatus {
  ADD = 'add', // 新建
  EDIT = 'edit', // 编辑
  DELETE = 'delete', // 删除
}

// 新增/编辑用户
export interface UserModalValuesProps {
  visible: boolean;
  id?: number;
  departmentId?: number;
  department: any[]; // 部门列表
}

export interface UserInfoOperateProps {
  setOperateUser: Function;
  operateUser: UserModalValuesProps;
  onSearch: Function;
}

// 用户管理表格
export interface UserTableProps {
  showOperateModal: Function;
  loadData: Function;
  params: any;
  onSearch: Function;
}

type ObjectProps = { [propname: string]: any };

// 左侧树需要的参数
export interface LeftTreeProps {
  treeData?: any[]; // 默认为undefined即不显示左侧树
  fieldNames?: ObjectProps; // 自定义节点 title、key、children 的字段
  onSelect?: (selectKeys: number | string[]) => void; // 选择tree key改变
}

// 筛选需要的/默认
export interface FilterProps {
  onSearch?: Function; // 筛选项改变-点击查询/重置按钮
}

export interface UserProps {
  tenantId?: string | number;
}

export interface UserListResult {
  meta: Meta;
  /**
   * 员工列表
   */
  objectList: UserObjectList[];
  /**
   * 当前页码
   */
  pageNum: number;
  /**
   * 每页显示数量
   */
  pageSize: number;
  /**
   * 总数量
   */
  totalNum: number;
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

export interface UserObjectList {
  /**
   * 部门
   */
  department: string;
  /**
   * 邮箱
   */
  email: null;
  /**
   * 性别
   */
  gender: string;
  /**
   * 创建时间
   */
  gmtCreate: string;
  /**
   * 更新时间
   */
  gmtModified: string;
  /**
   * 员工id
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
  /**
   * 按钮列表
   */
  permissions: ObjectListPermission[];
  /**
   * 状态
   */
  status: string;
  /**
   * 账号
   */
  username: string;
}

export interface ObjectListPermission {
  event: string;
  name: string;
}
