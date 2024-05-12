/**
 * 预测
 */
import { post } from '@/common/request/index';

/**
 * 导出 https://yapi.lanhanba.com/project/297/interface/api/33335
 */
export function predictExport(params: Record<string, any>) {
  return post('/predict/export', params, true);
}

/**
 * 预测列表 https://yapi.lanhanba.com/project/297/interface/api/33334
 */
export function predictList(params: Record<string, any>) {
  return post('/predict/list', params, true);
}
