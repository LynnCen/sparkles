import { Form, Radio } from 'antd';
import React from 'react';

const TimeConfig: React.FC<{ csName: string }> = ({ csName }) => {
  return (
    <Form.Item name={[csName, 'value']} label='时间类型' rules={[{ required: false, message: '请选择时间类型' }]}>
      <Radio.Group value={1}>
        <Radio value={1}>时间点（年，月，日）</Radio>
        <Radio value={2}>时间点（时，分，秒）</Radio>
        <Radio value={3}>时间段（年，月，日）</Radio>
        <Radio value={4}>时间段（时，分，秒）</Radio>
      </Radio.Group>
    </Form.Item>
  );
};
export default TimeConfig;
