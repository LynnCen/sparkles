export interface MockDemo {
  a: Function;
}

// 设备状态
export enum DeviceStatus {
  NOTEXECUTE = 0, // 未实施
  ONLINE = 1, // 在线
  OFFLINE = 2, // 设备离线
  EXCEPTION = 3, // 数据异常
}

// 店铺运营状态
export enum StoreStatus {
  OPERATION = 1, // 运营中
  NOTSTART = 2, // 未开始
  CLOSE = 3, // 已关闭
}

export interface StoreDetailPermission {
  event: string;
  name: string;
}

export interface StoreDetail {
  id: number;
  name: string;
  deviceStatus: DeviceStatus; // 设备状态
  deviceStatusName: string;
  spotId: number;
  spotName: string;
  spotCategoryId: number;
  spotCategoryName: string;
  startDate: string;
  operatingTime: string; // 经营时间拼接
  endDate: string;
  isPerpetual: number; // 是否永久 0：否 1：永久
  status: StoreStatus; // 店铺运营状态
  statusName: string;
  brandId?: string;
  brandName?: string;
  typeName?: string;
  startAt?: string;
  endAt?: string;
  permissions: StoreDetailPermission[];
  source?: string; // 客流解决方案
  sourceName?: string; // 客流解决方案中文名
  lhMaintainers?: Array<any>; // 运维人员列表
  lhMaintainerNames?: string; // 运维人员
  flowStoreId?: string; // 三方门店id
  flowStoreName?: string; // 三方门店中文名
  nvr?: string; // 华为nvr号
  // 请求接口后保存
  permissionEvents: PermissionEvent[]; // ['createUpdateStore','attachTenants']
  duration?:number; // 人次分段统计值
}

export enum SourceValue {
  YD = 'YD', // 云盯
  HW = 'HW', // 华为
  HN = 'HN', // 汇纳
}

export enum PermissionEvent {
  STORE_UPDATE = 'createUpdateStore', // 新增/编辑门店
  STORE_DELETE = 'deleteStore', // 删除门店
  TENANTS_ATTACH = 'attachTenants', // 添加可见团队
  TENANTS_DELETE = 'deleteTenants', // 移除可见团队
  OEPN = 'open', // 开通客流
  CHANGE = 'change', // 切换客流方案
  CLOSE = 'close', // 关闭客流
  DEVICE_ATTACH = 'attachDevices', // 关联设备
  DEVICE_DELETE = 'deleteDevices', // 删除设备
  TAB_DEVICES = 'showStoreDevices', // 查看客流实施
  TAB_TENANTS = 'showStoreTenants', // 查看可见范围
  TAB_HISTORY = 'showStoreOperationHistory', // 查看操作记录
}
