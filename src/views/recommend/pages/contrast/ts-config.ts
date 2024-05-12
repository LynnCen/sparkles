export interface MockDemo {
  a: Function;
}
// 地图上的单选按钮
export const colorRadio = ['#71C9CE', '#77E3E7', '#76A1E8', '#A2D5F2', '#6EB6FF'];
export const colorChart = ['#71C9CE', '#77E3E7', '#76A1E8', '#A2D5F2', '#6EB6FF'];

// 只保留最深颜色和最浅颜色（维护须为全称）
export const mapColor = [
  ['#00C3CE', '#E5F9FA'],
  ['#00DFE7', '#E5FCFD'],
  ['#0058E8', '#E5EEFD'],
  ['#00B3F2', '#E5F7FE'],
  ['#007FFF', '#E5F2FF']
];
export const barChartColor = [
  ['#71C9CE', 'rgba(155,109,254,0.5)'],
  ['#77E3E7', 'rgba(45,139,255,0.5)'],
  ['#76A1E8', 'rgba(41,211,238,0.5)'],
  ['#A2D5F2', 'rgba(255,212,73,0.5)'],
  ['#6EB6FF', 'rgba(242,153,61,0.5)']
];
// 综合对比
export const Comprehensiveness = 'comprehensiveness';

// 地图级别枚举
export enum mapLevel{
  COUNTRY_LEVEL = 1, // 全国范围
  PROVINCE_LEVEL = 2, // 省份范围
  CITY_LEVEL = 3, // 城市范围
}

export enum DataType{
  CHART = 'chart',
  TABLE = 'table'
}

export enum tabType{
  STORE_NUM='storeNum', // 门店数量
  STORE_TYPE='storeType'// 门店类型
}

export const ALLTYPE = 'allType';


export enum TimeSelect {
  MONTH =1,
  QUARTER,
  YEAR
}
// 直辖市 500000 重庆
// 直辖市 310000 上海
// 直辖市 110000 北京
// 直辖市 120000 天津
export const MUNICIPALITY_ADCODE = ['500000', '310000', '110000', '120000'];
