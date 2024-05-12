import React from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';

const statusOptions = [
  { label: '已启用', value: 1 },
  { label: '已停用', value: 0 },
];

const Filter: React.FC<any> = ({ onSearch }) => {
  return (
    <FormSearch labelLength={2} onSearch={onSearch}>
      <V2FormInput label='搜索' name='templateName' placeholder='模版名' />
      <V2FormSelect label='状态' name='enable' options={statusOptions} />
    </FormSearch>
  );
};

export default Filter;
