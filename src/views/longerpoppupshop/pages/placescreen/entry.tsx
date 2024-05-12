/*
 * @Author: xiangshangzhi
 * @Date: 2023-05-26 11:01:12
 * @FilePath: \console-pc\src\views\longerpoppupshop\pages\placescreen\entry.tsx
 * @Description:  场地管理（慢闪店-追觅）
 */

import { useState } from 'react';
import cs from 'classnames';
import { post } from '@/common/request';

import Filter from './components/Filter';
import List from './components/List';

import { FilterParmas, PlaceListResponse } from './ts-config';
import styles from './entry.module.less';

const PlaceScreen = () => {
  const [filterParams, setFilterParams] = useState<FilterParmas>({} as FilterParmas);

  const onSearch = (values: FilterParmas) => {
    setFilterParams(values);
  };

  const loadData = async (params) => {
    // return { dataSource: PlaceList, count: 3 };

    // https://yapi.lanhanba.com/project/353/interface/api/52471
    const url = '/zm/chancePoint/pages';
    const result: PlaceListResponse = await post(url, params, true);
    return { dataSource: result.data, count: result?.meta?.total };
  };

  return (
    <div className={cs(styles.container, 'bg-fff', 'pd-20')}>
      <>
        <Filter onSearch={onSearch} />
        <List filterParams={filterParams} loadData={loadData} refresh={() => setFilterParams({ ...filterParams })} />
      </>
    </div>
  );
};

export default PlaceScreen;
