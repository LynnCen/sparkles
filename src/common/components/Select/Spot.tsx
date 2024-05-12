/**
 * 品牌列表
 */
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import styles from './index.module.less';
import { Tag } from 'antd';
import Fuzzy from '@/common/components/Select/Fuzzy';
import { postSpotQuery } from '@/common/api/passenger-flow';
import { isArray } from '@lhb/func';
import AddPoint from '../Business/AddPoint';
import { useMethods } from '@lhb/hook';
const Spot: React.FC<any> = ({
  extraParams = {},
  finallyData,
  onRef,
  defaultOptions,
  needAddableNotFoundNode = false,
  channel,
  ...props
}) => {
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const fuzzyRef: any = useRef();
  const [data, setData] = useState();

  const methods = useMethods({
    addClose() {},
    addOk() {
      // 这里注释掉是因为点位新增后还需要审核才能出现在列表，无法直接回填
      // fuzzyRef.current.reload();
    },
    toAdd() {
      fuzzyRef.current.selectRef.blur();
      setTimeout(() => {
        setAddVisible(true);
      }, 200);
    },
    async loadData(name: string) {
      const params = {
        name,
        ...extraParams,
      };
      const data = await postSpotQuery(params);
      const objectList = data.objectList || [];
      setData(objectList);
      finallyData && finallyData(objectList);
      return Promise.resolve(objectList);
    }
  });
  const addableNotFoundNode = (
    <div className={styles.spotNoData}>
      未找到匹配点位，<span className={styles.spotToAdd} onClick={methods.toAdd}>去新增</span>
    </div>
  );

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
          label: 'longName',
          value: 'id'
        }}
        customOptionItem={(option) => {
          return <>
            <Tag color='blue'>{option.categoryName}</Tag>
            {option.longName}
          </>;
        }}
        notFoundNode={needAddableNotFoundNode ? addableNotFoundNode : undefined}
        {...props} />
      {
        needAddableNotFoundNode && <AddPoint channel={channel} zIndex={1001} visible={addVisible} onClose={() => setAddVisible(false)} onOK={methods.addOk}/>
      }
    </>
  );
};

export default Spot;

