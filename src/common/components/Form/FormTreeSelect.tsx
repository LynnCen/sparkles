/* demo:
import FormTreeSelect from 'src/common/components/Form/FormTreeSelect';

注意 FormTreeSelect 回显时，industryIds 入参和出参都是 [{ value: 1, name: '张三' }]

<FormTreeSelect
  label='所属行业'
  name='industryIds'
  treeData={options.industries}
  config={{
    fieldNames: { label: 'name', value: 'id', children: 'children' },
    multiple: true,
    allowClear: true,
    treeCheckable: true,
    treeCheckStrictly: true,
    showCheckedStrategy: TreeSelect.SHOW_ALL,
    maxTagCount: 'responsive'
  }}
  rules={[{ required: true, message: '请选择所属行业' }]}
  placeholder='选择所属行业'
/>
  */

import { FC } from 'react';
import { Form, TreeSelect } from 'antd';
import { FormTreeSelectProps } from './ts-config';

const FormTreeSelect: FC<FormTreeSelectProps> = ({
  label,
  name,
  rules,
  placeholder = '请选择',
  treeData,
  onChange,
  formItemConfig = {},
  config = {}
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      {
        ...formItemConfig
      }
    >
      <TreeSelect
        placeholder={placeholder}
        onChange={(value, label, extra) => onChange && onChange(value, label, extra)}
        treeData={treeData}
        {
          ...config
        }
      />
    </Form.Item>
  );
};

export default FormTreeSelect;
