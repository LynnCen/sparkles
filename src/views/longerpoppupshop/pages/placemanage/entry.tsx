/*
 * @Author: xiangshangzhi
 * @Date: 2023-05-26 11:01:12
 * @FilePath: \console-pc\src\views\longerpoppupshop\pages\placemanage\entry.tsx
 * @Description: 场地管理（备选址管理）
 */
import { useState } from 'react';
import cs from 'classnames';

import { post } from '@/common/request';
import Filter from './components/Filter';
import List from './components/List';

import { FilterParmas, PlaceManageResponse } from './ts-config';
import styles from './entry.module.less';

const PlaceManage = () => {
  const [filterParams, setFilterParams] = useState<FilterParmas>({} as FilterParmas);
  const onSearch = (values: FilterParmas) => {
    setFilterParams(values);
  };

  const loadData = async (params) => {
    // https://yapi.lanhanba.com/project/353/interface/api/52499

    const url = '/zm/alternate/pages';

    const result: PlaceManageResponse = await post(url, params, true);
    const list = result.objectList;

    // 父子都得用name，否则店铺名称那一列显示不出来
    list.forEach((item) => {
      if (item.reports && item.reports.length) {
        item.reports.forEach((child) => {
          child['name'] = child.reportName;
        });
      }
    });

    return {
      dataSource: list,
      count: result.total,
    };
  };

  return (
    <div className={cs(styles.container, 'bg-fff', 'pd-20')}>
      <Filter onSearch={onSearch} />
      <List filterParams={filterParams} loadData={loadData} refresh={() => setFilterParams({ ...filterParams })} />
    </div>
  );
};

export default PlaceManage;
