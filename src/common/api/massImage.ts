import { post } from '../request';

/**
 * 行业品牌列表
 * https://yapi.lanhanba.com/project/349/interface/api/69432
 */
export function getBrandList(params:any) {
  return post(`/brand/list2`, params);
}

/**
 * 保存优化品牌的logo图片
 * https://yapi.lanhanba.com/project/349/interface/api/69425
 */
export function saveOptimizeLogo(params:any) {
  return post(`/brand/save/optimize/logo`, params);
}

