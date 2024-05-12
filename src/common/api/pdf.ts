/**
 * @Description pdf相关接口(需要加白名单)
 */

import { post } from '@/common/request/index';

/**
 * 踩点报告pdf详情
 * https://yapi.lanhanba.com/project/329/interface/api/39717
 */
export function reviewExportPdf(id:number) {
  return post('/checkSpot/review/exportPDF', { id }, {
    isMock: false,
    needHint: true,
    mockId: 329,
    proxyApi: '/blaster'
  });
}

/**
 * 导出详情(通过关联id查询)
 * https://yapi.lanhanba.com/project/347/interface/api/58701
 */
export function getReportDetail(params:any) {
  return post(`/share/businessReport/relation/detail`, params, {
    proxyApi: '/terra-api',
  });
}
