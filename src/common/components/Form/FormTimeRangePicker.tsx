// 时间范围选择器
// TODO FormTimeRangePicker
import { FC } from 'react';
import { Form, TimePicker } from 'antd';
import { DefaultFormItemProps } from './ts-config';
// import { TimePickerProps } from 'antd/lib/time-picker';

const { RangePicker } = TimePicker;

interface FormTimeRangePickerProps extends DefaultFormItemProps {
  placeholder?: string;
  rules?: Array<any>;
  disabled?: boolean;
  format?: string;
  config?: any;
}

const FormTimeRangePicker: FC<FormTimeRangePickerProps> = ({
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
      <RangePicker
        format={format}
        disabled={disabled}
        {...config}/>
    </Form.Item>
  );
};

export default FormTimeRangePicker;
