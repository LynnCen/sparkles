export interface MockDemo {
  a: Function;
}


export const NOT_MORE_DATA = 0;// page为0的时候代表没有更多的数据了

export const BUSINESS_COLOR = ['#0A9951', '#49C7FF', '#FF8456', '#006AFF', '#D259D9', '#7644E2', '#FFC136'];


// 门店状态(100:已签约 300:已交房 500:开业中 700:已闭店)

export enum Status {
  SIGNED = 100,
  DELIVERY_HOUSE = 300,
  START_BUSINESS = 500,
  CLOSED =700,
}
export enum RankStatus{
  normal, // 普通情况，无勾选奶茶行业评分排名或益禾堂评分排名
  brandRank, // 奶茶行业评分排名
  yhtRank// 益禾堂评分排名
}

// 写成对象方便以后冗余其他字段
export const colorStatus = {
  1: { // 商业区
    color: '#7644E2',
    labelBg: 'rgba(118, 68, 226, 0.08)',
    selectedColor: '#BAA1F0',
  },
  2: { // 社区型
    color: '#2AB3D1',
    labelBg: 'rgba(42, 179, 209, 0.08)',
    selectedColor: '#94D9E8',
  },
  3: { // 文教型
    color: '#FF8456',
    labelBg: 'rgba(255, 132, 86, 0.08)',
    selectedColor: '#FFC1AA',
  },
  4: { // 交通枢纽型
    color: '#FFC136',
    labelBg: 'rgba(255, 193, 54, 0.08)',
    selectedColor: '#FFE09A',
  },
  5: { // 办公型
    color: '#006AFF',
    labelBg: 'rgba(0, 106, 255, 0.08)',
    selectedColor: '#7FB4FF',
  },
  6: { // 景区型
    color: '#0A9951',
    labelBg: 'rgba(10, 153, 81, 0.08)',
    selectedColor: '#84CCA8',
  },
  7: { // 复合型
    color: '#D259D9',
    labelBg: 'rgba(210, 89, 217, 0.08)',
    selectedColor: '#E8ACEC',
  },
  8: { // 街铺
    color: '#F54593',
    labelBg: 'rgba(245, 69, 147, 0.08)',
    selectedColor: '#F199C0',
  }
};


// 类型（0: 自定义创建，1:模型同步）
export enum businessType {
  DIYBusiness=0,
  synchronizationBusiness=1
}

export const dropdownRows = [
  { id: 1, name: '商圈信息' },
  { id: 2, name: '竞品分布' },
  { id: 3, name: '本品牌分布' },
  { id: 4, name: '筛选条件' },
];
// 筛选条件中的锚点
export const searchModalAnchorItems = [
  { id: 'recommendIndustryBusinessSearchBasic', title: '基础筛选' },
  { id: 'recommendIndustryBusinessSearchBrand', title: '品牌筛选' },
  { id: 'recommendIndustryBusinessSearchAssort', title: '配套筛选', subhead: '（周边500米）' },
  { id: 'recommendIndustryBusinessSearchTrend', title: '趋势筛选', subhead: '（周边500米）' },
];

export const markerDefaultColorOption = {
  strokeColor: '#006AFF',
  fillColor: '#006AFF',
};

export const markerActiveColorOption = {
  strokeColor: '#FC7657',
  fillColor: '#FC7657',
};

// https://confluence.lanhanba.com/pages/viewpage.action?pageId=109315635
// 小区建筑年代、小区户数（需要根据不同城市，出现此筛选项）
export const targetCityIdShowHousing = [
  1,
  2,
  3,
  4,
  6,
  8,
  9,
  12,
  14,
  25,
  26,
  37,
  38,
  51,
  52,
  60,
  73,
  74,
  75,
  76,
  77,
  78,
  79,
  80,
  81,
  82,
  84,
  87,
  88,
  89,
  90,
  91,
  92,
  93,
  96,
  98,
  99,
  105,
  108,
  114,
  115,
  118,
  119,
  123,
  126,
  129,
  130,
  133,
  134,
  135,
  136,
  139,
  140,
  141,
  142,
  143,
  145,
  149,
  150,
  151,
  152,
  153,
  156,
  158,
  159,
  165,
  166,
  168,
  169,
  171,
  172,
  185,
  186,
  188,
  190,
  191,
  199,
  201,
  202,
  204,
  205,
  206,
  209,
  214,
  215,
  216,
  220,
  221,
  222,
  224,
  234,
  253,
  255,
  259,
  260,
  262,
  263,
  264,
  265,
  266,
  267,
  269,
  275,
  276,
  278,
  285,
  308,
  310,
  311,
  314,
  318,
  340,
  345
];
