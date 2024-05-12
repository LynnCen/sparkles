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
