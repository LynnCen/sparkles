
export const location = [
  { lng: 120.289306640625, lat: 30.1111111, categoryName: '购物', poiId: 1, poiName: 'poiName' },
  { lng: 120.289306640625, lat: 30.4266357421875, categoryName: '店铺', poiId: 1, poiName: 'poiName' },
  { lng: 120.289306640625, lat: 30.4266357421875, categoryName: '购物', poiId: 1, poiName: 'poiName' },
  { lng: 120.289306640625, lat: 30.4266357421875, categoryName: '餐饮', poiId: 1, poiName: 'poiName' },
  { lng: 120.289306640625, lat: 30.4266357421875, categoryName: '汽车', poiId: 1, poiName: 'poiName' },
  { lng: 120.289306640625, lat: 30.4266357421875, categoryName: '住宿', poiId: 1, poiName: 'poiName' },
  { lng: 120.289306640625, lat: 30.4266357421875, categoryName: '商务', poiId: 1, poiName: 'poiName' },
  { lng: 120.289306640625, lat: 30.4266357421875, categoryName: '其他', poiId: 1, poiName: 'poiName' },
];
export const categoryToStyle = {
  'FL01': 0,
  'FL02': 1,
  'FL0201': 2,
  'FL0202': 3,
  'FL0203': 4,
  'FL0204': 5,
  'FL0205': 6,
  'FL0206': 7,
};

export const selectIcon = {
  '购物中心': { iconHref: 'iconic_left_gouwuzhongxin' },
  '店铺': { iconHref: 'iconic_left_dianpu' },
  '汽车相关': { iconHref: 'iconic_left_qiche', style: { color: '#006AFF' } },
  '餐饮服务': { iconHref: 'iconic_left_canting', style: { color: '#FC8331' } },
  '购物服务': { iconHref: 'iconic_left_gouwu', style: { color: '#AB67F8' } },
  '住宿服务': { iconHref: 'iconic_left_zhusu', style: { color: '#00B183' } },
  '商务住宅': { iconHref: 'iconic_left_shangwu', style: { color: '#6967F8' } },
  '其它': { iconHref: 'iconic_left_qita', style: { color: '#5BD8E0' } },
};

export const iconStyle = [
  {
    url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_gouwuzhongxin.png',
    anchor: 'bottom-center',
    size: [23, 24],
    zIndex: 1,
  },
  {
    url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_dianpu.png',
    anchor: 'bottom-center',
    size: [23, 24],
    zIndex: 1,
  },
  {
    url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_qiche.png',
    anchor: 'bottom-center',
    size: [23, 24],
    zIndex: 1,
  },
  {
    url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_canting.png',
    anchor: 'bottom-center',
    size: [23, 24],
    zIndex: 1,
  },
  {
    url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_gouwu.png',
    anchor: 'bottom-center',
    size: [23, 24],
    zIndex: 1,
  },
  {
    url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_zhusu.png',
    anchor: 'bottom-center',
    size: [23, 24],
    zIndex: 1,
  },
  {
    url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_shangwu.png',
    anchor: 'bottom-center',
    size: [23, 24],
    zIndex: 1,
  },
  {
    url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_qita.png',
    anchor: 'bottom-center',
    size: [23, 24],
    zIndex: 1,
  },
];

export enum IndustryId {
  Clothing = 1, // 服装行业
  Catering = 6, // 餐饮行业
  Car = 13 // 汽车行业
}

