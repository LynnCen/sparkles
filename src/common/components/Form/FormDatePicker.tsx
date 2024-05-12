import { FC } from 'react';
import { Form, DatePicker } from 'antd';
import { FormDatePickerProps } from './ts-config';

const FormDatePicker: FC<FormDatePickerProps> = ({
  label,
  name,
  rules,
  noStyle = false,
  formItemConfig,
  config,
  placeholder = `${label || ''}`,
}) => {
  return (
    <Form.Item noStyle={noStyle} name={name} label={label} rules={rules} {...formItemConfig}>
      <DatePicker style={{ width: '100%' }} placeholder={placeholder} {...config} />
    </Form.Item>
  );
};

export default FormDatePicker;
