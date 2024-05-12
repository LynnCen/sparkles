import React, { useEffect, useState } from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import FormInputNumberRange from '@/common/components/Form/FormInputNumberRange';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import dayjs from 'dayjs';
import { chancePointSelection, chancePointAsicsSelection } from '@/common/api/storemanage';
import { refactorSelection } from '@/common/utils/ways';

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
  const [options, setOptions] = useState<{ locationShopCategory: any[]; locationShopApproveStatus: any[] }>({
    locationShopCategory: [],
    locationShopApproveStatus: [],
  });
  useEffect(() => {
    (async () => {
      const getSelection = isAsics ? chancePointAsicsSelection : chancePointSelection;
      const result = await getSelection({
        keys: ['shopStatus', 'shopCategory'],
      });
      setOptions({
        locationShopCategory: result.shopCategory,
        locationShopApproveStatus: result.shopStatus,
      });
    })();
  }, [isAsics]);
  const onFinish = (values) => {
    const params = {
      ...values,
      ...((Array.isArray(values?.cityId) &&
        values?.cityId.length && { provinceId: values.cityId[0], cityId: values.cityId[1] }) || {
        provinceId: undefined,
        // cityId: undefined,
      }),
      ...((values?.createdAtMin && {
        createdAtMin: dayjs(values.createdAtMin[0]).format('YYYY-MM-DD'),
        createdAtMax: dayjs(values.createdAtMin[1]).format('YYYY-MM-DD'),
      }) || { createdAtMin: undefined, createdAtMax: undefined }),
      ...((values.guaranteedSaleMin && {
        guaranteedSaleMin: values.guaranteedSaleMin.min,
        guaranteedSaleMax: values.guaranteedSaleMin.max,
      }) || {
        guaranteedSaleMin: undefined,
        guaranteedSaleMax: undefined,
      }),
      ...((values.flowWeekdayMin && { flowWeekdayMin: values.flowWeekdayMin.min, flowWeekdayMax: values.flowWeekdayMin.max }) || {
        flowWeekdayMin: undefined,
        flowWeekdayMax: undefined,
      }),
      ...((values.flowWeekendMin && { flowWeekendMin: values.flowWeekendMin.min, flowWeekendMax: values.flowWeekendMin.max }) || {
        flowWeekendMin: undefined,
        flowWeekendMax: undefined,
      }),
    };
    onSearch(params);
  };

  return (
    <FormSearch onSearch={onFinish} labelLength={7}>
      <V2FormProvinceList label='所在城市' name='cityId' type={2} />
      <V2FormInput label='店铺名称' name='keyword' />
      <V2FormSelect label='店铺类型' name='shopCategory' options={refactorSelection(options.locationShopCategory)}/>
      <V2FormInput label='责任人' name='responsibleName' />
      <V2FormRangePicker label='创建日期' name='createdAtMin' />
      {/* 未来请使用 V2FormRangeInput，而不是FormInputNumberRange */}
      <FormInputNumberRange
        // label={isBabyCare ? '预计销售额' : '保本销售额'}
        label='保本销售额'
        min={0}
        max={10000000}
        name='guaranteedSaleMin'
        addonAfter='元'
      />
      {/* 未来请使用 V2FormRangeInput，而不是FormInputNumberRange */}
      <FormInputNumberRange label='工作日日均客流' min={0} max={10000000} name='flowWeekdayMin' addonAfter='人次' />
      {/* 未来请使用 V2FormRangeInput，而不是FormInputNumberRange */}
      <FormInputNumberRange label='节假日日均客流' min={0} max={10000000} name='flowWeekendMin' addonAfter='人次' />
    </FormSearch>
  );
};

export default Filter;
