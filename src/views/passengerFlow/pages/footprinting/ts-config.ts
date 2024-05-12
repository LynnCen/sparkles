export interface EditTaskModalProps {
  visible: boolean;
  id?: number;
  tenantName?: string;
  projectCode?: string;
  demandBrandName?: string
  placeName?: string
}

export interface AssignTaskModalProps {
  visible: boolean;
  id?: number;
  checkWay?: number;
  checkerName?: string;
  checkerPhone?: string;
}

export interface TaskDetailDrawProps {
  visible: boolean;
  id?: number;
}

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

export enum CanvasDrawTypeEnum {
  CROSS = '1', // 过店
  ENTER = '2', // 进店
}

export enum CanvasDrawTypeColorEnum {
  CROSS = '#FF0000', // 过店
  ENTER = '#009C5E', // 进店
}

export const CanvasDrawTypeOptions = [
  { label: '绘制过店', value: CanvasDrawTypeEnum.CROSS },
  { label: '绘制进店', value: CanvasDrawTypeEnum.ENTER },
];
