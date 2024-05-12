/**
 * @Description 流程配置相关接口
 */

import { get, post } from '../request';


export function getTreeList(params = {}) {
  return get('/department/treeList', params, {
    needHint: true,
    proxyApi: '/mirage',
    needCancel: false
  });
};



/**
 * 模板选项
 * https://yapi.lanhanba.com/project/355/interface/api/44267
 */

export function getFlowSelection() {
  return get('/flowTemplate/selection', {}, {
    proxyApi: '/workflow-api',
    isMock: false,
    needHint: true
  });
}

/**
 * 审批列表
 * https://yapi.lanhanba.com/project/355/interface/api/44015
 */

export function getFlowTaskList(params?: any) {
  return get('/flowTask/pageList', { ...params }, {
    proxyApi: '/workflow-api',
    isMock: false,
    needHint: true
  });
}
/**
 * 审批详情
 * https://yapi.lanhanba.com/project/355/interface/api/44008
 */

export function getFlowTaskDetail(id: any) {
  return get('/flowTask/detail', { id }, {
    proxyApi: '/workflow-api',
    isMock: false,
    needHint: true
  });
}

/**
 * 编辑模板
 * https://yapi.lanhanba.com/project/355/interface/api/53479
 */

export function postFlowTemplateUpdate(params?: any) {
  return post('/tnt/template/update', { ...params }, {
    proxyApi: '/workflow-api',
    isMock: false,
    needHint: true
  });
}

/**
 * 创建模版
 * https://yapi.lanhanba.com/project/355/interface/api/53472
 */

export function postFlowTemplateCreate(params?: any) {
  return post('/tnt/template/create', { ...params }, {
    proxyApi: '/workflow-api',
    isMock: false,
    needHint: true
  });
}

/**
 * location 管理的创建模，带有绑定关系
 * https://yapi.lanhanba.com/project/289/interface/api/62516
 */

export function postLocationFlowTemplateCreate(params?: any) {
  return post('/flow/template/create', { ...params }, {
    proxyApi: '/blaster',
    isMock: false,
    needHint: true
  });
}

/**
 * 模版详情
 * https://yapi.lanhanba.com/project/355/interface/api/53465
 */

export function getFlowTemplateDetail(params: any) {
  return get('/tnt/template/detail', { ...params }, {
    proxyApi: '/workflow-api',
    isMock: false,
    needHint: true });
}

/**
 * 删除模板
 * https://yapi.lanhanba.com/project/355/interface/api/53486
 */

export function deleteTemplate(params?: any) {
  return get('/tnt/template/delete', { ...params }, {
    proxyApi: '/workflow-api',
    isMock: false,
    needHint: true
  });
}


/**
 * 模板列表
 * https://yapi.lanhanba.com/project/355/interface/api/53451
 */
export function getTemplate(params?: any) {
  return get('/tnt/template/page', { ...params }, {
    proxyApi: '/workflow-api',
    isMock: false,
    needHint: true
  });
}

export function userSearch(params?: any) {
  return post('/employee/search', { ...params }, {
    needHint: true,
    proxyApi: '/mirage',
    needCancel: false
  });
};

export function positionSearch(params?: any) {
  return get('/position/search', { ...params }, {
    needHint: true,
    proxyApi: '/mirage',
    needCancel: false
  });
};

export function getRoleSearch(params?: any) {
  return get('/role/search', { ...params }, {
    needHint: true,
    proxyApi: '/mirage',
    needCancel: false
  });
};


/**
 * 部门树
 * https://yapi.lanhanba.com/project/378/interface/api/35930
 */

export function getDepartmentTreeList(params?: {tenantId:number|string}) {
  return get(
    '/department/treeList',
    { ...params },
    { proxyApi: '/mirage', isMock: false, needHint: true },
  );
}
