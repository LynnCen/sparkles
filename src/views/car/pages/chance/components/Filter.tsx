import React, { useEffect, useState } from 'react';

import FormSearch from '@/common/components/Form/SearchForm';
import FormInput from '@/common/components/Form/FormInput';
import FormProvinceList from '@/common/components/FormBusiness/FormProvinceList';
import FormSelect from '@/common/components/Form/FormSelect';
import FormRangePicker from '@/common/components/Form/FormRangePicker';
import FormInputNumberRange from '@/common/components/Form/FormInputNumberRange';
import { chancePointSelection } from '@/common/api/storemanage';
import dayjs from 'dayjs';

interface IProps {
  onSearch: (values?: any) => void;
}

interface RangeProps {
  min: string | number,
  max: string | number,
}

const Filter: React.FC<IProps> = ({
  onSearch,
}) => {
  const [options, setOptions] = useState<{ locationShopCategory: any[]; locationShopApproveStatus: any[] }>({
    locationShopCategory: [],
    locationShopApproveStatus: [],
  });
  useEffect(() => {
    (async () => {
      const result = await chancePointSelection({
        keys: ['shopStatus', 'shopCategory'],
      });
      setOptions({
        locationShopCategory: result.shopCategory,
        locationShopApproveStatus: result.shopStatus,
      });
    })();
  }, []);
  const onFinish = (values: any) => {
    console.log(values);
    const params: any = {
      ...values,
      ...((Array.isArray(values?.cityId) &&
        values?.cityId.length && { provinceId: values.cityId[0], cityId: values.cityId[1] }) || {
        provinceId: undefined,
        // cityId: undefined,
      }),
      ...((values?.contractDateStart && {
        contractDateStart: dayjs(values.contractDateStart[0]).format('YYYY-MM-DD'),
        contractDateEnd: dayjs(values.contractDateStart[1]).format('YYYY-MM-DD'),
      }) || { contractDateStart: undefined, contractDateEnd: undefined }),
    };
    const RangeFileds = ['passCost', 'indoorCost', 'stayInfoCost', 'testDriveCost', 'orderCost', 'aveFlow'];
    for (const [key, value] of Object.entries(values)) {
      if (RangeFileds.indexOf(key) > -1) {
        params[`${key}Min`] = value ? (value as RangeProps).min : undefined;
        params[`${key}Max`] = value ? (value as RangeProps).max : undefined;
        params[key] = undefined;
      }
    }
    onSearch(params);
  };

  return (
    <FormSearch onSearch={onFinish} labelLength={7}>
      <FormProvinceList label='所在城市' name='cityId' type={2} />
      <FormInput label='店铺名称' name='keyword' />
      <FormSelect
        label='门店类型'
        name='shopCategory'
        options={options.locationShopCategory}
        config={{ fieldNames: { label: 'name', value: 'id' }, allowClear: true }}
      />
      <FormRangePicker label='营业日期' name='contractDateStart' />
      <FormInputNumberRange
        label='单位过店成本'
        min={0}
        max={10000000}
        name='passCost'
        addonAfter='元'
      />
      <FormInputNumberRange
        label='单位进店成本'
        min={0}
        max={10000000}
        name='indoorCost'
        addonAfter='元'
      />
      <FormInputNumberRange
        label='单位留资成本'
        min={0}
        max={10000000}
        name='stayInfoCost'
        addonAfter='元'
      />
      <FormInputNumberRange
        label='单位试驾成本'
        min={0}
        max={10000000}
        name='testDriveCost'
        addonAfter='元'
      />
      <FormInputNumberRange
        label='单位大定成本'
        min={0}
        max={10000000}
        name='orderCost'
        addonAfter='元'
      />
      <FormInputNumberRange label='日均客流' min={0} max={10000000} name='aveFlow' addonAfter='人次' />
    </FormSearch>
  );
};

export default Filter;
