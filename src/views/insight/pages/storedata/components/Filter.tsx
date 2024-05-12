import React from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';

interface IProps {
  onSearch: (values?: any) => void;
}

const Filter: React.FC<IProps> = ({ onSearch }) => {
  const onFinish = (values) => {
    onSearch(values);
  };

  return (
    <FormSearch labelLength={4} onSearch={onFinish} className='mb-14'>
      <V2FormProvinceList
        label='省市区'
        name='pcdIds'
        placeholder='请选择省市/省市区'
        config={{
          changeOnSelect: true,
        }}
      />
      <V2FormInput
        label='店铺名称'
        name='name'
        maxLength={10}
      />
      <V2FormRangePicker label='营业时间' name='createdAtMin' />
      <V2FormSelect
        label='店铺类型'
        name='type'
        allowClear
        options={[
          { value: '商超店', label: '商超店' },
          { value: '街边店', label: '街边店' },
        ]}
      />
    </FormSearch>
  );
};

export default Filter;
