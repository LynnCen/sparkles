/* demo:
import FormSizeInput from 'src/common/components/Form/FormSizeInput';

其中 size: [1, 2, 3]

<FormSizeInput
  label='面积'
  name='size'
  formItemConfig={{ className: 'size' }}
  config={{ addonAfter: 'm' }}
  firstConfig={{ placeholder: '长' }}
  middleConfig={{ placeholder: '宽' }}
  lastConfig={{ placeholder: '高' }}
/>
*/
import { FC } from 'react';
import { Form, InputNumber, Input } from 'antd';
import { FormSizeInputProps } from './ts-config';
import styles from './index.module.less';
import { deepCopy } from '@lhb/func';
import { SearchOutlined } from '@ant-design/icons';

const FormSizeInput: FC<FormSizeInputProps> = ({
  label,
  name,
  rules = [],
  useBaseRules,
  placeholder = '请输入',
  max = 9999.99,
  min = 0.01,
  formItemConfig = {},
  config = { addonAfter: <SearchOutlined className='fs-14'/> },
  firstConfig = {},
  middleConfig = {},
  lastConfig = {}
}) => {
  // 如果rules里没有设置 validator，就是用默认 validator;
  const _rules = deepCopy(rules);
  useBaseRules && _rules.push(({ getFieldValue }) => ({
    validator() {
      const min = getFieldValue(name[0]);
      const max = getFieldValue(name[1]);
      if (min <= max) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('请确保后值大于等于前值'));
    },
  }));
  return (
    <Form.Item name={name} label={label} rules={_rules} {...formItemConfig}>
      <Input.Group compact className={styles.formSizeInput}>
        <Form.Item name={[name, 0]} noStyle>
          <InputNumber
            placeholder={placeholder}
            min={min}
            max={max}
            controls={false}
            precision={2}
            formatter={(value: any) => value}
            style={{
              marginRight: '16px'
            }}
            {
              ...config
            }
            {
              ...firstConfig
            }/>
        </Form.Item>
        <Form.Item name={[name, 1]} noStyle>
          <InputNumber
            placeholder={placeholder}
            min={min}
            max={max}
            controls={false}
            precision={2}
            formatter={(value: any) => value}
            style={{
              marginRight: '16px'
            }}
            {
              ...config
            }
            {
              ...middleConfig
            }/>
        </Form.Item>
        <Form.Item name={[name, 2]} noStyle>
          <InputNumber
            placeholder={placeholder}
            min={min}
            max={max}
            controls={false}
            precision={2}
            formatter={(value: any) => value}
            {
              ...config
            }
            {
              ...lastConfig
            }/>
        </Form.Item>
      </Input.Group>
    </Form.Item>
  );
};

export default FormSizeInput;
