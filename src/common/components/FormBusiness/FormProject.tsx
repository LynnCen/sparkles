/**
 * 邻汇吧项目列表
 */
import React from 'react';
import { Form } from 'antd';
import { SelectProps } from 'antd/es/select';
import { DefaultFormItemProps } from '@/common/components/Form/ts-config';
import Project from '@/common/components/Select/Project';

export interface FormUserListProps {
  form?: any;
  placeholder?: string;
  allowClear?: boolean;
  extraParams?: any;
  config?: SelectProps;
}

const FormProject: React.FC<FormUserListProps & DefaultFormItemProps> = ({
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
      <Project
        {...config}
        extraParams={extraParams}
        allowClear={allowClear}
        placeholder={placeholder}
      />
    </Form.Item>
  );
};

export default FormProject;
