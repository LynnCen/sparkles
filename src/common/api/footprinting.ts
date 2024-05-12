import { post } from '@/common/request/index';

interface AnalysisParams {
  page: number;
  size: number;
  projectCode: string;
}

/**
 * 踩点分析设置列表 https://yapi.lanhanba.com/project/329/interface/api/33886
 */
export function checkSpotAnalysis(params: AnalysisParams) {
  return post('/checkSpot/project/analysisSetting', params, true);
}

/**
 * 踩点分析绘制多边形 https://yapi.lanhanba.com/project/329/interface/api/33881
 */
export function savePoints(params: any) {
  return post('/checkSpot/checkPoints/save', params, true);
}


/**
 * 视频分页查询 https://yapi.lanhanba.com/project/329/interface/api/34159
 */
export function videoListData(params: any) {
  return post('/checkSpot/video/pages', params, true);
}

/**
 * 立即分析 https://yapi.lanhanba.com/project/329/interface/api/33883
 */
export function immediatelyAnalysis(params: any) {
  return post('/checkSpot/project/analysis', params, true);
}

/**
 * 下拉框内容选择 https://yapi.lanhanba.com/project/329/interface/api/33893
 */
export function footprintingManageSelection(params: any) {
  return post('/checkSpot/selection', params, true);
}

/**
 * 踩点任务批量删除 https://yapi.lanhanba.com/project/329/interface/api/33877
 */
export function projectTaskDelete(params: any) {
  return post('/checkSpot/project/batchDelete', params, true);
}


/**
 * 单个视频的立即分析 https://yapi.lanhanba.com/project/329/interface/api/34160
 */
export function videoItemAnalysis(params: any) {
  return post('/checkSpot/video/analysis', params, true);
}

/**
 * 视频批量删除 https://yapi.lanhanba.com/project/329/interface/api/34344
 */
export function videoBatchDelete(params: any) {
  return post('/checkSpot/video/batchDelete', params, true);
}

/**
 * 踩点分析报告详情 https://yapi.lanhanba.com/project/329/interface/api/35328
 */
export function getCheckSpotReport(params: any) {
  return post('/checkSpot/report/show', params, true);
}
