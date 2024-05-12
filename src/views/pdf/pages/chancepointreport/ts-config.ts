import { ChanceDetailModule } from '@/common/components/business/ExpandStore/ts-config';
import { isNotEmptyAny } from '@lhb/func';

// pdf渲染时的分组模块
export enum PDFChanceModuleName {
  MODULE_PRE = 1, // 首页
  // 核心信息 + 收益预估 + 项目综述
  MODULE_PROJECT_INFO,
  // 点位评分
  MODULE_POINT_EVALUATION,
  MODULE_BUSINESS_AREA, // 商圈
  MODULE_DETAIL, // 动态表单
  // MODULE_END, // 尾页
}

// pdf页共通class
export const ChancePdfPageClass = 'chance-pdf-page';
export const CHANCEPOINT_REPORT_PDF = 'chancepoint-report-pdf';

// 以下部分从page.config.ts迁移过来的，原作者（蔡忠岭）
// const order = {
//   '项目综述': 0,
//   '收益预估': 1,
//   '核心信息': 2
//   // 如果有其他名称，可继续添加
// };
// 项目信息接口数据处理
export const tranformProjectInfo = (data) => {
  if (!isNotEmptyAny(data)) return {};
  // 从接口数据中
  const projectInfo = data.filter((item) => item.moduleType === ChanceDetailModule.Basic || item.moduleType === ChanceDetailModule.Benifit || item.moduleType === ChanceDetailModule.Overview);
  // const sortProjectInfo = projectInfo.sort((a, b) => order[a.moduleTypeName] - order[b.moduleTypeName]);
  const projectInfoDetail = projectInfo.map((item) => {
    // 各个子模块需要的数据 如果为空数据 则不展示该子模块
    if (item.moduleType === ChanceDetailModule.Overview) item.isShow = isNotEmptyAny(item?.projectOverviewModule?.textValue);
    if (item.moduleType === ChanceDetailModule.Benifit) item.isShow = isNotEmptyAny(item?.earnEstimateModule);
    if (item.moduleType === ChanceDetailModule.Basic) item.isShow = isNotEmptyAny(item?.importModule);
    return item;
  }) || [];
  const isShowModule = projectInfoDetail.some((el) => el.isShow); // 是否展示项目信息模块
  return {
    projectInfoDetail,
    isShowModule
  };
};
// 点位评估接口数据处理
export const tranformPointEvalution = (data) => {
  if (!isNotEmptyAny(data)) return {};
  const pointEvalutionInfo = data.find((item) => item.moduleType === ChanceDetailModule.Radar);
  return {
    isShowModule: isNotEmptyAny(pointEvalutionInfo?.radarModule),
    pointEvalutionDetail: pointEvalutionInfo
  };
};
