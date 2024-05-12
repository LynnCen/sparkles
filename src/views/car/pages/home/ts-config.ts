// 筛选项入参
export interface FiltersProps {
  storeIds: number[] | number | string; // 店铺选择
  strStoredIds: string | number;
  cityIds?: number[] | number | string;
  start: string; // 时间
  end: string;
  dateScope: number;
  checkTab?: string;
  openDate?: string,
  closeDate?: string,
  passbyMin?: string,
  passbyMax?: string,
  indoorMin?: string,
  indoorMax?: string,
  stayInfoMin?: string,
  stayInfoMax?: string,
  orderMin?: string,
  orderMax?: string,
}

export interface FlowIProps {
  filters: FiltersProps;
}

export interface FilterIProps {
  onSearch: (params: any) => void;
  setHaveStores: (params: boolean) => void;
  filters: FiltersProps;
  handleChangeTime: (start: string, end: string, dateScope: number, checkTab?: string) => void;
}

export interface CustomTableProps extends FlowIProps {
  activeTab?: string;
  tenantStatus?:number;
  setVisible:any;
}

export interface PolylineProps extends FlowIProps {
  activeTab?: string;
}

export interface StoreData {
  id: number;
  name: string;
  playbackStatus: number;
}

export interface SelectType {
  label: string;
  value: number;
  playbackStatus?: number;
}

// https://yapi.lanhanba.com/project/94/interface/api/25431
export interface TotalStatistic {
  count: number;
  ratio: number;
  title: string;
  label: string;
  ratio_flag: number;
}

export interface TodayStatistic {
  count: number;
  label: string;
  title: string;
  ratio: number;
  ratio_flag: number;
}

export interface Statistics {
  total_statistics: TotalStatistic[];
  today_statistics: TodayStatistic[];
}

// https://yapi.lanhanba.com/project/94/interface/api/25438
export interface IndoorFlow {
  name: string;
  date: string[];
  data: number[];
}

export interface PassbyFlow {
  name: string;
  date: string[];
  data: number[];
}

export interface IndoorRate {
  name: string;
  date: string[];
  data: number[];
}

export interface StatisticsFlow {
  indoorFlow: IndoorFlow;
  passbyFlow: PassbyFlow;
  indoorRate: IndoorRate;
}

// pagination
export interface PaginationProps {
  page: number;
  per_page: number;
  order: string;
  order_by: string;
}

export interface StoresProps {
  activeTab: string;
}

export enum Tabs {
  OPERATE = 'operate',
  PASSENGERFLOW = 'passengerflow',
}

export interface StoreStatisticsProps {
  /**
   * 总数据统计
   */
  statistics: Statistic[];
}

export interface Statistic {
  /**
   * 数量（今日或平均）
   */
  count: string;
  /**
   * 日均
   */
  dayAvg?: number;
  field_10: string;
  field_11: string;
  field_12: string;
  field_13: string;
  /**
   * 悬浮注释
   */
  label: string;
  /**
   * 环比（单位：1%）
   */
  ratio: number;
  /**
   * 环比标识（0：下浮  1：上浮）
   */
  ratioFlag: number;
  /**
   * 标题
   */
  title: string;
  /**
   * 累计悬浮注释
   */
  totalCount: string;
  /**
   * 累计标题
   */
  totalLabel: string;
  /**
   * 累计数量
   */
  totalTitle: string;
}

/** https://yapi.lanhanba.com/project/297/interface/api/33383 */
export interface StoreDataAnalysisResult {
  meta?: null;
  objectList?: ObjectList[];
  pageNum?: number;
  pageSize?: number;
  totalNum?: number;
}

export interface ObjectList {
  /**
   * 转化率
   */
  conversionPercentage: string;
  /**
   * 平均停留时长
   */
  durationAvg: number;
  /**
   * 饿了么订单
   */
  elOrderCount: number;
  /**
   * 进店客流量
   */
  indoorCount: number;
  /**
   * 进店率
   */
  indoorPercentage: string;
  /**
   * 美团订单
   */
  mtOrderCount: number;
  /**
   * 总订单
   */
  orderCount: number;
  /**
   * 过店客流量
   */
  passByCount: number;
  /**
   * 总销售额
   */
  saleAmount: number;
  /**
   * 店铺名称
   */
  storeName: string;
  /**
   * 店内订单
   */
  storeOrderCount: number;
  /**
   * 店内销售额
   */
  storeSaleAmount: number;
}
