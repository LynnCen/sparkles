export interface MockDemo {
  a: Function;
}

/** 规划管理 tab 枚举 */
export enum TabsEnums {
  /**
   * 总公司
   */
  HEAD_OFFICE = '1',
  /**
   * 分公司
   */
  BRANCH = '2',
}

/** 规划状态 */
export const enum PlanStatusEnum {
  /**
   * 总部规划中
   */
  HEADQUARTERS_IN_PLANNING = 1,
  /**
   * 分公司规划中
   */
  BRANCH_IS_PLANNING = 2,
  /**
   * 审批中
   */
  UNDER_APPROVAL = 3,
  /**
   * 已通过
   */
  PASSED = 4,
  /**
  * 已驳回
  */
  DISMISSED = 5,
  /**
   * 已拒绝
   */
  REJECTED = 6,
  /**
   * 生效中
   */
  ACTIVE = 7,
}

/** 规划状态 颜色枚举*/
export const PlanningStatus = {
  1: {
    color: '#FA8723',
    text: '总部规划中'
  }, // 总部规划中
  2: {
    color: '#F216EB',
    text: '分公司规划中'
  }, // 分公司规划中
  3: {
    color: '#006AFF',
    text: '审批中'
  }, // 审批中
  4: {
    color: '#009963',
    text: '已通过'
  }, // 已通过
  5: {
    color: '#F23030',
    text: '已驳回'
  }, // 已驳回
  6: {
    color: '#F23030',
    text: '已拒绝'
  }, // 已拒绝
  7: {
    color: '#F5D83F',
    text: '生效中'
  }, // 生效中
};



// // 显示全国范围的level值（展示全国范围下的不同省份）
// export const COUNTRY_LEVEL = 1;
// // 显示省范围的level值 （展示省范围下的不同城市）
// export const PROVINCE_LEVEL = 2;
// // 显示市范围的level值 （展示市范围下的不同区）
// export const CITY_LEVEL = 3;
// // 显示区范围的level值
// export const DISTRICT_LEVEL = 4;

// // 显示全国范围的地图缩放级别
// export const PROVINCE_ZOOM = 6;
// // 显示市范围的地图缩放级别
// export const CITY_ZOOM = 8;
// // 显示区范围的地图缩放级别
// export const DISTRICT_ZOOM = 10;

export const BusinessAreaType = 'BusinessAreaType';// 商区列表
export const dataType = [
  {
    key: BusinessAreaType,
    label: `商区列表`,
    value: BusinessAreaType
  },
  {
    key: '1',
    label: `分公司规划`,
    value: '1'
  },
  {
    key: '2',
    label: `分公司剔除`,
    value: '2'
  },
  {
    key: '3',
    label: `分公司新增`,
    value: '3'
  },
];



// todo 1221-szn 待优化删除



export enum RankStatus{
  normal=0, // 普通情况，无勾选奶茶行业评分排名或益禾堂评分排名
  brandRank=1, // 奶茶行业评分排名
  yhtRank=2// 益禾堂评分排名
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
    labelBg: '#FAA2C9',
    selectedColor: '#FAA2C9',
  }

};


// 类型（0: 自定义创建，1:模型同步）
export enum businessType {
  DIYBusiness=0,
  synchronizationBusiness=1
}

// 类名
export const mapCon = 'mapCon';
export const addBusiness = 'addBusinessBtn';

// 类型（1:商圈点位marker 2:商区（市场容量）围栏marker）
export enum markerType {
  AddressMarker = 1,
  BusinessDistrictMarker = 2
}


export const maxAddressMarkerCount = 500; // 最多显示的商区个数
