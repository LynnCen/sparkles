import { get } from '@/common/request/index';

/**
 * 部门列表
 * http://yapi.lanhanba.com/project/289/interface/api/33063
 */

export function departmentList(params?: any) {
  return get('/department/list', { ...params }, {
    needHint: true,
    proxyApi: '/mirage'
  });
}

export function departmentTreeList(params?: any) {
  return get('/department/treeList', { ...params }, {
    needHint: true,
    proxyApi: '/mirage'
  });
}
