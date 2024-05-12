/**
 * 品牌列表
 * warning 待废弃，除了 location 组，其他都使用 src/common/components/Select/ResourceBrand.tsx
 */
import { FC, useState, ReactNode, useRef, useEffect } from 'react';
import { Space, Input, Button, message as msg } from 'antd';
import Fuzzy from './Fuzzy';
import { brandAdd } from '@/common/api/flow';
import { useMethods } from '@lhb/hook';
import { concatObjArray, deepCopy } from '@lhb/func';
import { SelectionOptionItem } from './ts-config';
import { postResourceBrandListQuery } from '@/common/api/common';
const Brand: FC<any> = ({
  extraParams = {},
  finallyData,
  isAddable = false,
  assignmentHandle,
  mode,
  setListData,
  brandRef,
  ...props
}) => {
  let fuzzyRef = useRef();
  if (brandRef) {
    fuzzyRef = brandRef;
  }
  const [ipVal, setIpVal] = useState('');
  const [addItems, setAddItems] = useState<{ id: number, name: string }[]>([]);
  const addableNotFoundNode = (<span className='color-help'>搜索不到品牌时可添加</span>);

  // methods
  const { loadData, addHandle, changeHandle, dropdownRenderAddable } = useMethods({
    // 获取品牌列表
    loadData: async (keyword: string) => {
      const params = {
        name: keyword,
        ...extraParams,
      };
      const data: SelectionOptionItem[] = await postResourceBrandListQuery(params);
      let options: any = data;
      if (isAddable) { // 多选且可以新增品牌时
        options = concatObjArray(addItems, data, 'id');
      }
      finallyData && finallyData(options);
      return Promise.resolve(options);
    },
    addHandle: async () => {
      if (!ipVal) return;
      const { id } = await brandAdd({ name: ipVal, status: 0 });
      const option = {
        id,
        name: ipVal
      };
      const items = deepCopy(addItems);
      items.push(option);
      setAddItems(items);
      setIpVal(''); // 清空输入框
      (fuzzyRef as any).current.addOption(option); // 添加option项
      assignmentHandle(id); // 帮助选中
      msg.success('新增品牌成功，已帮助选择');
    },
    changeHandle: (e) => {
      const val = e.target.value;
      setIpVal(val);
    },
    dropdownRenderAddable: (menu: ReactNode) => {
      if (isAddable) {
        return (
          <>
            {menu}
            <Space align='center' style={{ width: '100%' }}>
              <Input value={ipVal} allowClear onChange={changeHandle} className='mt-8 ml-12' />
              <Button type='primary' onClick={addHandle} className='mt-8 ml-24'>添加</Button>
            </Space>
          </>
        );
      }
      return menu;
    },
  });

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
          label: 'name',
          value: 'id'
        }}
        dropdownRender={(menu) => dropdownRenderAddable(menu)}
        notFoundNode={isAddable ? addableNotFoundNode : null}
        {...props}>
      </Fuzzy>
    </>
  );
};

export default Brand;

