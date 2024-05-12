// 资源-品牌列表
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { isArray } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import Fuzzy from '@/common/components/Select/Fuzzy';
import { post } from '@/common/request';

const TenantTemplate: React.FC<any> = ({ extraParams = {}, finallyData, onRef, defaultOptions, ...props }) => {
  const fuzzyRef: any = useRef();
  const [data, setData] = useState();

  const methods = useMethods({
    addClose() {},
    addOk() {
      // 这里注释掉是因为点位新增后还需要审核才能出现在列表，无法直接回填
      // fuzzyRef.current.reload();
    },
    async loadData(name: string) {
      // const params = {
      //   // type: 1,
      //   name,
      //   // brandId,
      //   ...extraParams,
      // };

      // https://yapi.lanhanba.com/project/289/interface/api/49020
      const result =
        (await post(
          '/dynamic/template/copy/pages',
          { templateName: name, ...extraParams },
          {
            proxyApi: '/blaster',
            needHint: true,
          }
        ));
      const objectList = result?.objectList || [];
      setData(objectList);
      finallyData && finallyData(objectList);
      return Promise.resolve(objectList);
    },
  });

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
        fieldNames={{
          value: 'id',
          label: 'templateName',
        }}
        customOptionItem={(option) => {
          return <>{option.templateName}</>;
        }}
        {...props}
      />
    </>
  );
};

export default TenantTemplate;
