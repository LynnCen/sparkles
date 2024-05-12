// 供应商列表
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { postTenantSupplierListQuery } from '@/common/api/common';
import { isArray } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import Fuzzy from '@/common/components/Select/Fuzzy';

const Supplier: React.FC<any> = ({
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
      const objectList = await postTenantSupplierListQuery(params) || [];
      setData(objectList);
      finallyData && finallyData(objectList);
      return Promise.resolve(objectList);
    }
  });

  useImperativeHandle(onRef, () => ({
    getData() {
      return data;
    },
    addOption: fuzzyRef.current.addOption,
    setOptions: fuzzyRef.current.setOptions,
    // getItem: fuzzyRef.current.getItem, // 这样获取数据有延迟，是上一次的
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
          label: 'supplierName',
        }}
        customOptionItem={(option) => {
          return <>{option.supplierName}</>;
        }}
        {...props} />
    </>
  );
};

export default Supplier;

