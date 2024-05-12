/**
 * 供应商合同列表
 */
import React, { useEffect, useState, useImperativeHandle, useRef } from 'react';
import { getSupplierContract } from '@/common/api/purchaseTask';
import { useMethods } from '@lhb/hook';
import Fuzzy from '@/common/components/Select/Fuzzy';

const SupplierContract: React.FC<any> = ({
  extraParams = {},
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
    // 获取供应商合同列表
    async loadData (keyword: string) {
      const params = {
        keyword,
        ...extraParams,
      };
      const result = await getSupplierContract(params);
      setData(result);
      return Promise.resolve(result);
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
    if (!(Array.isArray(defaultOptions) && defaultOptions.length)) return;
    fuzzyRef.current.setOptions(defaultOptions); // 添加option项
    // finallyData && finallyData(setListData);
  }, [defaultOptions]);

  return (
    <Fuzzy
      ref={fuzzyRef}
      loadData={methods.loadData}
      fieldNames={{
        label: 'contractNum',
        value: 'contractNum',
      }}
      customOptionItem={(option) => {
        return <>{option.company}-{option.contractNum}</>;
      }}
      {...props}
    />
  );
};

export default SupplierContract;

