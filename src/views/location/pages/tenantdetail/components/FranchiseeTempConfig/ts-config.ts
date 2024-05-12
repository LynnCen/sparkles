export interface PropertyTreeDrawInfo {
  visible: boolean;
  disabledOIds?: string[]; // 无法选中的oid集合
  templateId?: number;
  rowKey?: string;
}

export interface TemplateEditProps {
  setOperateStoreTemplate: Function;
  operateStoreTemplate: StoreTemplateModalValuesProps;
  onSearch: Function;
  tenantId: number;
}

// 新增/编辑模板
export interface StoreTemplateModalValuesProps {
  id?: number;
  /**
   * 名称
   */
  templateName?: string;
  /**
   * 标识
   */
  code?: string;
  visible: boolean;
}

export interface EditComputeModalProps {
  setEditCompute: Function;
  editCompute: EditComputeModalValuesProps;
  onSearch: Function;
  templateId: number;
}

// 新增/编辑计算公式
export interface EditComputeModalValuesProps {
  id?: number;
  propertyId?: number;
  categoryTemplateId?: number;
  categoryPropertyGroupId?: number;
  visible: boolean;
  templateRestriction?: string;
}

export enum ComputeObjectType {
  PROPERTY = 'PROPERTY', // 属性
  OPERATION = 'OPERATION', // 计算符号
  NUMBER = 'NUMBER', // 数字
}

export interface ComputeObject {
  type: ComputeObjectType; // 计算对象类型
  label: string; // 显示标签
  propertyId?: number; // 属性id
  value?: number; // 运算符枚举值
}

export const operationList: ComputeObject[] = [
  {
    type: ComputeObjectType.OPERATION,
    label: '+',
    value: 100,
  },
  {
    type: ComputeObjectType.OPERATION,
    label: '-',
    value: 101,
  },
  {
    type: ComputeObjectType.OPERATION,
    label: '×',
    value: 102,
  },
  {
    type: ComputeObjectType.OPERATION,
    label: '÷',
    value: 103,
  },
  {
    type: ComputeObjectType.OPERATION,
    label: '(',
    value: 104,
  },
  {
    type: ComputeObjectType.OPERATION,
    label: ')',
    value: 105,
  }
];

export const numberList: ComputeObject[] = [
  {
    type: ComputeObjectType.NUMBER,
    label: '1',
    value: 1,
  },
  {
    type: ComputeObjectType.NUMBER,
    label: '2',
    value: 2,
  },
  {
    type: ComputeObjectType.NUMBER,
    label: '3',
    value: 3,
  },
  {
    type: ComputeObjectType.NUMBER,
    label: '4',
    value: 4,
  },
  {
    type: ComputeObjectType.NUMBER,
    label: '5',
    value: 5,
  },
  {
    type: ComputeObjectType.NUMBER,
    label: '6',
    value: 6,
  },
  {
    type: ComputeObjectType.NUMBER,
    label: '7',
    value: 7,
  },
  {
    type: ComputeObjectType.NUMBER,
    label: '8',
    value: 8,
  },
  {
    type: ComputeObjectType.NUMBER,
    label: '9',
    value: 9,
  },
  {
    type: ComputeObjectType.NUMBER,
    label: '0',
    value: 10,
  },
  {
    type: ComputeObjectType.NUMBER,
    label: '.',
    value: 11,
  },
];
