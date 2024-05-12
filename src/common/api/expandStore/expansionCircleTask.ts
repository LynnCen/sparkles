/**
 * @Description 商圈版本-拓店管理-拓店任务-接口
 */

import { get, post } from '@/common/request/index';

/**
 * @description 拓店任务列表
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/71462
 */
export function getExpansionCircleTaskList(params?: any) {
  return post(
    '/direct/task/page',
    { ...params },
    {
      isMock: false,
      mockId: 532,
      mockSuffix: '/api',
      needHint: true,
      needCancel: false,
    }
  );
}

/**
 * @description 拓店任务导出
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/71469
 */
export function circleTaskListExport(params?:any) {
  return post('/direct/task/export', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}


/**
 * @description 拓店任务详情
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/71399
 */
export function getCircleTaskDetail(params?: any) {
  return get(
    '/direct/task/detail',
    { ...params },
    {
      isMock: false,
      mockId: 532,
      mockSuffix: '/api',
      needHint: true,
    }
  );
}

/**
 * @description 获取可被关联的机会点列表
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/71476
 */
export function getCircleTaskChancePointList(params?:any) {
  return post('/direct/task/chancePointPage', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * @description 选址地图拓店任务历史列表（商圈id为入参）
 * @yapi https://yapi.lanhanba.com/project/532/interface/api/71581
 */
export function circleTaskHistory(params?: any) {
  return post('/direct/task/history', { ...params }, {
    isMock: false,
    mockId: 532,
    mockSuffix: '/api',
    needHint: true,
  });
}
