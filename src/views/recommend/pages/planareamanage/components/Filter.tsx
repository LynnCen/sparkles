import React from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import FormInput from '@/common/components/Form/FormInput';
import FormSelect from '@/common/components/Form/FormSelect';

interface IProps {
  onSearch: (values?: any) => void;
}

const Filter: React.FC<IProps> = ({ onSearch }) => {
  const onFinish = (values) => {
    onSearch(values);
  };

  return (
    <FormSearch labelLength={4} onSearch={onFinish} className='mb-14'>
      <FormInput label='门店名称' name='keyword' />
      <FormSelect
        label='当前阶段'
        name='period'
        config={{ fieldNames: { label: 'name', value: 'id' }, allowClear: true }}
        options={[
          { id: '已踩点', value: '已踩点' },
          { id: '机会点', value: '机会点' },
          { id: '装修中', value: '装修中' },
          { id: '已开业', value: '已开业' },
        ]}
      />
    </FormSearch>
  );
};

export default Filter;
