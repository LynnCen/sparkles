/**
 * Locxx供应商列表
 */
import React from 'react';
import { Form } from 'antd';
import { SelectProps } from 'antd/es/select';
import { DefaultFormItemProps } from '@/common/components/Form/ts-config';
import LocxxSupplier from '@/common/components/Select/LocxxSupplier';

export interface FormUserListProps {
  form?: any;
  placeholder?: string;
  allowClear?: boolean;
  extraParams?: any;
  config?: SelectProps;
}

const FormLocxxSupplier: React.FC<FormUserListProps & DefaultFormItemProps> = ({
  name,
  label,
  rules,
  placeholder,
  allowClear = false,
  extraParams = {},
  formItemConfig = {},
  config = {},
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      {...formItemConfig}>
      <LocxxSupplier
        {...config}
        extraParams={extraParams}
        allowClear={allowClear}
        placeholder={placeholder}
      />
    </Form.Item>
  );
};

export default FormLocxxSupplier;
