/**
 * @Description 存量门店存续比例分布
 */

// import { surroundCategoryPOIDataList } from '@/common/api/siteselectionmap';
import V2Table from '@/common/components/Data/V2Table';
import { isNotEmptyAny } from '@lhb/func';
// import { isArray } from '@lhb/func';
import { FC, useMemo } from 'react';
// import { v4 } from 'uuid';
interface OldStoreDetailProps{
  [k:string]:any
}
const OldStoreDetail: FC<OldStoreDetailProps> = ({
  dataSource,
}) => {
  // const loadData = async (_params: any) => {

  //   console.log('detail', detail, _params);
  //   // const { page } = _params;
  //   // // 更新page
  //   // // const target = tabsParamsRef.current?.[+customActive];
  //   // // if (target) {
  //   // //   target.page = page;
  //   // //   setTabsParams(tabsParamsRef.current);
  //   // // }
  //   // const data = await surroundCategoryPOIDataList({ page: 1 }).finally(() => {
  //   //   // setIsLoading(false);
  //   // });
  //   // const { objectList } = data;
  //   // const list = isArray(objectList) ? objectList.map((item: any, index: number) => {
  //   //   const uid = v4();
  //   //   return {
  //   //     ...item,
  //   //     id: uid,
  //   //     idx: (page - 1) * 10 + (index + 1)
  //   //   };
  //   // }) : [];
  //   return {
  //     dataSource: [],
  //     // count: data.totalNum,
  //   };
  // };
  const data = useMemo(() => isNotEmptyAny(dataSource) ? dataSource.map((item, index) => ({ ...item, idx: index })) : [], [dataSource]);
  /** 表头 */
  const defaultColumns = [
    {
      key: 'idx',
      title: '序号',
      width: 52,
      render: (text, record, index) => <>{index + 1}</>,
      // render: (value) => `${value ? `${value}、` : '-'}`,
    },
    {
      key: 'name',
      title: '名称',
      width: 222,
      ellipsis: true,
      render: (value) => value || '-'
      // <div className={styles.colText} >{value || '-'}</div>
    },
    {
      key: 'address',
      title: '地址',
      width: 222,
      ellipsis: true,
      render: (value) => value || '-'
      // <div className={styles.colText}>{value || '-'}</div>
    },
  ];
  return (
    <V2Table
      // filters={params}
      rowKey='id' // 设置一个每一行数据唯一的键值
      defaultColumns={defaultColumns}
      hideColumnPlaceholder
      onFetch={() => ({ dataSource: data })}
      pagination={false}
    />
  );
};

export default OldStoreDetail;
