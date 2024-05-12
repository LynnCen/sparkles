import { get, post } from '@/common/request/index';
import { Key } from 'react';

interface AnalysisParams {
  page: number;
  size: number;
  projectCode: string;
}

/**
 * 踩点分析设置列表 https://yapi.lanhanba.com/project/329/interface/api/33886
 */
export function checkSpotAnalysis(params: AnalysisParams) {
  return post('/checkSpot/project/analysisSetting', params, {
    proxyApi: '/terra-api',
    needHint: true
  });
}

/**
 * 踩点分析绘制多边形 https://yapi.lanhanba.com/project/329/interface/api/33881
 */
export function savePoints(params: any) {
  return post('/checkSpot/checkPoints/save', params, {
    proxyApi: '/terra-api',
    needHint: true
  });
}


/**
 * 视频分页查询 https://yapi.lanhanba.com/project/329/interface/api/34159
 */
export function videoListData(params: any) {
  return post('/checkSpot/video/pages', params, {
    proxyApi: '/terra-api',
    needHint: true
  });
}

/**
 * 立即分析 https://yapi.lanhanba.com/project/329/interface/api/33883
 */
export function immediatelyAnalysis(params: any) {
  return post('/checkSpot/project/analysis', params, {
    proxyApi: '/terra-api',
    needHint: true
  });
}

/**
 * 下拉框内容选择 https://yapi.lanhanba.com/project/462/interface/api/53927
 */
export function footprintingManageSelection(params: any) {
  return post('/checkSpot/selection', params, {
    proxyApi: '/blaster',
    needHint: true
  });
}

/**
 * 踩点任务批量删除 https://yapi.lanhanba.com/project/329/interface/api/33877
 */
export function projectTaskDelete(params: any) {
  return post('/checkSpot/project/batchDelete', params, {
    proxyApi: '/terra-api',
    needHint: true
  });
}


/**
 * 单个视频的立即分析 https://yapi.lanhanba.com/project/329/interface/api/34160
 */
export function videoItemAnalysis(params: any) {
  return post('/checkSpot/video/analysis', params, {
    proxyApi: '/terra-api',
    needHint: true
  });
}

/**
 * 视频批量删除 https://yapi.lanhanba.com/project/329/interface/api/34344
 */
export function videoBatchDelete(params: any) {
  return post('/checkSpot/video/batchDelete', params, {
    proxyApi: '/terra-api',
    needHint: true
  });
}

/**
 * 踩点分析报告详情 https://yapi.lanhanba.com/project/329/interface/api/35328
 */
export function getCheckSpotReport(params: any) {
  return post('/checkSpot/report/show', params, {
    proxyApi: '/terra-api',
    needHint: true,
    // mockId: 329,
    // isMock: true
  });
}

/**
 * 批量分析
 * https://yapi.lanhanba.com/project/329/interface/api/64105
 * @param params 传入的参数
 * @returns 返回分析结果
 */
export function passengerFlowBatchAnalysis(params: any) {
  return post('/checkSpot/video/batchAnalysis', params, {
    proxyApi: '/terra-api',
    needHint: true,
  });
}
/**
 * 应用视频画框
 * https://yapi.lanhanba.com/project/329/interface/api/64119
 * @param projectId 踩点任务 ID
 * @param sourceVideoId 原视频ID
 * @param outdoorPoints 视频点位(过店)
 * @param needToAnalysis 是否需要分析
 * @param indoorPoints 视频点位(进店)
 * @param applyAll 是否应用到所有视频
 * @param videoIds 被应用的部分视频ID集合
 * @returns 返回应用结果
 */
export function passengerCheckPointsApply(params: {
  /** 踩点任务 ID */
  projectId: number | string;
  /** 原视频ID */
  sourceVideoId: number | string;
  /** 视频点位(过店) */
  outdoorPoints: any;
  /** 是否需要分析 */
  needToAnalysis?: boolean;
  /** 视频点位(进店) */
  indoorPoints?: any;
  /** 是否应用到所有视频	 */
  applyAll?: boolean;
  /** 被应用的部分视频ID集合 */
  videoIds?: Key[];
}) {
  return post('/checkSpot/checkPoints/apply', params, {
    proxyApi: '/terra-api',
    needHint: true,
  });
}

/**
 * 视频详情
 * https://yapi.lanhanba.com/project/329/interface/api/71168
 * @param params 传入的参数
 * @returns 返回分析结果
 */
export function checkSpotVideoDetail(params: any) {
  return get('/checkSpot/video/detail', params, {
    proxyApi: '/terra-api',
    needHint: true,
  });
}
