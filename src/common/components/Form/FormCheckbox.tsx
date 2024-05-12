import { Checkbox, Form } from 'antd';
import { FC } from 'react';
import { FormCheckboxProps } from './ts-config';

const FormCheckbox: FC<FormCheckboxProps> = ({
  label,
  name,
  rules,
  noStyle = false,
  formItemConfig,
  initialValue,
  config,
}) => {
  return (
    <Form.Item noStyle={noStyle} initialValue={initialValue} name={name} label={label} rules={rules} {...formItemConfig}>
      <Checkbox.Group {...config} />
    </Form.Item>
  );
};

export default FormCheckbox;
