export interface MockDemo {
  a: Function;
}

// 1,2,3区域的icon
export const leftIcon = [
  { url: '//staticres.linhuiba.com/project-custom/locationpc/map/medalone.png' },
  { url: '//staticres.linhuiba.com/project-custom/locationpc/map/medaltwo.png' },
  { url: '//staticres.linhuiba.com/project-custom/locationpc/map/medalthree.png' },
];

export const areaIcon = [
  { url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_dingwei_one@2x.png' },
  { url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_dingwei_two@2x.png' },
  { url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_dingwei_three@2x.png' },
  { url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_dingwei_select_one@2x.png' },
  { url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_dingwei_select_two@2x.png' },
  { url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_dingwei_select_three@2x.png' },
];
export const rankIcon = [
  { url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_dingwei@2x.png' },
  { url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_dingwei@2x-2.png' },
  { url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_dingwei@2x-3.png' },
  { url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_dingwei@2x-4.png' },
  { url: '//staticres.linhuiba.com/project-custom/locationpc/lantu/ic_dingwei@2x-5.png' },
];

export const mapIcon = {
  'business': {
    '大型商场': '//staticres.linhuiba.com/project-custom/locationpc/recommend/icon_business_store@2x.png',
    '服装': '//staticres.linhuiba.com/project-custom/locationpc/recommend/icon_business_clothing@2x.png',
    '零售': '//staticres.linhuiba.com/project-custom/locationpc/recommend/icon_business_retail@2x.png',
    '餐饮': '//staticres.linhuiba.com/project-custom/locationpc/recommend/icon_business_restaurant@2x.png',
    '旅游景点': '//staticres.linhuiba.com/project-custom/locationpc/recommend/icon_business_spot@2x.png',
  },
  'traffic': {
    '地铁站': '//staticres.linhuiba.com/project-custom/locationpc/recommend/icon_traffic_subway@2x.png',
    '公交站': '//staticres.linhuiba.com/project-custom/locationpc/recommend/icon_traffic_transit@2x.png',
    '停车场': '//staticres.linhuiba.com/project-custom/locationpc/recommend/icon_traffic_stop@2x.png',
    '火车站': '//staticres.linhuiba.com/project-custom/locationpc/recommend/icon_traffic_train@2x.png',
    '机场': '//staticres.linhuiba.com/project-custom/locationpc/recommend/icon_traffic_aircraft@2x.png',
  },
  'competition': {
    '咖啡厅': '//staticres.linhuiba.com/project-custom/locationpc/recommend/icon_competition_coffee@2x.png',
    '茶艺馆': '//staticres.linhuiba.com/project-custom/locationpc/recommend/icon_competition_tea@2x.png',
    '冷饮店': '//staticres.linhuiba.com/project-custom/locationpc/recommend/icon_competition_cold@2x.png',
  },
  'around': {
    '小区': '//staticres.linhuiba.com/project-custom/locationpc/recommend/icon_around_center@2x.png',
    '酒店': '//staticres.linhuiba.com/project-custom/locationpc/recommend/icon_around_hotel@2x.png',
    '学校': '//staticres.linhuiba.com/project-custom/locationpc/recommend/icon_around_school@2x.png',
    '医院': '//staticres.linhuiba.com/project-custom/locationpc/recommend/icon_around_hospital@2x.png',
    '公园': '//staticres.linhuiba.com/project-custom/locationpc/recommend/icon_around_park@2x.png',
    '图书馆': '//staticres.linhuiba.com/project-custom/locationpc/recommend/icon_around_library@2x.png',
    '休闲娱乐': '//staticres.linhuiba.com/project-custom/locationpc/recommend/icon_around_leisure@2x.png',
    '工业园区': '//staticres.linhuiba.com/project-custom/locationpc/recommend/icon_around_industry@2x.png',
    '综合市场': '//staticres.linhuiba.com/project-custom/locationpc/recommend/icon_around_market@2x.png',
    '运动场馆': '//staticres.linhuiba.com/project-custom/locationpc/recommend/icon_around_playground@2x.png',
    '教育机构': '//staticres.linhuiba.com/project-custom/locationpc/recommend/icon_around_education@2x.png',
  },
};

export interface DataType {
  categoryName: string;
  pointNum: number;
  pointList: any;
}
export interface itemDataType {
  address: string;
  name: string;
}

export const selectOptions = [
  {
    value: 1000,
    label: '1000m'
  },
  {
    value: 500,
    label: '500m'
  },
  {
    value: 250,
    label: '250m'
  }
];

export const reference = {
  around: '小区、写字楼、酒店、教育机构、学校、医院、公园等人流聚集场所的数量',
  business: '有利于消费的大型商场、购物中心、旅游景点、餐饮、零售、服装品类数量',
  competition: '同类型店铺的品类及数量',
  traffic: '交通相关点位中地铁、公交站、停车场、火车站、机场的数量',
};
