/**
 * 租户列表
 */
import React from 'react';
import { DefaultFormItemProps } from '@/common/components/Form/ts-config';
import { Form } from 'antd';
import Tenant from '@/common/components/Select/Tenant';
import { SelectProps } from 'antd/es/select';

interface FormTenantProps {
  form?: any;
  placeholder?: string;
  allowClear: boolean;
  extraParams?: any;
  config?: SelectProps;
  onChange?: Function;
  changeHandle?: Function; // 映射select的onChange
  enableNotFoundNode?: boolean;
  keyword?: string;
}

const FormTenant: React.FC<FormTenantProps & DefaultFormItemProps> = ({
  name,
  label,
  rules,
  form,
  placeholder,
  allowClear = false,
  formItemConfig = {},
  config = {},
  changeHandle,
  enableNotFoundNode = false,
  keyword,
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
      <Tenant
        {...config}
        allowClear={allowClear}
        placeholder={placeholder}
        onChange={onChange}
        enableNotFoundNode={enableNotFoundNode}
        keyword={keyword}
      />
    </Form.Item>
  );
};

export default FormTenant;