// 服装行业
export const clothingIndustry = {
  bgUrl: 'https://staticres.linhuiba.com/project-custom/locationpc/industry/bg_industry_clothing.png',
  introduce: '服装业主要由原料采购、服装设计、生产、销售的一系列联系极其紧密的环节构成，主要由服饰鞋帽皮具二级行业组成。',
  revenue: [ // 营收Top10
    { name: '海澜之家', data: 201.88 },
    { name: '三房巷', data: 194.79 },
    { name: '华利集团', data: 174.70 },
    { name: '华孚时尚', data: 167.08 },
    { name: '际华集团', data: 154.94 },
    { name: '森马服饰', data: 154.20 },
    { name: '雅戈尔', data: 136.07 },
    { name: '太平鸟', data: 109.21 },
    { name: '航民股份', data: 95.91 },
    { name: '百隆东方', data: 77.74 },
  ],
  marketShares: [ // 上年市场规模
    { name: '1月', data: 1322 },
    { name: '2月', data: 1689 },
    { name: '3月', data: 2496 },
    { name: '4月', data: 3238 },
    { name: '5月', data: 4058 },
    { name: '6月', data: 4875 },
    { name: '7月', data: 5530 },
    { name: '8月', data: 6154 },
    { name: '9月', data: 6918 },
    { name: '10月', data: 7824 },
    { name: '11月', data: 8906 },
    { name: '12月', data: 9975 },
  ],
};

// 汽车行业
export const carIndustry = {
  bgUrl: 'https://staticres.linhuiba.com/project-custom/locationpc/industry/bg_industry_car.png', // 背景图
  introduce: '指其汽车产品或具有相同工艺过程或提供同类劳动服务划分的经济活动类别。包括汽车生产、销售、售后、美容等增值服务的总体。', // 简介
  revenue: [ // 营收Top10
    { name: '大众汽车', data: 2827.6 },
    { name: '丰田汽车', data: 2752.8 },
    { name: '戴姆勒', data: 1933.46 },
    { name: '福特汽车', data: 1550.9 },
    { name: '本田汽车', data: 1373.32 },
    { name: '通用汽车', data: 1372.37 },
    { name: '上汽集团', data: 1220.7 },
    { name: '宝马汽车', data: 1166.38 },
    { name: '日产汽车', data: 908.63 },
    { name: '现代汽车', data: 907.4 },
  ],
  marketShares: [
    { name: '1月', data: 250.3, unit: '万辆' },
    { name: '2月', data: 145.5, unit: '万辆' },
    { name: '3月', data: 252.6, unit: '万辆' },
    { name: '4月', data: 225.2, unit: '万辆' },
    { name: '5月', data: 212.8, unit: '万辆' },
    { name: '6月', data: 201.5, unit: '万辆' },
    { name: '7月', data: 186.4, unit: '万辆' },
    { name: '8月', data: 179.9, unit: '万辆' },
    { name: '9月', data: 206.7, unit: '万辆' },
    { name: '10月', data: 233.3, unit: '万辆' },
    { name: '11月', data: 252.2, unit: '万辆' },
    { name: '12月', data: 278.6, unit: '万辆' },
  ]
};

// 餐饮行业
export const cateringIndustry = {
  bgUrl: 'https://staticres.linhuiba.com/project-custom/locationpc/industry/bg_industry_catering.png',
  introduce: '通过即时加工制作、商业销售和服务性劳动于一体，向消费者专门提供各种酒水、食品，消费场所和设施的食品生产经营行业。',
  revenue: [ // 营收Top10
    { name: '金拱门', data: 1568.31 },
    { name: '百胜', data: 444.64 },
    { name: '海底捞', data: 411.12 },
    { name: '千喜鹤', data: 387.27 },
    { name: '瑞幸', data: 79.65 },
    { name: '杨国福', data: 14.32 },
    { name: '金丰', data: 0 },
    { name: '顶巧', data: 0 },
    { name: '朝天门', data: 0 },
    { name: '品尚', data: 0 },
  ],
  marketShares: [ // 近十年市场规模
    { name: '2012', data: 23448 },
    { name: '2013', data: 25392 },
    { name: '2014', data: 27860 },
    { name: '2015', data: 32310 },
    { name: '2016', data: 35799 },
    { name: '2017', data: 39644 },
    { name: '2018', data: 42716 },
    { name: '2019', data: 46721 },
    { name: '2020', data: 39527 },
    { name: '2021', data: 40895 },
  ]
};
