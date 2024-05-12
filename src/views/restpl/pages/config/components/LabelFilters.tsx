import FormInput from '@/common/components/Form/FormInput';
import FormSearch from '@/common/components/Form/SearchForm';
import React from 'react';




const LabelFilters: React.FC<any> = ({ onSearch }) => {

  return (
    <>
      <FormSearch
        onSearch={onSearch}
        labelLength={5}>
        <FormInput
          name='name'
          placeholder='请输入标签名称'
          config={{
            style: { width: 220 }
          }} />
      </FormSearch>
    </>
  );
};

export default LabelFilters;

