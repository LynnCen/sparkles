import { FC } from 'react';
import { Form, InputNumber } from 'antd';
import { FormInputNumberProps } from './ts-config';

const FormInputNumber: FC<FormInputNumberProps> = ({
  label,
  name,
  rules = [],
  placeholder = '请输入',
  max,
  min,
  precision = 2,
  formItemConfig = {},
  config = {}
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      {
        ...formItemConfig
      }
    >
      <InputNumber
        placeholder={placeholder}
        min={min}
        max={max}
        precision={precision}
        style={{ width: '100%' }}
        {
          ...config
        }/>
    </Form.Item>
  );
};

export default FormInputNumber;
