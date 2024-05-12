import { CombineUploadProps } from '@/common/components/Upload/ts-config';
import { CascaderProps } from 'antd/lib/cascader/index';
import { CheckboxGroupProps } from 'antd/lib/checkbox';
import { DatePickerProps, RangePickerProps } from 'antd/lib/date-picker';
import { FormItemProps, FormProps } from 'antd/lib/form/index';
import { NamePath } from 'antd/lib/form/interface';
import { SelectProps, SwitchProps } from 'antd/lib/index';
import { InputProps, InputRef } from 'antd/lib/input';
import { InputNumberProps } from 'antd/lib/input-number';
import { PasswordProps } from 'antd/lib/input/Password';
import { TextAreaProps } from 'antd/lib/input/TextArea.d';
import { RadioGroupProps, RadioGroupOptionType } from 'antd/lib/radio';
import { TreeSelectProps } from 'antd/lib/tree-select';
import { ReactNode, RefAttributes } from 'react';

// Form.Item的默认参数 ，其他入参传入formItemConfig，对应Form.Item
export interface DefaultFormItemProps {
  name: NamePath | any;
  label?: ReactNode;
  noStyle?: boolean;
  initialValue?: number | string;
  rules?: any[];
  formItemConfig?: FormItemProps; // Form.Item的其他入参
}

//  input输入框
export interface FormInputProps extends DefaultFormItemProps {
  placeholder?: string;
  maxLength?: number;
  rules?: Array<any>;
  // inputStyle?: any;
  // readOnly?: boolean; // 是否只读
  allowClear?: boolean;
  onClickInput?: Function;
  prefix?: ReactNode;
  config?: InputProps & RefAttributes<InputRef>;
  removeSpace?: boolean; // 是否去前后的空格，默认为false
}

//  密码输入框
export interface FormInputPasswordProps extends DefaultFormItemProps {
  placeholder?: string;
  readOnly?: boolean;
  prefix?: ReactNode;
  dependencies?: string | number | (string | number)[];
  config?: PasswordProps; // antd input password的入参
}

// 数字输入框
export interface FormInputNumberProps extends DefaultFormItemProps {
  placeholder?: string;
  max?: number; // 最大
  min?: number; // 最小
  config?: InputNumberProps;
  precision?: number,
}

// 多行文本输入框
export interface FormTextAreaProps extends DefaultFormItemProps {
  placeholder?: string;
  rows?: number; // 行数
  showCount?: boolean; // 是否显示数量
  maxLength?: number; // 字数
  allowClear?: boolean; // 是否可以点击图标删除
  config?: TextAreaProps; // antd TextArea 的入参
}

// select框
export interface FormSelectProps extends DefaultFormItemProps {
  options: any[];
  placeholder?: string;
  allowClear?: boolean;
  mode?: 'multiple' | 'tags';
  config?: SelectProps;
}

// select组
export interface FormSelectOptGroupProps extends DefaultFormItemProps {
  valuePropName?: string;
  initialValue?: any;
  options: any[];
  placeholder?: string;
  allowClear?: boolean;
  mode?: 'multiple' | 'tags';
  config?: SelectProps; // antd Select 的入参
}

// treeSelect框
export interface FormTreeSelectProps extends DefaultFormItemProps {
  treeData: any[];
  placeholder?: string;
  onChange?: Function;
  config?: TreeSelectProps;
}

// switch开关
export interface FormSwitchProps extends DefaultFormItemProps {
  valuePropName?: string;
  initialValue?: any;
  config?: SwitchProps; // antd switch 的入参
}

// 单选框
export interface FormRadioProps extends DefaultFormItemProps {
  options?: any[];
  onChange?: Function;
  optionType?: RadioGroupOptionType | undefined;
  config?: RadioGroupProps; // antd Radio 的入参
}

// 多选框
export interface FormCheckboxProps extends DefaultFormItemProps {
  config?: CheckboxGroupProps; // antd Radio 的入参
}

// 时间选择
export interface FormDatePickerProps extends DefaultFormItemProps {
  placeholder?: string;
  config?: DatePickerProps; // antd DataPicker 的入参
}

// 时间范围选择
export interface FormRangePickerProps extends DefaultFormItemProps {
  config?: RangePickerProps; // antd RangerPicker 的入参
}

// 上传
export interface FormUploadProps extends DefaultFormItemProps {
  valuePropName?: string;
  initialValue?: any;
  config: CombineUploadProps;
  getValueFromEvent?: any;
  children?: ReactNode;
}

// 级联选择
export interface FormCascaderProps extends DefaultFormItemProps {
  options: any[];
  placeholder?: string;
  config?: CascaderProps<any>; // antd Cascader 的入参
}

// 带搜索和重置按钮的form
export interface SearchFormProps extends FormProps {
  needResetButton?: boolean; // 是否需要 重置按钮
  onSearch?: Function; // 确定
  className?: string;
  labelLength?: number;
  extra?: ReactNode; // 可传入额外的操作
  onRef?: any;
  onOkText?: string; // 查询按钮的问题-默认为查询
  /**
   * @description 可传入右侧按钮组
   */
  rightOperate?: ReactNode;
  /**
   * 按钮按钮是否换行
   */
  isFooterButtonLine?: boolean;
  /**
   * form 表单项
   */
  columns?: any;
  /**
   * 重置回调事件
   */
  onResetFn?: Function;
  actionRef?: any;
  setFilterData?:any;
  /**
   * @description 插入额外的表单项
   */
  otherSearchForm?:() => ReactNode;
  children?: ReactNode;
}

export interface FormCheckboxGroupProps extends DefaultFormItemProps {
  initialValue?: number | string;
  options: Array<any>;
  formItemConfig?: FormItemProps; // Form.Item的其他入参
  fieldNames?: { label: string; value: string };
  config?: CheckboxGroupProps;
  onChange?: Function;
}

export interface FormSizeInputProps extends DefaultFormItemProps {
  placeholder?: string;
  max?: number; // 最大
  min?: number; // 最小
  config?: InputNumberProps;
  firstConfig?: InputNumberProps;
  middleConfig?: InputNumberProps;
  lastConfig?: InputNumberProps;
  useBaseRules?: boolean; // 是否植入默认规则组
}


export interface FormDictionarySelectProps extends DefaultFormItemProps {
  config?: InputNumberProps;
  placeholder?: string;
}


// 富文本编辑器
export interface FormEditorProps extends DefaultFormItemProps {
  config?: any;
  placeholder?: string;
}
