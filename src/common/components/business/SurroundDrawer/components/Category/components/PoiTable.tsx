/**
 * @Description 周边详情-单个poi列表
 */

import { FC, useEffect, useState } from 'react';
import { isNotEmpty } from '@lhb/func';
// import { targetValSort } from '@/common/utils/ways';
import VirtualTable from './VituralTable';
import { modelCirclePoiList } from '@/common/api/recommend';
import { getSourroundPois } from '@/common/api/surround';
// import V2Message from '@/common/components/Others/V2Hint/V2Message';

const PoiTable: FC<any> = ({
  tabItem, // 当前二级tab项目内容
  poiMapRef,
  setLoading, // 加载状态
  isShowAddress,
  params, // 接口参数
  // getPoiList,
  radius, // 半径变化的时候需要重新请求接口获取数据
  setPoiCount, // 设置poi点位总数
  activePoiTypeList = [],
  setActivePoiTypeList, // poi点位list
  isReport = false
}) => {

  const [tableData, setTableData] = useState<any>([]);

  useEffect(() => {
    tabItem && getList();

    // return () => {
    //   getList();
    // };
  }, [tabItem, radius]);


  // const loadData = async () => {
  //   const list = await getPoiList();
  //   const dataList = Array.isArray(list) ? list.map((itm, index) => ({ ...itm, index: index + 1 })) : [];
  //   setTableData(dataList);
  // };;


  /**
   * @description 轮询请求数据
   */
  const getList = async () => {
    let total = 0;
    let indexNo = 0;
    let curAllList = activePoiTypeList.length ? [...activePoiTypeList] : []; // 当前已有的数据
    // 第一次请求
    setLoading(true);
    const _params = isReport ? {
      attributeId: tabItem.id,
      reportId: 278,
      page: 1,
      size: 500,
      ...params,
      categoryId: undefined
    } : {
      page: 1,
      size: 500,
      ...params,
      code: tabItem.code,
    };
    const api = isReport ? modelCirclePoiList : getSourroundPois;
    const res = await api(_params);
    total = res.totalNum;
    setPoiCount(total);
    setActivePoiTypeList({
      list: res.objectList,
      icon: tabItem.icon,
      attributeName: tabItem.attributeName || tabItem.name
    });
    poiMapRef.current?.createPointMarker(res.objectList, tabItem.icon);
    curAllList = [...curAllList, ...res?.objectList.map((item) => {
      indexNo++;
      return ({
        ...item,
        index: indexNo
      });
    })];
    setTableData(curAllList);
    // setLoading(false);
    // ----------
    // 第二次后面的循环请求数据
    for (let index = 1; curAllList.length < total; index++) {
      const res = await getSourroundPois({
        ..._params,
        page: index + 1,
        size: 500,
      });
      // 数据更新
      curAllList = [...curAllList, ...res?.objectList.map((item) => {
        indexNo++;
        return ({
          ...item,
          index: indexNo
        });
      })];
      setActivePoiTypeList((state) => ({
        ...state,
        list: curAllList, // 更新数据
      }));
      setTableData(curAllList);
      poiMapRef.createPointMarker(res.objectList, tabItem.icon);
    }
    setLoading(false);

  };



  const defaultColumns = isShowAddress ? [
    { key: 'index', dataIndex: 'index', title: '序号', width: 64, render: (_, record, index) => index + 1 },
    { key: 'name', dataIndex: 'name', title: '名称', width: 200, importWidth: true },
    { key: 'address', dataIndex: 'address', title: '地址', render: (val) => isNotEmpty(val) ? val : '-' },
    { key: 'distance', dataIndex: 'distance', title: '距查询点位距离', render: (text) => isNotEmpty(text) ? `${text}m` : '-' },
  ] : [
    { key: 'index', dataIndex: 'index', title: '序号', width: 110, render: (_, record, index) => index + 1 },
    { key: 'name', dataIndex: 'name', title: '名称', width: 185, importWidth: true },
    { key: 'distance', dataIndex: 'distance', title: '距查询点位距离', width: 140, render: (text) => isNotEmpty(text) ? `${text}m` : '-' },
  ];

  return (
    <>
      <VirtualTable
        rowKey='index'
        columns={defaultColumns}
        dataSource={tableData}
        scroll={{ y: 300, x: '300px' }}
      />
      {/* <V2Table
        type='easy'
        rowKey='index'
        pagination={false}
        defaultColumns={defaultColumns}
        hideColumnPlaceholder={true}
        scroll={{ x: 'max-content', y: 264 }}
        onFetch={fetchData}
        className={'mt-12'}
      /> */}
    </>

  );
};

export default PoiTable;

