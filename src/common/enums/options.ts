// 门店类型
export const storeType = [
  { label: '正铺', value: 1 },
  { label: '快闪店', value: 2 },
  { label: '慢闪店', value: 3 },
];

// 概览/门店分析的tab
export const storeTabs = [
  { label: '经营分析', value: 'operate' },
  { label: '客流分析', value: 'passengerflow' },
];

// 根据是否有订单权限过滤storeTabs
export const filterStoreTabs = (hasOrderPermission) => {
  return hasOrderPermission ? storeTabs : storeTabs.filter((item) => item.value === 'passengerflow');
};

// 门店跟踪/概览的tab
export const analysisTabs = [
  { label: '客流分析', value: 'passengerflow' },
  { label: '成本分析', value: 'cost' },
];

// 租金模式
export const cooperationModel = {
  1: '首年租金',
  2: '保底租金',
};

// 有/没有
export const numberToText = {
  1: '是',
  0: '否',
};

// 装修投入状态
export const decorationStatus = {
  1: '完好',
  2: '现状使用',
  3: '我司新做',
};

// 排名icon
export const rankIcon = [
  'https://staticres.linhuiba.com/project-custom/locationpc/map/medalone.png', // 第一名icon
  'https://staticres.linhuiba.com/project-custom/locationpc/map/medaltwo.png', // 第二名icon
  'https://staticres.linhuiba.com/project-custom/locationpc/map/medalthree.png', // 第三名icon
];
