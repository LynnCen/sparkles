
import React, { useEffect, useState } from 'react';
import { isArray, isNotEmptyAny } from '@lhb/func';
import { getSourroundPoiByCategory, modelCategoryList } from '@/common/api/surround';
import { useMethods } from '@lhb/hook';
import SurroundingHome from './SurroundingHome';
import SurroundingItem from './SurroundingItem';


interface SurroundingFacilitiesProps{
  [k:string]:any
}

const SurroundingFacilities:React.FC<SurroundingFacilitiesProps> = ({
  id,
  token,
  data,
  targetChildClass,
  homeData,
  // computeModuleMap,
  // moduleMapCount
}) => {
  const { businessDetail } = data;
  const [surroundPageDetail, setSurroundPageDetail] = useState<any[]>([]);
  useEffect(() => {
    const { businessDetail } = data;
    +id && token && businessDetail && loadData();
  }, [id, token, data.businessDetail]);

  const {
    loadData
  } = useMethods({
    loadData: async () => {
      const { businessDetail } = data;
      // 周边配套模块目录查询
      const resData = await modelCategoryList({
        pdfPageUserToken: token,
      });
      // 以下是从原有的首页迁移过来的逻辑
      const surroundDetailRes:Array<any> = [];
      // 根据目录id去循环请求接口获取poi信息
      for (const item of resData) {
        const surroundPageDetailRes = await getSourroundPoiByCategory({
          page: 1,
          size: 15,
          poiSearchType: 1,
          radius: 500,
          categoryId: item.id,
          lat: businessDetail.lat,
          lng: businessDetail.lng,
          cityName: businessDetail.cityName,
          pdfPageUserToken: token,
        });
        surroundDetailRes.push({
          lat: businessDetail.lat,
          lng: businessDetail.lng,
          borders: businessDetail.borders,
          ...item,
          ...surroundPageDetailRes
        });
      }
      setSurroundPageDetail(surroundDetailRes);
    }
  });
  // useEffect(() => {
  //   if (isNotEmptyAny(surroundingInfo) || isNotEmptyAny(surroundPageDetail)) {
  //     computeModuleMap('surroundingFacilities', true);
  //   }
  // }, [surroundingInfo, surroundPageDetail]);
  return <>
    {/* 周边配套第一页 */}
    {isNotEmptyAny(businessDetail?.surroundingInfoVO) && <SurroundingHome
      homeData={homeData}
      targetChildClass={targetChildClass}
      surroundingInfo={businessDetail?.surroundingInfoVO}
      // moduleMapCount={moduleMapCount}
    />}
    {/* 周边配套tab页 */}
    {isArray(surroundPageDetail) && surroundPageDetail.length ? <>
      {
        surroundPageDetail.map((item) => item.totalNum > 0 && <SurroundingItem
          // moduleMapCount={moduleMapCount}
          homeData={homeData}
          key={item.id}
          targetChildClass={targetChildClass}
          {...item}
        />)
      }
    </> : <></>
    }
  </>;
};

export default SurroundingFacilities;
