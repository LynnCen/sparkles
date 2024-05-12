/**
 * @Description 周边详情-单个poi列表
 */

import { FC, useEffect, useState } from 'react';
// import { isNotEmpty } from '@lhb/func';
import ListItem from './ListItem';
import VirtualTable from './VituralTable';
import { post } from '@/common/request';

const PageSize = 100;
const DefaultPOIIcon = 'https://staticres.linhuiba.com/project-custom/locationpc/ic_dianpu.png';

const PoiTable: FC<any> = ({
  tabItem, // 当前二级tab项目内容
  poiMapRef,
  setLoading, // 加载状态
  params, // 接口参数
  radius, // 半径变化的时候需要重新请求接口获取数据
  // setPoiCount, // 设置poi点位总数
  activePoiTypeList = [],
  setActivePoiTypeList, // poi点位list
}) => {
  const [tableData, setTableData] = useState<any>([]);

  useEffect(() => {
    tabItem && getList();
  }, [tabItem.code, radius, params]);

  /**
   * @description 轮询请求数据
   */
  const getList = async () => {
    let total = 0;
    let indexNo = 0;
    let curAllList = activePoiTypeList.length ? [...activePoiTypeList] : []; // 当前已有的数据
    // 第一次请求
    setLoading(true);
    const _params = {
      page: 1,
      size: PageSize,
      ...params,
      code: tabItem.code,
    };
    // https://yapi.lanhanba.com/project/511/interface/api/69789
    const res = await post('/surround/poi/level_page', _params).finally(() => setLoading(false));
    total = res.totalNum;
    // setPoiCount && setPoiCount(total);
    setActivePoiTypeList({
      list: res.objectList || [],
      icon: tabItem.icon || DefaultPOIIcon,
      attributeName: tabItem.attributeName || tabItem.name
    });
    poiMapRef.createPointMarker(res.objectList || [], tabItem.icon || DefaultPOIIcon);
    curAllList = [...curAllList, ...res?.objectList?.map((item) => {
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
      // https://yapi.lanhanba.com/project/511/interface/api/69789
      const res = await post('/surround/poi/level_page', {
        ..._params,
        page: index + 1,
        size: PageSize,
      }).finally(() => setLoading(false));
      // 数据更新
      curAllList = [...curAllList, ...res?.objectList?.map((item) => {
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
      poiMapRef.createPointMarker(res.objectList || [], tabItem.icon || DefaultPOIIcon);
      if (Math.ceil(total / PageSize) < index) {
        break;
      }
    }
  };

  const defaultColumns = [
    {
      key: 'a',
      dataIndex: 'a',
      title: '',
      render: (record: any) => <ListItem
        item={record}
        handleItem={(itm) => {
          console.log(`点击item`, itm.name, itm.id);
        }}
      />
    }
  ];

  return (
    <VirtualTable
      rowKey='index'
      columns={defaultColumns}
      dataSource={tableData}
      scroll={{ x: 288, y: 396 }}
      showHeader={false}
    />
  );
};

export default PoiTable;

