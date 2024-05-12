/**
 * @Description 拓店-标准版本-加盟商
 */

import { post } from '@/common/request/index';

/**
 * @description 加盟商列表
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/65519
 */
export function franchiseePage(params?:any) {
  return post('/standard/franchisee/page', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 动态表头列表
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/65967
 */
export function franchiseeDynamicPage(params?:any) {
  return post('/standard/franchisee/dynamic/page', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 加盟商状态选项
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/65981
 */
export function getFranchiseeSelection(params?:any) {
  return post('/standard/franchisee/selection', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 加盟商详情
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/65540
 */
export function getFranchiseeDetail(params?:any) {
  return post('/standard/franchisee/detail', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 加盟商模版列表
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/65526
 */
export function getFranchiseeTemplateList() {
  return post('/standard/franchisee/template/list', {}, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 加盟商模版详情
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/65533
 */
export function franchiseeTemplateDetail(params:any) {
  return post(`/standard/franchisee/template/query`, params, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 加盟商保存
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/59422
 */
export function saveFranchisee(params:any) {
  return post(`/standard/franchisee/save`, params, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 状态变更记录列表
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/65841
 */
export function franchiseeStatusRecord(params:any) {
  return post(`/standard/franchisee/status/record`, params, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

