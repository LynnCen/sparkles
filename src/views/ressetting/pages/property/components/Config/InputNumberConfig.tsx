import { DoubleInputNumber } from '@/common/components';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Radio } from 'antd';
import React from 'react';

const InputNumberConfig: React.FC<{ csName: string }> = ({ csName }) => {
  return (
    <>
      <Form.Item
        name={[csName, 'placeholder']}
        label='默认提示语'
        rules={[{ required: false, message: '请填写输入框默认提示语' }]}
      >
        <Input placeholder='请填写输入框默认提示语' />
      </Form.Item>

      {/* <Form.Item
        name={[csName, 'addonAfter']}
        label='输入框后缀'
        rules={[{ required: false, message: '请填写输入框后缀' }]}
      >
        <Input placeholder='请填写输入框后缀' />
      </Form.Item> */}
      <Form.Item name={[csName, 'decimals']} label='小数点位数'>
        <Radio.Group>
          <Radio value={0}>0位</Radio>
          <Radio value={1}>1位</Radio>
          <Radio value={2}>2位</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label='输入框后缀'>
      <Form.List name={[csName, 'suffixOptionList']}>
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
                <MinusCircleOutlined style={{color: '#ACB4C7'}} onClick={() => remove(field.name)} />
              </Form.Item>
            ))}
            <Form.Item>
              <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined/>} style={{ width: '90%', color: '#006AFF', borderColor: '#006AFF' }}>
                新增输入框后缀
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      </Form.Item>
      <Form.Item name={[csName, 'range']} label='输入范围' help='输入范围“x~y“'>
        <DoubleInputNumber unit='' precision={2}/>
      </Form.Item>
    </>
  );
};
export default InputNumberConfig;
