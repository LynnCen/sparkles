import { DeleteOutlined } from '@ant-design/icons';
import { floorKeep } from '@lhb/func';
import { Button, Form, Input, InputNumber, Space } from 'antd';
import React, { useEffect } from 'react';

const DynamicSpecLW: React.FC<any> = ({ propertyId, form }) => {
  const nameValue = Form.useWatch(['propertyList', propertyId], form);
  useEffect(() => {
    if (nameValue === undefined || nameValue.length === 0) {
      form.setFieldsValue({ kaMaxArea: undefined });
    } else {
      let maxArea = -1;
      nameValue.forEach((item) => {
        if (item && item.l && item.w) {
          const result = Number(floorKeep(Number(item.l), Number(item.w), 3, 2));
          if (result > maxArea) {
            maxArea = result;
          }
        }
      });
      if (maxArea > -1) {
        form.setFieldsValue({ kaMaxArea: maxArea });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameValue]);

  return (
    <>
      <Form.Item label='规格' required={true}>
        <Form.List name={['propertyList', propertyId]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align='baseline'>
                  <Form.Item
                    {...restField}
                    name={[name, 'l']}
                    style={{ display: 'inline-block', width: '150px' }}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: '请输入长',
                      },
                    ]}
                    noStyle
                  >
                    <Input placeholder='请输入长' style={{ width: '150px', marginRight: '5px' }} addonAfter='m' />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'w']}
                    style={{ display: 'inline-block', width: '150px' }}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: '请输入宽',
                      },
                    ]}
                    noStyle
                  >
                    <Input placeholder='请输入宽' style={{ width: '150px', marginRight: '5px' }} addonAfter='m' />
                  </Form.Item>
                  <DeleteOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Button type='primary' onClick={() => add()}>
                新增
              </Button>
            </>
          )}
        </Form.List>
      </Form.Item>
      <Form.Item
        label='最大面积'
        name='kaMaxArea'
        rules={[{ required: true, message: '请输入规格' }]}
      >
        <InputNumber placeholder='通过规格自动计算' disabled={true} addonAfter='m²' />
      </Form.Item>
      {/* <FormInputNumber
        label='最大面积'
        name={['propertyList', propertyId, 'kaMaxArea']}
        config={{ style: { width: '180px' }, addonAfter: 'm²', disabled: true }}
        formItemConfig={{
          labelCol: { span: 7 },
        }}
        rules={[{ required: false, message: '请输入规格' }]}
        placeholder='通过规格自动计算'
      /> */}
    </>
  );
};
export default DynamicSpecLW;
