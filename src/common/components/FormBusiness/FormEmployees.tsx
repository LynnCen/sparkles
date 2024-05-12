/**
 * 表单项员工列表
 */
import React from 'react';
import { Form } from 'antd';
import { SelectProps } from 'antd/es/select';
import { DefaultFormItemProps } from '@/common/components/Form/ts-config';
import Employees from '../Select/Employees';

export interface FormEmployeeProps {
    form?: any;
    placeholder?: string;
    allowClear: boolean;
    extraParams?: any;
    config?: SelectProps;
    onChange?: Function;
    finallyData?: Function;
    changeHandle?: Function; // 映射select的onChange
  }

const FormEmployees: React.FC<FormEmployeeProps & DefaultFormItemProps> = ({
  name,
  label,
  rules,
  form,
  placeholder,
  allowClear = false,
  formItemConfig = {},
  config = {},
  changeHandle,
  finallyData
}) => {
  const onChange = (val: any) => {
    changeHandle && changeHandle(val);
    form && form.setFieldsValue({
      [name]: val
    });
  };

  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      {...formItemConfig}>
      <Employees
        {...config}
        allowClear={allowClear}
        placeholder={placeholder}
        onChange={onChange}
        finallyData={finallyData}/>
    </Form.Item>
  );
};

export default FormEmployees;

