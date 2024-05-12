import { get, post } from '@/common/request';

/**
 * 角色列表
 * http://yapi.lanhanba.com/project/289/interface/api/33075
 */
export function roleList(params?: any) {
  return get('/role/list', { ...params }, {
    needHint: true,
    proxyApi: '/mirage'
  });
}

/**
 * 修改权限
 * https://yapi.lanhanba.com/project/317/interface/api/33596
 */
export async function modifyPermission(params?: any) {
  return post('/role/grantAuthorize', { ...params }, {
    needHint: true,
    proxyApi: '/mirage'
  });
}
