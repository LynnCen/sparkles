/**
 * @Description 对应一级分类的二级分类下的分页tables
 */

import { FC } from 'react';
import { v4 } from 'uuid';
import { isArray } from '@lhb/func';
import { surroundCategoryPOIDataList } from '@/common/api/siteselectionmap';
// import cs from 'classnames';
// import styles from './entry.module.less';
import V2Table from '@/common/components/Data/V2Table';

const List: FC<any> = ({
  params,
  // tabsParamsRef,
  // setTabsParams,
  setIsLoading
}) => {
  const loadData = async (_params: any) => {
    const { page } = _params;
    // 更新page
    // const target = tabsParamsRef.current?.[+customActive];
    // if (target) {
    //   target.page = page;
    //   setTabsParams(tabsParamsRef.current);
    // }
    const data = await surroundCategoryPOIDataList(_params).finally(() => {
      setIsLoading(false);
    });
    const { objectList } = data;
    const list = isArray(objectList) ? objectList.map((item: any, index: number) => {
      const uid = v4();
      return {
        ...item,
        id: uid,
        idx: (page - 1) * 10 + (index + 1)
      };
    }) : [];
    return {
      dataSource: list,
      count: data.totalNum,
    };
  };
  /** 表头 */
  const defaultColumns = [
    {
      key: 'idx',
      title: '序号',
      dragChecked: true,
      width: 60,
      // render: (text, record, index) => <>{index + 1}、</>,
      render: (value) => `${value ? `${value}、` : '-'}`,
    },
    {
      key: 'name',
      title: '名称',
      dragChecked: true,
      width: 400,
      render: (value) => value || '-',
    },
    {
      key: 'address',
      title: '地址',
      dragChecked: true,
      width: 400,
      render: (value) => value || '-',
    },
  ];

  return (
    <V2Table
      filters={params}
      rowKey='id' // 设置一个每一行数据唯一的键值
      defaultColumns={defaultColumns}
      hideColumnPlaceholder
      onFetch={loadData}
      emptyRender={true}
      paginationConfig={{
        showSizeChanger: false
      }}
    />
  );
};

export default List;
