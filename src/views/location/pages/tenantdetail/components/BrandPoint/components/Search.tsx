/**
 * @Description 搜索框
 */

import { FC } from 'react';
import SearchForm from '@/common/components/SearchForm';
import FormInput from '@/common/components/Form/FormInput';
import FormThreeLevelIndustry from '@/common/components/FormBusiness/FormThreeLevelIndustry';

const Search:FC<any> = ({
  form,
  onSearch
}) => {

  return (
    <SearchForm
      moreBtn={false}
      form={form}
      onSearch={onSearch}
    >
      <FormInput
        label='品牌名称'
        name='name'
        allowClear
      />

      <FormThreeLevelIndustry
        label='所属行业'
        name='industryIds'
        allowClear
        config={{
          changeOnSelect: true,
          showSearch: true,
          maxTagCount: 'responsive'
        }}
        placeholder='请选择行业'
        twoLevel
      />

    </SearchForm>
  );
};

export default Search;
