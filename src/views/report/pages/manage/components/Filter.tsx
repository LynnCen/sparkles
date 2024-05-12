import React from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { FilterProps } from '../ts-config';
import styles from './index.module.less';
import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';

const Filter: React.FC<FilterProps> = ({ onSearch, addReport, operateList }) => {
  const { ...methods } = useMethods({
    handleCreateReportTemplate() {
      addReport();
    },
  });

  return (
    <div className={styles.filter}>
      <FormSearch labelLength={5} onSearch={onSearch}>
        <V2FormInput label='搜索关键词' placeholder='输入报表名称' name='keyword' maxLength={10} />
      </FormSearch>
      <Operate operateList={operateList} onClick={(btn) => methods[btn.func]()} />
    </div>
  );
};

export default Filter;
