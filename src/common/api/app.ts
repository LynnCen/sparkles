import { get, post } from '@/common/request/index';
// import { QueryParams } from './ts-config';

/**
 * 应用列表
 * https://yapi.lanhanba.com/project/289/interface/api/33189
 */
export function getAppList({ tenantId }) {
  return get('/app/list', { tenantId }, {
    needHint: true,
    proxyApi: '/mirage'
  });
}

/**
 * 开启个性化菜单
 * https://yapi.lanhanba.com/project/378/interface/api/53332
 */
export function enableModule(params) {
  return post('/tenant/enableModule', { ...params }, {
    needHint: true,
    proxyApi: '/mirage'
  });
}

/**
 * 关闭个性化菜单
 * https://yapi.lanhanba.com/project/378/interface/api/53339
 */
export function disableModule(params) {
  return post('/tenant/disableModule', { ...params }, {
    needHint: true,
    proxyApi: '/mirage'
  });
}
