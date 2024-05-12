import React from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import FormInput from '@/common/components/Form/FormInput';
import FormDatePicker from '@/common/components/Form/FormDatePicker';
import styles from '../entry.module.less';

interface FilterProps {
  onSearch: Function;
}

const Filter: React.FC<FilterProps> = ({ onSearch }) => {
  return (
    <FormSearch className={styles.formSearch} labelLength={6} onSearch={onSearch}>
      <FormInput label='任务码' name='projectCode' />
      <FormDatePicker label='踩点日期' name='checkDate' config={{ style: { width: '100%' }, allowClear: true }} />
      <FormInput label='踩点项目名称' name='name' />
    </FormSearch>
  );
};

export default Filter;
