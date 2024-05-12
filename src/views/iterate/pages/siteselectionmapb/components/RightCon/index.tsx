/**
 * @Description 右侧列表
 */
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { isArray } from '@lhb/func';
import { Spin } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import { PROVINCE_LEVEL } from '@/common/components/AMap/ts-config';
// import { industryCircleList } from '@/common/api/networkplan';
import cs from 'classnames';
import styles from './index.module.less';
import Row from './Row';
import Sort from './Sort';
import List from './List';
import AreaDetailDrawer from '@/views/iterate/pages/siteselectionmap/components/AreaDetailDrawer';
import Tool from './Tool';
import V2Empty from '@/common/components/Data/V2Empty';
// import SkinTool from './SkinTool/SkinTool';
import PointDetailDrawer from './PointDetailDrawer';
// import HeatCon from './HeatCon';


const RightCon:FC<any> = ({
  mapIns,
  mapHelpfulInfo,
  locationInfo,
  searchParams,
  // getParams, // 获取商圈列表的入参
  provinceCityComData, // 左上角选中的省市数据
  // mapParams, // 省市区ids
  // filtersParams, // 左侧筛选项参数
  itemData, // 选中的商圈项
  poiData, // 地址搜索
  listData, // 列表数据
  setItemData,
  rankSort,
  isSync,
  setIsSync,
  setRankSort,
  firstLevelCategory, // 商圈类型数据
  isLoading, // 右侧是否加载中
  setOpenList, // 设置右边展开
  openList, // 右侧是否展开
  // isPositioning, // 是否正在定位中
  districtCluster, // 点击区时
  setDistrictCluster,
  hasOtherData, // 是否存在生成中的数据
}) => {
  const { level } = mapHelpfulInfo;
  const [distanceSort, setDistanceSort] = useState<boolean>(false);
  // const [changeState, setChangeState] = useState<number>(0);
  // const dataRef: any = useRef({
  //   page: 1,
  //   size: 50,
  // });
  // const paramsRef: any = useRef({
  //   cityIds: [],
  //   districtIds: []
  // });
  const [drawerData, setDrawerData] = useState<any>({ // 详情抽屉
    open: false,
    id: '',
    rankVal: null
  });
  const [pointDrawerData, setPointDrawerData] = useState<any>({
    open: false,
    businessId: null,
    pointId: null
  });// 点位详情抽屉

  const [showBack, setShowBack] = useState(false); // 是否显示返回顶部
  const lastIndexRef: any = useRef(0); // 记录列表关闭前的索引
  const listRef: any = useRef();

  // listData变化时，清空itemData
  useEffect(() => {
    const { isFirst } = itemData;
    if (isFirst) return;
    setItemData({
      visible: false, // 是否显示详情
      id: null,
      detail: null, // 存放详情相关字段
      isFirst: false
    });
    lastIndexRef.current = 0;
  }, [listData]);

  // 市级别时才显示
  const targetCity = useMemo(() => {
    if (isArray(provinceCityComData) && provinceCityComData.length === 2 && level > PROVINCE_LEVEL) {
      return provinceCityComData[1];
    }
    return null;
  }, [provinceCityComData, level]);

  const backTop = () => {
    listRef.current && listRef.current.scrollToItem(0, 'start');
  };

  // useEffect(() => {
  //   console.log(`listData变化了`, listData);
  // }, [listData]);

  // useEffect(() => {
  //   if (!targetCity) return;
  //   setListData([]);
  //   dataRef.current.page = 1;
  //   loadData();
  // }, [filtersParams, changeState, targetCity]);
  // 监听区的变化以及城市的变化
  // useEffect(() => {
  //   const { cityIds, districtIds } = mapParams;
  //   const params = {
  //     cityIds,
  //     districtIds
  //   };
  //   if (isEqual(paramsRef, params)) return;
  //   setChangeState((state) => state++);
  // }, [mapParams]);

  // const loadData = async () => {
  //   console.log(`loadData`);

  //   if (isLoading) return;
  //   setIsLoading(true);
  //   const _params = getParams();

  //   // 不传可视范围
  //   Reflect.deleteProperty(_params, 'maxLat');
  //   Reflect.deleteProperty(_params, 'maxLng');
  //   Reflect.deleteProperty(_params, 'minLat');
  //   Reflect.deleteProperty(_params, 'minLng');
  //   const params = {
  //     page: dataRef.current.page,
  //     size: dataRef.current.size,
  //     ..._params
  //   };
  //   try {
  //     const data = await industryCircleList(params);
  //     const { totalNum, objectList } = data || {};
  //     setTotal(totalNum);
  //     const targetList = isArray(objectList) ? objectList.map((item) => ({ ...item, isFrontEndExpanded: false })) : [];
  //     if (listData.length === 0) { // 第一次
  //       const placeholderData = new Array(totalNum - dataRef.current.size).fill(true).map(() => ({}));
  //       setListData([...targetList, ...placeholderData]);
  //     } else { // 替换对应页数的数据
  //       const startIndex = dataRef.current.page * dataRef.current.size - dataRef.current.size;
  //       const listDataCopy = deepCopy(listData);
  //       listDataCopy.splice(startIndex, dataRef.current.size, ...targetList);
  //       setListData(listDataCopy);
  //     }
  //     dataRef.current.page++;
  //   } catch (error) {
  //     console.log(`右侧商圈列表加载出错`, error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  return <>
    {/* 热力图 */}
    {/* <HeatCon
      mapIns={mapIns}
      mapHelpfulInfo={mapHelpfulInfo}
    /> */}
    {
      targetCity ? <div className={styles.wrapperCon}>
        {/* 推荐个数行 */}
        <Row
          total={listData?.length || 0}
          openList={openList}
          targetCity={targetCity}
          districtCluster={districtCluster}
          setOpenList={setOpenList}
          setDistrictCluster={setDistrictCluster}
        />
        <div className={cs(styles.listCon, openList ? '' : styles.isFold)}>
          <Sort
            searchParams={searchParams}
            poiData={poiData}
            setRankSort={setRankSort}
            setDistanceSort={setDistanceSort}
            setIsSync={setIsSync}
            hasOtherData={hasOtherData}
            rankSort={rankSort}
          />
          <List
            mapIns={mapIns}
            lastIndexRef={lastIndexRef}
            listRef={listRef}
            // dataRef={dataRef}
            openList={openList && targetCity}
            isSync={isSync}
            total={listData?.length || 0}
            poiData={poiData}
            rankSort={rankSort}
            distanceSort={distanceSort}
            itemData={itemData}
            listData={listData}
            firstLevelCategory={firstLevelCategory}
            drawerData={drawerData}
            setShowBack={setShowBack}
            setDrawerData={setDrawerData}
            setItemData={setItemData}
            setPointDrawerData={setPointDrawerData}
          />
          <Spin spinning={isLoading} className={styles.loadingCon}/>
          {
            !isLoading && listData?.length === 0 ? <div
              style={{ width: '100%', height: 'calc(100% - 100px)' }}>
              <V2Empty
                type='search'
                centerInBlock
              />
            </div> : <></>
          }
          {/* 返回顶部 */}
          {
            showBack ? <div
              className={styles.backCon}
              onClick={backTop}
            >
              <ArrowUpOutlined className='fs-16'/>
            </div> : <></>
          }
        </div>
      </div> : <></>
    }

    <Tool
      mapIns={mapIns}
      locationInfo={locationInfo}
      openList={openList && targetCity}
    />
    {/* 商圈详情抽屉 */}
    <AreaDetailDrawer
      drawerData={drawerData}
      pointDrawerData={pointDrawerData}
      setDrawerData={setDrawerData}
      setPointDrawerData={setPointDrawerData}
    />
    {/* 点位详情抽屉 */}
    <PointDetailDrawer
      pointDrawerData={pointDrawerData}
      setPointDrawerData={setPointDrawerData}
      setDrawerData={setDrawerData}
      drawerData={drawerData}
    />
  </>;

};
export default RightCon;
