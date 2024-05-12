import React from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import FormInput from '@/common/components/Form/FormInput';
import FormSelect from '@/common/components/Form/FormSelect';
import FormProvinceList from '@/common/components/FormBusiness/FormProvinceList';
import FormRangePicker from '@/common/components/Form/FormRangePicker';

interface IProps {
  onSearch: (values?: any) => void;
}

const Filter: React.FC<IProps> = ({ onSearch }) => {
  const onFinish = (values) => {
    onSearch(values);
  };

  return (
    <FormSearch labelLength={4} onSearch={onFinish} className='mb-14'>
      <FormProvinceList
        label='省市区'
        name='pcdIds'
        placeholder='请选择省市/省市区'
        config={{
          allowClear: true,
          changeOnSelect: true,
        }}
      />
      <FormInput
        label='店铺名称'
        name='name'
        maxLength={10}
        config={{
          allowClear: true,
        }}
      />
      <FormRangePicker label='营业时间' name='createdAtMin' />
      <FormSelect
        label='店铺类型'
        name='type'
        allowClear
        config={{ fieldNames: { label: 'name', value: 'id' }, allowClear: true }}
        options={[
          { id: '商超店', value: '商超店' },
          { id: '街边店', value: '街边店' },
        ]}
      />
    </FormSearch>
  );
};

export default Filter;
