import React from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import FormInput from '@/common/components/Form/FormInput';

const ChooseUserFilter: React.FC<any> = ({ onSearch }) => {
  const onFinish = (values) => {
    onSearch(values);
  };

  return (
    <FormSearch labelLength={4} onSearch={onFinish} labelAlign='left' colon={false}>
      <FormInput
        label=''
        name='keyword'
        placeholder='请输入接手员工的姓名或者手机号'
        config={{ allowClear: true, style: { width: 300 } }}
      />
    </FormSearch>
  );
};

export default ChooseUserFilter;
