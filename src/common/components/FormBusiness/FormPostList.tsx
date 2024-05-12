/**
 * 表单项用户列表
 */
import React from 'react';
import { Form } from 'antd';
import { SelectProps } from 'antd/es/select';
import { DefaultFormItemProps } from '@/common/components/Form/ts-config';
import PostList from '@/common/components/Select/PostList';

export interface FormPostListProps {
  placeholder?: string;
  allowClear: boolean;
  extraParams?: any;
  config?: SelectProps;
  onChange?: Function;
}

const FormPostList: React.FC<FormPostListProps & DefaultFormItemProps> = ({
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
    <Form.Item name={name} label={label} rules={rules} {...formItemConfig}>
      <PostList {...config} extraParams={extraParams} allowClear={allowClear} placeholder={placeholder} />
    </Form.Item>
  );
};

export default FormPostList;
