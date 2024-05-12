/**
 * 订单
 */
import { post } from '@/common/request/index';

/**
 * 订单列表 https://yapi.lanhanba.com/project/297/interface/api/33276
 */
export function orderManageList(params: Record<string, any>) {
  return post('/order/list', params, true);
}

/**
 * 导入订单 https://yapi.lanhanba.com/project/297/interface/api/33277
 */
export function orderImport(params: Record<string, any>) {
  return post('/order/import', params, true);
}

/**
 * 导出订单 https://yapi.lanhanba.com/project/297/interface/api/33278
 */
export function orderExport(params: Record<string, any>) {
  return post('/order/export', params, true);
}
/**
 *订单折线图：https://yapi.lanhanba.com/project/297/interface/api/33342
 */
export function orderStatistic(params: Record<string, any>) {
  return post('/order/statistic', params, true);
}

/**
 *订单占比图：https://yapi.lanhanba.com/project/297/interface/api/33342
 */
export function orderProportion(params: Record<string, any>) {
  return post('/order/proportion', params, true);
}

/**
 * 导入订单校验 https://yapi.lanhanba.com/project/297/interface/api/33310
 */
export function orderImportCheck(params: { url: string }) {
  return post('/order/check', params, true);
}
