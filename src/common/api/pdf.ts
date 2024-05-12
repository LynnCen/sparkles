/**
 * pdf相关接口
 */
import { get, post } from '@/common/request/index';

/**
  * 商圈洞察pdf详情 https://yapi.lanhanba.com/project/347/interface/api/35741
  */
export function insightDetail(id: number) {
  return get('/share/businessReport/detail/show', { id }, true);
}
/**
 * 踩点报告pdf详情 https://yapi.lanhanba.com/project/329/interface/api/39717
 */
export function reviewExportPdf(id:number) {
  return post('/checkSpot/review/exportPDF', { id });
}
