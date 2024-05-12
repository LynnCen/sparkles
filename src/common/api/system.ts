import { get } from '@/common/request/index';

/**
 * 系统日志
 * https://yapi.lanhanba.com/project/289/interface/api/33206
 */

export function getSystemLog(params?: any) {
  return get('/system/log', { ...params }, {
    proxyApi: '/mirage',
    needHint: true
  });
}
