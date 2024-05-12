export interface CircleTemplateModalProps {
  setOperateCircleTemplate: Function;
  operateCircleTemplate: CircleTemplateModalValuesProps;
  onSearch: Function;
}

// 新增/编辑商圈模板
export interface CircleTemplateModalValuesProps {
  id?: number;

  tenantId: number;

  /**
   * 编号
   */
  code?: string;

  /**
   * 名称
   */
  name?: string;
  /**
   * 标识
   */
  remark?: string;

  visible: boolean;
}
export const defineSelect = [
  {
    label: '文本框',
    value: 1
  },
  {
    label: '数字框',
    value: 2
  }];
