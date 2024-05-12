/**
 * @LastEditors Please set LastEditors
 * @Date 2023-09-13 17:09
 * @LastEditTime 2023-12-19 15:12
 * @FilePath /console-pc/src/views/recommend/pages/networkplanapprove/components/Filter.tsx
 * @Description
 */
import React, { useEffect, useState } from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import { Button } from 'antd';
import { useMethods } from '@lhb/hook';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
import { refactorSelection } from '@lhb/func';
import { Cascader } from 'antd';
import { getTreeSelection } from '@/common/api/networkplan';
import { BusinessAreaType } from '../ts-config';

const Filter: React.FC<any> = ({
  onSearch,
  setIsMap,
  planId,
  branchCompanyId,
  activeTab
}) => {
  const onFinish = (values) => {
    onSearch(values);
  };

  const [citys, setCitys] = useState<Array<object>>([]);
  const [secondCategorys, setSecondCategorys] = useState<Array<object>>([]);

  useEffect(() => {
    planId && methods.getSelection();
  }, [planId]);

  const methods = useMethods({
    getSelection() {
      setCitys([]);
      setSecondCategorys([]);
      Promise.all([
        // module 1 网规相关，2行业商圈 （通用版）
        getTreeSelection({ planId, type: 2, module: 1 }),
        getTreeSelection({ planId, type: 1, childCompanyId: branchCompanyId }),
      ]).then(res => {
        setCitys(res[1]);
        setSecondCategorys(res[0]);
      });
    },
  });

  return (
    <FormSearch
      labelLength={activeTab !== BusinessAreaType ? 6 : 4}
      onSearch={onFinish}
      labelAlign='right'
      rightOperate={
        <Button type='primary' className='mb-16' onClick={() => { setIsMap(true); }}>地图模式</Button>}
    >
      {activeTab !== BusinessAreaType ? <V2FormCascader
        label='商圈/业态类型'
        name='secondLevelCategory'
        options={refactorSelection(secondCategorys, { children: 'child' })}
        config={{ multiple: true, showCheckedStrategy: Cascader.SHOW_CHILD, maxTagCount: 'responsive' }}
      /> : <></>}
      <V2FormCascader
        label='规划区域'
        name='districtIdList'
        options={refactorSelection(citys, { children: 'child' })}
        config={{ multiple: true, showCheckedStrategy: Cascader.SHOW_CHILD, maxTagCount: 'responsive' }}
      />
    </FormSearch>
  );
};

export default Filter;
