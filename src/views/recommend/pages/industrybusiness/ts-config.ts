export interface MockDemo {
  a: Function;
}

// // 显示全国范围的level值（展示全国范围下的不同省份）
// export const COUNTRY_LEVEL = 1;
// // 显示省范围的level值 （展示省范围下的不同城市）
// export const PROVINCE_LEVEL = 2;
// // 显示市范围的level值 （展示市范围下的不同区）
// export const CITY_LEVEL = 3;
// // 显示区范围的level值
// export const DISTRICT_LEVEL = 4;

// // 显示全国范围的地图缩放级别
// export const PROVINCE_FIT_ZOOM = 7.25;
// // 显示市范围的地图缩放级别
// export const CITY_FIT_ZOOM = 8.8;
// // 显示区范围的地图缩放级别
// export const DISTRICT_FIT_ZOOM = 13;
// // 显示商圈名称和围栏的缩放级别
// export const BUSINESS_FIT_ZOOM = 15;

// // 显示商圈名称和围栏的缩放级别
// export const BUSINESS_ZOOM = 14;


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
    labelBg: '#FAA2C9',
    selectedColor: '#FAA2C9',
  }
};


// 类型（0: 自定义创建，1:模型同步）
export enum businessType {
  DIYBusiness=0,
  synchronizationBusiness=1
}

export const maxAddressMarkerCount = 500; // 最多显示的商区个数
