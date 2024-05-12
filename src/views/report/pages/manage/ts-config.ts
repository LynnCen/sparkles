export type ObjectProps = {[propname: string]: any};

export interface FilterProps {
  onSearch: Function;
  addReport: Function;
  operateList: any[]
}

export interface ListProps {
  params: ObjectProps;
  loadData: Function;
  updateReport: Function;
  onRefresh: Function;
  refresh: Function;
}

export interface ListResult {
  meta?: any;
  objectList?: ListRecordProps[];
  pageNum?: number;
  pageSize?: number;
  totalNum?: number;
}

export interface ListRecordProps {
  /**
   * id
   */
  id?: number;
  /**
  * 报表名称
  */
  name?: string;
  /**
  * 门店
  */
  stores?: string;
  /**
  * 时间段
  */
  date?: string;
  /**
  * 备注
  */
  remark?: string;
  /**
  * 创建时间
  */
   createdAt?: string;
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
  * flow:export：导出，flow:updateReportTemplate：编辑，flow:deleteReportTemplate：删除
  */
  event?: string;
}

// 弹窗需要的共通参数
export interface ModalProps {
  visible: boolean;
}

// 新增、编辑、删除、导出弹框
export interface OperateModalProps extends ModalProps {
  id: number;
}

export interface OperateProps {
  record: OperateModalProps;
  onClose: Function; // 关闭弹窗
  onOk: Function; // 确定
}

export interface ExportProps {
  record: OperateModalProps;
  onClose: Function; // 关闭弹窗
}

// 数据项组件选择变动
export interface ChangeOptionsProps {
  onChange: Function;
}

// 数据项名
export interface OptionsInfoType {
  name: string;
  childrenNames: string[];
}

export interface ScopeProps {
  showExtend: boolean;
  onChange: Function;
}


export const dataTypeOptions = [
  { label: '门店', value: 1 },
  { label: '日期', value: 2 },
];
