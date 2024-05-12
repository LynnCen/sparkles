import React from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import FormInputNumberRange from '@/common/components/Form/FormInputNumberRange';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { data } from '../ts-config';
const handleOption = (options: Array<string>) => {
  return Array.from(new Set(options)).map((item) => ({ label: item, value: item }));
};

const joinNameOptions: any = handleOption(data.map((item) => item.joinName));
const feeStatusOptions: any = handleOption(data.map((item) => item.feeStatus));
const currentStatusOptions: any = handleOption(data.map((item) => item.currentStatus));

const Filter: React.FC<any> = ({ onSearch }) => {
  const onFinish = (values) => {
    onSearch(values);
  };

  return (
    <FormSearch labelLength={5} onSearch={onFinish} labelAlign='right' colon={false}>
      <V2FormSelect label='加盟商姓名' name='joinName' options={joinNameOptions} />
      {/* 未来请使用 V2FormRangeInput，而不是FormInputNumberRange */}
      <FormInputNumberRange label='落位周期' min={0} max={10000000} name='locationDays' addonAfter='天' />
      <V2FormProvinceList label='意向城市' name='joinCity' type={2} />
      <V2FormSelect label='当前状态' name='currentStatus' options={currentStatusOptions} />
      <V2FormSelect label='选址费收取' name='feeStatus' options={feeStatusOptions} />
      <V2FormRangePicker label='加盟日期' name='joinDate' />
      <V2FormInput label='选址责任人' name='responsibleName' />
    </FormSearch>
  );
};

export default Filter;
