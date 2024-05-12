// 品牌中心-品牌库-相似品牌搜索、选择
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { brandSearch } from '@/common/api/brand-center';
import { isArray } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import Fuzzy from '@/common/components/Select/Fuzzy';

const SimilarBrand: React.FC<any> = ({
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
        brandName: name,
        ...extraParams,
      };
      const objectList = await brandSearch(params) || [];
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
        customOptionItem={(opt) => {
          return <>
            <div style={{
              fontSize: '14px',
              color: '#222',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}>
              {opt.name}{`（ID:${opt.id}）`}
            </div>
            <div style={{ fontSize: '12px', color: '#222' }}>{opt.industryShowName}</div>
          </>;
        }}
        {...props} />
    </>
  );
};

export default SimilarBrand;

