
import { FC, useMemo } from 'react';
import { Form, Checkbox } from 'antd';
import { FormCheckboxGroupProps } from './ts-config';

const FormCheckboxGroup: FC<FormCheckboxGroupProps> = ({
  label,
  name,
  initialValue = [],
  rules = [],
  options = [],
  fieldNames = {
    label: 'name',
    value: 'id'
  },
  formItemConfig = {},
  config = {},
  onChange
}) => {
  const formatOptions = useMemo(() => {
    return options.map((option: any) => {
      return {
        label: option[fieldNames.label],
        value: option[fieldNames.value], // .toString(),
        disabled: option?.disabled || false
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      initialValue={initialValue}
      {...formItemConfig}>
      <Checkbox.Group
        options={formatOptions}
        {...config}
        onChange={(e) => onChange && onChange(e)}>
      </Checkbox.Group>
    </Form.Item>
  );
};

export default FormCheckboxGroup;

