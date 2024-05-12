import React from 'react';
import styles from './index.module.less';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import FormSearch from '@/common/components/Form/SearchForm';
import dayjs from 'dayjs';
import { FilterProps } from '../ts-config';

const Filter: React.FC<FilterProps> = ({ onSearch }) => {
  return (
    <FormSearch onSearch={onSearch} className={styles.searchForm}>
      <V2FormInput label='关键词' name='keyword'/>
      <V2FormRangePicker
        label='时间'
        name='ranges'
        config={{
          ranges: {
            '最近一周': [dayjs().subtract(7, 'day'), dayjs()],
            '最近一个月': [dayjs().subtract(30, 'day'), dayjs()],
            '最近三个月': [dayjs().subtract(30 * 3, 'day'), dayjs()]
          }
        }}
      />
    </FormSearch>
  );
};

export default Filter;
