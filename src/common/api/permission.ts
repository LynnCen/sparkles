import { get, post } from '@/common/request/index';

/**
 * 根据appId获取应用菜单
 * https://yapi.lanhanba.com/project/297/interface/api/33468
 */

export function moduleFindByAppId(params?: any) {
  return get('/module/findByAppId', { ...params }, true);
}

/**
 *
 * 根据moduleIds获取应用菜单树
 * https://yapi.lanhanba.com/project/297/interface/api/33469
 */

export function moduleFindByModuleIds(params?: any) {
  return post('/module/findByModuleIds', { ...params }, true);
}

/**
 *
 * 获取权限按钮列表
 * https://yapi.lanhanba.com/project/297/interface/api/33940
 */

export function userPermissionList(params?: any) {
  return get('/user/permissionList', { ...params }, true);
}
