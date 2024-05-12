// 客群列表返回结果
// export const customList = [
//   {
//     title: '注册会员',
//     key: 'vip',
//     id: 111,
//     checked: false,
//     icon: 'https://staticres.linhuiba.com/project-custom/locationpc/industry/ic_vip@2x.png',
//     color: '#FF861F'
//   },
//   {
//     title: '活跃会员',
//     key: 'activeVip',
//     checked: false,
//     id: 3,
//     icon: 'https://staticres.linhuiba.com/project-custom/locationpc/industry/ic_activeVip@2x.png',
//     color: '#FC6076'
//   },
//   {
//     title: '会员收货地址',
//     key: 'address',
//     id: 24,
//     checked: false,
//     icon: 'https://staticres.linhuiba.com/project-custom/locationpc/industry/ic_address@2x.png',
//     color: '#3291FC'
//   },
// ];
export const customList = [
  {
    title: '注册会员',
    key: 1,
    id: 111,
    checked: false,
    icon: 'https://staticres.linhuiba.com/project-custom/locationpc/industry/ic_vip@2x.png',
    color: '#FF861F'
  },
  {
    title: '活跃会员',
    key: 2,
    checked: false,
    id: 3,
    icon: 'https://staticres.linhuiba.com/project-custom/locationpc/industry/ic_activeVip@2x.png',
    color: '#FC6076'
  },
  {
    title: '沉睡会员',
    key: 3,
    id: 24,
    checked: false,
    icon: 'https://staticres.linhuiba.com/project-custom/locationpc/industry/ic_address@2x.png',
    color: '#3291FC'
  },
];

// 客群属性映射
// export const customerMap = {
//   vip: {
//     logo: 'https://staticres.linhuiba.com/project-custom/locationpc/industry/ic_vip@2x.png',
//     name: '注册会员',
//   },
//   activeVip: {
//     logo: 'https://staticres.linhuiba.com/project-custom/locationpc/industry/ic_activeVip@2x.png',
//     name: '活跃会员',
//   },
//   address: {
//     logo: 'https://staticres.linhuiba.com/project-custom/locationpc/industry/ic_address@2x.png',
//     name: '会员收货地址',
//   },
// };
export const customerMap = {
  1: {
    logo: 'https://staticres.linhuiba.com/project-custom/locationpc/industry/ic_vip@2x.png',
    name: '注册会员',
  },
  2: {
    logo: 'https://staticres.linhuiba.com/project-custom/locationpc/industry/ic_activeVip@2x.png',
    name: '活跃会员',
  },
  3: {
    logo: 'https://staticres.linhuiba.com/project-custom/locationpc/industry/ic_address@2x.png',
    name: '沉睡会员',
  },
};
// 客群颜色映射
// export const customerColorMap = {
//   vip: '#FF861F',
//   activeVip: '#FC6076',
//   address: '#3291FC',
// };
export const customerColorMap = {
  1: '#FF861F',
  2: '#FC6076',
  3: '#3291FC',
};
// 模拟请求客群列表方法
export const fetchCustomerList = () => {
  return new Promise((resolve) => {
    resolve(customList);
  });
};

// 绘制客群海量点配置
// export const massMarkerList = {
//   vip: [
//     {
//       url: 'https://staticres.linhuiba.com/project-custom/locationpc/industry/ic_vip@2x.png',
//       anchor: 'bottom-center',
//       size: [23, 24],
//       zIndex: 1,
//     },
//   ],
//   activeVip: [
//     {
//       url: 'https://staticres.linhuiba.com/project-custom/locationpc/industry/ic_activeVip@2x.png',
//       anchor: 'bottom-center',
//       size: [23, 24],
//       zIndex: 1,
//     },
//   ],
//   address: [
//     {
//       url: 'https://staticres.linhuiba.com/project-custom/locationpc/industry/ic_address@2x.png',
//       anchor: 'bottom-center',
//       size: [23, 24],
//       zIndex: 1,
//     },
//   ],
// };
export const massMarkerList = {
  1: [
    {
      url: 'https://staticres.linhuiba.com/project-custom/locationpc/industry/ic_vip@2x.png',
      anchor: 'bottom-center',
      size: [23, 24],
      zIndex: 1,
    },
  ],
  2: [
    {
      url: 'https://staticres.linhuiba.com/project-custom/locationpc/industry/ic_activeVip@2x.png',
      anchor: 'bottom-center',
      size: [23, 24],
      zIndex: 1,
    },
  ],
  3: [
    {
      url: 'https://staticres.linhuiba.com/project-custom/locationpc/industry/ic_address@2x.png',
      anchor: 'bottom-center',
      size: [23, 24],
      zIndex: 1,
    },
  ],
};

