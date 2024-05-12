export interface MockDemo {
  a: Function;
}

/**
 * @description 标签类型
 */
export enum LabelType {
  System = 1, // 系统标签
  NetPlan = 2, // 网规标签
  Custom = 3 // 自定义标签
}

// A、B、C、D标签（网规标签）
export const labelType = [
  'https://staticres.linhuiba.com/project-custom/locationpc/label/label_A@2x.png',
  'https://staticres.linhuiba.com/project-custom/locationpc/label/label_B@2x.png',
  'https://staticres.linhuiba.com/project-custom/locationpc/label/label_C@2x.png',
  'https://staticres.linhuiba.com/project-custom/locationpc/label/label_D@2x.png',
];

export const labelTypeSmall = [
  'https://staticres.linhuiba.com/project-custom/locationpc/label/label_A_small@2x.png',
  'https://staticres.linhuiba.com/project-custom/locationpc/label/label_B_small@2x.png',
  'https://staticres.linhuiba.com/project-custom/locationpc/label/label_C_small@2x.png',
  'https://staticres.linhuiba.com/project-custom/locationpc/label/label_D_small@2x.png',
];

// A、B、C、D标签
export const typeLabels = ['A类', 'B类', 'C类', 'D类'];

/*
  网规标签名称与图片对应map

  使用方法：
  拿到标签名称label后，
  const imgUrl = typeLabelImgMap.get(label) || ''
*/
export const typeLabelImgMap = new Map([
  ['A类', labelType[0]],
  ['B类', labelType[1]],
  ['C类', labelType[2]],
  ['D类', labelType[3]],
]);

export const typeSmallLabelImgMap = new Map([
  ['A类', labelTypeSmall[0]],
  ['B类', labelTypeSmall[1]],
  ['C类', labelTypeSmall[2]],
  ['D类', labelTypeSmall[3]],
]);

// 区以下聚合的临界条件
export const CLUSTER_CRITICAL_COUNT = 500;

export const markerDefaultColorOption = { // 默认普通商圈围栏颜色
  strokeColor: '#006AFF',
  fillColor: '#006AFF',
  zIndex: 10
};

// export const markerDefaultTopColorOption = { // 默认排名前三普通商圈围栏颜色
//   strokeColor: '#ff861d',
//   fillColor: '#ff861d',
//   zIndex: 10
// };

export const markerActiveColorOption = { // 当前点击的商圈围栏
  // strokeColor: '#ff861d',
  // fillColor: 'rgba(242, 48, 48, 0.2)',
  strokeColor: '#FC7657',
  fillColor: '#FC7657',
  zIndex: 20
};

export const hasViewMarkerColorOption = { // 已经看过的普通商圈围栏
  strokeColor: '#006AFF',
  fillColor: 'rgba(0, 106, 255, 0.2)',
  zIndex: 10
};

// export const hasViewMarkerTopColorOption = { // 已经看过的排名前三的商圈围栏
//   strokeColor: '#ff861d',
//   fillColor: 'rgba(255, 134, 29, 0.2)',
//   zIndex: 10
// };

// 左侧筛选项
export const labelPlanCluster = 'labelPlanCluster';// 网规商圈
export const labelCustom = 'labelCustom';// 自定义商圈
export const labelSystemBrand = 'labelSystemBrand';// 标杆品牌商圈
export const labelSystemHighQuality = 'labelSystemHighQuality';// 商圈特性
export const labelSystemMall = 'labelSystemMall';// 商圈特点
export const labelSystemFlow = 'labelSystemFlow';// 商圈客群
export const preferenceBrand = 'preferenceBrand';// 偏好品牌
export const avoidBrand = 'avoidBrand';// 避开品牌
export const firstLevelCategory = 'firstLevelCategory';// 商圈类型
export const houseYear = 'houseYear';// 小区建筑年代
export const households = 'households';// 小区户数
export const workType = 'workType';// 办公
export const schoolType = 'schoolType';// 学校
export const trafficType = 'trafficType';// 交通
export const scenicType = 'scenicType';// 景区
export const medicalType = 'medicalType';// 医院
export const otherType = 'otherType';// 其他市场
export const radiationResidentsList = 'radiationResidentsList';// 辐射居住人口排名
export const radiationWorkPopulationList = 'radiationWorkPopulationList';// 辐射办公人口排名



// 左下地图工具箱
export const mapToolBoxImg = [
  'https://staticres.linhuiba.com/project-custom/locationpc/map/icon_network_putong.png',
  'https://staticres.linhuiba.com/project-custom/locationpc/map/icon_network_weixing.png',
  'https://staticres.linhuiba.com/project-custom/locationpc/map/icon_network_renkoureli.png',
  'https://staticres.linhuiba.com/project-custom/locationpc/map/icon_network_canyinreli.png',
];

export enum mapToolEnum {
  normal = 'normal',
  satellite = 'satellite',
  population = 'population',
  food = 'food'
}

export const tabOne = { label: '机会点', key: 'chancePoint' };
export const tabTwo = { label: '基本信息', key: 'shopOfBasic' };
export const tabThree = { label: '点位', key: 'shopOfPoints' };
export const tabFour = { label: '经营业态', key: 'typeOfBusiness' };
export const tabFive = { label: '入驻商户', key: 'commercialTenant' };
export const tabSix = { label: '客流画像', key: 'passengerFlowPortrait' };
export const tabSeven = { label: '周边配套', key: 'surroundingFacility' };

export enum TaskStatus {
  PROCESSING = 20, // 进行中
  CHANGED = 30, // 已变更
  COMPLETED = 40, // 已完成
  CLOSE = 50, // 已关闭
}
