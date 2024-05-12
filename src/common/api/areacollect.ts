import { post } from '../request';

/**
 * 区域收藏—收藏列表-https://yapi.lanhanba.com/project/331/interface/api/54599
 */
export function favorPage(params?: any) {
  return post('/shop/report/favor/page', params, {
    isMock: false,
    mockId: 331,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * 区域收藏-添加收藏-https://yapi.lanhanba.com/project/331/interface/api/54585
 */
export function favorCreate(params: any) {
  return post(`/shop/report/favor/create`, params, {
    isMock: false,
    mockId: 331,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * 区域收藏-取消收藏-https://yapi.lanhanba.com/project/331/interface/api/54592
 */
export function favorDelete(params: any) {
  return post(`/shop/report/favor/delete`, params, {
    isMock: false,
    mockId: 331,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * 区域收藏-判断是否已被收藏-https://yapi.lanhanba.com/project/331/interface/api/54795
 */
export function favorCheck(params: any) {
  return post(`/shop/report/favor/check`, params, {
    isMock: false,
    mockId: 331,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * 报告点位导出-https://yapi.lanhanba.com/project/331/interface/api/55061
 */
export function exportExcel(params: any) {
  return post(`/shop/model/report/export`, params, {
    isMock: false,
    mockId: 331,
    mockSuffix: '/api',
    needHint: true,
  });
}
