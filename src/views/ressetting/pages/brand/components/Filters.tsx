import React from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';

const Filters: React.FC<any> = ({ onSearch }) => {
  return (
    <FormSearch onSearch={onSearch} labelLength={5}>
      <V2FormInput label='品牌名称' name='name' />
    </FormSearch>
  );
};

export default Filters;
