// 客流宝相关接口
import { get, post } from '@/common/request/index';
import { CrowdStorehouseSearchParams, StoreCreateForm } from '@/views/tenant/pages/detail/ts-config';
/**
 * 门店列表 https://yapi.lanhanba.com/project/289/interface/api/33283
 */
export function storeList(params: CrowdStorehouseSearchParams) {
  return get('/store/list', { ...params }, {
    needHint: true,
    proxyApi: '/blaster'
  });
}

/**
 * 云盯列表 https://yapi.lanhanba.com/project/289/interface/api/33286
 */
export function thirdpartyList(params: Record<string, any>) {
  return get('/store/search', { ...params }, {
    needHint: true,
    proxyApi: '/blaster'
  });
}

/**
 * 云盯列表 https://yapi.lanhanba.com/project/289/interface/api/33286
 */
export function relevancyThirdparty(params: Record<string, any>) {
  return post('/store/relate', { ...params }, {
    needHint: true,
    proxyApi: '/blaster'
  });
}

/**
 * 开启回放 https://yapi.lanhanba.com/project/289/interface/api/33294
 */
export function playbackEnable(params: Record<string, any>) {
  return post('/store/playbackEnable', { ...params }, {
    needHint: true,
    proxyApi: '/blaster'
  });
}

/**
 * 关闭回放 https://yapi.lanhanba.com/project/289/interface/api/33295
 */
export function playbackDisable(params: Record<string, any>) {
  return post('/store/playbackDisable', { ...params }, {
    needHint: true,
    proxyApi: '/blaster'
  });
}

/**
 * 删除门店 https://yapi.lanhanba.com/project/289/interface/api/33291
 */
export function deleteStore(params: Record<string, any>) {
  return post('/store/delete', { ...params }, {
    needHint: true,
    proxyApi: '/blaster'
  });
}

/**
 * 批量删除门店 https://yapi.lanhanba.com/project/289/interface/api/33296
 */
export function batchDeleteStore(params: { ids: number[] }) {
  return post('/store/batchDelete', { ...params }, {
    needHint: true,
    proxyApi: '/blaster'
  });
}

/**
 * 批量删除管理员 https://yapi.lanhanba.com/project/289/interface/api/33298
 */
export function batchDeleteManager(params: { ids: number[]; managerIds: number[] }) {
  return post('/store/batchDeleteManager', { ...params }, {
    needHint: true,
    proxyApi: '/blaster'
  });
}

/**
 * 批量设置管理员 https://yapi.lanhanba.com/project/289/interface/api/33297
 */
export function batchSetManager(params: { ids: number[]; managerIds: number[] }) {
  return post('/store/batchSetManager', { ...params }, {
    needHint: true,
    proxyApi: '/blaster'
  });
}

/**
 * 批量添加管理员 https://yapi.lanhanba.com/project/289/interface/api/33491
 */
export function batchAddManager(params: { ids: number[]; managerIds: number[] }) {
  return post('/store/batchAddManager', { ...params }, {
    needHint: true,
    proxyApi: '/blaster'
  });
}

/**
 * 设置管理员 https://yapi.lanhanba.com/project/289/interface/api/33293
 */
export function setManager(params: { id: number; managerIds: number[] }) {
  return post('/store/setManager', { ...params }, {
    needHint: true,
    proxyApi: '/blaster'
  });
}

/**
 * 设置摄像头 https://yapi.lanhanba.com/project/289/interface/api/33307
 */
export function setDevice(params: { id: number; deviceIds: number[] }) {
  return post('/store/enableDevice', { ...params }, {
    needHint: true,
    proxyApi: '/blaster'
  });
}

/**
 * 新增门店 https://yapi.lanhanba.com/project/289/interface/api/33289
 */
export function storeCreate(params: StoreCreateForm) {
  return post('/store/create', { ...params }, {
    needHint: true,
    proxyApi: '/blaster'
  });
}

/**
 * 编辑门店 https://yapi.lanhanba.com/project/289/interface/api/33290
 */
export function storeUpdate(params: StoreCreateForm) {
  return post('/store/update', { ...params }, {
    needHint: true,
    proxyApi: '/blaster'
  });
}

/**
 * 门店详情 https://yapi.lanhanba.com/project/289/interface/api/33284
 */
export function storeDetail(params: { id: number }) {
  return get('/store/show', { ...params }, {
    needHint: true,
    proxyApi: '/blaster'
  });
}

