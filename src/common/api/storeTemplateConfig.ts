import { get, post } from '@/common/request/index';

/*
 * 拓店模版详情页已配置的模块列表
 * https://yapi.lanhanba.com/project/289/interface/api/55376
*/
export function expandConfiguredModules(params?: any) {
  return get('/dynamic/expand/detail/group/list', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 289,
    proxyApi: '/blaster'
  });
};

/**
 * 模版详情配置
 * https://yapi.lanhanba.com/project/289/interface/api/47333
 */

export function templateDetail(params: any) {
  return post('/dynamic/template/detail', { ...params }, {
    proxyApi: '/blaster',
    needHint: true
  });
}

/**
 * 拓店模版详情页删除模块
 * https://yapi.lanhanba.com/project/289/interface/api/55418
 */

export function expandModuleDelete(params: any) {
  return post('/dynamic/expand/detail/group/delete', { ...params }, {
    proxyApi: '/blaster',
    needHint: true
  });
}

/**
 * 拓店模版详情页新增配置模块
 * https://yapi.lanhanba.com/project/289/interface/api/55383
 */

export function expandModuleAdd(params: any) {
  return post('/dynamic/expand/detail/group/add', { ...params }, {
    proxyApi: '/blaster',
    needHint: true
  });
}

/**
 * 拓店模版详情页模块排序
 * https://yapi.lanhanba.com/project/289/interface/api/55460
 */

export function expandModuleReorder(params: any) {
  return post('/dynamic/expand/detail/group/reorder', { ...params }, {
    proxyApi: '/blaster',
    needHint: true
  });
}

/*
 * 拓店模块列表
 * https://yapi.lanhanba.com/project/289/interface/api/55278
*/
export function expandModules(params?: any) {
  return get('/dynamic/expand/modules', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 289,
    proxyApi: '/blaster'
  });
};

/**
 * 拓店模版详情页编辑模块属性
 * https://yapi.lanhanba.com/project/289/interface/api/55411
 */

export function expandModuleUpdate(params: any) {
  return post('/dynamic/expand/detail/group/update', { ...params }, {
    proxyApi: '/blaster',
    needHint: true
  });
}
