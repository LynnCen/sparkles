import { get, post } from '@/common/request/index';

interface SearchParams {
  number?: number; // 订单号
  spotName?: string;	 // 展位名称
  supplyName?: string;	// 供应商名称
  title?: string;	// 活动名称
  start?: string; // 活动时间 - 开始时间
  end?: string;	 // 活动时间 - 结束时间
  status?: Status | null		// 状态
}

interface Response<T> {
  totalNum?: number	// 总数量
  pageNum?:	number; // 页码
  pageSize?: number; // 每页显示数量
  objectList?: T[];
  meta?:ResponseMeta
}
interface ResponseMeta {
  permissions?: Permission[]
}

export interface Info {
  id?: number;	// 主键
  orderStateId?: number;	// 订单状态机id
  number?: string;	 // 订单号
  spotId?: number	// 点位id
  supplyId?: number; // 供应商id
  supplyName?: string	// 供应商名称
  spotName?: string // 点位名称
  placeId?: number // 场地id
  placeName?:	string // 场地名称
  title?: string // 标题
  dates?: string [] // 活动日期
  displayDates?: string []	 // 活动日期 - 显示日期
  purchaseFee?: number	 // 采购总金额（元）
  priceDetail?: Price	 // 价格明细
  depositFee?:number // 押金（元）
  mark?: string; // 备注: 价格明细
  status?: Status;	// 状态
  statusName?: string; // 状态中文
  permissions?: Permission[]// 列表按钮
  brand?: string// 品牌
}

// 价格明细
export interface Price {
  name?:	string;	 // 名称
  value	?: number; // 金额（元）
}

export interface Permission {
  event?: string;
  name?: string;
}

type Status = 1 | 2 | 3 | 4 | 5 | 6 | 7 // 1-待支付 2-待审核 3-带执行 4-执行中 5-已完成 6-已拒绝 7-已取消

// https://yapi.lanhanba.com/project/420/interface/api/40669
export function getList(page, size, searchParams: SearchParams): Promise<Response<Info>> {
  return get('/order/purchaseOrder/pageList', { page, size, ...searchParams }, {
    proxyApi: 'order-center',
    isMock: false,
    needHint: true,
    mockId: 420 });
}

/**
 * https://yapi.lanhanba.com/project/420/interface/api/40676
 * 采购单详情
 */
export function detail(id: number) {
  return get('/order/purchaseOrder/detail', { id }, {
    needHint: true,
    proxyApi: '/order-center',
    isMock: false,
    mockId: 420,
  });
}

/*
 * 采购单额外金额列表
 * https://yapi.lanhanba.com/project/420/interface/api/40466
 * src/common/hook/useBrand.tsx
*/
export function getOrderSelectionExtPrice(params?: any) {
  return get('/order/selection/extPrice', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 420,
    proxyApi: '/order-center'
  });
};

/*
 * 采购单额外金额列表
 * https://yapi.lanhanba.com/project/420/interface/api/40697
 * src/common/hook/useBrand.tsx
*/
export function postPurchaseOrderCreate(params?: any) {
  return post('/order/purchaseOrder/create', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 420,
    proxyApi: '/order-center'
  });
};


/**
 * https://yapi.lanhanba.com/mock/420/api/order/saleOrder/records
 * 获取订单操作记录
 */

export function getPurchaseOrderRecoder(page, size, searchParams: any) {
  return get('/order/purchaseOrder/records', { page, size, ...searchParams }, { proxyApi: '/order-center', needHint: true });
}

/*
 * 采购单编辑
 * https://yapi.lanhanba.com/project/420/interface/api/41866
*/
export function postPurchaseOrderUpdate(params?: any) {
  return post('/order/purchaseOrder/update', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 420,
    proxyApi: '/order-center'
  });
};

/*
 * 销售单编辑
 * https://yapi.lanhanba.com/project/420/interface/api/41845
*/
export function postSaleOrderUpdate(params?: any) {
  return post('/order/saleOrder/update', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 420,
    proxyApi: '/order-center'
  });
};

/**
 * 审核通过
 * https://yapi.lanhanba.com/project/420/interface/api/40760
 */
export function pass(orderStateId: number) {
  return post('/order/purchaseOrder/pass', { orderStateId }, { proxyApi: '/order-center' });
}

/**
 * https://yapi.lanhanba.com/mock/420/api/order/selection/orderReasons
 * 取消原因
 */
export function getOrderReasons () {
  return get('/order/selection/orderReasons', {}, { proxyApi: '/order-center' });
}
