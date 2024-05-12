import {
  FC,
  useEffect,
  useState,
  useRef,
  useMemo
} from 'react';
import {
  deepCopy,
  isArray,
  // recursionEach
} from '@lhb/func';
import { poiTreeBrand } from '@/common/api/selection';
import { useMapLevelAndCity } from '@/common/hook/useMapLevelAndCity';
import {
  COUNTRY_LEVEL,
  PROVINCE_LEVEL,
  CITY_LEVEL,
  PROVINCE_ZOOM,
  CITY_ZOOM,
  DISTRICT_ZOOM,
  DISTRICT_LEVEL
} from '@/common/components/AMap/ts-config';
import { useMethods } from '@lhb/hook';
import styles from './entry.module.less';
import AMap from '@/common/components/AMap';
import MapDrawer from '@/common/components/business/MapDrawer';
import ProvinceListForMap from '@/common/components/AMap/components/ProvinceListForMap';
import LevelLayer from '@/common/components/AMap/components/LevelLayer';
import TopCon from '@/common/components/AMap/components/TopCon';
import BrandTree from './components/BrandTree';
// import OverviewCount from './components/OverviewCount';
import OverviewRingProportion from './components/OverviewRingProportion';
import Points from './components/Points';
import DataBoard from './components/DataBoard';

/**
 * 页面交互逻辑说明
 * 1. 左侧树状结构，行业和品牌是互斥的，即勾选了行业后，不能勾选品牌，同理
 * 2. 勾选了行业时，在省和市级别下展示行业数量卡片，在区级别下展示该行业下的所有品牌
 * 3. 勾选了品牌时，在省和市级别下展示聚合的环状图
 * 4. 勾选了品牌时，在区级别下展示所有的品牌
 * ----------------------
 * 因交互修改，注释了一部分代码，但修改后的交互个人感觉并不如之前，故暂时保留注释的代码
 */
