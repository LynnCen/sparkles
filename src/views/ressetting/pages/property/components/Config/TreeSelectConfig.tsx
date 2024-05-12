import FormSelect from '@/common/components/Form/FormSelect';
import { post } from '@/common/request';
import { Form, Radio } from 'antd';
import React, { useEffect, useState } from 'react';

const TreeSelectConfig: React.FC<{ csName: string }> = ({ csName }) => {
  const [options, setOptions] = useState<any[]>([]);

  const getDropDownList = async() => {
    const options =  await post('/dropDownList/dataOrigin/list');
    setOptions(options);
  };

  useEffect(() => {
    getDropDownList();
  },[])
  return (
    <>
      <Form.Item name={[csName, 'multiple']} label='支持选择' rules={[{required: true}]}>
        <Radio.Group>
          <Radio value={0}>单选</Radio>
          <Radio value={1}>多选</Radio>
        </Radio.Group>
      </Form.Item>
      <FormSelect   
       name={[csName, 'dataOrigin']}
        label='数据来源'
        options={options}
        config={{fieldNames: {label: 'name'}}}
        rules={[{ required: true, message: '请选择数据源' }]}/>
    </>
  );
};
export default TreeSelectConfig;
