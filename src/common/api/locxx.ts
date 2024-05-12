import { get, post } from '@/common/request/index';

/**
 * 分页查询邀请记录（短信/微信）
 * https://yapi.lanhanba.com/project/307/interface/api/54830
 */

export function postLocxxMsgPageList(params?: any) {
  return post('/locxx/customerMessage/pageList', { ...params }, { needHint: true, proxyApi: '/lcn-api' });
}


/**
 * 发送邀请（短信/微信）
 * https://yapi.lanhanba.com/project/307/interface/api/54823
 */

export function postLocxxMsgSend(params?: any) {
  return post('/locxx/customerMessage/send', { ...params }, { needHint: true, proxyApi: '/lcn-api' });
}


/**
 * 账号中心id获取token
 * https://yapi.lanhanba.com/project/307/interface/api/55873
 */
export function getTokenById(params?: any) {
  return get('/mirage/tokenById', { ...params }, { isMock: false, needHit: true, mockId: 307, proxyApi: '/lcn-api' });
}

/**
 * 租户授权状态
 * https://yapi.lanhanba.com/project/560/interface/api/63846
 */
export function getUserTenantAuthorizeStatus(params?: any) {
  return post('/admin/user/tenant/authorizeStatus', { ...params }, { isMock: false, needHit: true, mockId: 560, proxyApi: '/zhizu-api' });
}

/*
* locxxPlaceMng项目列表
* https://yapi.lanhanba.com/mock/560/api/admin/placeMng/page
*/
export function getPlaceList(searchParams: any): Promise<any> {
  return post('/admin/placeMng/page', { ...searchParams }, {
    isMock: false,
    needHint: true,
    mockId: 560,
    proxyApi: '/zhizu-api'
  });
}

/*
* locxxPlaceMng项目详情二维码
* https://yapi.lanhanba.com/mock/560/api/admin/placeMng/appCode
*/
export function getPlaceInfoAppCode(obj: any): Promise<any> {
  return post('/admin/placeMng/qrCode', { ...obj }, {
    isMock: false,
    needHint: true,
    mockId: 560,
    proxyApi: '/zhizu-api'
  });
}


/*
* locxxPlaceMng跟进记录
* https://yapi.lanhanba.com/mock/560/api/admin/placeMng/appCode
*/
export function getRecordList(obj: any): Promise<any> {
  return post('/admin/placeFollow/page', { ...obj }, {
    isMock: false,
    needHint: true,
    mockId: 560,
    proxyApi: '/zhizu-api'
  });
}

/*
* locxxPlaceMng 保存记录
* https://yapi.lanhanba.com/mock/560/api/admin/placeMng/appCode
*/
export function saveRecord(obj: any): Promise<any> {
  return post('/admin/placeFollow/store', { ...obj }, {
    isMock: false,
    needHint: true,
    mockId: 560,
    proxyApi: '/zhizu-api'
  });
}


/*
* locxxPlaceMng 详情
* https://yapi.lanhanba.com/mock/560/api/admin/placeMng/appCode
*/
export function getPlaceInfoDetail(tenantPlaceId: number): Promise<any> {
  return post('/admin/placeMng/detail', { tenantPlaceId }, {
    isMock: false,
    needHint: true,
    mockId: 560,
    proxyApi: '/zhizu-api'
  });
}