const POIMap: FC = () => {
  const dataRef: any = useRef({
    brandTreeData: [], // 存储最新的非搜索状态下的左侧树结构的数据（异步加载品牌，品牌的取消选中和选中）
    treeDataSearchResult: [], // 搜索状态下的左侧树状结构数据
    brandIds: [], // 选中的品牌ids
    initExpandedKeys: [],
    expandedKeys: [], // 存储非搜索状态时展开的keys
    // industryKeyId: new Map(), // 存储行业key对应的id
    // brandKeyId: new Map(), // 存储品牌key对应的id
    // tiledData: [], // 将树状结构的数据平铺到一个对象中
    tiledDataSearchResult: [], // 搜索后的树状结构的数据平铺到一个对象中
  });
  const [leftDrawerVisible, setLeftDrawerVisible] = useState<boolean>(true); // 左侧抽屉的展示
  const [rightDrawerVisible, setRightDrawerVisible] = useState<boolean>(false); // 右侧抽屉的展示
  const [amapIns, setAmapIns] = useState<any>(null); // 地图实例
  const [brandTreeData, setBrandTreeData] = useState<Array<any>>([]); // 左侧品牌数据
  const [treeCheckedKeys, setTreeCheckedKeys] = useState<Array<any>>([]);
  const [dataBoardTabs, setDataBoardTabs] = useState<any[]>([]); // 右侧数据看板
  const [isInit, setIsInit] = useState<boolean>(false); // 是否初始化完成
  const { city, level } = useMapLevelAndCity(amapIns); // 当前地图的缩放级别及城市
  // 代码虽然注释了，但请不要删
  // 右侧数据看板Tabs
  // const dataBoardTabs = useMemo(() => {
  //   // 左侧树有选中
  //   if (isArray(brandTreeData) && brandTreeData.length) {
  //     // 存储的行业key
  //     // const { industryKeyId } = dataRef.current;
  //     const tabs: Array<any> = [];
  //     // 遍历选中的key
  //     brandTreeData.forEach((item: any) => {
  //       // if (!industryKeyId.has(itemKey)) return;
  //       // // key匹配时获取对应的行业数据
  //       // const targetIndustry: any = industryKeyId.get(itemKey);
  //       const { id: industryId, level, name: industryName } = targetIndustry;
  //       if (level === 1) { // 只要一级行业
  //         tabs.push({
  //           id: industryId,
  //           name: industryName
  //         });
  //       }
  //     });
  //     return tabs;
  //   }
  //   return [];
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [brandTreeData]);
  // level对应的地图缩放值
  const targetZoom = useMemo(() => {
    if (level === COUNTRY_LEVEL) return PROVINCE_ZOOM;
    if (level === PROVINCE_LEVEL) return CITY_ZOOM;
    if (level === CITY_LEVEL) return DISTRICT_ZOOM;
    return PROVINCE_ZOOM;
  }, [level]);


  useEffect(() => {
    getTreeData(); // 获取左侧树状行业数据
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!amapIns) return;
    addClickEvent();
    return () => {
      clearClickEvent();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amapIns]);
  // 是否展示右侧数据看板
  useEffect(() => {
    if (dataBoardTabs.length) {
      setRightDrawerVisible(true);
      return;
    }
    setRightDrawerVisible(false);
  }, [dataBoardTabs]);

  // 地图加载完成事件
  const mapLoadedHandle = (mapIns: any) => {
    setAmapIns(mapIns);
  };

  const getTreeData = async () => {
    const treeData = await poiTreeBrand({
      type: 1 // 1：纯行业树状图 2：品牌+行业树状图
    });
    // 需要对原始的接口数据做处理才能用于Tree组件
    if (!isArray(treeData)) return;
    initDataBoardTabs(treeData);
    const formattingBrandData = deepCopy(treeData); // 深拷贝一份接口返回的数据
    recursionGenerateUniqueKey(formattingBrandData, 0, true);
    // console.log(`生成key后的数据`, formattingBrandData);
    // recursionBrandData(formattingBrandData, 0); // 递归转包成合适的数据结构
    setBrandTreeData(formattingBrandData); // 转包完成后set到Tree的data
    // const tiledData: Array<any> = [];
    // recursionEach(formattingBrandData, 'children', (item: any) => {
    //   tiledData.push(item);
    // });
    // dataRef.current.tiledData = tiledData;
    dataRef.current.brandTreeData = deepCopy(formattingBrandData); // 保存一份全部节点未禁用的数据
    // console.log(`dataRef.current`, dataRef.current);
    setIsInit(true);
  };

  const initDataBoardTabs = (industries: any[]) => {
    const tabs: any[] = [];
    industries.forEach((item: any) => {
      // if (!industryKeyId.has(itemKey)) return;
      // // key匹配时获取对应的行业数据
      // const targetIndustry: any = industryKeyId.get(itemKey);
      const { id: industryId, level, name: industryName } = item;
      if (level === 1) { // 只要一级行业
        tabs.push({
          id: industryId,
          name: industryName
        });
      }
    });
    setDataBoardTabs(tabs);
  };

  // 现有的品牌和行业是两张表，故id可能会一样，所以通过递归遍历原始的数据，添加唯一的key
  const recursionGenerateUniqueKey = (
    data: Array<any>,
    indexKey: number | string,
    isTargetTag: boolean // 指定的标记（每层数组的第一项）
  ) => {
    // 需要了解接口返回的数据结构
    data.forEach((item: any, curIndex: number) => {
      const { children } = item;
      // 层级组成唯一的key，接口返回的id不唯一
      item.key = `${indexKey ? `${indexKey}-` : ''}${curIndex}`;
      // 递归时把数组的第一项的key存起来，用来默认展开
      isTargetTag && curIndex === 0 && dataRef.current.initExpandedKeys.push(item.key);
      if (isArray(children) && children.length) {
        recursionGenerateUniqueKey(children, item.key, curIndex === 0 && isTargetTag);
        return;
      }
    });
  };

  // 递归遍历原始的数据，转包为符合Tree组件及交互要求的格式，需要对antd的tree组件有一定的了解
  // const recursionBrandData = (data: Array<any>, index: number | string) => {
  //   // 需要了解接口返回的数据结构
  //   data.forEach((item: any, curIndex: number,) => {
  //     const { brandList, children, id, level: levelVal, name } = item;
  //     // 层级组成唯一的key，接口返回的id不唯一（行业id是一张表，品牌是另外一张表）
  //     item.key = `${index ? `${index}-` : ''}${curIndex}`;
  //     item.disabled = false;
  //     // 前三层为行业
  //     levelVal < 4 && dataRef.current.industryKeyId.set(item.key, {
  //       id,
  //       level: levelVal,
  //       name
  //     });
  //     // 行业层-继续向下遍历
  //     if (isArray(children) && children.length) {
  //       recursionBrandData(children, item.key);
  //       return;
  //     }
  //     // 到了最底层-品牌层
  //     if (isArray(brandList) && brandList.length) {
  //       recursionBrandData(brandList, item.key); // 将最后一层的品牌数据转包成需要的数据格式
  //       brandList.forEach((brandItem: any) => { // 标记这一层为品牌
  //         brandItem.isBrand = true;
  //         dataRef.current.brandKeyId.set(brandItem.key, { id: brandItem.id });
  //       });
  //       item.children = brandList; // 将品牌数据替换为最后一层的children
  //     }
  //   });
  // };

  // 为了地图实例能解绑click
  const {
    clearClickEvent,
    addClickEvent,
    toCenterAndLevel
  } = useMethods({
    addClickEvent: () => {
      amapIns && amapIns.on('click', toCenterAndLevel);
    },
    clearClickEvent: () => {
      amapIns && amapIns.off('click', toCenterAndLevel);
    },
    toCenterAndLevel: (e: any) => {
      if (level === DISTRICT_LEVEL) return;
      const { lnglat } = e;
      let zoom = 4;
      switch (level) {
        case COUNTRY_LEVEL:
          zoom = PROVINCE_ZOOM;
          break;
        case PROVINCE_LEVEL:
          zoom = CITY_ZOOM;
          amapIns.setZoom(CITY_ZOOM);
          break;
        case CITY_LEVEL:
          zoom = DISTRICT_ZOOM;
          break;
      };
      amapIns.setZoomAndCenter(zoom, lnglat, false, 300);
    }
  });

  return (
    <div className={styles.container}>
      <AMap
        mapOpts={{
          zoom: 4, // 设置默认缩放级别
          zooms: [4, 20], // 设置缩放级别范围
          center: [103.826777, 36.060634] // 默认地图的中心位置，使中国地图处于地图正中央
        }}
        loaded={mapLoadedHandle}
        plugins={[
          'AMap.DistrictSearch',
          'AMap.Geocoder',
          'AMap.RangingTool',
          'AMap.PlaceSearch',
          'AMap.HeatMap',
          'AMap.Driving', // 驾车
          'AMap.Riding', // 骑行
          'AMap.Walking' // 走路
        ]}>
        {/* 左侧搜索框 + 树状结构 */}
        <MapDrawer
          mapDrawerStyle={{
            top: '60px',
            height: 'max-content', // 动态高度
            maxHeight: 'calc(100vh - 240px)' // 动态高度，240是根据UI稿
          }}
          visible={leftDrawerVisible}
          setVisible={setLeftDrawerVisible}
          outChildren={
            // 省市区搜索组件
            <div className={styles.pcdCon}>
              <ProvinceListForMap
                type={2} // 只展示省市
                _mapIns={amapIns}
                city={city}
                level={level}
                className='mb-16 bg-fff' />
            </div>
          }>
          {/* 行业 + 品牌树 */}
          <BrandTree
            dataRef={dataRef}
            isInit={isInit}
            brandTreeData={brandTreeData}
            treeCheckedKeys={treeCheckedKeys}
            setTreeCheckedKeys={setTreeCheckedKeys}
            setBrandTreeData={setBrandTreeData}/>
        </MapDrawer>
        {/* 搜索和工具箱组件 */}
        <TopCon
          city={city}
          level={level}
          clearClickEvent={clearClickEvent}
          addClickEvent={addClickEvent}/>
        {/* 行业数量卡片覆盖物 */}
        {/* <OverviewCount
          dataRef={dataRef}
          targetZoom={targetZoom}
          city={city}
          level={level}
          treeCheckedKeys={treeCheckedKeys}/> */}
        {/* 品牌占比环状图 */}
        <OverviewRingProportion
          dataRef={dataRef}
          targetZoom={targetZoom}
          city={city}
          level={level}
          treeCheckedKeys={treeCheckedKeys}/>
        {/* 展示到区一级时展示的所有品牌 */}
        <Points
          dataRef={dataRef}
          city={city}
          level={level}
          treeCheckedKeys={treeCheckedKeys}/>
        {/* 绘制行政区颜色 */}
        <LevelLayer
          level={level}
          city={city}
          isAllLevel
        />
        <MapDrawer
          placement='right'
          // 根据是否选中了一级行业进行展示开关按钮
          closeNode={dataBoardTabs.length ? null : <></>}
          mapDrawerStyle={{
            width: '280px',
            top: '8px',
            height: 'max-content', // 动态高度
            maxHeight: 'calc(100vh - 70px)' // 动态高度，70是根据UI稿
          }}
          visible={rightDrawerVisible}
          setVisible={setRightDrawerVisible}>
          {/* 右侧看板 */}
          <DataBoard
            targetTabs={dataBoardTabs}/>
        </MapDrawer>
      </AMap>
    </div>
  );
};

export default POIMap;
