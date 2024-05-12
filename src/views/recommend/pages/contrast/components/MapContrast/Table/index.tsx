/**
 * @Description 右侧表格
 */

import { FC } from 'react';
import styles from '../index.module.less';
import { Comprehensiveness, tabType } from '../../../ts-config';
import SynthesisTable from './SynthesisTable';
import BrandTable from './BrandTable';
import StoreTypeTable from './StoreTypeTable';
import StoreTypeBrandTable from './StoreTypeBrandTable';

// const title = {
//   [mapLevel.COUNTRY_LEVEL]: '全国排名',
//   [mapLevel.PROVINCE_LEVEL]: '全省排名',
//   [mapLevel.CITY_LEVEL]: '全市排名',
// };

const RightTable:FC<any> = ({
  currentMapLevel,
  curTabs,
  selected,
  city,
  brandIds,
  selectedBrand,
  allAreaInfo,
  curAdcodeRef,
  storeTypeSelected,
  cityTypes,
}) => {
  return <div className={styles.tableCon}>
    {/* <div */}
    {/* // className={styles.title}> */}
    {/* 单品牌且某个省份情况下，显示城市排名 */}
    {/* { title[currentMapLevel] } */}
    {/* </div> */}
    { curTabs === tabType.STORE_NUM
      ? (selected === Comprehensiveness
      // 城市类型-综合对比的table
        ? <SynthesisTable
          city={city}
          brandIds={brandIds}
          // provinceId={provinceId}
          selectedBrand={selectedBrand}
          currentMapLevel={currentMapLevel}
          allAreaInfo={allAreaInfo}
          curAdcodeRef={curAdcodeRef}
          cityTypes={cityTypes}
        />
      // 城市类型-具体某个品牌的table
        : <BrandTable
          city={city}
          brandIds={brandIds}
          selectedBrand={selectedBrand}
          // provinceId={provinceId}
          currentMapLevel={currentMapLevel}
          allAreaInfo={allAreaInfo}
          curAdcodeRef={curAdcodeRef}
          cityTypes={cityTypes}
        />)
    // 门店类型-综合对比-table
      : (selected === Comprehensiveness
        ? <StoreTypeTable
          city={city}
          brandIds={brandIds}
          // provinceId={provinceId}
          selectedBrand={selectedBrand}
          currentMapLevel={currentMapLevel}
          storeTypeSelected={storeTypeSelected}
          allAreaInfo={allAreaInfo}
          curAdcodeRef={curAdcodeRef}
          cityTypes={cityTypes}
        />
      // 门店类型-具体某个品牌table
        : <StoreTypeBrandTable
          city={city}
          brandIds={brandIds}
          // provinceId={provinceId}
          selectedBrand={selectedBrand}
          currentMapLevel={currentMapLevel}
          storeTypeSelected={storeTypeSelected}
          allAreaInfo={allAreaInfo}
          curAdcodeRef={curAdcodeRef}
          cityTypes={cityTypes}
        />
      )
    }
  </div>;
};
export default RightTable;
