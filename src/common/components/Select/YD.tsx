/**
 * 云盯三方门店列表
 */
import { FC, ReactNode, useRef, useEffect, useImperativeHandle, MutableRefObject, forwardRef } from 'react';
import Fuzzy from './Fuzzy';
import { useMethods } from '@lhb/hook';
import { postFlowYD } from '@/common/api/passenger-flow';
import { FuzzyHandles } from '../Form/Fuzzy/Fuzzy';
const Brand: FC<any> = forwardRef(({
  extraParams = {},
  finallyData,
  mode,
  setListData,
  ...props
}, ref) => {
  const fuzzyRef: MutableRefObject<FuzzyHandles | null> = useRef(null);
  // methods
  const { loadData, dropdownRenderAddable } = useMethods({
    // 获取品牌列表
    loadData: async (name: string) => {
      const params = {
        name,
        ...extraParams,
      };
      const { objectList } = await postFlowYD(params);
      const options: any = objectList;
      finallyData && finallyData(options);
      return Promise.resolve(options);
    },
    dropdownRenderAddable: (menu: ReactNode) => {
      return menu;
    },
  });


  useImperativeHandle(ref, () => ({
    getItem: (data) => fuzzyRef.current?.getItem(data),
    addOption: fuzzyRef.current?.addOption,
  }));

  useEffect(() => {
    if (!(Array.isArray(setListData) && setListData.length)) return;
    (fuzzyRef as any).current.setOptions(setListData); // 添加option项
    finallyData && finallyData(setListData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setListData]);

  return (
    <>
      <Fuzzy
        ref={fuzzyRef}
        loadData={loadData}
        mode={mode}
        fieldNames={{
          label: 'flowStoreName',
          value: 'flowStoreId'
        }}
        dropdownRender={(menu) => dropdownRenderAddable(menu)}
        {...props}>
      </Fuzzy>
    </>
  );
});

export default Brand;