// 原热力图勾选成海亮点（客群分布右边勾选）
export const massMarkerRightList = [
  {
    url: 'https://staticres.linhuiba.com/project-custom/locationpc/industry/icon_register.png',
    anchor: 'bottom-center',
    size: [6, 6],
    zIndex: 1,
  },
  {
    url: '//staticres.linhuiba.com/project-custom/locationpc/industry/icon_register.png',
    anchor: 'bottom-center',
    size: [6, 6],
    zIndex: 1,
  },
  {
    url: '//staticres.linhuiba.com/project-custom/locationpc/industry/icon_register.png',
    anchor: 'bottom-center',
    size: [6, 6],
    zIndex: 1,
  },
];

// 品牌饼图颜色盘
export const chartColorList = [
  'rgba(210, 89, 217, 1)',
  'rgba(255, 161, 54, 1)',
  'rgba(118, 68, 226, 1)',
  'rgba(10, 153, 81, 1)',
  'rgba(218, 42, 111, 1)',
  'rgba(255, 132, 86, 1)',
  'rgba(246, 239, 0, 1)',
];

// 商圈icon集合
export const areaIcon = [
  'iconic_circle',
  'iconic_wubianxing',
  'iconic_sanjiaoxing',
  'iconic_liubianxing',
  'iconic_fangxing',
  'iconic_babianxing'
];
// 商圈颜色集合，与icon颜色一一对应
export const AreaChartColorList = [
  'rgba(210, 89, 217, 1)',
  'rgba(118, 68, 226, 1)',
  'rgba(10, 153, 81, 1)',
  'rgba(218, 42, 111, 1)',
  'rgba(255, 161, 54, 1)',
  'rgba(255, 132, 86, 1)',
];
// 商圈详情的属性与类名
export const areaDeatil = [

  {
    label: '城市内商圈排名',
    key: 'rank',
  },
  {
    label: '商圈名称',
    key: 'name',
  },
  {
    label: '地址',
    key: 'address',
  },
  {
    label: '商圈类型',
    key: 'typeName',
  },
  {
    label: '运营状态',
    key: 'status',
  },
  {
    label: '所属行政区',
    key: 'districtInfo',
  },
  {
    label: '工作日日均客流',
    key: 'weekdayFlow',
    // unit: '万人次'
  },
  {
    label: '节假日日日均客流',
    key: 'weekendFlow',
    // unit: '万人次'
  },
  {
    label: '已入驻重点新能源汽车品牌',
    key: 'electricBrands',
  },
  {
    label: '已入驻重点关注汽车品牌',
    key: 'luxuryBrands',
  },
  {
    label: '入驻业态/企业信息',
    key: 'ecology',
  },
  {
    label: '计划招商方向',
    key: 'policy',
  },
  {
    label: '面积',
    key: 'area',
    unit: '万m²'
  },
  {
    label: '周边3公里商场',
    key: 'malls',
  },
];
// 城市信息的属性
export const cityInfoMap = [
  {
    label: '城市级别',
    key: 'levelName'
  },
  {
    label: '城市面积',
    key: 'area',
    unit: 'km²'
  },
  {
    label: '常住人口',
    key: 'population',
    unit: '万'
  },
  {
    label: '流动人口',
    key: 'flowPopulation',
    unit: '万'
  },
  {
    label: 'GDP',
    key: 'gdp',
    unit: '亿'
  },
  {
    label: 'GDP增速',
    key: 'gdpGrowthRate',
    unit: '%'
  },
];
// 车辆属性
export const carSaleMap = [
  {
    label: '纯电动',
    key: 'electricSales'
  },
  // {
  //   label: '常规混合动力',
  //   key: 'conventionalHybrid'
  // },
  {
    label: '传统燃料',
    key: 'conventionalFuels'
  },
  // {
  //   label: '插电式混合动力',
  //   key: 'electricHybrid'
  // }
];
// 绘制行业网点icon大小映射表
export const zoomStyleMapping = {
  8: [23, 24],
  9: [23, 24],
  10: [23, 24],
  11: [25, 26],
  12: [25, 26],
  13: [29, 30],
  14: [29, 30],
  15: [31, 33],
  16: [31, 33],
  17: [33, 35],
  18: [33, 35],
  19: [33, 35],
  20: [33, 35],
};

export interface MapTreeProps {
  onCheck: () => void; // 勾选回调
  treeData: any[]; // 树数据
  clickSwitch?: Function; //
  showSwitch?: boolean; // 是否展示switch按钮
  hasBtBorder?: boolean; // 树是否有分割线
  disabled?: boolean; // 是否树禁用
  checkedKeys: any[]; // 勾选的key
  switchTitle?: string; // switch按钮的title
  classNames?: any;
  checkedProp?:string; // 单个开关是否展示的字段
  onSelectBrandTree?:()=>void;// 选择树的某一项触发的方法
  data?:any
}


export const featureOptionsEnum = {
  car: [
    { label: '销售', value: 1 },
    { label: '售后', value: 2 },
    { label: '交付', value: 3 },
  ],
  food: [
    { label: '堂食', value: 4 },
    { label: '外卖', value: 5 },
  ]
};
