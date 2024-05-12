import React from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import FormInput from '@/common/components/Form/FormInput';
import FormProvinceList from '@/common/components/FormBusiness/FormProvinceList';
import FormSelect from '@/common/components/Form/FormSelect';
import FormRangePicker from '@/common/components/Form/FormRangePicker';

const Filter: React.FC<any> = () => {
  const progressOptions = [
    { label: '未开始', value: 1 },
    { label: '进行中', value: 2 },
    { label: '已完成', value: 3 },
    { label: '已逾期', value: 4 },
  ];
  return (
    <FormSearch labelLength={4} colon={false}>
      <FormProvinceList label='所在城市' name='cityId' type={2} />
      <FormInput label='门店名称' name='storeName' />
      <FormSelect label='进度状态' name='progressState' options={progressOptions} config={{ allowClear: true }} />
      <FormInput label='负责人' name='personInCharge' />
      <FormRangePicker label='计划时间' name='planDate' />
    </FormSearch>
  );
};

export default Filter;
