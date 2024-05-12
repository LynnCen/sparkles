/**
 * 省市区/省市-存入redux中
 * */

import { useEffect, FC } from 'react';
import { Cascader } from 'antd';
import { CascaderProps } from 'antd/lib/cascader/index';
import { useSelector, useDispatch } from 'react-redux';
import { changeProvinceCityDistrict, changeProvincesCities } from '@/store/common';

import { areaList } from '@/common/api/common';

const { SHOW_CHILD } = Cascader;

interface ProvinceListProp {
  type: number; // 默认是1 即省市区 如需省市，则传2
  placeholder?: string;
  value?: any;
  onChange?: Function;
}

const ProvinceList: FC<ProvinceListProp & CascaderProps<any>> = ({
  type = 1,
  placeholder,
  ...props
}) => {
  const province = useSelector((state: any) =>
    type === 1 ? state.common.provinceCityDistrict : state.common.provincesCities
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const getAreaList = async () => {
      const cityResult = await areaList({ type });
      if (type === 1) {
        dispatch(changeProvinceCityDistrict(cityResult));
      } else {
        dispatch(changeProvincesCities(cityResult));
      }
    };
    // 如果不存在则进行请求
    if (!province.length) {
      getAreaList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  return (
    <Cascader
      {...props}
      options={province}
      placeholder={placeholder}
      showCheckedStrategy={SHOW_CHILD}
      fieldNames={{ label: 'name', value: 'id', children: 'children' }}
    />
  );
};

export default ProvinceList;
