import FormInput from '@/common/components/Form/FormInput';
import FormSelect from '@/common/components/Form/FormSelect';
import FormSearch from '@/common/components/Form/SearchForm';
import { get } from '@/common/request';
import React, { useEffect, useState } from 'react';


const PropertyFilters: React.FC<any> = ({ onSearch }) => {
  const [categoryOptions, setCategoryOptions] = useState<any>([]);
  const loadCategoryOptions = async () => {
    const data = await get(
      '/shop/category/list',
      {},
      { proxyApi: '/blaster', needCancel: false, isMock: false, needHint: true, mockId: 462 }
    );
    data.objectList &&
      data.objectList.length &&
      setCategoryOptions(data.objectList.map((item) => ({ label: item.name, value: item.id })));
  };

  useEffect(() => {
    loadCategoryOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <FormSearch onSearch={onSearch} labelLength={4} colon={false}>
        <FormInput
          label='内容搜索'
          name='attribute'
          placeholder='请输入属性名称/编号/标识'
          config={{
            style: { width: 220 },
          }}
        />
        <FormSelect
          label='属性分类'
          name='categoryId'
          placeholder='属性分类'
          config={{
            style: { width: 220 },
            allowClear: true
          }}
          options={categoryOptions}
        />
      </FormSearch>
    </>
  );
};

export default PropertyFilters;
