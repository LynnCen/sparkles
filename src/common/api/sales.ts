import { get, post } from '../request';

interface SearchParams {
  number?: number; // 订单号
  spotName?: string;	 // 展位名称
  enterName?: string;	// 商家名称
  title?: string;	// 活动名称
  start?: string; // 活动时间 - 开始时间
  end?: string;	 // 活动时间 - 结束时间
  status?: Status | null		// 状态
}

interface Response<T> {
  totalNum?: number	// 总数量
  pageNum?:	number; // 页码
  pageSize?: number; // 每页显示数量
  objectList?: T[]
}

interface Info {
  id?: number;	// 主键
  number?: string;	 // 订单号
  channel?: string; // 渠道
  spotId?: number	// 点位id
  spotName?: string	// 点位名称
  placeId?: number // 场地id
  placeName?:	string // 场地名称
  enterId?: number // 商家id
  enterName?: string	// 商家名称
  title?: string // 标题
  dates?: string [] // 活动日期
  displayDates?: string []	 // 活动日期 - 显示日期
  price?: Price	 // 价格明细
  mark?: string; // 备注: 价格明细
  status?: Status;	// 状态
  statusName?: string; // 状态中文
  permissions?: Permission[]
}

// 价格明细
export interface Price {
  saleFee?:	number;	 // 总销售额
  placeFee?: number; // 场地费
  serviceFee?: number;	// 服务费
  otherFee?: number;	 // 其他费用
  depositFee?: number;	// 押金
}

interface Permission {
  event?: string;
  name?: string;
}

type Status = 1 | 2 | 3 | 4 | 5 | 6 | 7 // 1-待支付 2-待审核 3-带执行 4-执行中 5-已完成 6-已拒绝 7-已取消

/**
 * https://yapi.lanhanba.com/mock/420/api/order/saleOrder/pageList
 * 订单列表
 */
export function getList(page, size, searchParams: SearchParams): Promise<Response<Info>> {
  return get('/order/saleOrder/pageList', { page, size, ...searchParams }, { proxyApi: 'order-center', needHint: true });
}

/**
 * https://yapi.lanhanba.com/mock/420/api/order/selection/orderReasons
 * 取消原因
 */
export function getOrderReasons () {
  return get('/order/selection/orderReasons', {}, { proxyApi: '/order-center', needHint: true });
}

export function pass(id: number) {
  return post('/order/saleOrder/pass', { id }, { proxyApi: '/order-center', needHint: true });
}

/**
 * https://yapi.lanhanba.com/mock/420/api/order/saleOrder/deta
 * 订单详情
 */
export function detail(id: number) {
  return get('/order/saleOrder/detail', { id }, { proxyApi: '/order-center', needHint: true });
}

/**
 *
 * https://yapi.lanhanba.com/mock/420/api/crm/getToken
 * 获取crmtoken
 */
export function getCRMToken() {
  return get('/crm/getToken', {}, { proxyApi: '/order-center', needHint: true });
}

/**
 * https://yapi.lanhanba.com/mock/333/api/crmCustomer/queryPageList
 *  根据ids获取企业信息
 */

export function getCRMCustomer(token: string, name:any) {
  return post('/crmCustomer/queryPageList', {
    type: 2,
    search: name,
    searchList: [],
    page: 1,
    limit: 100,
  },
  {
    proxyApi: '/wkcrm-api',
    needCancel: false,
    headers: {
      channel: 'linhuiba',
      'admin-token': token,

    } });
}

/**
 * https://yapi.lanhanba.com/mock/333/api/crmContacts/queryPageList
 *  根据ids获取企业信息
 */

export function getCRMContacts(token: string, customerId: number, name: string) {
  return post('/crmContacts/queryPageList', {
    type: 3,
    search: name,
    searchList: [],
    page: 1,
    limit: 100,
  },
  {
    proxyApi: '/wkcrm-api',
    needCancel: false,
    headers: {
      channel: 'linhuiba',
      'admin-token': token,

    } });
}
/**
 * https://yapi.lanhanba.com/mock/420/api/order/saleOrder/records
 * 获取订单操作记录
 */

export function getSalseOrderRecoder(page, size, searchParams: any) {
  return get('/order/saleOrder/records', { page, size, ...searchParams }, { proxyApi: '/order-center', needHint: true });
}


/**
 *
 * https://yapi.lanhanba.com/mock/420/api/order/saleOrder/create
 * 创建订单
 */
export function add (info) {
  return post('/order/saleOrder/create', info, { proxyApi: '/order-center', needHint: true });
}

