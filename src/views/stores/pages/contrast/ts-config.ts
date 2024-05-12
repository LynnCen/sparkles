export type ObjectProps = { [propname: string]: any };

export interface FilterProps {
  onSearch: Function;
  onResetForm: Function;
}

export interface StoreOption {
  id: number;
  name: string;
}

export interface StoreFormOption extends StoreOption {
  start: string;
  end: string;
}

export interface ContrastChartsProps {
  params: ObjectProps;
  result: ObjectProps;
}

export interface DataBoxProps {
  title?: string;
  tip?: string;
  className?: string;
}

// 柱状图
export interface BarChartItemProps {
  count: number;
  name: string;
}
export interface BarChartGroupProps {
  data: BarChartItemProps[];
  groupName: string;
}

export interface BarChartsProps {
  dataList: any;
  legendData: string[];
  storeInfos: any[];
}

// charts
export interface ChartsResult {
  ageRate?: AgeRate[];
  genderRate?: GenderRate[];
  passbyFlow?: CommonFlowData[];
  indoorFlow?: CommonFlowData[];
  indoorRate?: CommonFlowData[];
  durationAvg?: CommonFlowData[];
}

// age
export interface AgeRate {
  store_name: string;
  data: AgeRateItem[];
}

export interface AgeRateItem {
  name: string;
  count: number;
}

// gender
export interface GenderRate {
  store_name: string;
  male: number;
  female: number;
}

// common flow data
export interface CommonFlowData {
  data?: number[];
  date?: string[];
  date_name?: string[];
  name?: string;
  store_name?: string;
}
