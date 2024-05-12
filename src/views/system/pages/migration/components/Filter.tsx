import React from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';

const Filter: React.FC<any> = ({ onSearch }) => {
  const onFinish = (values) => {
    onSearch(values);
  };

  return (
    <FormSearch labelLength={5} onSearch={onFinish} colon={false}>
      <V2FormInput label='员工手机号' name='phone' />
      <V2FormInput label='员工姓名' name='name' />
      <V2FormSelect
        label='状态'
        name='jobStatus'
        options={[
          { label: '在职', value: 3 },
          { label: '离职', value: 4 },
        ]}
      />
    </FormSearch>
  );
};

export default Filter;
