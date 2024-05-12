import { get, post } from '@/common/request/index';

interface SearchParams {
  number?: number; // 单号
  placeName?: string; // 场地|点位名称
  enterName?: string;	 // 商家名称
  brandName?: string;	// 品牌名称
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
  number?: string;	 // 任务单号
  status?: Status;	// 状态（1：待处理  2：已通过  3：已拒绝）
  statusName?: string; // 状态中文
  enterId?: number; // 商家id
  enterName?: string; // 商家名称
  placeId?: number; // 场地id
  placeName?: string; // 场地名称
  spotId?: number;	// 点位id
  brand?: string; // 品牌
  title?: string // 活动名称
  dates?: string [] // 活动日期
  mark?: string; // 备注
  permissions?: Permission[]// 列表按钮
}

export interface Permission {
  event?: string;
  name?: string;
}

type Status = 1 | 2 | 3 // 1：待处理  2：已通过  3：已拒绝

/**
 * 采购任务列表
 * https://yapi.lanhanba.com/project/420/interface/api/41698
 */
export function getList(page, size, searchParams: SearchParams): Promise<Response<Info>> {
  return get('/order/purchaseTask/pageList', { page, size, ...searchParams }, {
    proxyApi: 'order-center',
    isMock: false,
    needHint: true,
    mockId: 420
  });
}

/**
 * 采购任务详情
 * https://yapi.lanhanba.com/project/420/interface/api/41705
 */
export function detail(id: number) {
  return get('/order/purchaseTask/detail', { id }, {
    needHint: true,
    proxyApi: '/order-center',
    isMock: false,
    mockId: 420,
  });
}

/*
 * 创建任务
 * https://yapi.lanhanba.com/project/420/interface/api/41712
*/
export function createTask(params?: any) {
  return post('/order/purchaseTask/create', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 420,
    proxyApi: '/order-center'
  });
};

/*
 * 审核通过
 * https://yapi.lanhanba.com/project/420/interface/api/41726
*/
export function passTask(params?: any) {
  return post('/order/purchaseTask/pass', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 420,
    proxyApi: '/order-center'
  });
};

/*
 * 审核拒绝
 * https://yapi.lanhanba.com/project/420/interface/api/41733
*/
export function rejectTask(params?: any) {
  return post('/order/purchaseTask/deny', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 420,
    proxyApi: '/order-center'
  });
};

/*
 * 供应商合同搜索
 * https://yapi.lanhanba.com/project/420/interface/api/42013
*/
export function getSupplierContract(params?: any) {
  return get('/contract/supply/search', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 420,
    proxyApi: '/order-center',
  });
};
