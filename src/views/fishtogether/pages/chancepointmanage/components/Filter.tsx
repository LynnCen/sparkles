import React, { useEffect, useState } from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import FormInput from '@/common/components/Form/FormInput';
import FormProvinceList from '@/common/components/FormBusiness/FormProvinceList';
import FormSelect from '@/common/components/Form/FormSelect';
import { getYNChancepointSelection } from '@/common/api/fishtogether';
import { Cascader } from 'antd';

interface IProps {
  onSearch: (values?: any) => void;
}

const Filter: React.FC<IProps> = ({
  onSearch,
}) => {
  const [options, setOptions] = useState<{ locationShopCategory: any[] }>({
    locationShopCategory: []
  });
  useEffect(() => {
    (async () => {
      const { data } = await getYNChancepointSelection({
        keys: ['shopCategory'],
      });
      setOptions({
        locationShopCategory: data.shopCategory,
      });
    })();
  }, []);
  const onFinish = (values) => {
    const params = {
      ...values,
      ...(Array.isArray(values?.cityIds) ? { cityIds: values?.cityIds.filter(itm => Array.isArray(itm) && itm.length === 2).map(itm => itm[1]) } : []),
    };
    onSearch(params);
  };

  return (
    <FormSearch onSearch={onFinish} labelLength={7}>
      <FormProvinceList label='所在城市' name='cityIds' type={2} config={{
        multiple: true,
        maxTagCount: 'responsive',
        showCheckedStrategy: Cascader.SHOW_CHILD,
      }}/>
      <FormInput label='机会点名称' name='keyword' />
      <FormSelect
        label='店铺类型'
        name='shopCategories'
        options={options.locationShopCategory}
        config={{
          fieldNames: { label: 'name', value: 'id' },
          allowClear: true,
          mode: 'multiple',
        }}
      />
    </FormSearch>
  );
};

export default Filter;
