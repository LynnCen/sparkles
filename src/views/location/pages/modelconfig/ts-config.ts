export interface ModelModalProps {
  setOperateModel: Function;
  operateModel: ModelModalValuesProps;
  onSearch: Function;
  type: string;
}

// 新增/编辑模型
export interface ModelModalValuesProps {
  id?: number;
  /**
   * 名称
   */
  name?: string;
  /**
   * 标识
   */
  code?: string;
  visible: boolean;
}


export enum TabStatus {
  RECOMMENDED_AREA_MODEL='1',
  PLANNING_MODEL='2',
}
