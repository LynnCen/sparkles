// 表单项-字典选择器
import { FC } from 'react';
import { Form } from 'antd';
import { FormDictionarySelectProps } from './ts-config';
import DictionarySelect from 'src/common/business/DictionarySelect';

const FormDictionarySelect: FC<FormDictionarySelectProps> = ({
  label,
  name,
  rules,
  noStyle = false,
  formItemConfig,
  config,
  placeholder,
}) => {
  return (
    <Form.Item noStyle={noStyle} name={name} label={label} rules={rules} {...formItemConfig}>
      <DictionarySelect placeholder={placeholder} {...config} />
    </Form.Item>
  );
};

export default FormDictionarySelect;
