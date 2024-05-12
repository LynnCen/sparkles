import React from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
const Filter: React.FC<any> = ({ onSearch }) => {
  const onFinish = (values) => {
    onSearch(values);
  };

  return (
    <FormSearch labelLength={4} onSearch={onFinish} labelAlign='left' colon={false}>
      <V2FormInput label='公司名称' name='name' />
    </FormSearch>
  );
};

export default Filter;
