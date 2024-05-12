/**
 * 表单项用户列表
 */
import React from 'react';
import { Form } from 'antd';
import { SelectProps } from 'antd/es/select';
import { DefaultFormItemProps } from '@/common/components/Form/ts-config';
import { DefaultListData } from '@/common/components/FormBusiness/ts-config';
import { FuzzyProps } from '../Select/Fuzzy';
import RelateThirdparty from '../Select/RelateThirdparty';

export interface FormProps {
  form?: any;
  placeholder?: string;
  allowClear?: boolean;
  extraParams?: any;
  config?: SelectProps & Omit<FuzzyProps, 'loadData'>& DefaultListData;
  onChange?: Function;
}


const FormRelateThirdparty: React.FC<FormProps & DefaultFormItemProps> = ({
  name,
  label,
  rules,
  form,
  placeholder,
  allowClear = false,
  extraParams = {},
  formItemConfig = {},
  config = {}
}) => {
  const onChange = (val: any) => {
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
      <RelateThirdparty
        {...config}
        extraParams={extraParams}
        allowClear={allowClear}
        placeholder={placeholder}
        onChange={onChange}/>
    </Form.Item>
  );
};

export default FormRelateThirdparty;

