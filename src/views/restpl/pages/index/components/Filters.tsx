import React from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';

const resTypeList = [
  { label: '场地', value: 0 },
  { label: '点位', value: 1 },
  { label: '供给', value: 2 },
];

const useTypeList = [
  { label: '资源中心', value: 0 },
  { label: 'PMS', value: 1 },
  { label: 'LOCATION', value: 2 },
  { label: '客流宝', value: 3 },
  { label: 'KA', value: 4 },
];

const Filters: React.FC<any> = ({ onSearch }) => {
  return (
    <>
      <FormSearch onSearch={onSearch}>
        <V2FormInput name='name' label='类目模版' />
        <V2FormSelect name='resourcesType' label='资源类型' options={resTypeList}/>
        <V2FormSelect name='useType' label='渠道' options={useTypeList}/>
      </FormSearch>
    </>
  );
};

export default Filters;

