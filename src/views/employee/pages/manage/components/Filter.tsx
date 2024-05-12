import React from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import FormInput from '@/common/components/Form/FormInput';
import { FilterProps } from '../ts-config';
import styles from './index.module.less';

const Filter: React.FC<FilterProps> = ({ onSearch }) => {
  return (
    <FormSearch labelLength={5} onSearch={onSearch} className={styles.searchForm}>
      <FormInput label='搜索关键词' placeholder='输入员工姓名或电话' name='keyword' />
    </FormSearch>
  );
};

export default Filter;