/**
 * 暂时弃用
 * 品牌搜索 https://yapi.lanhanba.com/project/289/interface/api/33308
 */
// export function brandSearch(params: { keyword?: string }) {
//   return get('/brand/search', { ...params }, {
//     needHint: true,
//     proxyApi: '/blaster'
//   });
// }

/**
 * 新增品牌 https://yapi.lanhanba.com/project/289/interface/api/33313
 */
export function brandAdd(params: { name: string; status: number }) {
  return post('/brand/add', { ...params }, {
    needHint: true,
    proxyApi: '/blaster'
  });
}

/**
 * 场地搜索 https://yapi.lanhanba.com/project/289/interface/api/40284
 */
export function placeSearch(params) {
  return post('/location/place/pages', { ...params }, {
    isMock: false,
    mockId: 289,
    needHint: true,
    needCancel: false,
    proxyApi: '/blaster'
  });
}

/**
 * 点位搜索 https://yapi.lanhanba.com/project/289/interface/api/40291
 */
export function spotSearch(params) {
  return post('/location/spot/pages', { ...params }, {
    isMock: false,
    mockId: 289,
    needHint: true,
    needCancel: false,
    proxyApi: '/blaster'
  });
}

/**
 * 展位搜索 https://yapi.lanhanba.com/project/289/interface/api/33312
 */
export function boothSearch(params: { keyword?: string }) {
  return get('/booth/search', { ...params }, {
    needHint: true,
    proxyApi: '/blaster'
  });
}

/**
 * 行业列表 https://yapi.lanhanba.com/project/289/interface/api/33311
 */
export function industryTree() {
  return get('/industry/tree', {}, {
    needHint: true,
    proxyApi: '/blaster'
  });
}

/**
 * 导入门店 https://yapi.lanhanba.com/project/289/interface/api/33488
 */
export function storeImport(params: Record<string, any>) {
  return post('/store/import', params, {
    needHint: true,
    proxyApi: '/blaster'
  });
}

/**
 * 下拉选项 https://yapi.lanhanba.com/project/289/interface/api/33567
 */
export function storeSelection() {
  return get('/store/selection', {}, {
    needHint: true,
    proxyApi: '/blaster'
  });
}

/**
 * 设备列表 https://yapi.lanhanba.com/project/289/interface/api/34173
 */
export function deviceList(params: { storeId: number }) {
  return get('/device/list', params, {
    needHint: true,
    proxyApi: '/blaster'
  });
}

/**
 * 检测设备状态 https://yapi.lanhanba.com/project/289/interface/api/34174
 */
export function deviceStatusCheck(params: { id: number }) {
  return post('/device/status/check', params, {
    needHint: true,
    proxyApi: '/blaster'
  });
}

/**
 * 客流宝应用列表 https://yapi.lanhanba.com/project/289/interface/api/34215
 */
export function flowAppList() {
  return get('/location/app/list', {}, {
    needHint: true,
    proxyApi: '/blaster'
  });
}

/**
 * 客流宝设置运维人员 https://yapi.lanhanba.com/project/289/interface/api/34216
 */
export function flowOperations(params) {
  return post('/location/app/maintainer/set', params, {
    needHint: true,
    proxyApi: '/blaster'
  });
}

/*
 * 设备列表
 * https://yapi.lanhanba.com/project/462/interface/api/69796
*/
export function postCheckSpotDevicePage(params = {}) {
  return post('/checkSpotDevice/page', params, {
    isMock: false,
    needHint: true,
    mockId: 462,
    proxyApi: '/blaster'
  });
};

/*
 * 保存设备
 * https://yapi.lanhanba.com/project/462/interface/api/69803
*/
export function postCheckSpotDeviceSave(params = {}) {
  return post('/checkSpotDevice/save', params, {
    isMock: false,
    needHint: true,
    mockId: 462,
    proxyApi: '/blaster'
  });
};

/*
 * 导入设备
 * https://yapi.lanhanba.com/project/462/interface/api/69810
*/
export function postCheckSpotDeviceImport(params = {}) {
  return post('/checkSpotDevice/import', params, {
    isMock: false,
    needHint: true,
    mockId: 462,
    proxyApi: '/blaster'
  });
};

/*
 * 导出设备
 * https://yapi.lanhanba.com/project/462/interface/api/69817
*/
export function postCheckSpotDeviceExport(params = {}) {
  return post('/checkSpotDevice/export', params, {
    isMock: false,
    needHint: true,
    mockId: 462,
    proxyApi: '/blaster'
  });
};
