import React from 'react'; // { useEffect, useState }
import styles from '../../../entry.module.less';
import FormInput from '@/common/components/Form/FormInput';
import SearchForm from '@/common/components/Form/SearchForm';

const Search: React.FC<{ change: Function, searchRef: any }> = ({ change, searchRef }) => {
  return (
    <SearchForm
      onRef={searchRef}
      onSearch={change}
      className={styles.searchCon}>
      <FormInput
        label='关键词'
        name='keyword'
        placeholder='请输入关键词查询'/>
    </SearchForm>
  );
};

export default Search;
