export type ObjectProps = {[propname: string]: any};

export interface FilterProps {
  onSearch: Function;
}

export interface ListProps {
  params: ObjectProps;
  loadData: Function;
  addEmployee: Function;
  onRefresh: Function;
}

export interface ListResult {
  data?: ListRecordProps[];
  meta?: Meta;
}

export interface Meta {
  current_page?: number,
  per_page?: number,
  total?: number
}

export interface ListRecordProps {
  /**
   * id
   */
  id?: number;
  /**
  * 用户id
  */
  account_id?: number;
  /**
  * 是否管理员
  */
  is_manager?: number;
  /**
  * 创建时间
  */
  created_at?: string;
  /**
  * 电话
  */
  mobile?: string;
  /**
  * 名称
  */
  name?: string;
  /*
  * 权限
  */
  permissions?: ListRecordPermissionProps[];
}

export interface ListRecordPermissionProps {
  /*
  * 事件名
  */
  name?: string;
  /*
  * 事件识别符号
  */
  event?: string;
}

// 弹窗需要的共通参数
export interface ModalProps {
  visible: boolean;
}

export interface AddEmployeeRecordProps extends ModalProps {
  name: string;
  mobile: string;
}

export interface AddEmployeeProps {
  record: AddEmployeeRecordProps;
  onClose: Function; // 关闭弹窗
  onOk: Function; // 确定
}
