/**
 * @Description 机会点管理-筛选项
 */

import { useEffect, useState, FC } from 'react';
import { Form, Cascader } from 'antd';
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { getChancepointSelection } from '@/common/api/expandStore/chancepoint';
import { getSelection as getPlanSelection } from '@/common/api/networkplan';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import dayjs from 'dayjs';
import { tenantCheck } from '@/common/api/common';
import { isArray, refactorSelection } from '@lhb/func';
import styles from './index.module.less';

const Filter: FC<any> = ({
  onSearch,
  onFilterChanged,
}) => {
  const [form] = Form.useForm();
  const [statuses, setStatuses] = useState<any[]>([]);
  const [firstLevelCategoryOptions, setFirstLevelCategoryOptions] = useState<any[]>([]);
  const [isYiHeTang, setIsYiHeTang] = useState<boolean>(false);

  useEffect(() => {
    tenantCheck().then(({ isYiHeTang }) => {
      setIsYiHeTang(!!isYiHeTang);
    });

    // 机会点状态选项
    getChancepointSelection({}).then(({ status }: any) => {
      isArray(status) && setStatuses(refactorSelection(status));
    });

    // 商圈类型选项
    // module 1 网规相关，2行业商圈 （通用版）
    getPlanSelection({ module: 1 }).then((data) => {
      const { firstLevelCategory } = data;
      // 注意，使用每个返回数据中的name字段作为提交值
      isArray(firstLevelCategory) && setFirstLevelCategoryOptions(refactorSelection(firstLevelCategory, { id: 'name' }));
    });
  }, []);

  /**
	 * @description 点击搜索框模糊查询
	 * @param fields 搜索框参数
	 */
  const handleSearch = (value: any) => {
    // 搜索
    onSearch(formatValue(value));
  };

  /**
   * @description form数据转为为提交要求格式
   * @param value
   * @return 转为后格式
   */
  const formatValue = (value: any) => {
    // 搜索
    // console.log('==params 原始', deepCopy(value));
    const { houseDelivery, addresses } = value;
    let houseDeliveryStart;
    let houseDeliveryEnd;
    let tmpAddresses: any;
    // 省市区参数处理
    if (isArray(addresses) && addresses.length) {
      tmpAddresses = addresses.map(itm => ({
        provinceId: itm.length ? itm[0] : undefined,
        cityId: itm.length > 1 ? itm[1] : undefined,
        districtId: itm.length > 2 ? itm[2] : undefined,
      }));
    }
    // 日期参数处理
    if (isArray(houseDelivery) && houseDelivery.length === 2) {
      houseDeliveryStart = dayjs(houseDelivery[0]).format('YYYY-MM-DD');
      houseDeliveryEnd = dayjs(houseDelivery[1]).format('YYYY-MM-DD');
    }

    // 商圈类型筛选字段，提交名称数组
    const { firstLevelCategoryList } = value;
    value.firstLevelCategoryList = firstLevelCategoryList ? [firstLevelCategoryList] : undefined;

    const _params = form.getFieldsValue();
    const formattedValue = {
      ..._params,
      ...value,
      houseDeliveryStart,
      houseDeliveryEnd,
      addresses: tmpAddresses,
    };
    delete formattedValue.houseDelivery;
    // console.log('==params 格式后', formatetedValue);

    return formattedValue;
  };

  const onValuesChange = (changedValues, allValues) => {
    // console.log('onValuesChange, changedValues:', changedValues);
    // console.log('    allValues:', allValues);
    onFilterChanged(formatValue(allValues));
  };

  return (
    <SearchForm
      onOkText='搜索'
      form={form}
      labelAlign='left'
      labelLength={6}
      onSearch={handleSearch}
      className={styles.searchForm}
      onValuesChange={onValuesChange}
    >
      <V2FormInput label='机会点名称' name='name' />
      <V2FormInput label='开发经理' name='accountName' />
      <V2FormSelect
        label='机会点状态'
        name='statuses'
        options={statuses}
        config={{
          mode: 'multiple',
          maxTagCount: 'responsive',
        }}/>
      <V2FormSelect
        label='所属商圈类型'
        name='firstLevelCategoryList'
        options={firstLevelCategoryOptions}
      />
      <V2FormProvinceList
        label='省市区'
        name='addresses'
        type={1}
        multiple
        config={{ showCheckedStrategy: Cascader.SHOW_PARENT }}
      />
      <V2FormInput label='详细地址' name='address' />
      <V2FormInput label='创建人' name='creatorName' />
      <V2FormInput label='分公司名称' name='branchCompanyName' />
      {isYiHeTang ? <V2FormRangePicker label='可交房日期' name='houseDelivery'/> : <></>}
    </SearchForm>
  );
};

export default Filter;

