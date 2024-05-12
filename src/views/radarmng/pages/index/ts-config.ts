export interface MockDemo {
  a: Function;
}

export interface FiltersProps {
  onSearch: Function;
}

export interface TaskListProps {
  loadData: Function;
  params: Object;
  onSearch: Function;
}

export interface TaskModalProps {
  taskInfo: any;
  setTaskInfo: Function;
  onSearch: Function;
}
export interface TaskBrandModalProps {
  brandInfo: any;
  setBrandInfo: Function;
  onSearch: Function;
}

export enum TaskStatus {
  WAIT = 0, // 待执行
  PROCESSING = 1, // 执行中
  HANGUP = 2, // 已挂起
  COMPLETE = 3, // 已完成
  FAIL = 4, // 失败
  STOP = 5, // 已停止
}

