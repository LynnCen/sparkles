import React, { useEffect, useState } from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import FormInput from '@/common/components/Form/FormInput';
import styles from '../entry.module.less';
import FormSelect from '@/common/components/Form/FormSelect';
import { get } from '@/common/request';

const Filter: React.FC<any> = ({ onSearch, searchForm }) => {
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
    <FormSearch className={styles.formSearch} labelLength={4} onSearch={onSearch} form={searchForm}>
      <FormInput label='属性名称' name='attribute' />
      <FormSelect label='属性分类' name='categoryId' allowClear options={categoryOptions} />
    </FormSearch>
  );
};

export default Filter;
