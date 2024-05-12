import { post } from '../request';

// pms/租户配置

/*
  获取PMS租户配置列表
  https://yapi.lanhanba.com/project/319/interface/api/51757
*/
export function getTenantList(params: any) {
  return post('/saas/tenant/page', { ...params }, { needHit: true, proxyApi: '/pms-api' });
};

/*
  获取PMS租户业务类型
  https://yapi.lanhanba.com/project/319/interface/api/51771
*/
export function getBusinessType(params: any) {
  return post('/saas/tenant/get/businessType', { ...params }, { needHit: true, proxyApi: '/pms-api' });
}

/*
  设置PMS租户业务类型
  https://yapi.lanhanba.com/project/319/interface/api/51764
*/
export function postBusinessType(params: any) {
  return post('/saas/tenant/businessType/store', { ...params }, { needHit: true, proxyApi: '/pms-api' });
}
