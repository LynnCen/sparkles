/**
 * @Description 商圈列表
 */

import { FC, memo, useContext, useEffect, useState } from 'react';
// import cs from 'classnames';
// import styles from './index.module.less';
import { VariableSizeList } from 'react-window';
// https://www.npmjs.com/package/react-window
// import { areEqual } from 'react-window';
import { isArray, isEqual } from '@lhb/func';
import AutoSizer from 'react-virtualized-auto-sizer';
// import InfiniteLoader from 'react-window-infinite-loader';
import ListItem from './ListItem';
import { allData, businessStatus, collecting, creating, isResetContext } from '../../../ts-config';
// import IconFont from '@/common/components/IconFont';

// function getRandomInt(min, max) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

const List: FC<any> = ({
  mapIns,
  // dataRef, // 分页数据
  lastIndexRef, // 记录关闭时的索引
  listRef, // 列表Ref
  // total, // 总数
  isSync,
  rankSort, // 前xx名
  openList, // 是否展开
  itemData, // 选中的商圈
  firstLevelCategory,
  poiData,
  distanceSort, // 是否是距离排序
  listData, // 列表数据
  // loadData, // 加载列表数据的函数
  setDrawerData, // 设置详情抽屉
  setItemData,
  setShowBack, // 是否显示滚动到顶部
  setPointDrawerData,
}) => {
  const { collectList }: any = useContext(isResetContext);

  // const listRef: any = useRef();
  // const visibleStartIndexRef = useRef(0);
  // const selectedIndexRef = useRef(0);
  const [variableListData, setVariableListData] = useState<any[]>([]);
  const [refLoaded, setRefLoaded] = useState(false);
  // const [showBack, setShowBack] = useState(false); // 是否显示返回顶部

  // 拿到listRef之后，监听itemData、variableListData、openList变化
  useEffect(() => {
    if (!openList) {
      setRefLoaded(false);
      return;
    };
    const { id } = itemData || {};
    // 列表数据变化时 | 收起后又展开时，滚动到对应位置
    if (!id && refLoaded && variableListData?.length && listRef.current) {
      // 重置尺寸
      // listRef.current.resetAfterIndex(visibleStartIndexRef.current);
      // visibleStartIndexRef.current = 0;
      // lastIndexRef.current = 0;
      const len = variableListData.length;
      for (let i = 0; i < len; i++) {
        if (variableListData[i]?.isFrontEndExpanded) {
          variableListData[i].isFrontEndExpanded = false;
          listRef.current.resetAfterIndex(i);
        }
      }
      // 没有itemData而且弹窗关闭前的索引不为0，滚动之前的位置
      listRef.current.scrollToItem(lastIndexRef.current || 0, 'start');
      return;
    }
    // 列表打开状态时设置itemData后，滚动到对应的位置
    const index = variableListData.findIndex((item: any) => item.id === id);
    if (index > -1 && listRef.current) {
      const target = variableListData[index];
      target && (target.isFrontEndExpanded = true);

      // 将其余项收起
      const len = variableListData.length;
      for (let i = 0; i < len; i++) {
        if (i !== index && variableListData[i]?.isFrontEndExpanded) {
          variableListData[i].isFrontEndExpanded = false;
          listRef.current.resetAfterIndex(i);
        }
      }
      lastIndexRef.current = index;
      listRef.current.scrollToItem(index, 'start');
      listRef.current.resetAfterIndex(index);
    }
  }, [itemData, variableListData, refLoaded, openList]);

  useEffect(() => {
    if (!(isArray(listData) && listData.length)) {
      setVariableListData([]);
    };
    const { value } = rankSort;
    // 选择排名时
    const targetListData = listData.filter((item) => {
      if (value === creating) { // 生成中的数据
        return item?.status === businessStatus.NEW;
      } else if (value === collecting) { // 被收藏的数据
        return collectList.includes(item?.id);
      } else if (value === allData) { // 全部数据
        return true;
      } else {
        return item.rank < value;
      }
    });
    if (poiData) { // 搜索了地址
      const { longitude: lng, latitude: lat } = poiData;
      const targetData = targetListData.map((item: any) => {
        let distance = '';
        if (+item.lng && +item.lat && +lng && +lat) {
          distance = window.AMap.GeometryUtil.distance([item.lng, item.lat], [lng, lat]);
        }
        return {
          ...item,
          distance,
          isFrontEndExpanded: false
        };
      });
      setVariableListData(targetData);
      if (distanceSort) { // 选择了排序
        const sortData = targetData.sort((a, b) => {
          const targetA = a?.distance;
          const targetB = b?.distance;
          return targetA - targetB;
        });
        setVariableListData(sortData);
        lastIndexRef.current = 0;
        setItemData({
          visible: false, // 是否显示详情
          id: null,
          detail: null, // 存放详情相关字段
          isFirst: false
        });
      }
      return;
    }
    setVariableListData(targetListData.map((item: any) => ({ ...item, isFrontEndExpanded: false })));
    // setVariableListData(listData.map((item: any) => ({ ...item, isFrontEndExpanded: false })));
  }, [listData, distanceSort, poiData, rankSort, collectList]);

  useEffect(() => {
    // 切换排名时，清空原本的状态及高度
    if (variableListData?.[lastIndexRef.current] && listRef.current) {
      variableListData[lastIndexRef.current].isFrontEndExpanded = false;
      listRef.current.resetAfterIndex(lastIndexRef.current);
    }
    lastIndexRef.current = 0;
    // 清空选中
    setItemData({
      visible: false, // 是否显示详情
      id: null,
      detail: null, // 存放详情相关字段
      isFirst: false
    });
    backTop();
  }, [rankSort?.key]);

  // const totalVal = useMemo(() => {
  //   const { value } = rankSort;
  //   if (value) { // 0 代表全部
  //     if (total < value) return total;
  //     return value;
  //   }
  //   return total;
  // }, [total, rankSort]);

  // const loadTargetData = async (index) => {
  //   dataRef.current.page = Math.ceil(index / dataRef.current.size);
  //   await loadData();
  //   listRef.current && listRef.current.scrollToItem(index, 'start');
  // };
  // 每项的高度
  const getItemSize = (index: number) => {
    // 展开的高度 ：收起的高度
    return variableListData[index]?.isFrontEndExpanded ? variableListData[index]?.status === businessStatus.NEW ? 170 : 600 : 50;
  };

  // const isItemLoaded = (index) => {
  //   const target = listData[index] || {};
  //   // console.log(`isItemLoaded`, index);
  //   return Object.entries(target)?.length > 0;
  // };

  const ItemRenderer = ({ index, style, data }) => {
    return (
      <ListItem
        mapIns={mapIns}
        listRef={listRef}
        index={index}
        style={style}
        item={data[index]}
        listData={data}
        isSync={isSync}
        firstLevelCategory={firstLevelCategory}
        setDrawerData={setDrawerData}
        setItemData={setItemData}
        setPointDrawerData={setPointDrawerData}
      />
    );
  };

  // const ItemRenderer = memo(
  //   props => {
  //     const { index, style, data } = props as any;
  //     // console.log(`index`, index, data);
  //     // return <div style={style}>Row {index}</div>;
  //     return (
  //       <ListItem
  //         mapIns={mapIns}
  //         listRef={listRef}
  //         index={index}
  //         style={style}
  //         item={data[index]}
  //         listData={data}
  //         firstLevelCategory={firstLevelCategory}
  //         setDrawerData={setDrawerData}
  //         setItemData={setItemData}
  //       />
  //     );
  //   },
  //   areEqual
  // );

  const onItemsRendered = ({ visibleStartIndex }) => {
    // 组件重新渲染时，visibleStartIndex是0，这里只记录重新渲染之前的索引
    if (visibleStartIndex > 0 && lastIndexRef.current > 0) {
      // visibleStartIndexRef.current = visibleStartIndex; // 记录当前可视区域第一项的索引
      lastIndexRef.current = visibleStartIndex;
    }
    // 确保在useEffect能拿到ref值
    setRefLoaded(true);
  };
  // 监听虚拟列表滚动
  const onScroll = ({
    // scrollDirection, // 'forward' 或 'backward',
    scrollOffset, // 当前的滚动偏移量
    // scrollUpdateWasRequested // 滚动是否是由用户操作引起的
  }) => {
    setShowBack(scrollOffset > 500);
  };
  const backTop = () => {
    listRef.current && listRef.current.scrollToItem(0, 'start');
  };
  // 这段注释代码不要删除
  // const onItemsRenderedWrapper = ({
  //   onItemsRendered,
  //   data
  // }) => {
  //   // ...rest
  //   return ({
  //     visibleStartIndex,
  //     visibleStopIndex,
  //     // overscanStartIndex,
  //     // overscanStopIndex
  //   }) => {
  //     onItemsRendered({
  //       // overscanStartIndex, // 被预渲染的第一项的索引
  //       // overscanStopIndex, // 被预渲染的最后一项的索引
  //       visibleStartIndex, // 可视区域的第一项的索引
  //       visibleStopIndex // 可视区域的最后一项的索引
  //     });
  //     console.log(`visibleStartIndex`, visibleStartIndex);
  //     console.log(`visibleStopIndex`, visibleStopIndex);
  //     // const startItem = data[visibleStartIndex];
  //     // const endItem = data[visibleStopIndex];
  //     console.log(`data`, data);
  //     // console.log(`startItem`, startItem);
  //     // console.log(`endItem`, endItem);
  //     // console.log(`visibleStopIndex`, visibleStopIndex);
  //     // dataRef.current.page
  //     // 向上检查一页 向下检查一页
  //     // if (visibleStartIndex > 0) {
  //     //   dataRef.current.page =
  //     // }
  //   };
  // };
  return <>
    {
    // https://www.npmjs.com/package/react-virtualized-auto-sizer

      <AutoSizer>
        {({ height, width }) => (
        // https://www.npmjs.com/package/react-window-infinite-loader
        // <InfiniteLoader
        //   isItemLoaded={isItemLoaded}
        //   itemCount={total}
        //   loadMoreItems={loadData}
        // >
        // {({ onItemsRendered, ref }) => (
          <VariableSizeList
            // ref={(list) => {
            //   // 将List的ref分别传递给InfiniteLoader和外部ref
            //   // 这个方法必须正确地设置InfiniteLoader的ref
            //   ref(list);
            //   listRef.current = list;
            // }}
            ref={listRef}
            // 列表中项目的总数
            itemCount={variableListData?.length}
            // 列表可视区域高度(减去(排序 + 排名所占的高度)
            height={height - 88 || 0}
            width={width}
            // 每一项的高度
            itemSize={getItemSize}
            itemData={variableListData}
            // onItemsRendered={onItemsRenderedWrapper({ onItemsRendered, data: listData })}
            onItemsRendered={onItemsRendered}
            onScroll={onScroll} // 监听滚动事件
          >
            {ItemRenderer}
          </VariableSizeList>
        )}
        {/* </InfiniteLoader> */}
        {/* )} */}
      </AutoSizer>
    }
  </>;
};

const areRowsEqual = (prevProps, nextProps) => {
  const { listData: lastData, poiData: prevPoiData } = prevProps;
  const { listData: nextData, poiData: nextPoiData } = nextProps;
  const lastDataIds = lastData.map((item) => item.id);
  const nextDataIds = nextData.map((item) => item.id);
  return isEqual(lastDataIds, nextDataIds) &&
  prevProps?.itemData?.id === nextProps?.itemData?.id &&
  prevProps?.drawerData?.id === nextProps?.drawerData?.id &&
  prevProps?.openList === nextProps?.openList &&
  isEqual(prevPoiData, nextPoiData) &&
  prevProps?.distanceSort === nextProps?.distanceSort &&
  prevProps?.rankSort?.key === nextProps?.rankSort?.key &&
  prevProps?.isSync === nextProps?.isSync;
};

export default memo(List, areRowsEqual);
