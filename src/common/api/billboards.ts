import { post } from '@/common/request/index';

/**
 * 活动行业分布
 * https://yapi.lanhanba.com/project/319/interface/api/49510
 */

export function clueIndustryRatio(params?: any) {
  return post('/property/panel/clueIndustryRatio', { ...params }, false);
}
