// 日期范围选择器
import { FC } from 'react';
import { Form, DatePicker } from 'antd';
import { FormRangePickerProps } from './ts-config';

const { RangePicker } = DatePicker;

const FormRangePicker: FC<FormRangePickerProps> = ({
  label,
  name,
  rules,
  noStyle = false,
  formItemConfig,
  config,
}) => {
  return (
    <Form.Item noStyle={noStyle} name={name} label={label} rules={rules} {...formItemConfig}>
      <RangePicker {...config}/>
    </Form.Item>
  );
};

export default FormRangePicker;
