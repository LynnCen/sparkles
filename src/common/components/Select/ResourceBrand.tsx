// 资源-品牌列表
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { postResourceBrandListQuery } from '@/common/api/common';
import { isArray } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import Fuzzy from '@/common/components/Form/Fuzzy/NewFuzzy';

const ResourceBrand: React.FC<any> = ({
  extraParams = {},
  finallyData,
  onRef,
  defaultOptions,
  onChangeKeyword, // 返回搜索内容
  api,
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
      const searchApi = api || postResourceBrandListQuery;
      onChangeKeyword?.(name);
      const params = {
        // type: 1,
        name,
        // brandId,
        ...extraParams,
      };
      const tempData = await searchApi(params);
      let objectList = [] as any;
      if (Array.isArray(tempData) && tempData.length) {
        objectList = tempData;
      } else {
        objectList = Array.isArray(tempData.objectList) && tempData.objectList.length ? tempData.objectList : [];
      }
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
    getItem: fuzzyRef.current.getItem,
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
          label: 'name',
        }}
        customOptionItem={(option) => {
          return <>{option.name}</>;
        }}
        {...props} />
    </>
  );
};

export default ResourceBrand;

