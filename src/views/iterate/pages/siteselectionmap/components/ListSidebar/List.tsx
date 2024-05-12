/**
 * @Description 列表内容
 */

import { FC, useEffect, useMemo, useRef, useState } from 'react';
import cs from 'classnames';
import styles from './index.module.less';
import VirtualTable from './components/VirtualTable';
import ListItem from './components/ListItem';
import { isArray, throttle } from '@lhb/func';
import V2Empty from '@/common/components/Data/V2Empty';
import { useMethods } from '@lhb/hook';
import { Dropdown, Spin } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
// import InfiniteLoader from 'react-window-infinite-loader';

const SortRowHeight = 37;

/*
  排序key使用接口约定的sortFied字段的可能值
  枚举定义来源：https://yapi.lanhanba.com/project/546/interface/api/64994
*/
const SortKeyDistance = 'lat_lng'; // 距离排序的key

const sortType = [
  {
    key: 'main_brands_score',
    label: '推荐排序' // 评分
  },
  {
    key: SortKeyDistance,
    label: '距离优先'
  },
  {
    key: 'resident_population',
    label: '按常住人口数量排序'
  },
  {
    key: 'milk_tea_stores',
    label: '按奶茶商家数量排序'
  },
  {
    key: 'food_stores',
    label: '按餐饮商家数量排序'
  }
];

