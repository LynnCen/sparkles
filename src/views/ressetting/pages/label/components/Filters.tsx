import React from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';

const Filters: React.FC<any> = ({ onSearch }) => {
  return (
    <>
      <FormSearch onSearch={onSearch} labelLength={4}>
        <V2FormInput label='标签' name='labelKeyWord' placeholder='请输入标签名称/编号/标识'/>
        <V2FormInput label='标签分类' name='keyWord' placeholder='请输入标签分类进行搜索'/>
      </FormSearch>
    </>
  );
};
export default Filters;
