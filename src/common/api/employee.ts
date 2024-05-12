import { get, post } from '@/common/request/index';

/**
 * 企业下的员工列表：https://yapi.lanhanba.com/project/297/interface/api/33385
 */
export function employeesList(params: Record<string, any>) {
  return get('/user/search', params);
}

/**
 * 2.1.8隐藏 员工管理页
 * 门店管理 - 禁用员工：https://yapi.lanhanba.com/project/94/interface/api/25578
 */
export function updateEmployeeStatus(params: Record<string, any>) {
  return post('/v1/customer_flow/stores/update_employee_status', params);
}

/**
 * 2.1.8隐藏 员工管理页
 * 门店管理 - 添加员工：https://yapi.lanhanba.com/project/94/interface/api/25571
 */
export function addStoreEmployee(params: Record<string, any>) {
  return post('/v1/customer_flow/stores/employee', params);
}

/**
 * 根据数据权限搜索员工：https://yapi.lanhanba.com/project/297/interface/api/62537
 */
export function employeeListPermission(params?: Record<string, any>) {
  return get('/user/listByDataPermission', params);
}

