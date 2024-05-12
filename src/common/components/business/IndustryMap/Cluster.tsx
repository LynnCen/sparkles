/**
 * @Description 品牌网点分布和重点商圈的聚合状态下的Markers
 * TODO 当前逻辑耦合太严重，应该将两者逻辑分开处理，需要将公共状态提到父组件进行维护
 */
import {
  getAreaCluster,
  getAreaClusterShare,
  getBrandCluster,
  getBrandClusterShare,
  heatDemoCountry,
  heatDemoProvince,
} from '@/common/api/selection';
import ClusterChart from '@/common/components/AMap/components/ClusterChart';
import { CITY_ZOOM, COUNTRY_LEVEL, PROVINCE_LEVEL } from '@/common/components/AMap/ts-config';
import dayjs from 'dayjs';
import { FC, useEffect, useRef, useState } from 'react';
import { get } from '@/common/request';
import { customerColorMap, customerMap } from '../../../../views/selection/pages/industry/ts-config';
import { isArray, urlParams } from '@lhb/func';
import { getTenantInfo } from '@/common/api/system';
// import { isEqual } from 'lodash';
const Cluster: FC<any> = ({
  _mapIns,
  city,
  level,
  brandCheckList,
  areaCheckList,
  customerCheckList,
  brandColorMap,
  areaColorMap,
  month,
  featureVal,
  getBrandList,
  // 将pointClusterData抛出去，之所以不进行pointClusterData的状态提升，是为了限定影响范围
  finallyData
}) => {
  const isShare = urlParams(location.search)?.isShare;
  const labelMarkerRef = useRef<any>(null);
  const fieldNamesRef = useRef<any>({
    childrenKey: 'brands',
    name: 'area',
  });
  const colorMapRef = useRef<any>(brandColorMap);
  // 聚合点位数据
  const [pointClusterData, setPointClusterData] = useState<any[]>([]);
  // 聚合点位的备注中是否有Logo
  const [showImg, setShowImg] = useState<boolean>(true);
  const customerProvinceCount = useRef<any>({
    1: null,
    2: null,
    3: null
  });
  const [customerCountryCount, setCustomerCountryCount] = useState<any>({
    1: null,
    2: null,
    3: null
  });
  // const levelRef: any = useRef(); // 记录当前的缩放级别
  // const areaParamsRef: any = useRef<any>({}); // 请求商圈列表时的入参
  // const brandParamsRef: any = useRef<any>({}); // 请求品牌列表时的入参


  useEffect(() => {
    if (!_mapIns) return;
    labelMarkerRef.current = new window.AMap.Marker({
      content: ' ',
      map: _mapIns,
      anchor: 'top-left',
      offset: [-34, 6],
    });
  }, [_mapIns]);
  useEffect(() => {
    // 全国视角下省、省视角下的市、市视角下的区时，都显示聚合状态的marker
    // if (isArray(areaCheckList) && areaCheckList.length > 0 && level <= CITY_LEVEL) return;
    if (level > PROVINCE_LEVEL) {
      // brandParamsRef.current = {}; // 重置默认值
      setPointClusterData([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);
  useEffect(() => {
    handleCountryInfo();
  }, [customerCheckList]);
  const [shopFunctionStatus, setShopFunctionStatus] = useState<boolean>(false);
  const setTenantInfo = async () => {
    const data = await getTenantInfo();
    data && data.shopFunctionStatus && data.shopFunctionStatus > 0 && setShopFunctionStatus(true);
  };
  useEffect(() => {
    if (isShare) return;
    setTenantInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // ----重点商圈绘制副作用相关逻辑start----
  // 重点商圈在市级别的时候也要聚合（会有数据量过大的场景）
  // 每次触发时比较上一次和当前的参数是否相同，相同入参时不重新请求接口
  // useEffect(() => {
  //   if (!_mapIns) return;
  //   if (!(isArray(areaCheckList) && areaCheckList.length)) {
  //     areaParamsRef.current = {}; // 重置参数为默认值
  //     // level、city改变，但是选了品牌时也会执行这段就会有问题
  //     if (brandCheckList?.length && level < CITY_LEVEL) return;
  //     setPointClusterData([]);
  //     return;
  //   };
  //   if (level > CITY_LEVEL) { // 全国、省、市时都显示聚合的商圈数据
  //     areaParamsRef.current = {}; // 重置参数为默认值
  //     return;
  //   };
  //   const params: any = {
  //     level,
  //     areaCheckList
  //   };
  //   const { id: cityId, provinceId } = city || {};

  //   if (level === PROVINCE_LEVEL && provinceId) { // 在省份视角下，省份id变化才需要重新请求
  //     params.provinceId = provinceId;
  //     Reflect.deleteProperty(areaParamsRef.current, 'cityId'); // 清除城市id
  //   }
  //   if (level === CITY_LEVEL && cityId) { // 在市视角下，只有城市id变化才需要重新请求
  //     params.cityId = cityId;
  //     Reflect.deleteProperty(areaParamsRef.current, 'provinceId'); // 清除省份id
  //   }
  //   // console.log(`areaParamsRef.current`, areaParamsRef.current);
  //   // console.log(`params`, params);
  //   // console.log(`是否相同`, isEqual(areaParamsRef.current, params));
  //   if (isEqual(areaParamsRef.current, params)) return;
  //   areaParamsRef.current = params;
  //   drawBusinessArea();
  // }, [areaCheckList, city, level, _mapIns]);
  // ----重点商圈绘制副作用相关逻辑end----



  useEffect(() => {
    if (!_mapIns) return;
    if (level <= PROVINCE_LEVEL) {
      switchLevel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, level, _mapIns, brandCheckList, areaCheckList, customerCheckList, featureVal, customerCountryCount, brandColorMap]);
  // 数据抛出去
  useEffect(() => {
    finallyData && finallyData(pointClusterData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointClusterData]);

  // const drawBusinessArea = async () => {
  //   const apiGetAreaCluster = isShare ? getAreaClusterShare : getAreaCluster;
  //   const params: any = {};
  //   // 管理全国和省级的聚合点, 全国的不需要传区域参数
  //   level === PROVINCE_LEVEL && (params.provinceId = city?.provinceId);
  //   level === CITY_LEVEL && (params.cityId = city?.id);
  //   const areaCluster = await apiGetAreaCluster({ ...params, areaIds: areaCheckList });
  //   setShowImg(false);
  //   fieldNamesRef.current = {
  //     childrenKey: 'areas',
  //   };
  //   colorMapRef.current = areaColorMap;
  //   setPointClusterData(areaCluster || []);
  // };

  const switchLevel = async () => {
    const params: any = {};
    // 管理全国和省级的聚合点, 全国的不需要传区域参数
    level === PROVINCE_LEVEL && (params.provinceId = city?.provinceId);
    switch (true) {
      case brandCheckList.length > 0:
        const api = isShare ? getBrandClusterShare : getBrandCluster;
        // level === CITY_LEVEL && (params.cityId = city?.id);

        // 门店功能全不选的情况下传-1， 不然服务端会返回全部的
        const optionsVal = featureVal && featureVal.length ? featureVal : [-1];
        const reqParam = {
          ...params,
          brandIds: brandCheckList,
          month: dayjs(month).format('YYYY-MM'),
        };
        if (shopFunctionStatus) {
          reqParam.shopFunctions = optionsVal;
        }
        // 入参相同时，不重新请求接口
        // if (isEqual(brandParamsRef.current, reqParam)) return;
        // brandParamsRef.current = reqParam;
        const brandCluster = await api(reqParam);
        fieldNamesRef.current = {
          childrenKey: 'brands',
          name: 'area',
        };
        let brandClusterData: any[] = [];
        // 需要把brandCluster中的area、brands重命名为name、areas，方便src/common/components/AMap/components/LevelLayer中利用统一的字段名
        if (isArray(brandCluster)) {
          brandClusterData = brandCluster.map((item: any) => ({ ...item, name: item.area, areas: item.brands }));
        }
        setShowImg(true);
        colorMapRef.current = brandColorMap;
        setPointClusterData(brandClusterData);
        getBrandList && getBrandList(optionsVal);
        break;
      case areaCheckList.length > 0:
        // if (level >= CITY_LEVEL) return;
        const apiGetAreaCluster = isShare ? getAreaClusterShare : getAreaCluster;
        const areaCluster = await apiGetAreaCluster({ ...params, areaIds: areaCheckList });
        setShowImg(false);
        fieldNamesRef.current = {
          childrenKey: 'areas',
        };
        colorMapRef.current = areaColorMap;
        setPointClusterData(areaCluster || []);
        break;
      case isArray(customerCheckList) && customerCheckList.length > 0:
        // if (level >= CITY_LEVEL) return;
        setShowImg(true);
        fieldNamesRef.current = {
          childrenKey: 'data',
        };
        colorMapRef.current = customerColorMap;

        if (level === COUNTRY_LEVEL) {
          let arr:any = [];
          customerCheckList.map((cur) => {
            arr = customerCountryCount[cur];
            arr?.map((item) => {
              let total = 0;
              item.data = customerCheckList.map((curCheck) => {
                let dataCount = 0;
                customerCountryCount[curCheck].map((val) => {
                  if (val.id === item.id) {
                    dataCount += val.count;
                  }
                });
                total += dataCount;
                return {
                  name: customerMap[curCheck].name,
                  id: curCheck,
                  logo: customerMap[curCheck].logo,
                  total: dataCount,
                };
              });
              item.total = total;
            });
            setPointClusterData(arr || []);
          });


        } else if (level === PROVINCE_LEVEL) {
          customerCheckList.forEach((type) => {
            handleCustomerInfo(type);
          });
        }
        break;
      default:
        // 所有的数组都是空的时候说明没有任何勾选项，清空地图上的聚合点
        setPointClusterData([]);
        // brandParamsRef.current = {};
    }
  };
  const handleCustomerInfo = async(type) => {
    const jsonUrl = await heatDemoProvince({ provinceId: city.provinceId, type });
    const provincePoint = jsonUrl.pointUrl && await get(jsonUrl.pointUrl);
    let curCustomer = {};
    curCustomer = {
      ...curCustomer,
      ...customerProvinceCount.current,
      [type]: provincePoint?.districts
    };
    customerProvinceCount.current = curCustomer;
    provincePoint?.districts.forEach((item) => {
      let val = 0;
      item.data = customerCheckList.map((customer) => {
        let curVal = 0;
        customerProvinceCount.current[customer]?.forEach((cur) => {
          if (cur.id === item.id) {
            val += cur.count;
            curVal += cur.count;
          }
        });
        return {
          name: customerMap[customer].name,
          id: customer,
          logo: customerMap[customer].logo,
          total: curVal,
        };
      });
      item.total = val;
    });
    setPointClusterData(provincePoint?.districts || []);
  };
  //  全国
  const handleCountryInfo = async() => {
    const jsonUrl = await heatDemoCountry();
    // 注册会员-1
    const allProvinceRegisterUrl = jsonUrl?.allProvinceRegisterUrl && await get(jsonUrl.allProvinceRegisterUrl);
    // 活跃会员-2
    const allProvinceActiveUrl = jsonUrl?.allProvinceActiveUrl && await get(jsonUrl.allProvinceActiveUrl);
    // 沉睡会员-3
    const allProvinceSleepUrl = jsonUrl?.allProvinceSleepUrl && await get(jsonUrl.allProvinceSleepUrl);
    setCustomerCountryCount({
      1: allProvinceRegisterUrl,
      2: allProvinceActiveUrl,
      3: allProvinceSleepUrl
    });
  };


  return (
    <>
      <ClusterChart
        zooms={[0, CITY_ZOOM]}
        fieldNames={fieldNamesRef.current}
        labelMarker={labelMarkerRef.current}
        colorMap={colorMapRef.current}
        showImg={showImg}
        clusterData={pointClusterData}
        _mapIns={_mapIns}
        showColor={true}
      />
    </>
  );
};

export default Cluster;
