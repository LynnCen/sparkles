import { get, post } from '@/common/request/index';

/**
 * 用户列表
 * https://yapi.lanhanba.com/project/289/interface/api/33050
 */

export function userList(params?: any) {
  return post('/employee/list', { ...params }, {
    needHint: true,
    proxyApi: '/mirage'
  });
}

/**
 * 用户搜索
 * https://yapi.lanhanba.com/project/289/interface/api/33207
 */
export function userSearch(params?: any) {
  return post('/employee/search', { size: 300, ...params }, {
    proxyApi: '/mirage',
    needHint: true
  });
}

/**
 * 当前用户信息
 * https://yapi.lanhanba.com/project/289/interface/api/33049
 */

export function userCurrentUser(params?: any) {
  return get('/employee/currentUser', { ...params }, {
    proxyApi: '/mirage',
    needHint: true
  });
}

/**
 * LocxxOpManager角色员工列表
 * https://yapi.lanhanba.com/project/307/interface/api/66016
 */
export function postLocxxOpManager(params?: any) {
  return post('/h5/locxx/requirement/selection/locxxOperator', { ...params }, {
    proxyApi: '/lcn-api',
    needHint: true
  });
}
