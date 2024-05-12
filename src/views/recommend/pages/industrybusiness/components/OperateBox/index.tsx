/**
 * @Description 除右侧列表和地图外的页面的所有操作入口
 */

import MapDrawer from '@/common/components/business/MapDrawer';
import { FC, useEffect, useMemo, useState } from 'react';
import { LeftCon } from './components/LeftCon/LeftCon';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';
import RecommendSidebar from '@/common/components/business/RecommendSidebar';
import cs from 'classnames';
import SearchBox from './components/SearchBox';
import SearchAndTool from './components/SearchAndTool';

const OperateBox:FC<any> = ({
  amapIns,
  city,
  level,
  setIsOpenHeatMap,
  setBusinessTypeList,
  setMapShowType,
  searchModalData,
  // planId,
  // branchCompanyId,
  setSearchParams,
  setSearchModalData,
  selectionsRef,
  setIsSelectToolBox,
  // isReset
}) => {
  const [leftDrawerVisible, setLeftDrawerVisible] = useState<boolean>(true);
  const [showContendBrand, setShowContendBrand] = useState<boolean>(false);// 显示竞品分布
  const changeShowContendBrand = () => {
    setShowContendBrand((state) => !state);
  };
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

  // 筛选条件和竞品分布互斥，由场景可得，打开竞品分布的时候，筛选条件一定是关闭的，
  // 所以这里只处理打开竞品分布的情况下，去打开筛选条件，自动关闭竞品分布
  useEffect(() => {
    if (searchModalData.visible && showContendBrand) {
      setShowContendBrand(false);
    }
  }, [searchModalData.visible]);

  useEffect(() => {
    // 竞品分布打开时，收起左侧信息；收起时打开左侧信息
    setLeftDrawerVisible(!showContendBrand);
  }, [showContendBrand]);

  const model = useMemo(() => {
    return { provinceCode: city?.provinceId, cityId: city?.id };
  }, [city?.provinceId, city?.id]);

  return <div className={styles.operateBox}>
    <MapDrawer
      placement='left'
      mapDrawerStyle={{
        width: '220px',
        top: '10px',
        height: 'max-content', // 动态高度
        left: '10px',
        // maxHeight: 'calc(100vh - 70px)', // 动态高度，70是根据UI稿
        transform: leftDrawerVisible ? 'translateX(0%)' : 'translateX(-230px)'
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
      />
    </MapDrawer>
    {/* 筛选条件和竞品分布开关 */}
    <div className={cs(styles.box, !leftDrawerVisible && styles.hideLeftDrawer)}>
      <div className={styles.card} onClick={changeSearchModal}>
        <span className='fs-14'>筛选条件</span>
        <IconFont
          iconHref={searchModalData.visible ? 'iconarrow-down-copy' : 'iconarrow-down'}
          className='inline-block ml-4 fs-10'
        />
      </div>
      <span className={styles.line}></span>
      <div onClick={changeShowContendBrand}>
        <span className='fs-14'>竞品分布</span>
        <IconFont
          iconHref={showContendBrand ? 'iconarrow-down-copy' : 'iconarrow-down'}
          className='inline-block ml-4 fs-10'
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
        setIsCheckInsideMapOperate={setIsSelectToolBox}
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
      searchModalData={searchModalData}
      // planId={planId}
      // branchCompanyId={branchCompanyId}
      setSearchParams={setSearchParams}
      setSearchModalData={setSearchModalData}
      selectionsRef={selectionsRef}
      // isReset={isReset}
    />

  </div>;
};
export default OperateBox;
