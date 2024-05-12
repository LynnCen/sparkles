import { get, post } from '@/common/request/index';

/**
 * 行政区域
 * http://yapi.lanhanba.com/project/289/interface/api/33054
 */

export function areaList(params?: any) {
  return get('/area/list', { ...params }, {
    proxyApi: '/mirage',
    needHint: true,
  });
}

/**
 * 下拉框选项
 * https://yapi.lanhanba.com/project/289/interface/api/33205
 */

export function dictionaryTypeItems(params?: any) {
  return get('/dictionary/items', { ...params }, {
    proxyApi: '/mirage',
    needHint: true
  });
}


/**
 * 租户列表：https://yapi.lanhanba.com/project/307/interface/api/33539
 */
export function tntList(token) {
  return get('/tntList', {}, {
    headers: {
      token,
    },
    needHint: true,
    proxyApi: '/mirage'
  });
}

/**
 * 更新跟进人
 * 修改跟进人http://yapi.lanhanba.com/project/289/interface/api/33188
 */
export function updateFollowerRequest(params: any) {
  return post('/tenant/updateFollower', { ...params }, {
    proxyApi: '/mirage',
    needHint: true
  });
};

/*
 * 资源-品牌
 * https://yapi.lanhanba.com/project/321/interface/api/41684
 * src/common/hook/useBrand.tsx
*/
export function postResourceBrandListQuery(params?: any) {
  return post('/resource/brand/list', { ...params }, {
    isMock: false,
    needHint: true,
    // mockId: 321,
    // proxyApi: '/passenger-flow'
  });
};

/*
 * 供应商列表
 * https://yapi.lanhanba.com/project/399/interface/api/38947
*/
export function postTenantSupplierListQuery(params?: any) {
  return post('/tenant/supplier/list', { ...params }, {
    isMock: false,
    needHint: true,
    needCancel: false,
    mockId: 399,
    // proxyApi: '/passenger-flow'
  });
};

/*
 * 【供应商联系人信息】列表-不分页
 * https://yapi.lanhanba.com/project/399/interface/api/41656
*/
export function postTenantSupplierContactPageQuery(params?: any) {
  return post('/tenant/supplierContact/list', { ...params }, {
    isMock: false,
    needHint: true,
    needCancel: false,
    mockId: 399,
    // proxyApi: '/passenger-flow'
  });
};

/**
 * 存储列表自定义列表字段
 * https://yapi.lanhanba.com/project/378/interface/api/45079
 */
export function postConfigCustomField(params = {}) {
  return post('/account/config/customField', params, {
    needHint: true,
    proxyApi: '/mirage'
  });
};

/**
 * 获取列表自定义列表字段
 * https://yapi.lanhanba.com/project/378/interface/api/46017
 */
export function getConfigCustomField(params = {}) {
  return get('/account/config/findCustomField', params, {
    needHint: true,
    proxyApi: '/mirage',
  });
};

/**
 * 模版详情
 * https://yapi.lanhanba.com/project/289/interface/api/47130
 */
export function getTemplateDetail(params:any) {
  return post('/tenant/template/detail', params, {
    proxyApi: '/blaster',
    needCancel: false,
    isMock: false,
    needHint: true,
    mockId: 289
  });
}

/**
 * 模版下拉框
 * https://yapi.lanhanba.com/project/289/interface/api/47144
 */
export function getTemplateSelection(params:any) {
  return post('/tenant/template/selection', params, {
    proxyApi: '/blaster',
    needCancel: false,
    isMock: false,
    needHint: true,
    mockId: 289
  });
}

/**
 * 保存/更新模版
 * https://yapi.lanhanba.com/project/289/interface/api/47137
 */
export function saveTemplate(params:any) {
  return post('/tenant/template/save', params, {
    proxyApi: '/blaster',
    needCancel: false,
    isMock: false,
    needHint: true,
    mockId: 289
  });
}

/**
 * 行业列表
 * https://yapi.lanhanba.com/project/297/interface/api/34312
 */
export function industryList(params: any) {
  return get(
    '/industry/list',
    { ...params },
    {
      proxyApi: '/terra-api',
      needHint: true
    }
  );
}

/**
 * 场地类目列表
 * https://yapi.lanhanba.com/project/329/interface/api/35160
 */
export function placeCategoryList(params: any) {
  return post(
    '/category/list',
    { ...params },
    {
      proxyApi: '/terra-api',
      needHint: true
    }
  );
}

/** 从location 踩点任务管理页面拷贝的 Restful API 定义 begin */
/**
 * 租户搜索
 * https://yapi.lanhanba.com/project/378/interface/api/46766
 */
export function tenantList(params: any) {
  return get(
    '/tenant/search',
    { ...params },
    {
      proxyApi: '/mirage',
      needHint: true,
      // isMock: true,
      // needCancel: false,
      // mockId: 378,
    }
  );
}

/** 从location 踩点任务管理页面拷贝的 Restful API 定义 begin */
/**
 * 品牌列表
 * https://yapi.lanhanba.com/project/329/interface/api/35153
 */
export function brandList(params: any) {
  return post(
    '/brand/list',
    { ...params },
    {
      proxyApi: '/terra-api',
      needHint: true
    }
  );
}

/**
 * 新增品牌
 * https://yapi.lanhanba.com/project/329/interface/api/35146
 */
export function createBrand(params: any) {
  return post(
    '/brand/create',
    { ...params },
    {
      proxyApi: '/terra-api',
      needHint: true
    }
  );
}

/**
 * 七牛token
 * https://yapi.lanhanba.com/project/297/interface/api/34045
 */
export function getQiNiuToken(params: any) {
  return get('/qiniu/getToken', { ...params }, {
    proxyApi: '/terra-api',
    needHint: true
  });
}

/** 从location 踩点任务管理页面拷贝的 Restful API 定义 end */

/**
 * 联系人列表
 * https://yapi.lanhanba.com/project/307/interface/api/58659
 */
export function postContactsList(params: any) {
  return post('/locxx/requirement/contacts', { ...params }, { proxyApi: '/lcn-api' });
}

/**
 * 员工搜索（无租户限制）
 * https://yapi.lanhanba.com/project/560/interface/api/69565
 */
export function postEmployeeSearch(params: any) {
  return post('/admin/employee/search', { ...params }, {
    needHint: true,
    proxyApi: '/zhizu-api'
  });
}

/**
 * 判断租户是否授权了商业直租
 * https://yapi.lanhanba.com/project/560/interface/api/69572
 */
export function tenantHasAuthToLocation(params: any) {
  return post('/admin/employee/isGrantSpace', { ...params }, {
    needHint: true,
    proxyApi: '/zhizu-api'
  });
}

/**
 * 代客户认证品牌
 * https://yapi.lanhanba.com/project/560/interface/api/69558
 */
export function replaceCertified(params: any) {
  return post('/admin/brand/agentSubmit', { ...params }, {
    needHint: true,
    proxyApi: '/zhizu-api'
  });
}

/**
 * 报价字段下拉项
 * https://yapi.lanhanba.com/project/560/interface/api/69670
 */
export function getPriceField(params?: any) {
  return get('/property/quote/selection/priceField', { ...params }, {
    needHint: true,
    proxyApi: '/zhizu-api'
  });
}

/**
 * 报价字段下拉项默认值
 * https://yapi.lanhanba.com/project/560/interface/api/69677
 */
export function getPriceDefaultValue(params?: any) {
  return get('/property/quote/selection/priceField/default', { ...params }, {
    needHint: true,
    proxyApi: '/zhizu-api',
    needCancel: false
  });
}

