import { post } from '@/common/request/index';

/**
 * 门店分析导出
 * https://yapi.lanhanba.com/project/297/interface/api/33397
 */
export function getStoreExport(params: any) {
  return post('/store/formData/export', params);
}



/**
 * 顾客组(门店运营页面下的顾客组图表接口)
 * https://yapi.lanhanba.com/project/297/interface/api/68081
 */
export function getGroupData(params: any) {
  return post('/store/customer/group', params);
}
