// 供应商联系人列表
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { postTenantSupplierContactPageQuery } from '@/common/api/common';
import { isArray } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import Fuzzy from '@/common/components/Select/Fuzzy';

const SupplierContact: React.FC<any> = ({
  extraParams = {},
  finallyData,
  onRef,
  defaultOptions,
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
      const params = {
        name,
        ...extraParams,
      };
      const objectList = await postTenantSupplierContactPageQuery(params) || [];
      setData(objectList);
      finallyData && finallyData(objectList);
      return Promise.resolve(objectList);
    }
  });

  useImperativeHandle(onRef, () => ({
    getData() {
      return data;
    },
    reload: fuzzyRef.current.reload,
    addOption: fuzzyRef.current.addOption,
    setOptions: fuzzyRef.current.setOptions,
    getItem: (data) => fuzzyRef.current.getItem(data)
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
        fieldNames={{
          value: 'id',
          label: 'contactName',
        }}
        customOptionItem={(option) => {
          return <>{option.contactName}</>;
        }}
        {...props} />
    </>
  );
};

export default SupplierContact;

