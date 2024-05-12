import React from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { useOptions } from '@/views/longerpoppupshop/hooks';
import { FilterParmas } from '../ts-config';

interface IProps {
  onSearch: (values: FilterParmas) => void;
  isAsics?: boolean;
}

const Filter: React.FC<IProps> = ({ onSearch }) => {
  const OPTIONS = useOptions();

  const onFinish = (values) => {
    const [provinceId, cityId, districtId] = values.addressArr || [];
    const params: FilterParmas = {
      ...values,
      provinceId,
      cityId,
      districtId,
    };
    onSearch(params);
  };

  return (
    <FormSearch onSearch={onFinish} labelLength={7}>
      <V2FormProvinceList label='省市区' name='addressArr' />
      <V2FormInput label='场地名称' name='placeName'/>
      <V2FormSelect label='工作日客流' name='flowWeekdaySelectId' options={OPTIONS.flowWeekdaySelectId} />
      <V2FormSelect label='节假日客流' name='flowWeekendSelectId' options={OPTIONS.flowWeekendSelectId} />
    </FormSearch>
  );
};

export default Filter;
