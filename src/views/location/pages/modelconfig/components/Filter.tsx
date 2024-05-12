import React, { useEffect, useState } from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import FormInput from '@/common/components/Form/FormInput';
import styles from '../entry.module.less';
import FormSelect from '@/common/components/Form/FormSelect';
import { post, get } from '@/common/request';
import FormCascader from '@/common/components/Form/FormCascader';
import { Cascader } from 'antd';

const Filter: React.FC<any> = ({ onSearch, searchForm }) => {
  const [categoryOptions, setCategoryOptions] = useState<any>([]);
  const [industryOptions, setIndustryOptions] = useState<any>([]);
  const loadCategoryOptions = async () => {
    const data = await get(
      // https://yapi.lanhanba.com/project/462/interface/api/46339
      '/shop/model/selection',
      {},
      { needCancel: false, isMock: false, needHint: true, mockId: 462, proxyApi: '/blaster' }
    );
    data.shopCategory &&
      data.shopCategory.length &&
      setCategoryOptions(data.shopCategory.map((item) => ({ label: item.name, value: item.id })));
  };

  const loadIndustryOptions = async () => {
    const data = await post(
      '/common/selection/tree',
      { key: 'MDHY' },
      { needCancel: false, isMock: false, needHint: true, mockId: 462, proxyApi: '/blaster' }
    );
    data && data.length && setIndustryOptions(data);
  };

  useEffect(() => {
    loadCategoryOptions();
    loadIndustryOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormSearch className={styles.formSearch} labelLength={4} onSearch={onSearch} form={searchForm}>
      <FormInput label='模型名称' name='name' />
      <FormSelect label='店铺类型' name='categoryId' allowClear options={categoryOptions} />
      <FormCascader
        label='所属行业'
        name='industryId'
        placeholder='选择所属行业'
        options={industryOptions}
        config={{ multiple: false, changeOnSelect: true, showCheckedStrategy: Cascader.SHOW_CHILD, fieldNames: {
          label: 'name',
          value: 'id'
        } }}
      />
    </FormSearch>
  );
};

export default Filter;
