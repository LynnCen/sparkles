/*
 * @Description 益禾堂首页相关接口
 */

import { get } from '@/common/request/index';

/**
 * 区域筛选项
 * https://yapi.lanhanba.com/project/532/interface/api/60843
 */
export function getSelectionArea(params) {
  return get(
    '/yht/home/selection/area',
    { ...params },
    {
      needHint: true,
      isMock: false,
      mockId: 532,
      mockSuffix: '/api'
    }
  );
}

/**
 * 进度完成率概况
 * https://yapi.lanhanba.com/project/532/interface/api/60850
 */
export function scheduleOverview(params) {
  return get(
    '/yht/home/schedule',
    { ...params },
    {
      needHint: true,
      isMock: false,
      mockId: 532,
      mockSuffix: '/api'
    }
  );
}

/**
 * 网规漏斗
 * https://yapi.lanhanba.com/project/532/interface/api/60857
 */
export function funnelOverview(params) {
  return get(
    '/yht/home/planFunnel',
    { ...params },
    {
      needHint: true,
      isMock: false,
      mockId: 532,
      mockSuffix: '/api'
    }
  );
}

/**
 * 年度目标
 * https://yapi.lanhanba.com/project/532/interface/api/60864
 */
export function annualObjectives(params) {
  return get(
    '/yht/home/annualObjectives',
    { ...params },
    {
      needHint: true,
      isMock: false,
      mockId: 532,
      mockSuffix: '/api'
    }
  );
}

/**
 * 招商目标完成情况
 * https://yapi.lanhanba.com/project/532/interface/api/60801
 */
export function attractInvestmentCompletion(params) {
  return get(
    '/yht/home/goalCompletion',
    { ...params },
    {
      needHint: true,
      isMock: false,
      mockId: 532,
      mockSuffix: '/api'
    }
  );
}

/**
 * 选址漏斗
 * https://yapi.lanhanba.com/project/532/interface/api/60808
 */
export function siteSelectionData(params) {
  return get(
    '/yht/home/locationFunnel',
    { ...params },
    {
      needHint: true,
      isMock: false,
      mockId: 532,
      mockSuffix: '/api'
    }
  );
}

/**
 * 门店数量 - 城市等级
 * https://yapi.lanhanba.com/project/532/interface/api/60815
 */
export function cityLevelShopCount(params) {
  return get(
    '/yht/home/storeStatistic/cityCategory',
    { ...params },
    {
      needHint: true,
      isMock: false,
      mockId: 532,
      mockSuffix: '/api'
    }
  );
}

/**
 * 门店数量 - 商圈类型
 * https://yapi.lanhanba.com/project/532/interface/api/60822
 */
export function areaTypeShopCount(params) {
  return get(
    '/yht/home/storeStatistic/mallCategory',
    { ...params },
    {
      needHint: true,
      isMock: false,
      mockId: 532,
      mockSuffix: '/api'
    }
  );
}

/**
 * 门店数量 - 省份
 * https://yapi.lanhanba.com/project/532/interface/api/60829
 */
export function shopCountOfProvince(params) {
  return get(
    '/yht/home/storeStatistic/province',
    { ...params },
    {
      needHint: true,
      isMock: false,
      mockId: 532,
      mockSuffix: '/api'
    }
  );
}

/**
 * 门店数量 - 城市
 * https://yapi.lanhanba.com/project/532/interface/api/60836
 */
export function shopCountOfCity(params) {
  return get(
    '/yht/home/storeStatistic/city',
    { ...params },
    {
      needHint: true,
      isMock: false,
      mockId: 532,
      mockSuffix: '/api'
    }
  );
}

/**
 * 分公司筛选项
 * https://yapi.lanhanba.com/project/532/interface/api/61984
 */
export function getSelectionCompany(params) {
  return get(
    '/yht/home/selection/company',
    { ...params },
    {
      needHint: true,
      isMock: false,
      mockId: 532,
      mockSuffix: '/api'
    }
  );
}



