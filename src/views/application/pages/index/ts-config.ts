export type ObjectProps = { [propname: string]: any };

export interface FilterProps {
  onSearch: Function;
}

export interface ApplistProps {
  loadData: Function;
}

// 弹窗状态/新建/编辑/删除
export enum ModalStatus {
  ADD = 'add', // 新建
  EDIT = 'edit', // 编辑
  DELETE = 'delete', // 删除
}

export interface ModalProps {
  visible: boolean;
}

// 新增编辑/租户需要的参数
export interface OperateAppTypes extends ModalProps {
  record: ObjectProps | undefined;
  type: string;
}

// 新增/编辑应用弹窗
export interface OperateAppProps {
  operateApp: any;
  onClose: Function;
  record?: any;
  onOk: Function;
}

export interface AppListResult {
  /**
   * 编码
   */
  code: string;
  /**
   * 创建人
   */
  creator: string;
  /**
   * 描述
   */
  desc: string;
  /**
   * 创建时间
   */
  gmtCreate: string;
  /**
   * 应用ID
   */
  id: number;
  /**
   * 名称
   */
  name: string;
  /**
   * 按钮列表
   */
  permissions: Permission[];
  /**
   * 授权状态
   */
  status: string;
}

export interface Permission {
  event: string;
  name: string;
}
