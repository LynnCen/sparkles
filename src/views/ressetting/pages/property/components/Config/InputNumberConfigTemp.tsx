/**
 * @Description 数字输入框的模版属性配置
 */
import DoubleInputNumber from '@/common/components/DoubleInputNumber';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { Form } from 'antd';
import React from 'react';

const InputNumberConfig: React.FC<{ csName: string }> = ({ csName }) => {
  return (
    <>
      <V2FormInput
        label="默认提示语"
        name={[csName, 'placeholder']}
      />
      <V2FormSelect
        label="小数点位数"
        name={[csName, 'decimals']}
        options={[{ label: '0位', value: 0 }, { label: '1位', value: 1 }, { label: '2位', value: 2 }]}
        config={{ showSearch: true }}
      />
      <Form.Item name={[csName, 'range']} label='输入范围' help='输入范围“x~y“'>
        <DoubleInputNumber unit='' precision={2}/>
      </Form.Item>
    </>
  );
};
export default InputNumberConfig;
