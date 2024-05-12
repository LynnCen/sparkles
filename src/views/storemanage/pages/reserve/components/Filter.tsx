import React, { useEffect, useState } from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import FormInputNumberRange from '@/common/components/Form/FormInputNumberRange';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import dayjs from 'dayjs';
import { refactorSelection } from '@/common/utils/ways';
import { expandShopSelection, expandShopAsicsSelection } from '@/common/api/common';

interface IProps {
  onSearch: (values?: any) => void;
  isAsics?: boolean
  // isBabyCare?: boolean;
}

const Filter: React.FC<IProps> = ({
  onSearch,
  isAsics = false
  // isBabyCare
}) => {
  const [options, setOptions] = useState<{ locationShopCategory: any[]; locationShopProgress: any[] }>({
    locationShopCategory: [],
    locationShopProgress: [],
  });

  useEffect(() => {
    (async () => {
      const getSelection = isAsics ? expandShopAsicsSelection : expandShopSelection;
      const result = await getSelection({
        keys: ['shopCategory', 'shopStatus'],
      });
      setOptions({
        locationShopCategory: result.shopCategory,
        locationShopProgress: result.shopStatus,
      });
    })();
  }, [isAsics]);

  const onFinish = (values) => {
    const params = {
      ...values,
      ...((Array.isArray(values?.cityId) &&
        values?.cityId.length && { provinceId: values.cityId[0], cityId: values.cityId[1] }) || {
        provinceId: undefined,
        cityId: undefined,
      }),
      ...((values?.openAtStart && {
        openDateMin: dayjs(values.openAtStart[0]).format('YYYY-MM-DD'),
        openDateMax: dayjs(values.openAtStart[1]).format('YYYY-MM-DD'),
      }) || {
        openDateMin: undefined,
        openDateMax: undefined,
      }),
      ...((values.guaranteedSaleMin && {
        guaranteedSaleMin: values.guaranteedSaleMin.min,
        guaranteedSaleMax: values.guaranteedSaleMin.max,
      }) || {
        guaranteedSaleMin: undefined,
        guaranteedSaleMax: undefined,
      }),
    };
    delete params.openAtStart;
    onSearch(params);
  };

  return (
    <FormSearch labelLength={6} onSearch={onFinish}>
      <V2FormProvinceList label='所在城市' name='cityId' type={2} />
      <V2FormInput label='店铺名称' name='keyword' />
      <V2FormSelect label='店铺类型' name='shopCategory' options={refactorSelection(options.locationShopCategory)}/>
      <V2FormSelect label='当前阶段' name='shopStatus' options={refactorSelection(options.locationShopProgress)}/>
      <V2FormInput label='责任人' name='responsibleName' />
      <V2FormRangePicker label='预计开业时间' name='openAtStart' />
      {/* 未来请使用 V2FormRangeInput，而不是FormInputNumberRange */}
      <FormInputNumberRange label='保本销售额' min={0} max={10000000} name='guaranteedSaleMin' addonAfter='元' />
    </FormSearch>
  );
};

export default Filter;
