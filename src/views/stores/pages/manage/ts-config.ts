export type ObjectProps = {[propname: string]: any};

export interface FilterProps {
  onSearch: Function;
}

export interface ListProps {
  params: ObjectProps;
  loadData: Function;
  setManager: Function;
  setCounterpart: Function;
  mainHeight?: any;
}

export interface ListResult {
  meta?: null;
  objectList?: ListRecordProps[];
  pageNum?: number;
  pageSize?: number;
  totalNum?: number;
}

export interface ListRecordProps {
  /**
  * 门店id
  */
  id?: number;
  /**
  * 门店名称
  */
  name?: string;
  /**
  * 店铺编号
  */
  number?: string;
  /**
  * 门店类型  YD | HW
  */
  source?: string;
  /**
  * 地址
  */
  boothAddress?: string;
  /**
  * 展位名称
  */
  boothName?: string;
  /**
  * 开始时间
  */
  date?: string;
  /**
  * 推广目的
  */
  promotionPurposes?: string;
  /*
  * 管理员
  */
  managers?: ListRecordManagerProps[];
  /*
  * 操作按钮
  */
  permissions?: ListRecordPermissionProps[];
  /**
   * 对接人
   */
   maintainers?: ListRecordManagerProps[],
   /**
    * 设备状态名称
    */
   deviceStatusName?: string;
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

export interface ListRecordManagerProps {
  id: number;
  name?: string;
  mobile?: string;
}

export interface ModalProps {
  visible: boolean;
}

export interface SetManagerModalProps extends ModalProps {
  store_id?: number;
  account_ids: number [];
}

export interface SetManagerProps {
  record: SetManagerModalProps;
  onClose: Function; // 关闭弹窗
  onOk: Function; // 确定
}
