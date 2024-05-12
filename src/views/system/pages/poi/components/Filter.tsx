import React from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import styles from '../entry.module.less';

const Filter: React.FC<any> = ({ onSearch }) => {

  return (
    <div className={styles.filter}>
      <FormSearch labelLength={5} onSearch={onSearch}>
        <V2FormInput label='关键词' placeholder='请输入' name='name' maxLength={10} />
      </FormSearch>
    </div>
  );
};

export default Filter;
