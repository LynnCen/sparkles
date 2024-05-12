/* demo:
import FormRadio from '@/common/components/Form/FormRadio';

<FormRadio
  name='show'
  label='是否可见'
  options={options.true_or_false}
  rules={[{ required: true }]}
/>
*/
import { FC } from 'react';
import { Form, Radio } from 'antd';
import { FormRadioProps } from './ts-config';

const FormRadio: FC<FormRadioProps> = ({
  label,
  name,
  initialValue = undefined,
  rules = [],
  options = [],
  optionType = 'default',
  formItemConfig = {},
  config = {},
  onChange,
}) => {
  return (
    <Form.Item name={name} label={label} rules={rules} initialValue={initialValue} {...formItemConfig}>
      <Radio.Group
        options={options}
        optionType={optionType}
        onChange={(e) => onChange && onChange(e)}
        {...config}
      ></Radio.Group>
    </Form.Item>
  );
};

export default FormRadio;
