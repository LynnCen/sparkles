import React, { useState, useEffect } from 'react';
import { Form, Button, message } from 'antd';
import { compareStores } from '@/common/api/store';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import FormMoreStoreCompared from './FormMoreStore';
import FormSingleStore from './FormSingleStore';

import { FilterProps } from '../ts-config';
import styles from './index.module.less';
import cs from 'classnames';
import HighFilter from './HighFilter';
import SearchForm from '@/common/components/Form/SearchForm';
import dayjs from 'dayjs';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';

const dateScopeOptions = [
  { label: '小时', value: 1 },
  { label: '天', value: 2 },
];

const Filter: React.FC<FilterProps> = ({ onSearch, onResetForm }) => {
  const [form] = Form.useForm();
  const [dateScope, setDateScope] = useState<number>(1);
  const [showHighModal, setShowHighModal] = useState<boolean>(false);
  const [checkStoreIds, setCheckStoreIds] = useState<any[]>([]);

  // 多门店的数据
  const moreStoresDeal = (stores: any[]) => {
    let storeArr: any[] = [];
    if (!dateScope) {
      storeArr = [];
    } else {
      const formValues = form.getFieldValue('stores');
      storeArr = stores.map((item) => {
        const target = formValues && formValues.find((value) => value.id === item.id);
        return {
          ...item,
          start: dateScope === 2 ? item.startDate : target?.start || '',
          end: dateScope === 2 ? item.endDate : target?.end || '',
        };
      });
      form.setFieldsValue({ stores: storeArr });
    }
  };

  // 单门店的数据
  const moreTimeDeal = (stores) => {
    let arr: any[] = [];
    arr = Array.from({ length: 2 }).map(() => ({
      ...stores[0],
      key: Math.random(),
      start: dateScope === 2 ? stores[0].startDate : '',
      end: dateScope === 2 ? stores[0].endDate : '',
    }));
    form.setFieldsValue({ singleStore: { list: arr, start: stores[0].startDate, end: stores[0].endDate } });
  };

  useEffect(() => {
    if (checkStoreIds.length === 1) {
      moreTimeDeal(checkStoreIds);
    } else if (checkStoreIds.length > 1) {
      moreStoresDeal(checkStoreIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateScope]);

  const handleDateScope = (e: any) => {
    if (!e) return;
    setDateScope(e.target.value);
  };

  const onCustomerReset = () => {
    form.resetFields();
    setDateScope(1);
    setCheckStoreIds([]);
    onResetForm();
  };

  const deleteStores = (index: number) => {
    const formValues = form.getFieldValue('stores');
    const arr = checkStoreIds.slice();
    const arr1 = formValues.slice();
    arr.splice(index, 1);

    setCheckStoreIds(arr);
    if (arr.length === 1) {
      moreTimeDeal(arr);
      return;
    }
    arr1.splice(index, 1);
    form.setFieldsValue({ stores: arr1 });
  };

  const moreThanYear = (list) => {
    if (dateScope === 2) {
      const moreThanYear = list.find((item) => dayjs(item.end).diff(dayjs(item.start), 'year') >= 1);
      if (moreThanYear) {
        message.warn(`对比时间最长不超过一年`);
        return false;
      }
    }
    return true;
  };

  // 单门店点击查询时候的数据验证
  const validateMoreDate = (singleStoreValue) => {
    const list = singleStoreValue.list;

    const target = list.find((item) => !item.start || !item.end);
    if (target) {
      message.warn(`请选择${target.name}的对比时间`);
      return false;
    }
    // 单门店需要判断选择不同的对比时间
    const hash = {};
    for (let i = 0, len = list.length; i < len; i++) {
      const item = list[i];
      if (hash[`${item.start}-${item.end}`]) {
        message.warn(`请选择不同的对比时间`);
        return false;
      }
      hash[`${item.start}-${item.end}`] = true;
    }
    return moreThanYear(list);
  };

  // 多门店点击查询时候的数据验证
  const validateMoreStore = (storesValue) => {
    const list = storesValue.slice();
    const target = list.find((item) => !item.start || !item.end);
    if (target) {
      message.warn(`请选择${target.name}的对比时间`);
      return false;
    }

    return moreThanYear(list);
  };

  const handleSubmit = (formData: any) => {
    if (formData.singleStore) {
      if (!validateMoreDate(formData.singleStore)) {
        return;
      }
    } else if (formData.stores) {
      if (!validateMoreStore(formData.stores)) {
        return;
      }
    } else {
      message.warning('请选择要对比的门店');
      return;
    }

    const stores = formData?.singleStore?.list || formData?.stores;

    const params = {
      dateScope: formData.dateScope,
      stores: stores.map((item) => ({
        id: item.id,
        start: item.start,
        end: item.end,
      })),
    };

    compareStores(params).then((data: any) => {
      const cbParams = {
        dateScope: params.dateScope,
        stores,
        moreStores: !!formData?.stores,
      };
      onSearch(data, cbParams);
    });
  };

  // 确定选中门店
  const onOk = (type?: string, list?: any[]) => {
    if (type === 'ok' && Array.isArray(list)) {
      setCheckStoreIds(list || []);
      if (list.length === 1) {
        moreTimeDeal(list);
      } else if (list.length > 1) {
        moreStoresDeal(list);
      }
    }
    setShowHighModal(false);
  };

  return (
    <div className={styles.filterWrap}>
      <TitleTips className={styles.titleWrap} name='门店对比' showTips={false} />
      <Button type='primary' className='mb-20' onClick={() => setShowHighModal(true)}>
        选择门店
      </Button>
      <SearchForm
        form={form}
        layout='horizontal'
        colon={false}
        onFinish={handleSubmit}
        className={cs(styles.searchForm)}
        onCustomerReset={onCustomerReset}
      >
        <V2FormRadio
          label='对比方式'
          formItemConfig={{ initialValue: 1 }}
          name='dateScope'
          options={dateScopeOptions}
          onChange={handleDateScope}
        />
        {/* 选择多门店时 */}
        {checkStoreIds.length > 1 ? (
          <Form.Item name='stores'>
            <FormMoreStoreCompared deleteStores={deleteStores} dateScope={dateScope} />
          </Form.Item>
        ) : <></>}

        {/* 选择单门店时 */}
        {checkStoreIds.length === 1 ? (
          <Form.Item name='singleStore'>
            <FormSingleStore dateScope={dateScope} />
          </Form.Item>
        ) : <></>}
      </SearchForm>
      <HighFilter visible={showHighModal} onOk={onOk} checkStoreIds={checkStoreIds} />
    </div>
  );
};

export default Filter;
