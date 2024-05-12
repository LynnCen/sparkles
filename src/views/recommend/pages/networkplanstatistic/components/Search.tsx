import React, { useRef } from 'react';
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { isArray, refactorSelection } from '@lhb/func';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
import { Cascader } from 'antd';
import { useMethods } from '@lhb/hook';

const Search: React.FC<{onSearch:Function, selection:any, isBranch:boolean}> = ({ onSearch, selection, isBranch }) => {
  const cityItems = useRef<any[]>([]);// 选中的城市项

  const methods = useMethods({
    onSearch(params) {
      const { districtIdList } = params;
      let districtIds: number[] = [];
      if (isArray(districtIdList) && districtIdList.length) {
        districtIds = districtIdList.map(item => Number(item[2])); // 省市区
      };
      onSearch({
        ...params,
        districtIdList: districtIds,
        cityItems: cityItems.current
      });
    },
    cityChange(value, items) {
      cityItems.current = items.map(item => {
        const province = item?.[0];
        const city = item?.[1];
        const district = item?.[2];
        return [
          { id: Number(province.value), name: province.label },
          { id: Number(city.value), name: city.label },
          { id: Number(district.value), name: district.label }
        ];
      });
    }
  });

  return (
    <SearchForm onSearch={methods.onSearch} className='form-search'>
      <V2FormSelect
        label='统计维度'
        name='showType'
        formItemConfig={{ initialValue: '' }}
        allowClear={false}
        options={[{ value: '', label: '全部' }].concat(refactorSelection(selection.showType))}
      />
      <V2FormSelect
        label={`${isBranch ? '规划' : '推荐'}状态`}
        name='planStatus'
        // planStatus为'xx规划' isPlanned为'xx推荐'
        options={refactorSelection(isBranch ? selection.planStatus : selection.isPlanned)}
      />
      <V2FormCascader
        label='商圈/业态'
        name='industryNames'
        options={refactorSelection(selection.businesses, { children: 'child' })}
        config={{ multiple: true,
          showCheckedStrategy: Cascader.SHOW_CHILD,
          maxTagCount: 'responsive',
          showSearch: true
        }}
      />
      <V2FormCascader
        label='规划区域'
        name='districtIdList'
        options={refactorSelection(selection.cities, { children: 'child' })}
        config={{ multiple: true, showCheckedStrategy: Cascader.SHOW_CHILD, maxTagCount: 'responsive', showSearch: true }}
        onChange={methods.cityChange}
      />
    </SearchForm>
  );
};

export default Search;
