// 联系人列表
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { postContactsList } from '@/common/api/common';
import { isArray, isEqual, replaceEmpty } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import Fuzzy from '@/common/components/Form/Fuzzy/NewFuzzy';

const Contacts: React.FC<any> = ({
  extraParams = {},
  finallyData,
  onRef,
  defaultOptions,
  onChangeKeyword, // 返回搜索内容
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
    async loadData(mobile: string | number) {
      onChangeKeyword?.(mobile);
      console.log(fuzzyRef.current.selectRef);

      const params = {
        // type: 1,
        mobile,
        // brandId,
        ...extraParams,
      };
      const objectList = await postContactsList(params) || [];
      setData(objectList);
      finallyData && finallyData(objectList);
      return Promise.resolve(objectList);
    },
    customOptionItem(user: Record<string, any>) {
      const { enterpriseName, name, mobile } = user;
      return (
        <>
          {!isEqual(enterpriseName, mobile) && <span>{enterpriseName || ''}-{name || ''}-</span>}<span>{replaceEmpty(mobile)}</span>
        </>
      );
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
          label: 'name',
        }}
        customOptionItem={methods.customOptionItem}
        {...props} />
    </>
  );
};

export default Contacts;

