import React from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';

const Filters: React.FC<any> = ({ onSearch, filterOptions }) => {
  return (
    <>
      <FormSearch onSearch={onSearch}>
        <V2FormInput label='属性' name='propertyKeyWord' placeholder='请输入属性名称/编号/标识'/>
        <V2FormSelect label='属性分类' name='propertyClassificationId' options={filterOptions}/>
      </FormSearch>
    </>
  );
};

export default Filters;
