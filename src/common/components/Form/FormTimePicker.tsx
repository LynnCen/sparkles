// 时间选择器
import { FC } from 'react';
import { Form, TimePicker } from 'antd';
import { DefaultFormItemProps } from './ts-config';
// import { TimePickerProps } from 'antd/lib/time-picker';

interface FormTimePickerProps extends DefaultFormItemProps {
  placeholder?: string;
  rules?: Array<any>;
  disabled?: boolean;
  format?: string;
  config?: any;
}

const FormTimePicker: FC<FormTimePickerProps> = ({
  label,
  name,
  rules,
  formItemConfig,
  format = 'HH:mm',
  disabled = false,
  config,
}) => {
  return (
    <Form.Item name={name} label={label} rules={rules} {...formItemConfig}>
      <TimePicker
        format={format}
        disabled={disabled}
        {...config}/>
    </Form.Item>
  );
};

export default FormTimePicker;
