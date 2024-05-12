// 分析状态
export enum AnalysisStatusEnum {
  NOT_START = 0, // 待分析
  WAITING = 1, // 分析中
  PENDING = 2, // 已分析
  SET_RULE = 4, // 待设置规则
  FINISH = 5, // 分析完成
  NO_CREATE = 6, // 待创建
}
