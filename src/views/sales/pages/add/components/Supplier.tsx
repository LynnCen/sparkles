// 供应商列表
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { isArray } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import Fuzzy from '@/common/components/Select/Fuzzy';
import { getCRMCustomer } from '@/common/api/sales';

const Supplier: React.FC<any> = ({
  finallyData,
  onRef,
  defaultOptions,
  token,
  ...props
}) => {
  const fuzzyRef: any = useRef();
  const [data, setData] = useState();

  const methods = useMethods({
    addClose() {},
    addOk() {
      // 这里注释掉是因为点位新增后还需要审核才能出现在列表，无法直接回填
      // fuzzyRef.current.reload();
    },
    async loadData(name: string) {
      if (!token) {
        return;
      }
      const { data } = await getCRMCustomer(token, name) || [];
      const { list = [] } = data || {};
      const newList = list.map(item => ({ ...item, value: `${item.customerId}-${item.customerName}-${item.mobile}` }));

      setData(newList);
      finallyData && finallyData(newList);
      return Promise.resolve(newList);
    },
    async getCustomer() {
      const { data } = await getCRMCustomer(token, '');
      const { list = [] } = data || {};
      const newList = list.map(item => {
        return {
          ...item,
          value: `${item.customerId}-${item.customerName}`
        };
      });
      fuzzyRef.current.setOptions(newList);
    }
  });


  useEffect(() => {
    if (!token) {
      return;
    }

    methods.getCustomer(token, '');
  }, [token]);

  useImperativeHandle(onRef, () => ({
    getData() {
      return data;
    },
    addOption: fuzzyRef.current.addOption,
    setOptions: fuzzyRef.current.setOptions,
  }));
  useEffect(() => {
    if (!(isArray(defaultOptions) && defaultOptions.length)) return;
    fuzzyRef.current.setOptions(defaultOptions); // 添加option项
    // finallyData && finallyData(setListData);
  }, [defaultOptions]);
  return (
    <>
      <Fuzzy
        ref={fuzzyRef}
        loadData={methods.loadData}
        placeholder='请选择商家'
        immediateOnce={false}
        fieldNames={{
          value: 'value',
          label: 'customerName',
        }}
        customOptionItem={(option) => {
          return <>{option.customerName}</>;
        }}
        {...props} />
    </>
  );
};

export default Supplier;

