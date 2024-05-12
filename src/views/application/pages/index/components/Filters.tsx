import React from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import FormInput from '@/common/components/Form/FormInput';
import { FilterProps } from '../ts-config';

const Filters: React.FC<FilterProps> = ({ onSearch }) => {
  return (
    <FormSearch onSearch={onSearch}>
      <FormInput label='应用名称' name='keyword' />
    </FormSearch>
  );
};

export default Filters;
