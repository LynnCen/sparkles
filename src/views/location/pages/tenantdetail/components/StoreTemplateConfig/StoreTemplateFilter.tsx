import React, { useEffect, useState } from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import FormInput from '@/common/components/Form/FormInput';
import FormSelect from '@/common/components/Form/FormSelect';
import { post } from '@/common/request';
// import { brandList } from '@/common/api/brand';

const Filter: React.FC<any> = ({ tenantId, onSearch }) => {

  // const [brandOptions, setBrandOptions] = useState<any>([]);

  // const typeOptions = [
  //   { label: '室内商铺', value: 1 },
  //   { label: '街铺', value: 2 },
  //   { label: '快闪店', value: 3 }
  // ];

  const statusOptions = [
    { label: '已启用', value: 1 },
    { label: '已停用', value: 0 },
  ];

  const [shopCategoryOptions, setShopCategoryOptions] = useState<any>([]);

  const loadShopCategoryOptions = async () => {
    // https://yapi.lanhanba.com/project/289/interface/api/48999
    const objectList = await post(
      '/dynamic/shopCategory/lists',
      { page: 1, size: 100, tenantId },
      {
        isMock: false,
        mockId: 331,
        mockSuffix: '/api',
        needHint: true,
        proxyApi: '/blaster',
      }
    );
    setShopCategoryOptions(objectList || []);
  };

  useEffect(() => {
    loadShopCategoryOptions();
  }, []);

  // const loadBrandData = async () => {
  //   const result = await brandList({ type: 1 });
  //   if (result && result.objectList) {
  //     const resultOptions = result.objectList.map((item) => {
  //       return { label: item.name, value: item.id };
  //     });
  //     setBrandOptions(resultOptions);
  //   }
  // };

  // useEffect(() => {
  //   loadBrandData();
  // }, []);

  return (
    <FormSearch labelLength={4} onSearch={onSearch}>
      <FormInput label='搜索' name='templateName' placeholder='模版名' />
      {/* <FormSelect label='品牌' name='brandId'options={brandOptions} config={{ showSearch: true }} /> */}

      <FormSelect
        label='类型'
        name='shopCategory'
        options={shopCategoryOptions}
        config={{
          fieldNames: { label: 'name', value: 'id' },
        }}
      />

      <FormSelect label='状态' name='enable' options={statusOptions} />
    </FormSearch>
  );
};

export default Filter;
