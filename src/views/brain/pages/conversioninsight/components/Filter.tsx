import React from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import FormInput from '@/common/components/Form/FormInput';
import FormRangePicker from '@/common/components/Form/FormRangePicker';

interface IProps {
  onSearch: (values?: any) => void;
}

const Filter: React.FC<IProps> = ({ onSearch }) => {
  const onFinish = (values) => {
    onSearch(values);
  };

  return (
    <FormSearch labelLength={4} onSearch={onFinish}>
      <FormInput
        label='洞察编号'
        name='no'
        maxLength={10}
        config={{
          allowClear: true,
        }}
      />
      <FormRangePicker label='洞察时间' name='timeMin' />
    </FormSearch>
  );
};

export default Filter;
