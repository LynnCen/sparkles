/**
 * @Description 新建商圈规划地图
 */
import { FC, useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';

import styles from './index.module.less';
import ToolBox from '@/common/components/AMap/components/ToolBox';
import { useAmapLevelAndCityNew } from '@/common/hook/useAmapLevelAndCityNew';
import MapCon from './components/MapCon';
// import CurrentBrand from './components/CurrentBrand';
import { MapHelpfulContextProvider } from '@/common/components/AMap/MapHelpfulContext';

import DrawGraph from './components/DrawGraph';
import SearchCity from './components/SearchCity';
import { Popover } from 'antd';
import { getNearArea } from '@/common/api/networkplan';
import CurrentBrand from '@/common/components/business/CurrentBrand';
import { COUNTRY_LEVEL } from '@/common/components/AMap/ts-config';

const DistrictMap: FC<any&{ ref?: any }> = forwardRef(({
  // mainHeight,
  amapIns,
  setAmapIns,
  onDraw,
  centerRef,
  planId,
  branchCompanyId,
  checkCity,
  tipStep,
  setTipStep,
  isBranch
}, ref) => {

  useImperativeHandle(ref, () => ({
    // 获取绘制的图形数组
    getGraphInfo: drawGraphRef.current?.getGraphInfo
  }));


  const drawGraphRef = useRef<any>(null);
  const curSelectedRef = useRef<any>(null);

  const [showCurrentBrand, setShowCurrentBrand] = useState<boolean>(false);
  const [isSelectToolBox, setIsSelectToolBox] = useState<boolean>(false);// 工具箱内部按钮是否激活
  const [isShape, setIsShape] = useState<boolean>(false);
  const [expand, setExpand] = useState(true);
  const [areaData, setAreaData] = useState<any>([]);
  const [refresh, setRefresh] = useState<boolean>(false);// 此状态用于刷新数据，与true、false无关，设反即可
  const [center, setCenter] = useState<any>(null);
  // const [searchParams, setSearchParams] = useState<any>(null);
  const [mapontext, setMapontext] = useState<any>({
    // 工具箱
    toolBox: {
      stadiometry: null
    },
    // 如果未来还有其他场景，往下加
  });
  const { level, city } = useAmapLevelAndCityNew(amapIns);

  const getAreaData = async(lng, lat) => {
    const data = await getNearArea({
      branchCompanyId,
      planId,
      lng,
      lat,
      distance: 3
    });
    setAreaData(data);
  };

  useEffect(() => {
    if (expand && showCurrentBrand) {
      setExpand(false);
    }
  }, [showCurrentBrand]);

  useEffect(() => {
    if (expand && showCurrentBrand) {
      setShowCurrentBrand(false);
    }
  }, [expand]);
  useEffect(() => {
    if (center?.lng && center?.lat) {
      getAreaData(center.lng, center.lat);
      curSelectedRef.current = null;
    }
  }, [refresh, center]);
  return (
    <MapHelpfulContextProvider
      helpInfo={mapontext}
      stateEvent={setMapontext}
    >
      <div className={styles.container}>
        <div className={styles.topCon}>
          <Popover
            overlayClassName={styles.popoverBox}
            placement='bottom'
            getPopupContainer={ (node) => node.childNodes[0] as HTMLDivElement}
            content={
              <div onClick={() => { setTipStep(1); }} className={styles.tipBox}>
                <span>1.请先输入商圈地址，地图点位具体位置</span>
                <div className={styles.bottom}>下一步</div>
              </div>
            }
            trigger='click'
            open={tipStep === 0}
          >
            {/* 搜索框 */}
            <SearchCity
              amapIns={amapIns}
              setCenter={setCenter}
              className={styles.searchCityCon}/>
          </Popover>
          {/* 工具箱 */}
          <ToolBox
            _mapIns={amapIns}
            externalStatus={false}
            // isShowInCountry={true} // 全国范围下显示
            topLevel={COUNTRY_LEVEL}
            isCheckInsideMapOperate={isSelectToolBox}
            setIsCheckInsideMapOperate={setIsSelectToolBox}
            isCheckOutsideMapOperate={isShape}
            setIsCheckOutsideMapOperate={setIsShape}
            needHeatMapPermission// 热力图需要权限
          />
          {/* 绘制形状 */}
          <Popover
            overlayClassName={styles.popoverBox}
            placement='bottom'
            getPopupContainer={ (node) => node.childNodes[0] as HTMLDivElement}
            content={
              <div onClick={() => { setTipStep(2); }} className={styles.tipBox}>
                <span>2.点击选择绘制形式，再次点击取消绘制操作</span>
                <div className={styles.bottom}>下一步</div>
              </div>
            }
            trigger='click'
            open={tipStep === 1}
          >
            <DrawGraph
              ref={drawGraphRef}
              _mapIns={amapIns}
              onDraw={onDraw}
              isShape={isShape}
              setIsShape={setIsShape}
              isSelectToolBox={isSelectToolBox}
              setIsSelectToolBox={setIsSelectToolBox}
              setExpand={setExpand}
              expand={expand}
            />
          </Popover>
          {/* 本品牌门店分布 */}
          <div className={styles.currentBrandBox}>
            <CurrentBrand
              showCurrentBrand={showCurrentBrand}
              setShowCurrentBrand={setShowCurrentBrand}
              level={level}
              city={city}
              amapIns={amapIns}
            />
          </div>

        </div>
        {/* 工具箱 */}
        {/* <div className={styles.topBoxCon}>
        <ToolBox
          _mapIns={amapIns}
          externalStatus={false}
          isShowInCountry={true} // 全国范围下显示
          isCheckInsideMapOperate={isSelectToolBox}
          setIsCheckInsideMapOperate={setIsSelectToolBox}
          isCheckOutsideMapOperate={isShape}
          setIsCheckOutsideMapOperate={setIsShape}
        />
      </div> */}
        {/* 本品牌门店分布 */}
        {/* <CurrentBrand
        showCurrentBrand={showCurrentBrand}
        setShowCurrentBrand={setShowCurrentBrand}
        level={level}
        city={city}
        amapIns={amapIns}
      /> */}

        <MapCon
          isBranch={isBranch}
          setAmapIns={setAmapIns}
          amapIns={amapIns}
          level={level}
          city={city}
          centerRef={centerRef}
          planId={planId}
          branchCompanyId={branchCompanyId}
          checkCity={checkCity}
          areaData={areaData}
          setRefresh={setRefresh}
          curSelectedRef={curSelectedRef}
        />

      </div>
    </MapHelpfulContextProvider>
  );
});

export default DistrictMap;
