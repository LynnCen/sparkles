// 拍摄状态
export enum ProcessStatus {
  FINISHED = 1, // 已完成
  ISSUED = 3, // 待拍摄
  DOING = 4, // 进行中
  FILM_COMPLETE = 5, // 拍摄完成
  ASSIGN = 8, // 待下发
  RESHOOT = 9, // 待补拍
}

// 分析状态
export enum AnalysisStatusEnum {
  NOT_START = 0, // 待分析
  WAITING = 1, // 分析中
  PENDING = 2, // 已分析
  SET_RULE = 4, // 待设置规则
  FINISH = 5, // 分析完成
  NO_CREATE = 6, // 待创建
}