const List: FC<any> = ({
  open,
  pageRef,
  list,
  locationInfo,
  poiData,
  loading,
  areaChangedLabels,
  searchParams, // 接口入参
  setSearchParams, // 设置接口请求参数
  setDetailData,
  appendData, // 加载下一页
}) => {
  const wrapperRef: any = useRef(null);
  const [virtualListHeight, setVirtualListHeight] = useState<number>(0); // 虚拟表展示高度
  const [selectedSort, setSelectedSort] = useState<any>(sortType[0]);
  const [dataSource, setDataSource] = useState<any[]>([]);

  useEffect(() => {
    // 列表展开时高度变化有0.2s动画，延时获取高度
    open && setTimeout(() => {
      updateVirtualListHeight();
    }, 300);
  }, [open]);

  /**
   * @description 筛选请求参数中排序变化时，更新组件中的选中排序项
   */
  useEffect(() => {
    const { sortField } = searchParams;

    // 无排序参数，指定默认项
    if (!sortField) {
      setSelectedSort(sortType[0]);
      return;
    }

    // 排序参数就是当前选中排序项
    if (selectedSort && sortField === selectedSort.key) return;

    // 切换排序选中项
    const selSortItems = sortType.filter(itm => itm.key === sortField);
    setSelectedSort(selSortItems.length ? selSortItems[0] : sortType[0]);

  }, [searchParams?.sortField]);

  /**
   * @description 当前请求参数中的行政区是否就是定位的行政区
   *
   *  判断成立逻辑：定位成功的前提下，locationInfosearchParams.districtIds中是否包含locationInfo?.districtId
   */
  const isInCurrentDistrict = useMemo(() => {
    return isArray(searchParams.districtIds) && !!locationInfo?.districtId && searchParams.districtIds.includes(locationInfo?.districtId);
  }, [locationInfo, searchParams.districtIds]);

  /**
   * @description 是否展示【按距离排序】
   *
   * 判断成立逻辑：地图展示的是定位行政区，或有poi搜索点位
   */
  const hasSortTypeDistance = useMemo(() => {
    return isInCurrentDistrict || !!poiData;
  }, [isInCurrentDistrict, poiData]);

  useEffect(() => {
    if (!isInCurrentDistrict && !poiData && /* selectedSort && SortKeyDistance === selectedSort.key*/ SortKeyDistance === searchParams.sortField) {
      // 特殊处理，【按距离排序】选项隐藏时，并且之前被选中，现在需要切换选中为默认排序，并清空经纬度参数
      methods.sortHandle(sortType[0]);
    } else {
      const params = {
        ...searchParams,
        ...getLngLatParams(),
      };
      setSearchParams(params);
    }
  }, [poiData, isInCurrentDistrict]);

  /**
   * @description poi搜索或处在本行政区时，需要额外传经纬度来获取商圈列表中的距离字段，否则清空经纬度
   */
  const getLngLatParams = () => {
    if (poiData) { // poi搜索时，使用poi经纬度
      const { latitude: lat, longitude: lng } = poiData;
      // const { lat, lng } = location;
      return {
        lat,
        lng,
      };
    } else if (isInCurrentDistrict) { // 处在本行政区时,使用定位位置
      const { lat, lng } = locationInfo;
      return {
        lat,
        lng,
      };
    } else { // 清空经纬度
      return {
        lat: undefined,
        lng: undefined,
      };
    }
  };

  useEffect(() => {
    window.addEventListener('resize', throttle(() => {
      updateVirtualListHeight();
    }, 300));

    return () => {
      window.removeEventListener('resize', throttle(() => {
        updateVirtualListHeight();
      }, 300));
    };
  }, []);

  useEffect(() => {
    if (!isArray(list)) {
      setDataSource([]);
      return;
    }

    // 没有标签变动信息
    if (!isArray(areaChangedLabels) || !areaChangedLabels.length) {
      setDataSource(list);
      return;
    }

    // 标签有临时变动的商圈ids
    const targetIds = areaChangedLabels.map(itm => itm.id);
    const tmpList = list.map(itm => {
      if (targetIds.includes(itm.id)) {
        const info = areaChangedLabels.find(obj => obj.id === itm.id);
        if (info && info.labelTypeMap) {
          // 需要将标签字段labelTypeMap替换为临时信息
          const { labelTypeMap } = info;
          return {
            ...itm,
            labelTypeMap
          };
        }
      }
      // 默认情况，使用接口返回的数据
      return itm;
    });
    setDataSource(tmpList);
  }, [list, areaChangedLabels]);

  /**
   * @description 初始化展示以及窗口resize时，重新设置虚拟列表高度
   */
  const updateVirtualListHeight = () => {
    const targetNode = wrapperRef.current;
    if (!targetNode) return;
    const { height } = targetNode.getBoundingClientRect();
    height && setVirtualListHeight(Math.max(0, height - SortRowHeight));
  };

  const columns = [
    {
      key: 'a',
      dataIndex: 'a',
      title: '',
      render: (record: any, index: any) => <ListItem
        item={record}
        rank={index + 1}
        handleItem={(itm) => {
          // console.log(`选中项item`, itm);
          setDetailData({
            visible: true, // 是否显示详情
            id: itm?.id,
            detail: itm // 存放详情相关字段
          });
        }}
      />
    },
  ];

  const methods = useMethods({
    sortHandle(target: any) { // 排序
      const { key } = target;

      setSelectedSort(target);
      setSearchParams({
        ...searchParams,
        sortField: key,
        sort: 'desc',
        ...getLngLatParams(),
      });
    },
  });

  const dropdownItems = sortType.filter(itm => !(!hasSortTypeDistance && itm.key === SortKeyDistance)).map((itm) => ({
    key: itm.key,
    label: (
      <div onClick={() => methods.sortHandle(itm)}>
        {itm.label}
      </div>
    ),
  }));

  const renderSortButton = () => {
    return <Dropdown
      menu={{
        items: dropdownItems,
        selectable: true,
        defaultSelectedKeys: [dropdownItems[0].key], // 默认选中项
        selectedKeys: [selectedSort?.key || dropdownItems[0].key] // 如果不加这行，代码控制选中菜单项情况下，菜单选中项不高亮
      }}
      placement={'bottomLeft'}
    >
      <div
        className={cs(
          selectedSort.key !== sortType[0].key ? 'c-006' : 'c-222',
          'fs-12 pointer pl-12',
          styles.rankCon
        )}>
        <span className='pr-4'>
          {selectedSort.label}
        </span>
        <CaretDownOutlined className={cs(styles.triangleIcon, selectedSort.key !== sortType[0].key && styles.triangleIconSel)}/>
      </div>
    </Dropdown>;
  };

  const loadMore = () => {
    if (loading) return;
    if (pageRef.current !== 0) {
      pageRef.current += 1;
      appendData && appendData();
    }
  };

  return (
    <div ref={wrapperRef} className={cs(styles.listCon, open ? '' : styles.isFold)}>
      <div className={styles.sortRow} style={{ height: SortRowHeight }}>
        {renderSortButton()}
      </div>
      <Spin spinning={loading}>
        {(isArray(dataSource) && dataSource.length) ? <VirtualTable
          rowKey='index'
          columns={columns}
          dataSource={dataSource}
          scroll={{ y: virtualListHeight, x: '300px' }}
          showHeader={false}
          loadMore={loadMore}
        /> : <V2Empty className='mt-100'/>}
      </Spin>
      {/* {!(isArray(list) && list.length) ? <V2Empty className='mt-100'/> : <></>} */}
    </div>
  );
};

export default List;
