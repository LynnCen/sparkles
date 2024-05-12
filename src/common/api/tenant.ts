/**
 * @Description
 */
import { post } from '@/common/request/index';

/**
 * 租户菜单重排序
 * https://yapi.lanhanba.com/project/378/interface/api/52058
 */

export function reorderTntModule(params?: any) {
  return post('/tntModule/reorder', { ...params }, {
    proxyApi: '/mirage',
    needHint: true
  });
}
