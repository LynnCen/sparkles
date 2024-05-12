// 需求管理相关接口
import { get, post } from '@/common/request/index';

/*
 * https://yapi.lanhanba.com/project/307/interface/api/55390
 * locxx需求分页列表
*/
export function postRequirementList(params?: any) {
  return post('/locxx/requirement/pageList', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 307,
    proxyApi: '/lcn-api'
  });
};

/*
 * https://yapi.lanhanba.com/project/307/interface/api/55397
 * 门店批量删除
*/
export function postRequirementDeleteBatch(params = {}) {
  return post('/locxx/requirement/deleteBatch', params, {
    isMock: false,
    needHint: true,
    mockId: 307,
    proxyApi: '/lcn-api'
  });
};

/*
 * https://yapi.lanhanba.com/project/307/interface/api/55404
 * locxx需求导入
*/
export function postRequirementImportExcel(params = {}) {
  return post('/locxx/requirement/importExcel', params, {
    isMock: false,
    needHint: true,
    mockId: 307,
    proxyApi: '/lcn-api'
  });
};

/*
 * https://yapi.lanhanba.com/project/307/interface/api/50735
 * 下拉选项
*/
export function getRequirementSelection(params = {}) {
  return get('/h5/locxx/requirement/selection', params, {
    isMock: false,
    needHint: true,
    mockId: 307,
    proxyApi: '/lcn-api'
  });
};

/*
 * https://yapi.lanhanba.com/project/307/interface/api/55719
 * locxx需求修改状态
*/
export function postRequirementUpdateStatus(params = {}) {
  return post('/locxx/requirement/updateStatus', params, {
    isMock: false,
    needHint: true,
    mockId: 307,
    proxyApi: '/lcn-api'
  });
};

/*
 * https://yapi.lanhanba.com/project/307/interface/api/55726
 * locxx需求调权
*/
export function postRequirementUpdateWeight(params = {}) {
  return post('/locxx/requirement/updateWeight', params, {
    isMock: false,
    needHint: true,
    mockId: 307,
    proxyApi: '/lcn-api'
  });
};

/*
 * https://yapi.lanhanba.com/project/307/interface/api/57847
 * locxx需求批量指派
*/
export function postRequirementAssignFollowers(params = {}) {
  return post('/locxx/requirement/assignFollowers', params, {
    isMock: false,
    needHint: true,
    mockId: 307,
    proxyApi: '/lcn-api'
  });
};

/*
 * https://yapi.lanhanba.com/project/307/interface/api/64133
 * locxx需求指派跟进人【批量】
*/
export function postRequirementAssignFollowersBatch(params = {}) {
  return post('/locxx/requirement/assignFollowerBatch', params, {
    isMock: false,
    needHint: true,
    mockId: 307,
    proxyApi: '/lcn-api'
  });
};

/*
 * https://yapi.lanhanba.com/project/307/interface/api/64140
 * locxx需求指派跟进人【完全】
*/
export function postRequirementAssignFollowerAll(params = {}) {
  return post('/locxx/requirement/assignFollowerAll', params, {
    isMock: false,
    needHint: true,
    mockId: 307,
    proxyApi: '/lcn-api'
  });
};

/*
 * https://yapi.lanhanba.com/project/307/interface/api/57854
 * locxx需求增加跟进记录
*/
export function postRequirementSaveFollowRecord(params = {}) {
  return post('/locxx/requirement/saveFollowRecord', params, {
    isMock: false,
    needHint: true,
    mockId: 307,
    proxyApi: '/lcn-api'
  });
};

/*
 * https://yapi.lanhanba.com/project/307/interface/api/57861
 * locxx需求跟进记录
*/
export function getRequirementFollowRecords(params = {}) {
  return get('/locxx/requirement/followRecords', params, {
    isMock: false,
    needHint: true,
    mockId: 307,
    proxyApi: '/lcn-api'
  });
};

/*
 * https://yapi.lanhanba.com/project/307/interface/api/58897
 * locxx需求修改需求标签
*/
export function postRequirementUpdateLabel(params = {}) {
  return post('/locxx/requirement/updateLabel', params, {
    isMock: false,
    needHint: true,
    mockId: 307,
    proxyApi: '/lcn-api'
  });
};

