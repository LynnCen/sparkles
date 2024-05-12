import React from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import FormInput from '@/common/components/Form/FormInput';
import FormProvinceList from '@/common/components/FormBusiness/FormProvinceList';
import FormSelect from '@/common/components/Form/FormSelect';
import FormRangePicker from '@/common/components/Form/FormRangePicker';

const Filter: React.FC<any> = () => {
  const constructOptions = [
    { label: '待交房', value: 1 },
    { label: '筹建中', value: 2 },
    { label: '已开业', value: 3 },
  ];
  const progressOptions = [
    { label: '进度正常', value: 1 },
    { label: '进度延迟', value: 2 },
  ];
  return (
    <FormSearch labelLength={5} colon={false}>
      <FormProvinceList label='所在城市' name='cityId' type={2} />
      <FormInput label='门店名称' name='storeName' />
      <FormSelect label='筹建状态' name='constructState' options={constructOptions} config={{ allowClear: true }} />
      <FormInput label='筹建负责人' name='personInCharge' />
      <FormRangePicker label='交房日起' name='handoverDate' />
      <FormRangePicker label='计划开业时间' name='planDate' />
      <FormSelect label='进度状态' name='progressState' options={progressOptions} config={{ allowClear: true }} />
    </FormSearch>
  );
};

export default Filter;
