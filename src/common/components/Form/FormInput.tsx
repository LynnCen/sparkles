import { FC } from 'react';
import { Form, Input } from 'antd';
import { FormInputProps } from './ts-config';

const FormInput: FC<FormInputProps> = ({
  label,
  name,
  rules = [],
  placeholder = `请输入${label || ''}`,
  maxLength,
  onClickInput,
  prefix,
  allowClear = false,
  formItemConfig = {},
  config = {},
  removeSpace = false,
}) => {
  // 去除input的前后空格
  const normFile = (e: any) => {
    return e.target.value.replace(/(^\s*)|(\s*$)/g, '');
  };

  const validateNumber = (_, value) => {
    if (typeof value === 'string') {
      // 校验字符串类型的输入的两端空白字符
      if (value && value.trim().length === 0) {
        return Promise.reject('请输入有效的字符串');
      }
    } else if (typeof value === 'number') {
      // 校验数字类型的输入
      if (isNaN(Number(value))) {
        return Promise.reject('请输入有效的数字');
      }
    }

    return Promise.resolve();
  };

  return (
    <Form.Item
      name={name}
      label={label}
      // 如果传入有规则，则默认添加字符串不能为空格的规则
      rules={rules.length ? rules.concat([{ validator: validateNumber }]) : []}
      getValueFromEvent={(removeSpace && normFile) || undefined}
      {...formItemConfig}
    >
      <Input
        maxLength={maxLength}
        prefix={prefix}
        placeholder={placeholder}
        autoComplete={config?.autoComplete || 'off'}
        allowClear={allowClear}
        {...config}
        onClick={() => onClickInput && onClickInput()}
      />
    </Form.Item>
  );
};

export default FormInput;
