/**
 * @Description 除了周边配套和尾页以外的页面
 * 机会点报告和商圈报告的公共页面
 */

import { FC, useMemo } from 'react';
import { isNotEmptyAny } from '@lhb/func';
import { transformDemographicBase, transformOperateAStore } from '../../ts-config';
// import cs from 'classnames';
// import styles from './entry.module.less';
import Home from '../Home';
import Overview from '../Overview';
import Chancepoint from '../Chancepoint';
import DemographicCustomerBase from '../DemographicCustomerBase';
import OperateAStore from '../OperateAStore';

const Main: FC<any> = ({
  id,
  homeData,
  token,
  data,
  isChancepoint = false, // 是否是机会点加载
  targetChildClass = null, // 机会点加载时会传
  // computeModuleMap,
  // moduleMapCount
}) => {
  const { businessDetail, demographicData, oldStoreDetail } = data;
  // 从原有逻辑中迁移过来的
  const demographicDetail = useMemo(() => {
    if (demographicData) {
      return transformDemographicBase(demographicData);
    }
    return null;
  }, [demographicData]);
  // 从原有逻辑中迁移过来的
  const operateAStoreDetail = useMemo(() => {
    if (businessDetail && oldStoreDetail) {
      return transformOperateAStore(businessDetail, oldStoreDetail);
    }
    return null;
  }, [oldStoreDetail, businessDetail]);

  return (
    <>
      {/* 首页 */}
      {
        isChancepoint ? <></> : <Home
          homeData={homeData}
          detail={businessDetail}
          targetChildClass={targetChildClass}
        />
      }
      {/* 整体评价 */}
      <Overview
        token={token}
        detail={businessDetail}
        homeData={homeData}
        targetChildClass={targetChildClass}
        // computeModuleMap={computeModuleMap}
        isChancepoint={isChancepoint}
      />
      {/* 机会点 */}
      {
        isChancepoint ? <></> : <Chancepoint
          id={id}
          token={token}
          businessDetail={businessDetail}
          homeData={homeData}
          targetChildClass={targetChildClass}
          // computeModuleMap={computeModuleMap}
          // moduleMapCount={moduleMapCount}
        />
      }
      {/* 人口客群 */}
      {isNotEmptyAny(demographicDetail)
        ? <DemographicCustomerBase
          demographicDetail={demographicDetail}
          targetChildClass={targetChildClass}
          homeData={homeData}
          isChancepoint={isChancepoint}
          // computeModuleMap={computeModuleMap}
          // moduleMapCount={moduleMapCount}
        /> : <></>
      }
      {/* 经营门店、老店明细 */}
      {isNotEmptyAny(operateAStoreDetail)
        ? <OperateAStore
          operateAStoreDetail={operateAStoreDetail}
          targetChildClass={targetChildClass}
          homeData={homeData}
          isChancepoint={isChancepoint}
          // computeModuleMap={computeModuleMap}
          // moduleMapCount={moduleMapCount}
        /> : <></>
      }
    </>
  );
};

export default Main;
