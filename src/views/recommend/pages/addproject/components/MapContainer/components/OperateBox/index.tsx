/**
 * @Description 除右侧列表和地图外的页面的所有操作入口
 */

import MapDrawer from '@/common/components/business/MapDrawer';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { LeftCon } from './components/LeftCon/LeftCon';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';
import RecommendSidebar from '@/common/components/business/RecommendSidebar';
import cs from 'classnames';
import SearchBox from './components/SearchBox';
import DrawShape from './components/DrawShape';
import SearchAndTool from './components/SearchAndTool';
import { addBusiness } from '../../ts-config';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
const OperateBox:FC<any> = ({
  amapIns,
  city,
  level,
  setBusinessTypeList,
  setMapShowType,
  isBranch,
  searchModalData,
  planId,
  branchCompanyId,
  setSearchParams,
  setSearchModalData,
  setIsOpenHeatMap,
  setIsShape,
  isShape,
  setIsDraw,
  setIsReset,
  isSelectToolBox,
  setIsSelectToolBox,
  drawedRef,
  selections,
  setRightDrawerVisible,
  isShowBusinessDistrict, // 展示商区围栏
  setIsShowBusinessDistrict, // 设置是否展示商区围栏
  onRefresh,
  total,
  // companyParams,
}) => {
  const [leftDrawerVisible, setLeftDrawerVisible] = useState<boolean>(false);// 左侧抽屉是否展开
  const [showContendBrand, setShowContendBrand] = useState<boolean>(false);// 显示竞品分布
  const [showAddBusiness, setShowAddBusiness] = useState<boolean>(false);// 展示新增商圈
  const isInitRef = useRef<boolean>(true);// 是否初始化加载
  // 展开关闭竞品按钮
  const changeShowContendBrand = () => {
    isInitRef.current = false;
    setShowContendBrand((state) => !state);
  };
  const changeShowAddBusiness = () => {
    if (total >= 5) {
      V2Message.info('添加数量已达上限');
      return;
    }
    isInitRef.current = false;
    setShowAddBusiness((state) => !state);
  };
  // 展开关闭筛选条件按钮
  const changeSearchModal = () => {
    setSearchModalData((state) => {
      return {
        ...state,
        visible: !state.visible
      };
    });
  };

  useEffect(() => {
    // 打开左侧抽屉时
    if (leftDrawerVisible) {
      setShowContendBrand(false);
    }
  }, [leftDrawerVisible]);

  // 筛选条件，竞品分布，新增筛选互斥，只能打开一个
  useEffect(() => {
    // 筛选条件打开时
    if (searchModalData.visible) {
      setShowContendBrand(false);
      setShowAddBusiness(false);
    }
  }, [searchModalData.visible]);
  useEffect(() => {
    // 竞品分布打开时
    if (showContendBrand) {
      setSearchModalData((state) => {
        return {
          ...state,
          visible: false
        };
      });
      setShowAddBusiness(false);
    }
    if (!isInitRef.current) {
      // 竞品分布或新增商圈打开时，收起左侧信息；都收起时打开左侧信息
      if (showContendBrand || showAddBusiness) {
        setLeftDrawerVisible(!(showContendBrand || showAddBusiness));
      } else {
        setLeftDrawerVisible(true);
      }
    }
  }, [showContendBrand]);
  useEffect(() => {
    // 新增商圈打开时
    if (showAddBusiness) {
      setSearchModalData((state) => {
        return {
          ...state,
          visible: false
        };
      });
      setShowContendBrand(false);
    }
    if (!isInitRef.current) {
      // 竞品分布或新增商圈打开时，收起左侧信息；都收起时打开左侧信息
      if (showContendBrand || showAddBusiness) {
        setLeftDrawerVisible(!(showContendBrand || showAddBusiness));
      } else {
        setLeftDrawerVisible(true);
      }
    }

  }, [showAddBusiness]);


  // 选中绘制商圈，收起左侧抽屉
  useEffect(() => {
    if (isShape) setLeftDrawerVisible(false);
  }, [isShape]);

  const model = useMemo(() => {
    return { provinceCode: city?.provinceId, cityId: city?.id };
  }, [city?.provinceId, city?.id]);

  return <div className={styles.operateBox}>
    <MapDrawer
      placement='left'
      mapDrawerStyle={{
        width: '220px',
        top: '52px', // 12+32+8
        height: 'max-content', // 动态高度
        left: '12px',
        transform: leftDrawerVisible ? 'translateX(0%)' : 'translateX(-232px)'
      }}
      closeConStyle={{
        top: 42,
      }}
      visible={leftDrawerVisible}
      setVisible={setLeftDrawerVisible}
    >
      {/* 左侧列表 */}
      <LeftCon
        level={level}
        city={city}
        amapIns={amapIns}
        setBusinessTypeList={setBusinessTypeList}
        setMapShowType={setMapShowType}
        isShowBusinessDistrict={isShowBusinessDistrict}
        setIsShowBusinessDistrict={setIsShowBusinessDistrict}
      />
    </MapDrawer>
    <div
      style={{
        width: '290px',
      }}
      className={cs(styles.box, !leftDrawerVisible && styles.hideLeftDrawer)}>
      {/* 筛选条件 */}
      <div className={cs(styles.card, searchModalData.visible ? 'c-006' : '')} onClick={changeSearchModal}>
        <span className='fs-14'>筛选条件</span>
        <IconFont
          iconHref={searchModalData.visible ? 'iconarrow-down-copy' : 'iconarrow-down'}
          className='inline-block ml-8 fs-12'
        />
      </div>
      <span className={styles.line}></span>
      {/* 竞品分布 */}
      <div onClick={changeShowContendBrand} className={`fs-14 ${showContendBrand ? 'c-006' : ''}`}>
        <span className='fs-14'>竞品分布</span>
        <IconFont
          iconHref={showContendBrand ? 'iconarrow-down-copy' : 'iconarrow-down'}
          className='inline-block ml-8 fs-12'
        />
      </div>
      {/* 新增商圈 */}
      <span className={styles.line}></span>
      <div onClick={changeShowAddBusiness} className={`fs-14 ${addBusiness} ${showAddBusiness ? 'c-006' : ''}`}>
        <span className='fs-14'>新增商圈</span>
        <IconFont
          iconHref={showAddBusiness ? 'iconarrow-down-copy' : 'iconarrow-down'}
          className='inline-block ml-8 fs-12'
        />
      </div>

    </div>

    <div className={styles.topBoxCon}>
      {/* 搜索框和工具箱 */}
      <SearchAndTool
        mapIns={amapIns}
        level={level}
        city={city}
        setIsOpenHeatMap={setIsOpenHeatMap}
        isCheckInsideMapOperate={isSelectToolBox}
        setIsCheckInsideMapOperate={setIsSelectToolBox}
        isCheckOutsideMapOperate={isShape}
        setIsCheckOutsideMapOperate={setIsShape}
        width={220}
      />
    </div>


    {/* 竞品分布内容 */}
    <div className={cs(styles.contendBrandBox, showContendBrand ? styles.show : styles.hidden, !leftDrawerVisible && styles.hideLeftDrawer)}>
      <RecommendSidebar
        amapIns={amapIns}
        model={model}
        scopeCheck={false}
      />
    </div>
    {/* 筛选条件弹窗 */}
    <SearchBox
      isBranch={isBranch}
      searchModalData={searchModalData}
      selections={selections}
      setSearchParams={setSearchParams}
      setSearchModalData={setSearchModalData}
    />
    {/* 新增商圈 */}
    <DrawShape
      amapIns={amapIns}
      isSelectToolBox={isSelectToolBox}
      setIsSelectToolBox={setIsSelectToolBox}
      setIsShape={setIsShape}
      expand={showAddBusiness}
      leftDrawerVisible={leftDrawerVisible}
      setIsDraw={setIsDraw}
      setIsReset={setIsReset}
      planId={planId}
      branchCompanyId={branchCompanyId}
      drawedRef={drawedRef}
      setLeftDrawerVisible={setLeftDrawerVisible}
      setRightDrawerVisible={setRightDrawerVisible}
      onRefresh={onRefresh}
    />
  </div>;
};
export default OperateBox;
