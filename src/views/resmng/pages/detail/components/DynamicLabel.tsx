import FormSelect from '@/common/components/Form/FormSelect';
import React from 'react';

const DynamicLabel: React.FC<any> = ({ labelGroup }) => {
  const options =
    labelGroup && labelGroup.labelResponseList
      ? labelGroup.labelResponseList.map((label) => ({
        label: label.name,
        value: label.id,
      }))
      : [];
  return (
    <>
      <FormSelect
        mode='multiple'
        label={labelGroup.name}
        name={['labelList', String(labelGroup.id)]}
        placeholder='请选择标签'
        rules={[{ required: false, message: '请选择标签' }]}
        options={options}
        config={{
          style: { width: '400px' },
        }}
      />
    </>
  );
};
export default DynamicLabel;
