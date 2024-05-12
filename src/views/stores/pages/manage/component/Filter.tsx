import React, { useEffect, useState } from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import { storeSelection } from '@/common/api/store';
import { FilterProps } from '../ts-config';
import styles from './index.module.less';
import { refactorSelection } from '@/common/utils/ways';

const Filter: React.FC<FilterProps> = ({ onSearch }) => {
  const [options, setOptions] = useState<any>({
    status: [],
    deviceStatus: []
  });
  useEffect(() => {
    const loadData = async () => {
      const result = await storeSelection();
      setOptions(result);
    };
    loadData();
  }, []);
  return (
    <FormSearch labelLength={5} onSearch={onSearch} className={styles.searchForm}>
      <V2FormInput label='店铺名称' name='keyword' maxLength={30} />
      <V2FormSelect label='营运状态' name='status' options={refactorSelection(options.status)} />
      <V2FormRangePicker label='营业日期' name='businessDate'/>
      <V2FormSelect label='摄像头状态' name='deviceStatus' options={refactorSelection(options.deviceStatus)}/>
    </FormSearch>
  );
};

export default Filter;
