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

