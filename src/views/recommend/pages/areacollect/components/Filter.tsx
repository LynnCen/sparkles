import React from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import FormInput from '@/common/components/Form/FormInput';

interface IProps {
  onSearch: (values?: any) => void;
}

const Filter: React.FC<IProps> = ({ onSearch }) => {
  return (
    <FormSearch onSearch={onSearch} labelLength={4} colon={false}>
      <FormInput label='区域名称' name='keyword' />
    </FormSearch>
  );
};

export default Filter;
