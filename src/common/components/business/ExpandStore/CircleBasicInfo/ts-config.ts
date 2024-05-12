export const TaskMap = {
  modelClusterName: '所属商圈',
  manager: '开发经理',
  emergencyDegreeName: '紧急度',
  targetAdress: '目标城市',
  signShopCount: '周边500m门店', // 圈内已签约门店
  expectDropInDate: '期望落位时间'

};

export interface LatLongItem{
  lng:number;
  lat:number
}

export interface CityIds{
  provinceId:number;
  cityId:number;
  districtId:number;
}

export interface ShopBasic {
  id:number;
  type:number;
  name:string;
  icon:string;
  color:string;
  address:string;
  status:number;
  statusName:string;
  openDate:string;
  closeDate:string;
  closeReason:string;
  chancePointId:number;
}

export type ShopItem = ShopBasic&CityIds&LatLongItem

export interface ModelClusterInfo {
  modelClusterId:number;
  modelClusterName:string;
  centerLng:number;
  centerLat:number;
  radius:number;
  polygon:Array<LatLongItem>;
  shopList:Array<ShopItem>
}

