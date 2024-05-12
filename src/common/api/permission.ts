import { get, post } from '@/common/request/index';

/**
 * 获取应用菜单
 * https://yapi.lanhanba.com/project/317/interface/api/33598
 */

export async function moduleFindByAppId(params?: any) {
  return get('/module/menus', { ...params }, {
    needHint: true,
    proxyApi: '/mirage'
  });
}

/**
 *
 * 根据moduleIds获取应用菜单树
 * https://yapi.lanhanba.com/project/317/interface/api/33599
 */

export async function moduleFindByModuleIds(params?: any) {
  return post('/module/permissions', { ...params }, {
    needHint: true,
    proxyApi: '/mirage'
  });
}


export async function listByModuleIds(params?: any) {
  return get('/permission/listByModuleIds', { ...params }, {
    needHint: true,
    proxyApi: '/mirage'
  });
}

/**
 *
 * 数据权限列表
 * https://yapi.lanhanba.com/project/317/interface/api/33599
 */

export async function dataPermission(params?: any) {
  return get('/module/scopes', { ...params }, {
    needHint: true,
    proxyApi: '/mirage'
  });
}

/**
 * 角色授权信息回显
 */

export async function getAuthorizedInfoByRoleInfo(params?: any) {
  return get('/module/authorized', { ...params }, {
    needHint: true,
    proxyApi: '/mirage'
  });
}


/**
 * 角色授权信息（saas后台专用）
 */

export async function getAuthorizedInfoByTenatInfo(params?: any) {
  return get('/module/app/authorized', { ...params }, {
    needHint: true,
    proxyApi: '/mirage'
  });
}
