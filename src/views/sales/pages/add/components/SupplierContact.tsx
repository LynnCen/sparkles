// 供应商列表
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { isArray } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import Fuzzy from '@/common/components/Select/Fuzzy';
import { getCRMContacts } from '@/common/api/sales';

const SupplierContact: React.FC<any> = ({
  finallyData,
  onRef,
  defaultOptions,
  enterId,
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
      const { data } = await getCRMContacts(token, enterId, name) || [];
      const { list = [] } = data || {};
      const newList = list.map(item => ({ ...item, value: `${item.contactsId}-${item.name}-${item.mobile}` }));

      setData(newList);
      finallyData && finallyData(newList);
      return Promise.resolve(newList);
    },
    async getCustomer() {
      const { data } = await getCRMContacts(token, enterId, '');
      const { list = [] } = data || {};
      const newList = list.map(item => ({ ...item, value: `${item.contactsId}-${item.name}-${item.mobile}` }));

      fuzzyRef.current.setOptions(newList);
    }
  });

  useEffect(() => {
    if (!token || !enterId) {
      return;
    }



    methods.getCustomer(token, enterId);
  }, [token, enterId]);

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
        immediateOnce={false}
        placeholder='请选择联系人'
        fieldNames={{
          label: 'name',
          value: 'value',
        }}
        customOptionItem={(option) => {
          return <>{option.name}</>;
        }}
        {...props} />
    </>
  );
};

export default SupplierContact;

