import { CheckboxOptionType } from 'antd/es/checkbox';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import React from 'react';

export interface TreeCheckboxOptionsProps {
  options?: Array<CheckboxOptionType>;
  label: React.ReactNode;
  value: CheckboxValueType;
  children?: Array<TreeCheckboxOptionsProps>;
}

export interface TreeCheckboxProps {
  content: TreeCheckboxOptionsProps;
  checkedList: CheckboxValueType[];
  setCheckedList: any;
  style?: React.CSSProperties;
}


export interface TreeCheckboxGroupProps {
  data: Array<TreeCheckboxOptionsProps>;
  checkedList: CheckboxValueType[];
  setCheckedList: any;
  style?: React.CSSProperties;
}
