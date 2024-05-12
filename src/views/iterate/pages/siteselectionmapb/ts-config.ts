import React from 'react';

export const isResetContext = React.createContext<any>(null);

export interface district {
  code:string;
  id:number;
  lat:string|number;
  lng:string|number;
  name:string;
}
export interface mapInfo{
  city:any;
  district:any;
  level:number;
}
// 当前选中的行政区信息
export interface curSelectDistrictType {
  districtInfo :district[];
  cacheMapInfo:mapInfo|null;
}

// 区以下聚合的临界条件
export const CLUSTER_CRITICAL_COUNT = 500;

// 左下地图工具箱
export const mapToolBoxImg = [
  'https://staticres.linhuiba.com/project-custom/locationpc/map/icon_network_putong.png',
  'https://staticres.linhuiba.com/project-custom/locationpc/map/icon_network_weixing.png',
  'https://staticres.linhuiba.com/project-custom/locationpc/map/icon_network_renkoureli.png',
  'https://staticres.linhuiba.com/project-custom/locationpc/map/icon_network_canyinreli.png',
];


export const rankIcon = [
  { url: 'http://staticres.linhuiba.com/project-custom/locationpc/map/pointone.png' },
  { url: 'http://staticres.linhuiba.com/project-custom/locationpc/map/pointtwo.png' },
  { url: 'http://staticres.linhuiba.com/project-custom/locationpc/map/pointthree.png' },
  { url: 'http://staticres.linhuiba.com/project-custom/locationpc/map/marker.png' },
];
export const selectRankIcon = [
  { url: 'http://staticres.linhuiba.com/project-custom/locationpc/map/selectone.png' },
  { url: 'http://staticres.linhuiba.com/project-custom/locationpc/map/selecttwo.png' },
  { url: 'http://staticres.linhuiba.com/project-custom/locationpc/map/selectthree.png' },
  { url: 'http://staticres.linhuiba.com/project-custom/locationpc/map/selectmarker.png' },
];
export const newCreateIcon = 'http://staticres.linhuiba.com/project-custom/locationpc/map/siteSelection_map_ic.png';
export enum mapToolEnum {
  normal = 'normal',
  satellite = 'satellite',
  population = 'population',
  food = 'food'
}

// 筛选项枚举
export enum sectionKey {
  sortRule = 'sortRule', // 排名规则
  sortRuleMenu = 'sortRuleMenu', // 排名规则
  firstLevelCategory='firstLevelCategory', // 商圈类型
  categoryMenu = 'categoryMenu', // 商圈类型
  secondLevelCategoryCultureEducation='secondLevelCategoryCultureEducation', // 文教型
  secondLevelCategoryCommunity='secondLevelCategoryCommunity', // 社区型
  secondLevelCategoryTraffic='secondLevelCategoryTraffic', // 交通枢纽型
  secondLevelCategoryStreet='secondLevelCategoryStreet', // 街铺商圈型
  secondLevelCategoryOffice='secondLevelCategoryOffice', // 办公型
  secondLevelCategoryBusiness='secondLevelCategoryBusiness', // 商场型
  secondLevelCategoryScenicSpot='secondLevelCategoryScenicSpot', // 景区型
  secondLevelCategoryCompound='secondLevelCategoryCompound', // 复合型
  area = 'area', // 行政区--no,
  districtMenu = 'districtMenu', // 行政区--no,
  labelSystemMall = 'labelSystemMall', // 商圈标签
  labelSystemHighQuality = 'labelSystemHighQuality', // 商圈特性
  preferBrand='preferBrand',
  preferBrandMenu = 'preferBrandMenu', // 偏好品牌--no
  avoidBrand = 'avoidBrand', // 避开品牌--no
  avoidBrandMenu = 'avoidBrandMenu', // 避开品牌--no
  cateringStore = 'cateringStore', // 餐饮门店数
  oldCateringStore = 'oldCateringStore', // 餐饮老店占比
  population = 'population', // 周边人口
  marketScore = 'marketScore', // 市场评分
  marketScoreMenu = 'marketScoreMenu', // 市场评分
  passFlow = 'passFlow', // 商场日均客流指数
  housePrice = 'housePrice', // 周边房屋均价
  facility='facility', // 周边配套（500m）
  workType ='workType', // 办公
  schoolType = 'schoolType', // 学校
  trafficType='trafficType', // 交通
  scenicType='scenicType', // 景区
  medicalType ='medicalType', // 医院
  otherType = 'otherType', // 其他市场
  households = 'households', // 小区户数
  houseYear = 'houseYear', // 小区建筑年代
  tourBrand='tourBrand', // 巡展品牌
  tourBrandMenu='tourBrandMenu', // 巡展品牌
  developerBrand='developerBrand', // 开发商品牌
  labelSystemSource='labelSystemSource', // 来源
}
export const secondLevel = [
  sectionKey.secondLevelCategoryCultureEducation,
  sectionKey.secondLevelCategoryCommunity,
  sectionKey.secondLevelCategoryTraffic,
  sectionKey.secondLevelCategoryStreet,
  sectionKey.secondLevelCategoryOffice,
  sectionKey.secondLevelCategoryBusiness,
  sectionKey.secondLevelCategoryScenicSpot,
  sectionKey.secondLevelCategoryCompound,
];
export const leftListSelectionDOM = 'leftListSelectionDOM';

