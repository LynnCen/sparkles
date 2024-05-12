/* 筛选条件 */
import { FC } from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import FormInput from '@/common/components/Form/FormInput';
// import { FilterProps } from '../ts-config';
import styles from '../index.module.less';


interface SearchProps {
  onSearch?: Function; // 筛选项改变-点击查询/重置按钮
}

const Filter: FC<SearchProps> = ({ onSearch }) => {
  return (
    <div className={styles.searchBox}>
      <FormSearch onSearch={(values) => onSearch && onSearch(values)}>
        <FormInput label='任务码' name='projectCode' />
      </FormSearch>
    </div>
  );
};

export default Filter;
