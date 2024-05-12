export interface FiltersProps {
  storeIds: number[];
  storeType: string;
  month: string;
}

export interface SearchFormProps {
  onSearch: (params: any) => void;
  filters: FiltersProps;
  haveResult: boolean;
  showOkBth: boolean;
}

export interface TabsProps {
  haveOrder: boolean;
  showOkBth: boolean;
}

export interface OrderDataErrorProps {
  // type: string;
  message: string;
  visible: boolean;
  onClose: () => void;
}

export interface HistoryTableProps {
  filters: FiltersProps;
  changeUploadStatus: () => void;
  isCheckDone?: boolean;
}

/**
 * 发起预测-预测结果
 */
export interface PredictCreateResult {
  /**
   * 进店客流
   */
  indoorCount: number;
  /**
   * 进店率
   */
  indoorRate: number;
  /**
   * 月份
   */
  month: string;
  /**
   * 预估订单
   */
  order: number;
  /**
   * 过店客流
   */
  passbyCount: number;
  /**
   * 销售额
   */
  saleAmount: number;
  /**
   * 门店名称
   */
  storeName?: string;
}

/**
 * 历史预测-预测结果
 */
export interface PredictHistoryListResult {
  meta?: null;
  objectList?: ObjectList[];
  pageNum?: number;
  pageSize?: number;
  totalNum?: number;
}

export interface ObjectList {
  /**
   * 实际进店
   */
  actualIndoorCount?: number;
  /**
   * 实际进店率
   */
  actualIndoorRate?: number;
  /**
   * 实际订单
   */
  actualOrder?: number;
  /**
   * 实际过店客流
   */
  actualPassbyCount?: number;
  /**
   * 实际销售额
   */
  actualSaleAmount?: number;
  /**
   * 进店比较 -1:低于 0:等于 1:高于 (可能为null)
   */
  indoorCountStatus?: number;
  /**
   * 进店率比较 -1:低于 0:等于 1:高于 (可能为null)
   */
  indoorRateStatus?: number;
  /**
   * 订单比较 -1:低于 0:等于 1:高于 (可能为null)
   */
  orderStatus?: number;
  /**
   * 过店比较 -1:低于 0:等于 1:高于 (可能为null)
   */
  passbyCountStatus?: number;
  /**
   * 预估进店
   */
  predictIndoorCount?: number;
  /**
   * 预估进店率
   */
  predictIndoorRate?: number;
  /**
   * 预估订单
   */
  predictOrder?: number;
  /**
   * 预估过店客流
   */
  predictPassbyCount?: number;
  /**
   * 预估销售额
   */
  predictSaleAmount?: number;
  /**
   * 销售额比较 -1:低于 0:等于 1:高于 (可能为null)
   */
  saleAmountStatus?: number;
  /**
   * 门店名称
   */
  storeName?: string;
}
