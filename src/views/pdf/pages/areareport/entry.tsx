import { FC, useEffect, useState } from 'react';
import { urlParams } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import {
  getModelClusterDetail,
  getModelClusterPopulation,
  areaReportHomeData,
} from '@/common/api/networkplan';
import {
  getOldStoreDetail,
  // getSourroundPoiByCategory,
  // modelCategoryList,
} from '@/common/api/surround';
import { checkSettled, ARE_AREPORT_CONTAINER_CLASS, AreaReportModule/*, ChildreClass*/ } from './ts-config';
import cs from 'classnames';
import styles from './entry.module.less';
import Main from './components/Main';
import SurroundingFacilities from './components/SurroundingFacilities';
// import Thanks from './components/Thanks';
// const initalModuleMap = {
//   overallRating: false,
//   chancePoint: false,
//   populationGroup: false,
//   operateStore: false,
//   surroundingFacilities: false
// };
// type ModuleMapKey = keyof typeof initalModuleMap
const Areareport: FC<any> = () => {
  const id = urlParams(location.search)?.id; // 商圈id
  const targetModule = +urlParams(location.search)?.moduleName; // 要渲染的模块名
  const token = urlParams(location.search)?.token; // token
  const [data, setData] = useState<Record<string, any>>({
    businessDetail: null, // 商圈详情
    demographicData: null, // 人口客群
    oldStoreDetail: null, // 经营门店-老店明细
    // surroundPageDetail: surroundDetailRes
  });
  const [homeData, setHomeData] = useState<any>({});
  // const [moduleMapCount, setModuleMapCount] = useState<Record<ModuleMapKey, boolean| number >>(initalModuleMap);
  // const moduleMapRef = useRef<Record<ModuleMapKey, boolean| number >>(initalModuleMap);


  useEffect(() => {
    if (+id) {
      loadData();
      loadHomeData();
    }
  }, [id]);

  const {
    loadData,
    loadHomeData,
    // computeModuleMap
  } = useMethods({
    loadData: async() => {
      const res = await Promise.allSettled([
        // 商圈详情
        getModelClusterDetail({
          id,
          pdfPageUserToken: token,
        }),
        // 人口客群
        getModelClusterPopulation({
          id,
          pdfPageUserToken: token,
        }),
        // 经营门店-老店明细
        getOldStoreDetail({
          clusterId: id,
          pdfPageUserToken: token,
        }),
        // // 周边配套模块目录查询
        // modelCategoryList({
        //   pdfPageUserToken: token,
        // })
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
    },
    loadHomeData: async () => {
      const res = await areaReportHomeData({
        id,
        pdfPageUserToken: token
      });
      setHomeData(res);
    },
    // computeModuleMap: (key:ModuleMapKey, isShow:boolean) => {
    //   const moduleMap = { ...moduleMapRef.current } || initalModuleMap;
    //   moduleMap[key] = isShow;
    //   let previousValue = 1;
    //   for (const el in moduleMap) {
    //     if (moduleMap[el]) {
    //       moduleMap[el] = previousValue++;
    //     }
    //   }
    //   setModuleMapCount(moduleMap);
    //   moduleMapRef.current = moduleMap;
    // }
  });



  return (
    <div className={cs(styles.container, ARE_AREPORT_CONTAINER_CLASS)}>
      { // 除了周边配套和尾页的其他页面
        targetModule === AreaReportModule.MODULE_1 ? <Main
          id={id}
          token={token}
          data={data}
          homeData={homeData}
          // computeModuleMap={computeModuleMap}
          // moduleMapCount={moduleMapCount}

        /> : <></>
      }
      { // 周边配套和尾页
        targetModule === AreaReportModule.MODULE_2 ? <>
          {/* 周边配套 */}
          <SurroundingFacilities
            id={id}
            token={token}
            data={data}
            homeData={homeData}
            // computeModuleMap={computeModuleMap}
            // moduleMapCount={moduleMapCount}
          />
          {/* 尾页 */}
          {/* 产品提出不要这页了 24042 */}
          {/* <Thanks
            homeData={homeData}
            targetChildClass={ChildreClass}
          /> */}
        </> : <></>
      }
    </div>
  );
};

export default Areareport;
