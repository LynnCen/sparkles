import { get, post } from '@/common/request/index';

// 主数据服务/品牌中心

/**
 * 行业列表
 * https://yapi.lanhanba.com/project/490/interface/api/49335
 */
export function industryList() {
  return get('/industry/list', {}, {
    isMock: false,
    proxyApi: '/mdata-api',
    needHint: true,
    needCancel: false,
  });
}

/**
 * 行业搜索
 * https://yapi.lanhanba.com/project/490/interface/api/49377
 */
export function industrySearch(params: any) {
  return post('/industry/search', { ...params }, {
    isMock: false,
    proxyApi: '/mdata-api',
    needHint: true,
    needCancel: false,
  });
}

/**
 * 品牌筛选项
 * https://yapi.lanhanba.com/project/490/interface/api/49321
 */
export function brandSelection() {
  return get('/brand/selection', {}, {
    isMock: false,
    proxyApi: '/mdata-api',
    needHint: true,
    needCancel: false,
  });
}

/**
 * 品牌相似度搜索列表
 * https://yapi.lanhanba.com/project/490/interface/api/49342
 */
export function brandSearch(params: any) {
  return post('/brand/search', { ...params }, {
    isMock: false,
    proxyApi: '/mdata-api',
    needHint: true,
  });
}

/**
 * 品牌新增
 * https://yapi.lanhanba.com/project/490/interface/api/49188
 */
export function brandCreate(params?: any) {
  return post('/brand/create', { ...params }, {
    isMock: false,
    proxyApi: '/mdata-api',
    needHint: true
  });
}

/**
 * 品牌编辑
 * https://yapi.lanhanba.com/project/490/interface/api/49370
 */
export function brandUpdate(params?: any) {
  return post('/brand/update', { ...params }, {
    isMock: false,
    proxyApi: '/mdata-api',
    needHint: true
  });
}

/**
 * 品牌列表
 * https://yapi.lanhanba.com/project/490/interface/api/49328
 */
export function brandList(params?: any) {
  return post('/brand/page', { ...params }, {
    isMock: false,
    proxyApi: '/mdata-api',
    needHint: true
  });
}

/**
 * 品牌详情
 * https://yapi.lanhanba.com/project/490/interface/api/49195
 */
export function brandDetail(params?: any) {
  return post('/brand/detail', { ...params }, {
    isMock: false,
    proxyApi: '/mdata-api',
    needHint: true
  });
}

/**
 * 品牌编辑详情
 * https://yapi.lanhanba.com/project/490/interface/api/63734
 */
export function brandApproveDetail(params?: any) {
  return post('/brand/edit/detail', { ...params }, {
    isMock: false,
    proxyApi: '/mdata-api',
    needHint: true
  });
}

/**
 * 品牌审核列表
 * https://yapi.lanhanba.com/project/490/interface/api/49384
 */
export function brandReviewList(params?: any) {
  return post('/review/page', { ...params }, {
    isMock: false,
    proxyApi: '/mdata-api',
    needHint: true
  });
}

/**
 * 品牌审核详情
 * https://yapi.lanhanba.com/project/490/interface/api/49391
 */
export function brandReviewDetail(params?: any) {
  return post('/review/detail', { ...params }, {
    isMock: false,
    proxyApi: '/mdata-api',
    needHint: true
  });
}

/**
 * 品牌审核通过
 * https://yapi.lanhanba.com/project/490/interface/api/49398
 */
export function brandReviewPass(params?: any) {
  return post('/review/pass', { ...params }, {
    isMock: false,
    proxyApi: '/mdata-api',
    needHint: true
  });
}

/**
 * 品牌审核拒绝
 * https://yapi.lanhanba.com/project/490/interface/api/49405
 */
export function brandReviewReject(params?: any) {
  return post('/review/reject', { ...params }, {
    isMock: false,
    proxyApi: '/mdata-api',
    needHint: true
  });
}
/**
 * 检查是否存在相同名称品牌
 * https://yapi.lanhanba.com/project/490/interface/api/65106
 * @param name 品牌名称
 */
export function brandCheck(params: {name:string}) {
  return post('/brand/check', { ...params }, {
    isMock: false,
    proxyApi: '/mdata-api',
    needHint: true
  });
}
