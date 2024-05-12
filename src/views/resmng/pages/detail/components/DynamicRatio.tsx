import FormInputNumber from '@/common/components/Form/FormInputNumber';
import { Form } from 'antd';
import React from 'react';
import { DynamicRatioProps } from '../ts-config';

const DynamicRatio: React.FC<DynamicRatioProps> = ({ value }) => {

  return (
    <div>
      <Form.Item label={value.label}>
        {value.propertyOptionList.map((item) => (
          <FormInputNumber
            key={Math.random()}
            name={[value.name, value.propertyId, String(item.id)]}
            min={0}
            max={100}
            formItemConfig={{
              style: { display: 'inline-block', width: '250px', marginRight: '10px' },
            }}
            config={{
              addonAfter: '%',
              addonBefore: item.name,
              precision: 0,
              placeholder: '所占比例',
            }}
          />
        ))}
      </Form.Item>
    </div>
  );
};
export default DynamicRatio;
