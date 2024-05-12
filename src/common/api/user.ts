import { get, post } from '@/common/request/index';

/**
 * 试用账号注册
 * https://yapi.lanhanba.com/project/297/interface/api/52023
 */
export function posteRegisterTrial(params = {}) {
  return post('/register/trial', params, { needHint: true, isMock: false, mockId: 297, mockSuffix: '/api' });
}
/**
 * 获取试用账号状态
 * https://yapi.lanhanba.com/project/297/interface/api/52030
 */
export function getRegisterTrialStatus() {
  return get('/register/trial/status', {}, { needHint: true, isMock: false, mockId: 297, mockSuffix: '/api' });
}


