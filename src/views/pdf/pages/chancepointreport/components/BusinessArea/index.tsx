/**
 * @Description 商圈部分
 */

import { FC, useEffect, useState } from 'react';
import { useMethods, } from '@lhb/hook';
import {
  getModelClusterDetail,
  getModelClusterPopulation,
} from '@/common/api/networkplan';
import {
  getOldStoreDetail,
  // getSourroundPoiByCategory,
  // modelCategoryList,
} from '@/common/api/surround';
import { checkSettled } from '@/views/pdf/pages/areareport/ts-config';
import { ChancePdfPageClass } from '../../ts-config';
// import cs from 'classnames';
// import styles from './index.module.less';
import Main from 'src/views/pdf/pages/areareport/components/Main';
import SurroundingFacilities from '@/views/pdf/pages/areareport/components/SurroundingFacilities';

const BusinessArea: FC<any> = ({
  detail,
  token,
  homeData,
}) => {
  const { modelClusterId } = detail;
  const [data, setData] = useState<Record<string, any>>({
    businessDetail: null, // 商圈详情
    demographicData: null, // 人口客群
    oldStoreDetail: null, // 经营门店-老店明细
    // surroundPageDetail: surroundDetailRes
  });

  useEffect(() => {
    modelClusterId && loadData();
  }, [modelClusterId]);

  const {
    loadData
  } = useMethods({
    loadData: async () => {
      const res = await Promise.allSettled([
        // 商圈详情
        getModelClusterDetail({
          id: modelClusterId,
          pdfPageUserToken: token,
        }),
        // 人口客群
        getModelClusterPopulation({
          id: modelClusterId,
          pdfPageUserToken: token,
        }),
        // 经营门店-老店明细
        getOldStoreDetail({
          clusterId: modelClusterId,
          pdfPageUserToken: token,
        }),
      ]);
      const [
        businessDetail, // 商圈详情
        demographicData, // 人口客群
        oldStoreDetail, // 经营门店-老店明细
      ] = res.map((item) => checkSettled(item));

      setData({
        businessDetail,
        demographicData,
        oldStoreDetail,
      });
    }
  });
  return (
    <>
      {/* 商圈报告的其他页面 */}
      <Main
        id={modelClusterId}
        token={token}
        data={data}
        targetChildClass={ChancePdfPageClass}
        isChancepoint={true}
        homeData={homeData}
      />
      {/* 周边配套 */}
      <SurroundingFacilities
        id={modelClusterId}
        token={token}
        data={data}
        homeData={homeData}
        targetChildClass={ChancePdfPageClass}
      />
    </>
  );
};

export default BusinessArea;