/*
 * https://yapi.lanhanba.com/project/307/interface/api/57994
 * locxx需求修改内部标签
*/
export function postRequirementUpdateInternalLabel(params = {}) {
  return post('/locxx/requirement/updateInternalLabel', params, {
    isMock: false,
    needHint: true,
    mockId: 307,
    proxyApi: '/lcn-api'
  });
};

/*
 * https://yapi.lanhanba.com/project/307/interface/api/62831
 * 导出locxx需求
*/
export function postRequirementExport(params = {}) {
  return post('/locxx/requirement/export', params, {
    isMock: false,
    needHint: true,
    mockId: 307,
    proxyApi: '/lcn-api',
    responseType: 'blob',
    timeout: 180000
  });
};

/*
* https://yapi.lanhanba.com/project/319/interface/api/63202
* locxx-会话记录增加跟进记录
*/
export function postSessionRecordSaveFollowRecord(params = {}) {
  return post('/im/followRecord/store', params, {
    isMock: false,
    needHint: true,
    mockId: 319,
    proxyApi: '/pms-api'
  });
};

/*
 * https://yapi.lanhanba.com/project/319/interface/api/63223
 * locxx-会话记录获取跟进记录
*/
export function getSessionRecordFollowRecords(params = {}) {
  return get('/im/followRecord/list', params, {
    isMock: false,
    needHint: true,
    mockId: 319,
    proxyApi: '/pms-api'
  });
};

/*
 * locxx-查会话关联需求
 * https://yapi.lanhanba.com/project/307/interface/api/68431
*/
export function getQuoteRelationRequirement(params = {}) {
  return post('/locxx/quote/relation/requirement', params, {
    isMock: false,
    needHint: true,
    mockId: 307,
    proxyApi: '/lcn-api'
  });
};

/*
 * locxx-工作台需求分页列表
 * https://yapi.lanhanba.com/project/307/interface/api/68424
*/
export function getDemandPageList(params = {}) {
  return post('/locxx/quote/pageList', params, {
    isMock: false,
    needHint: true,
    mockId: 307,
    proxyApi: '/lcn-api'
  });
};

/*
 * locxx-查会话关联点位
 * https://yapi.lanhanba.com/project/307/interface/api/68438
*/
export function getQuoteRelationSpot(params = {}) {
  return post('/locxx/quote/relation/spot', params, {
    isMock: false,
    needHint: true,
    mockId: 307,
    proxyApi: '/lcn-api'
  });
};

/*
 * locxx-场地搜索
 * https://yapi.lanhanba.com/project/307/interface/api/68452
*/
export function getQuotePlaceSearch(params = {}) {
  return post('/locxx/quote/place/search', params, {
    isMock: false,
    needHint: true,
    mockId: 307,
    proxyApi: '/lcn-api'
  });
};

/*
 * locxx-保存点位/需求和会话关系
 * https://yapi.lanhanba.com/project/307/interface/api/68445
*/
export function postQuoteRelationCreate(params = {}) {
  return post('/locxx/quote/relation/create', params, {
    isMock: false,
    needHint: true,
    mockId: 307,
    proxyApi: '/lcn-api'
  });
};

/*
 * locxx-需求报价记录
 * https://yapi.lanhanba.com/project/560/interface/api/68368
*/
export function postPropertyQuoteList(params = {}) {
  return post('/property/quote/list', params, {
    isMock: false,
    needHint: true,
    mockId: 560,
    proxyApi: '/zhizu-api'
  });
};

/*
 * locxx-生成报价链接
 * https://yapi.lanhanba.com/project/560/interface/api/68389
*/
export function postPropertyQuoteLinkInit(params = {}) {
  return post('/property/quote/link/init', params, {
    isMock: false,
    needHint: true,
    mockId: 560,
    proxyApi: '/zhizu-api'
  });
};


/*
 * https://yapi.lanhanba.com/project/560/interface/api/70461
 * 下拉选项
*/
export function getplaceCategory(params = {}) {
  return post('/brand/place/search/selection', params, {
    isMock: false,
    needHint: true,
    mockId: 560,
    proxyApi: '/zhizu-api'
  });
};
