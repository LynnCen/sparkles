/* 筛选条件 */
import { FC } from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import { FilterProps } from '../ts-config';
import styles from './index.module.less';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';

const Filter: FC<FilterProps> = ({ onSearch }) => {
  return (
    <div className={styles.searchBox}>
      <FormSearch onSearch={(values) => onSearch && onSearch(values)}>
        <V2FormInput label='关键词' name='keyword' />
      </FormSearch>
    </div>
  );
};

export default Filter;
