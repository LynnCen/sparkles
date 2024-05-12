import FormCheckbox from '@/common/components/Form/FormCheckbox';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import React from 'react';

const OptionsConfig: React.FC<any> = ({csName}) => {
  return (
    <div>
      <FormCheckbox name={csName} config={{
            options: [{value: 'withInput', label:'在所有选项后添加输入框'}, {value: 'withOther', label:'添加“其他”选项'}]
          }}/>
      <Form.List name='propertyOptionList'>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <Form.Item required={false} key={field.key}>
                <Form.Item
                  {...field}
                  rules={[{ required: true, message: '请输入选项名称' }]}
                  noStyle
                  name={[field.name, 'name']}
                >
                  <Input placeholder='请输入选项名称' style={{ width: '90%', marginRight: 5, marginBottom: 5 }} />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(field.name)} />
              </Form.Item>
            ))}
            <Form.Item>
              <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />} style={{ width: '90%' }}>
                新增选项
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </div>
  );
};
export default OptionsConfig;