//  与modelCluster/es/selection/list中menuStructure的code一致
export const leftSection = [
  { label: '排名规则', code: sectionKey.sortRuleMenu, remark: '根据您的选址需求自定义排名规则',
    children: [
      { label: '排名规则', code: sectionKey.sortRule }
    ]
  },
  // todo
  { label: '商圈类型', code: sectionKey.categoryMenu, remark: '多样化商圈选择，轻松定位您的目标商圈',
    children: [
      { label: '商业区', code: sectionKey.secondLevelCategoryBusiness },
      { label: '文教型', code: sectionKey.secondLevelCategoryCultureEducation },
      { label: '社区型', code: sectionKey.secondLevelCategoryCommunity },
      { label: '交通枢纽型', code: sectionKey.secondLevelCategoryTraffic },
      { label: '街铺商圈型', code: sectionKey.secondLevelCategoryStreet },
      { label: '办公型', code: sectionKey.secondLevelCategoryOffice },
      { label: '景区型', code: sectionKey.secondLevelCategoryScenicSpot	 },
      { label: '复合型', code: sectionKey.secondLevelCategoryCompound	 },
    ]
  },
  { label: '行政区', code: sectionKey.districtMenu, remark: '筛选特定行政区域，精准定位选址布局',
    children: [
      { label: '行政区', code: sectionKey.area, remark: '筛选特定行政区域，精准定位选址布局', }
    ]
  },
  {
    label: '商圈标签', code: 'labelSystemMenu', remark: '利用细分标签，快速识别商圈特色',
    children: [
      { label: '商圈标签', code: 'labelSystemMall', },
      { label: '商圈特性', code: 'labelSystemHighQuality', },
      { label: '来源', code: 'labelSystemSource', },
    ]
  },
  { label: '开发商品牌', code: 'developerBrandMenu', remark: '查询所属开发品牌的商圈', children: [
    { label: '开发商品牌', code: 'developerBrand', }
  ] },
  {
    label: '商场特性', code: 'mallMenu', remark: '利用细分标签，快速识别商圈特色，轻松定位您的目标商圈',
    children: [
      { label: '商场定位', code: 'mallLevel', },
      { label: '商场规模', code: 'mallSize', },
      { label: '商场开业时长', code: 'mallOpenYears', },
    ]
  },
  {
    label: '商场客流画像', code: 'flowPortraitMenu', remark: '查询符合客流人群画像的商圈',
    children: [
      { label: '日均客流', code: 'passFlow', },
      { label: '性别', code: 'gender', },
      { label: '年龄', code: 'age', },
      { label: '有车客群比例', code: 'carProportion', },
    ]
  },
  { label: '偏好品牌', code: sectionKey.preferBrandMenu, remark: '查询围栏内有此品牌的商圈', children: [
    { label: '偏好品牌', code: sectionKey.preferBrand, }
  ] },
  { label: '避开品牌', code: sectionKey.avoidBrandMenu, remark: '避开围栏内有此品牌的商圈', children: [
    { label: '避开品牌', code: sectionKey.avoidBrand, }
  ] },
  { label: '多经点位', code: 'multiplePointsMenu', remark: '查询拥有以下条件的巡展点位商圈',
    children: [
      { label: '历史是否有汽车巡展', code: 'historyCarTour', },
      { label: '场地面积', code: 'pointArea', },
      { label: '类型', code: 'locationType', },
      { label: '楼层', code: 'floor', },
    ]
  },
  { label: '巡展品牌', code: sectionKey.tourBrandMenu, remark: '历史在商圈开过快慢闪店的品牌', children: [
    { label: '巡展品牌', code: sectionKey.tourBrand }
  ] }, // todo-需要重新请求
  // { label: '巡展车型', code: '', remark: '历史在商圈开过快慢闪店的车型',
  //   children: [
  //     { label: '价格', code: '' },
  //     { label: '能源', code: '' }
  //   ]
  // }, // todo 巡展车型 整个二级筛选都还没有--目前不做
  { label: '小区特性', code: 'houseCharacteristicsMenu', remark: '查询周边500小区特性符合要求的商圈',
    children: [
      { label: '小区户数', code: 'households' },
      { label: '小区房价', code: 'housePrice' },
      { label: '建筑年代', code: 'houseYear' },
    ]
  },
  { label: '居住人口', code: 'residentsMenu', remark: '根据周边500m、3km内居住人口筛选',
    children: [
      { label: '500m人口聚集度', code: 'population' },
      { label: '3km人口聚集度', code: 'population3km' },
    ]
  },
  { label: '周边配套', code: 'surroundingMenu', remark: '查询商圈中心点周边500m内有此配套的商圈',
    children: [
      { label: '办公', code: 'workType' },
      { label: '学校', code: 'schoolType' },
      { label: '交通', code: 'trafficType' },
      { label: '景区', code: 'scenicType' },
      { label: '医院', code: 'medicalType' },
      { label: '其他市场', code: 'otherType' },
    ]
  },
  { label: '市场评分', code: sectionKey.marketScoreMenu, remark: '衡量商圈竞争力的关键指标，分数越高代表整体市场表现越好', children: [
    { label: '市场评分', code: sectionKey.marketScore, }
  ] },
  { label: '餐饮门店', code: 'cateringMenu', remark: '餐饮门店和餐饮老店占比合并',
    children: [
      { label: '门店数', code: 'cateringStore' },
      { label: '存续门店3年老店比例', code: 'oldCateringStore' },
    ]
  },
];

