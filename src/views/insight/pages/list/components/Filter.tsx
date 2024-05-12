import React from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';

interface IProps {
  onSearch: (values?: any) => void;
}

const Filter: React.FC<IProps> = ({ onSearch }) => {
  const onFinish = (values) => {
    onSearch(values);
  };

  return (
    <FormSearch labelLength={4} onSearch={onFinish} className='mb-14'>
      <V2FormInput
        label='洞察编号'
        name='no'
        maxLength={10}
      />
      <V2FormRangePicker label='洞察时间' name='timeMin' />
    </FormSearch>
  );
};

export default Filter;
