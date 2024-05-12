// 客流服务相关接口
import { get, post } from '@/common/request/index';

/*
 * https://yapi.lanhanba.com/project/434/interface/api/41327
 * 点位列表
*/
export function postSpotQuery(params?: any) {
  return post('/admin/spot/query', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 434,
    proxyApi: '/passenger-flow'
  });
};

/*
 * https://yapi.lanhanba.com/project/434/interface/api/41369
 * 门店筛选项
*/
export function getStoreSelection() {
  return get('/admin/store/selection', {}, {
    isMock: false,
    needHint: true,
    mockId: 434,
    proxyApi: '/passenger-flow'
  });
};

/*
 * https://yapi.lanhanba.com/project/434/interface/api/41222
 * 门店列表
*/
export function postStoreQuery(params = {}) {
  return post('/admin/store/query', params, {
    isMock: false,
    needHint: true,
    mockId: 434,
    proxyApi: '/passenger-flow'
  });
};

/*
 * https://yapi.lanhanba.com/project/434/interface/api/41537
 * 点位关键信息 -跳转详情用
*/
export function postSpotBrief(params = {}) {
  return post('/admin/spot/brief', params, {
    isMock: false,
    needHint: true,
    mockId: 434,
    proxyApi: '/passenger-flow'
  });
};

/*
 * https://yapi.lanhanba.com/project/434/interface/api/41257
 * 门店新增
*/
export function postStoreCreate(params = {}) {
  return post('/admin/store/create', params, {
    isMock: false,
    needHint: true,
    mockId: 434,
    proxyApi: '/passenger-flow'
  });
};


/*
 * https://yapi.lanhanba.com/project/434/interface/api/41257
 * 门店编辑
*/
export function postStoreUpdate(params = {}) {
  return post('/admin/store/update', params, {
    isMock: false,
    needHint: true,
    mockId: 434,
    proxyApi: '/passenger-flow'
  });
};

/*
 * https://yapi.lanhanba.com/project/434/interface/api/41271
 * 门店批量删除
*/
export function postBatchDelete(params = {}) {
  return post('/admin/store/batchDelete', params, {
    isMock: false,
    needHint: true,
    mockId: 434,
    proxyApi: '/passenger-flow'
  });
};

/*
 * https://yapi.lanhanba.com/project/434/interface/api/41460
 * 团队/租户列表
*/
export function postTenantQuery(params = {}) {
  return post('/admin/tenant/query', params, {
    isMock: false,
    needHint: true,
    mockId: 434,
    proxyApi: '/passenger-flow'
  });
}

/*
 * https://yapi.lanhanba.com/project/434/interface/api/41453
 * 可见范围列表
*/
export function postStoreTenants(params = {}) {
  return post('/admin/store/tenants', params, {
    isMock: false,
    needHint: true,
    mockId: 434,
    proxyApi: '/passenger-flow'
  });
}

/*
  门店详情
  https://yapi.lanhanba.com/project/434/interface/api/41334
*/
export function storeDetail(params?: any) {
  return post('/admin/store/show', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 434,
    proxyApi: '/passenger-flow'
  });
};

/*
  门店客流方案开通
  https://yapi.lanhanba.com/project/434/interface/api/41593
*/
export function postStoreFlowOpen(params?: any) {
  return post('/admin/store/flow/project/open', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 434,
    proxyApi: '/passenger-flow'
  });
};

/*
  云盯汇纳三方门店搜索
  https://yapi.lanhanba.com/project/434/interface/api/41579
*/
export function postFlowYD(params?: any) {
  return post('/admin/store/query/flow/source', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 434,
    proxyApi: '/passenger-flow'
  });
};

/*
  门店设备状态刷新
  https://yapi.lanhanba.com/project/434/interface/api/41649
*/
export function storeRefresh(params?: any) {
  return post('/admin/store/refresh', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 434,
    proxyApi: '/passenger-flow'
  });
};

/*
  门店客流方案切换
  https://yapi.lanhanba.com/project/434/interface/api/41635
*/
export function postStoreFlowChange(params?: any) {
  return post('/admin/store/flow/project/change', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 434,
    proxyApi: '/passenger-flow'
  });
};

/*
  门店客流方案关闭
  https://yapi.lanhanba.com/project/434/interface/api/41600
*/
export function postStoreFlowClose(params?: any) {
  return post('/admin/store/flow/project/close', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 434,
    proxyApi: '/passenger-flow'
  });
};

/*
  门店客流设备列表
  https://yapi.lanhanba.com/project/434/interface/api/41628
*/
export function flowDeviceList(params?: any) {
  return post('/admin/store/flow/device/list', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 434,
    proxyApi: '/passenger-flow'
  });
};

/*
  门店客流设备详情
  https://yapi.lanhanba.com/project/434/interface/api/41621
*/
export function flowDeviceDetail(params?: any) {
  return post('/admin/store/flow/device/show', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 434,
    proxyApi: '/passenger-flow'
  });
};

/*
  门店客流设备新增
  https://yapi.lanhanba.com/project/434/interface/api/41607
*/
export function postFlowDeviceAdd(params?: any) {
  return post('/admin/store/flow/device/create', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 434,
    proxyApi: '/passenger-flow'
  });
};

/*
  门店客流设备编辑
  https://yapi.lanhanba.com/project/434/interface/api/41614
*/
export function postFlowDeviceUpdate(params?: any) {
  return post('/admin/store/flow/device/update', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 434,
    proxyApi: '/passenger-flow'
  });
};

/*
  门店客流设备删除
  https://yapi.lanhanba.com/project/434/interface/api/41642
*/
export function postFlowDeviceDelete(params?: any) {
  return post('/admin/store/flow/device/delete', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 434,
    proxyApi: '/passenger-flow'
  });
};

/*
  门店客流设备打开热力图功能
  https://yapi.lanhanba.com/project/434/interface/api/41663
*/
export function postDeviceUpdateHot(params?: any) {
  return post('/admin/store/flow/device/update/hot', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 434,
    proxyApi: '/passenger-flow'
  });
};

/*
  门店客流设备打开直播功能
  https://yapi.lanhanba.com/project/434/interface/api/41670
*/
export function postDeviceUpdateLive(params?: any) {
  return post('/admin/store/flow/device/update/live', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 434,
    proxyApi: '/passenger-flow'
  });
};

/*
  门店客流设备打开回放功能
  https://yapi.lanhanba.com/project/434/interface/api/41677
*/
export function postFlowDeviceUpdatePlayback(params?: any) {
  return post('/admin/store/flow/device/update/playback', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 434,
    proxyApi: '/passenger-flow'
  });
};

/*
  门店详情-操作记录列表
  https://yapi.lanhanba.com/project/434/interface/api/41565
*/
export function storeRecords(params?: any) {
  return post('/admin/store/records', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 434,
    proxyApi: '/passenger-flow'
  });
};

/*
 * https://yapi.lanhanba.com/project/434/interface/api/41418
 * 添加可见团队/租户
*/
export function postAttachTenants(params = {}) {
  return post('/admin/store/attachTenants', params, {
    isMock: false,
    needHint: true,
    mockId: 434,
    proxyApi: '/passenger-flow'
  });
};

/*
 * https://yapi.lanhanba.com/project/434/interface/api/41425
 * 删除可见团队/租户
*/
export function postDetachTenants(params = {}) {
  return post('/admin/store/detachTenants', params, {
    isMock: false,
    needHint: true,
    mockId: 434,
    proxyApi: '/passenger-flow'
  });
};
