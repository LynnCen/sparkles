import { FC } from 'react';
import { Form, Switch } from 'antd';
import { FormSwitchProps } from './ts-config';

const FormSwitch: FC<FormSwitchProps> = ({
  label,
  name,
  rules,
  noStyle = false,
  valuePropName,
  initialValue,
  formItemConfig,
  config,
}) => {
  return (
    <Form.Item
      noStyle={noStyle}
      name={name}
      label={label}
      rules={rules}
      valuePropName={valuePropName}
      initialValue={initialValue}
      {...formItemConfig}
    >
      <Switch {...config} />
    </Form.Item>
  );
};

export default FormSwitch;