export const facilityList = [
  { label: '办公', key: sectionKey.workType },
  { label: '学校', key: sectionKey.schoolType },
  { label: '交通', key: sectionKey.trafficType },
  { label: '景区', key: sectionKey.scenicType },
  { label: '医院', key: sectionKey.medicalType },
  { label: '其他市场', key: sectionKey.otherType },
];
export const facilityListKeys = [sectionKey.workType, sectionKey.schoolType, sectionKey.trafficType, sectionKey.scenicType, sectionKey.medicalType, sectionKey.otherType];

export const sortRuleAliasOptions = [
  { id: 1, name: '市场评分排序', key: 'marketScore' },
  { id: 2, name: '商场客流排序', key: 'mallPassFlow' },
  { id: 3, name: '餐饮门店排序', key: 'foodStores' },
  { id: 4, name: '餐饮老店排序', key: 'oldCateringRate' },
  { id: 5, name: '500米人口排序', key: 'population' },
  { id: 6, name: '3km人口排序', key: 'population3km' },
  { id: 7, name: '商场面积', key: 'polygonArea' },
  { id: 8, name: '商户数', key: 'openStores' },
  { id: 9, name: '建成年份', key: 'mallOpenYears' },
];
export const creating = 'creating';
export const collecting = 'collecting';
export const allData = 'allData';
// export const creatingOption = { key: creating, name: '生成中', value: creating };
export const rankOptions:any[] = [
  { key: creating, name: '生成中', value: creating },
  { key: collecting, name: '收藏', value: collecting },
  { key: 'rank', name: '全部', value: allData },
  { key: 'rank20', name: '前20名', value: 20 },
  { key: 'rank50', name: '前50名', value: 50 },
  { key: 'rank100', name: '前100名', value: 100 },
  { key: 'rank200', name: '前200名', value: 200 },
  { key: 'rank300', name: '前300名', value: 300 },
  { key: 'rank500', name: '前500名', value: 500 },
];

export enum tabsKey {
  energy = 'energy',
  all = 'all'
}
export enum businessStatus {
  NEW = 'NEW',
  COMPLETE = 'COMPLETE'
}
export const carBrandRadio = [
  { label: '所有品牌', key: tabsKey.all },
  { label: '能源类型', key: tabsKey.energy },
];

// 类名
export const mapCon = 'mapCon';
export const addBusiness = 'addBusinessBtn';
export const networkMapContainer = 'networkMapContainer';
export const topCon = 'topCon';

export enum geoCategory{
  catering = '01',
  car='08'
}
// 服务端说不能写枚举，id又自增，只能通过中文匹配
export enum businessType{
  recommend = '推荐商圈',
  new = '新增商圈'
}
