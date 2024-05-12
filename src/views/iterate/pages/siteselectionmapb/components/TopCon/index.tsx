/**
 * @Description 顶部 （省市级联、竞品门店、本品牌门店、poi搜索、工具箱）
 */
import { FC, useEffect, useRef, useState } from 'react';
import { getStorage, setStorage } from '@lhb/cache';
import styles from './index.module.less';
import cs from 'classnames';
import Competitor from './Competitor';
import Brand from './Brand';
import IconFont from '@/common/components/IconFont';
import SearchInMap from '@/common/components/business/SearchInMap';
import ToolBox from '@/common/components/AMap/components/ToolBox';
import ProvinceCity from './ProvinceCity';
import { addBusiness, mapCon, networkMapContainer, rankOptions, sectionKey, topCon } from '../../ts-config';
import { useStadiometry } from '@/common/hook/Amap/useStadiometry';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { bigdataBtn } from '@/common/utils/bigdata';
import DrawShape from './DrawShape';
import { message } from 'antd';



const siteSelectionMapBHistorySearchList = 'siteSelectionMapBHistorySearchList';
const TopCon:FC<any> = ({
  mapIns,
  mapHelpfulInfo,
  curSelectDistrict, // 当前左侧筛选选中的行政区
  setChecked, // 当前选中的筛选项
  setCurSelectDistrict,
  setProvinceCityComData, // 设置左上角省市组件数据
  setShowLeftCon,
  // showLeftCon,
  setPoiData,
  setHandChange,
  isGreater1440, // 是否屏幕宽度大于1440
  isGreater1920,
  setRightDrawerVisible,
  polygonData,
  firstLevelCategory,
  setRankSort,
  setIsReset,
  isShape,
  setIsShape,
  // setOpenList
}) => {
  const [competitorOpen, setCompetitorOpen] = useState<boolean>(false);// 竞品门店开关
  const [brandOpen, setBrandOpen] = useState<boolean>(false);// 本品牌门店开关
  const [isSelectToolBox, setIsSelectToolBox] = useState<boolean>(false);// 工具箱内部按钮是否激活
  const [provinceCascaderOpen, setProvinceCascaderOpen] = useState<boolean>(false);// 显示省市浮层（下拉框）显示

  const [isDraw, setIsDraw] = useState<boolean>(false); // 是否已经绘制出图形信息，graphInfo有数据则为true

  const historySearchListRef = useRef<any[]>(getStorage(siteSelectionMapBHistorySearchList) || []);
  const isStadiometry: any = useStadiometry(); // 是否在使用测距功能
  const isStadiometryRef = useRef(isStadiometry);

  const finallySelected = (target: any) => {
    if (!target) return;
    const { extraData } = target || {};
    setPoiData(extraData);

    if (target) {
      // 缓存历史搜索结果
      cacheSearchList(extraData);
      handleSelectDistrict(extraData);
    }
  };
  // 缓存历史搜索结果
  const cacheSearchList = (extraData) => {
    const oldData = historySearchListRef.current;
    // historySearchListRef.current = [extraData, ...oldData];
    // 根据经纬度去重
    const coordinates = {};
    historySearchListRef.current = [extraData, ...oldData].filter(item => {
      const key = `${item.latitude}-${item.longitude}`;
      if (!coordinates[key]) {
        coordinates[key] = true;
        return true;
      }
      return false;
    });
    const newData = historySearchListRef.current.filter((item, index) => index < 4);
    historySearchListRef.current = newData;
    // 最多缓存五条历史记录
    setStorage(siteSelectionMapBHistorySearchList, newData);
  };

  // 搜索地址和行政区条件筛选联动（ui要求）
  // 1.当搜索地址和条件筛选已选行政区一致，则不做变动
  // 2.当搜索地址和条件筛选已选行政区不一致但在同一个城市，则行政区取消已选中
  // 3.当搜索地址和条件筛选已选行政区不一致且不在一个城市，则行政区取消已选中
  const handleSelectDistrict = (extraData) => {

    const curCityId = curSelectDistrict?.cacheMapInfo?.city?.id;
    // 未选择行政区，所以不会进行下面的操作
    if (!curCityId) return;
    const districtCodeList = curSelectDistrict?.districtInfo?.map((item) => {
      return +item.code;
    });
    const { cityId, districtId } = extraData;

    if (districtCodeList.includes(+districtId)) return;// 符合条件1
    // 符合条件2（行政区id不一致）||符合条件3（城市id不一致）
    if (!districtCodeList.includes(+districtId) || curCityId !== cityId) {
      // 清空
      setChecked((state) => ({
        ...state,
        [sectionKey.area]: []
      }));
      setCurSelectDistrict({
        districtInfo: [], // 当前选中的行政区信息
        cacheMapInfo: null, // 缓存选中行政区信息时的mapHelpfulInfo
      });
    }
  };

  const keywordChange = (str: string) => {
    if (!str) {
      setPoiData(null);
    }
  };

  const competitorTrigger = () => {
    bigdataBtn('cb908704-df13-2b7a-1b7d-9fa44213a43e', '选址地图', '竞品门店', '点击竞品门店');
    if (isStadiometry) {
      V2Message.warning(`使用测距功能时暂不支持查看竞品门店`);
      return;
    }
    // setCompetitorOpen((state) => !state);
    handleToggle(competitorOpen, setCompetitorOpen);
  };

  // 处理绘制商圈中禁止点击其他操作
  const handlePreventdefault = (e) => {
    const mapDom:any = document.querySelector(`.${mapCon}`);
    const addBusinessBtn:any = document.querySelector(`.${addBusiness}`);
    if (!mapDom.contains(e.target) && !addBusinessBtn.contains(e.target)) {
      V2Message.warning(`请先完成新增商圈信息填写或删除该商圈`);
      message.config({ maxCount: 1 });
      e.preventDefault();
      e.stopPropagation();
      e.target.blur();

    }
  };

  // 打开竞品门店或者本品牌门店时，收起左侧右侧
  // useEffect(() => {
  //   setShowLeftCon(!(competitorOpen || brandOpen || provinceCascaderOpen));
  //   // setOpenList(!(competitorOpen || brandOpen));
  // }, [competitorOpen, brandOpen, provinceCascaderOpen]);

  // // 关闭省市浮层（下拉框）
  // useEffect(() => {
  //   if (competitorOpen || brandOpen || showLeftCon) {
  //     setProvinceCascaderOpen(false);
  //   }
  // }, [competitorOpen, brandOpen, showLeftCon]);

  // // 当打开竞品门店时，关闭本品牌门店
  // useEffect(() => {
  //   if (competitorOpen && brandOpen) {
  //     setBrandOpen(false);
  //   }
  // }, [competitorOpen]);

  // // 当打开本品牌门店开关时，关闭竞品门店
  // useEffect(() => {
  //   if (competitorOpen && brandOpen) {
  //     setCompetitorOpen(false);
  //   }
  // }, [brandOpen]);

  useEffect(() => {
    isStadiometryRef.current = isStadiometry;
  }, [isStadiometry]);

  useEffect(() => {
  // 如果正在绘制，那么则默认选中“全部”（原因：绘制需要判断是否重叠，所以需要显示全部）
    if (isShape) {
      setRankSort(rankOptions[2]);
    }
  }, [isShape]);

  // 处理绘制商圈中禁止点击其他操作
  useEffect(() => {
    const dom:any = document.querySelector(`.${networkMapContainer}`);

    if (isDraw) {
      // 除地图元素和新增商圈外
      dom.addEventListener('click', handlePreventdefault);
      // 禁止键盘操作，快速上下左右操作会导致地图白掉
      mapIns?.setStatus({ keyboardEnable: false });
    } else {
      // 禁止键盘操作，快速上下左右操作会导致地图白掉
      mapIns?.setStatus({ keyboardEnable: true });
    }
    return () => {
      dom.removeEventListener('click', handlePreventdefault);
    };
  }, [isDraw]);

  useEffect(() => {
    // 确保只有一个状态为 true，其他三个为 false
    if (competitorOpen) {
      setBrandOpen(false);
      setProvinceCascaderOpen(false);
      setShowLeftCon(false);
    } else if (brandOpen) {
      setCompetitorOpen(false);
      setProvinceCascaderOpen(false);
      setShowLeftCon(false);
    } else if (provinceCascaderOpen) {
      setCompetitorOpen(false);
      setBrandOpen(false);
      setShowLeftCon(false);
    } else {
      // 默认情况下，如果其他三个都为 false，则 showLeftCon 为 true
      setShowLeftCon(true);
    }
  }, [competitorOpen, brandOpen, provinceCascaderOpen]);

  // 处理开关
  const handleToggle = (state, setState) => {
    if (state) {
      setState(false);
      setShowLeftCon(true);
    } else {
      setCompetitorOpen(false);
      setBrandOpen(false);
      setProvinceCascaderOpen(false);
      setState(true);
    }
  };

  return <div className={cs(styles.topCon, topCon)}>
    <div className={styles.topLeft}>
      {/* 省市筛选 */}
      <ProvinceCity
        mapIns={mapIns}
        mapHelpfulInfo={mapHelpfulInfo}
        setProvinceCityComData={setProvinceCityComData}
        curSelectDistrict={curSelectDistrict}
        setShowLeftCon={setShowLeftCon}
        setHandChange={setHandChange}
        isGreater1440={isGreater1440}
        isGreater1920={isGreater1920}
        provinceCascaderOpen={provinceCascaderOpen}
        setProvinceCascaderOpen={setProvinceCascaderOpen}
        handleToggle={handleToggle}
      />
      {/* 竞品门店 */}
      <div className={styles.content}>
        <span
          className={styles.competitorCard}
          onClick={competitorTrigger}>
          <span>竞品门店</span>
          <IconFont
            iconHref='pc-common-icon-a-iconarrow_down'
            className={cs(competitorOpen ? styles.arrowIconUp : styles.arrowIcon, 'ml-8')}
          />
        </span>
        <div
          style={{
            display: competitorOpen ? 'block' : 'none'
          }}
        >
          <Competitor
            mapIns={mapIns}
            mapHelpfulInfo={mapHelpfulInfo}
            isStadiometry={isStadiometry}
            isStadiometryRef={isStadiometryRef}
            setCompetitorOpen={setCompetitorOpen}
          />
        </div>
      </div>

      <div className={styles.content}>
        <span
          className={styles.brandCard}
          onClick={() => {
            bigdataBtn('4cdd6a28-81e3-4dba-0ee0-1d546f388bcb', '选址地图', '本品牌门店', '点击本品牌门店');
            // setBrandOpen((state) => !state);
            handleToggle(brandOpen, setBrandOpen);
          }}>
          <span>本品牌门店</span>
          <IconFont
            iconHref='pc-common-icon-a-iconarrow_down'
            className={cs(brandOpen ? styles.arrowIconUp : styles.arrowIcon, 'ml-8')}
          />
        </span>
        <div
          style={{
            display: brandOpen ? 'block' : 'none'
          }}
        >
          <Brand
            mapIns={mapIns}
            mapHelpfulInfo={mapHelpfulInfo}
            setBrandOpen={setBrandOpen}
          />
        </div>
      </div>
    </div>

    <div className={styles.topCenter}>
      {/* 搜索 */}
      <span
        onClick={() => {
          bigdataBtn('6d010a4a-10ce-d4a9-4b6a-6fac1a28249b', '选址地图', '地址搜索框', '点击地址搜索框');
        }}
      >
        <SearchInMap
          mapIns={mapIns}
          mapHelpfulInfo={mapHelpfulInfo}
          finallySelected={finallySelected}
          isMock={false}
          historySearchList={historySearchListRef.current}
          finallyKeywords={(str) => keywordChange(str)}
          hideBorder
          autoCompleteConfig={{
            style: {
              marginRight: 12
            }
          }}
          searchConfig={{
            style: {
              width: 280,
              height: 36
            },
          }}
        />
      </span>
      {/* 工具箱 */}
      <span
        onClick={() => {
          bigdataBtn('eac8ccb7-7d67-1b1e-1be8-d5f6d3cea645', '选址地图', '工具箱', '点击工具箱');
        }}
      >
        <ToolBox
          _mapIns={mapIns}
          level={mapHelpfulInfo?.level}
          city={mapHelpfulInfo?.city}
          heartMap={false}
          beforeIcon={<IconFont iconHref='iconic_toolbox' className='fs-16'/>}
          afterIcon={<IconFont iconHref='pc-common-icon-a-iconarrow_down'/>}
          toolBoxWrapperStyle={{
            height: '36px',
            lineHeight: '36px',
          }}
          getAddressEventId='e76b55f5-71bd-0eb3-56c2-774c6333b502'
          rulerEventId='f0e87e80-b4b6-8196-7276-47cd9c5e3d89'
          satellite={false}
          isCheckInsideMapOperate={isSelectToolBox}
          setIsCheckInsideMapOperate={setIsSelectToolBox}
          isCheckOutsideMapOperate={isShape}
          setIsCheckOutsideMapOperate={setIsShape}
        />
      </span>
      {/* 新增商圈 */}
      <span className={cs('ml-12', addBusiness)}>
        {/* 隐藏新增商圈 */}
        {
          isDraw && <DrawShape
            mapIns={mapIns}
            isSelectToolBox={isSelectToolBox}
            setIsSelectToolBox={setIsSelectToolBox}
            setIsShape={setIsShape}
            isShape={isShape}
            setIsDraw={setIsDraw}
            setIsReset={setIsReset}
            setLeftDrawerVisible={setShowLeftCon}
            setRightDrawerVisible={setRightDrawerVisible}
            polygonData={polygonData}
            firstLevelCategory={firstLevelCategory}
          />
        }
      </span>
    </div>
  </div>;
};
export default TopCon;
