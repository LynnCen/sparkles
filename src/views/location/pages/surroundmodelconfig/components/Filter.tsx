import React from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import FormInput from '@/common/components/Form/FormInput';
import styles from '../entry.module.less';

const Filter: React.FC<any> = ({ onSearch, searchForm }) => {

  return (
    <FormSearch className={styles.formSearch} labelLength={4} onSearch={onSearch} form={searchForm}>
      <FormInput label='模型名称' name='name' />
    </FormSearch>
  );
};

export default Filter;
