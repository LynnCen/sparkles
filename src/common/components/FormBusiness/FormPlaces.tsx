/**
 * 表单项员工列表
 */
import React from 'react';
import { SelectProps } from 'antd/es/select';
import { DefaultFormItemProps } from '@/common/components/Form/ts-config';
import { Form } from 'antd';
import Places from '../Select/Places';

export interface FormPlaceProps {
  form?: any;
  placeholder?: string;
  allowClear: boolean;
  extraParams?: any;
  config?: SelectProps;
  onChange?: Function;
  finallyData?: Function;
  changeHandle?: Function; // 映射select的onChange
  enableNotFoundNode?: boolean;
  keyword?: string
}

const FormPlaces: React.FC<FormPlaceProps & DefaultFormItemProps> = ({
  name,
  label,
  rules,
  form,
  placeholder,
  allowClear = false,
  formItemConfig = {},
  config = {},
  changeHandle,
  finallyData,
  enableNotFoundNode = false,
  keyword
}) => {
  const onChange = (val: any, option: any) => {
    changeHandle && changeHandle(val, option);
    form &&
      form.setFieldsValue({
        [name]: val,
      });
  };

  return (
    <Form.Item name={name} label={label} rules={rules} {...formItemConfig}>
      <Places
        {...config}
        allowClear={allowClear}
        placeholder={placeholder}
        onChange={onChange}
        finallyData={finallyData}
        enableNotFoundNode={enableNotFoundNode}
        keyword={keyword}
      />
    </Form.Item>
  );
};

export default FormPlaces;
