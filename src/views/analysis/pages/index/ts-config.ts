// 筛选项入参
export interface FiltersProps {
  storeIds: number[] | number | string; // 店铺选择
  strStoredIds: string | number;
  start: string;
  end: string;
  dateScope: number;
  checkTab?: string;
}

export interface FilterIProps {
  onSearch: (params: any) => void;
  filters: FiltersProps;
  handleChangeStore: (item: any) => void;
  handleChangeTime: (start: string, end: string, dateScope: number, checkTab?: string) => void;
}

export interface InitialProps {
  filters: FiltersProps;
}

export interface PassengerFlowAnalysisProps extends InitialProps {
  store: any; // 门店信息
}

export interface HeapMapProps extends InitialProps {
  deviceId: number | string;
}

export interface PieChartsProps extends InitialProps {}

export interface AreaModuleProps extends InitialProps {
  store: any; // 门店信息
}

export interface OrderStatisticProps {
  orderData: number[];
  saleAmountData: number[];
  date: string[];
}

export interface BaseHeatData {
  name: string;
  bgImg: string;
  heatmap: string;
}

export interface HeatData extends BaseHeatData {
  name: string;
  bgImg: string;
  heatmap: string;
  heatmap_type?: number;
  id: number;
}

export interface OrderStatisticResultProps {
  /**
   * 订单列表
   */
  orderDataList: OrderDataList[];
  /**
   * 门店名称
   */
  storeName: string;
}

export interface OrderDataList {
  /**
   * 名称
   */
  name: string;
  /**
   * 订单数
   */
  order: number | null;
  /**
   * 销售额
   */
  saleAmount: number | null;
  /**
   * 客单价
   */
  unitPrice: number | null;
}

/**
 * 门店分析-客流数据-https://yapi.lanhanba.com/project/297/interface/api/33372
 */
export interface StoreAnalysisProps {
  /**
   * 年龄层比率
   */
  ageRate: AgeRate[];
  /**
   * 客流统计折线图
   */
  flows: Flows;
  /**
   * 男女比率
   */
  genderRate: GenderRate[];
  /**
   * 客流数据
   */
  // statistic: Statistic;
}

export interface AgeRate {
  /**
   * 年龄层名称
   */
  name: string;
  /**
   * 人数
   */
  value: number;
}

/**
 * 客流统计折线图
 */
export interface Flows {
  /**
   * 进店客流
   */
  indoorFlow: FlowsIndoorFlow;
  /**
   * 进店率
   */
  indoorRate: FlowsIndoorRate;
  /**
   * 过店客流
   */
  passbyFlow: FlowsPassbyFlow;
}

/**
 * 进店客流
 */
export interface FlowsIndoorFlow {
  /**
   * Y轴
   */
  data: number[];
  /**
   * X轴
   */
  date: string[];
  /**
   * 标题
   */
  name: string;
}

/**
 * 进店率
 */
export interface FlowsIndoorRate {
  /**
   * Y轴
   */
  data: number[];
  /**
   * X轴
   */
  date: string[];
  /**
   * 标题
   */
  name: string;
}

/**
 * 过店客流
 */
export interface FlowsPassbyFlow {
  /**
   * Y轴
   */
  data: number[];
  /**
   * X轴
   */
  date: string[];
  /**
   * 标题
   */
  name: string;
}

export interface GenderRate {
  name: string;
  value: string;
}

/**
 * 客流数据
 */
export interface Statistic {
  /**
   * 平均停留时长
   */
  durationAvg: DurationAvg;
  /**
   * 进店客流
   */
  indoorFlow: StatisticIndoorFlow;
  /**
   * 进店率（单位：1%）
   */
  indoorRate: StatisticIndoorRate;
  /**
   * 过店客流（单位：人）
   */
  passbyFlow: StatisticPassbyFlow;
}

/**
 * 平均停留时长
 */
export interface DurationAvg {
  /**
   * 停留时长（s）
   */
  count: number;
  /**
   * 日均
   */
  dayAvg: string;
  label: string;
  /**
   * 环比
   */
  ratio: number;
  /**
   * 环比趋势  1：上升  0：下降
   */
  ratioFlag: string;
  title: string;
}

/**
 * 进店客流
 */
export interface StatisticIndoorFlow {
  /**
   * 人次
   */
  count: number;
  /**
   * 日均
   */
  dayAvg: number;
  label: string;
  /**
   * 环比
   */
  ratio?: number;
  /**
   * 环比趋势  1：上升  0：下降
   */
  ratioFlag?: number;
  title: string;
}

/**
 * 进店率（单位：1%）
 */
export interface StatisticIndoorRate {
  /**
   * 进店率
   */
  count: number;
  /**
   * 日均
   */
  dayAvg: number;
  label: string;
  /**
   * 环比
   */
  ratio: number;
  /**
   * 环比趋势  1：上升  0：下降
   */
  ratioFlag: number;
  title: string;
}

/**
 * 过店客流（单位：人）
 */
export interface StatisticPassbyFlow {
  /**
   * 人次
   */
  count: number;
  /**
   * 日均
   */
  dayAvg: number;
  label: string;
  /**
   * 环比
   */
  ratio: number;
  /**
   * 环比趋势  1：上升  0：下降
   */
  ratioFlag: number;
  title: string;
}

/**
 * 表单数据
 */
export interface StoreFormData {
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
  date: string;
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
   * 店内订单
   */
  storeOrderCount: number;
  /**
   * 店内销售额
   */
  storeSaleAmount: number;
}
