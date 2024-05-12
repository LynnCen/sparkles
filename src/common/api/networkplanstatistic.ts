/**
 * @Description 规划详情
 */
import { post } from '../request';


/**
 * 规划列表
 * https://yapi.lanhanba.com/project/546/interface/api/59786
 */
export function getStatisticList(params:any) {
  return post('/plan/detail', params, {
    isMock: false,
    mockId: 546,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * 规划列表child
 * https://yapi.lanhanba.com/project/546/interface/api/63741
 */
export function getStatisticListItemChild(params:any) {
  return post('/plan/detail/child', params, {
    isMock: false,
    mockId: 546,
    mockSuffix: '/api',
    needHint: true,
  });
}


/**
 * 规划详情total
 * https://yapi.lanhanba.com/project/546/interface/api/63713
 */
export function getStatisticTotal(params:any) {
  return post('/plan/detail/total', params, {
    isMock: false,
    mockId: 546,
    mockSuffix: '/api',
    needHint: true,
  });
}
