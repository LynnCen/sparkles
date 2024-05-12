
import { FC, useEffect, useMemo, useRef, useState } from 'react';

import { fetchBrandList, getIndustryPermissionList } from '@/common/api/selection';
import { useMethods } from '@lhb/hook';
import { useMapLevelAndCity } from '@/common/hook/useMapLevelAndCity';
import { isEqual } from 'lodash';
// import { chartColorList } from './ts-config';
import dayjs from 'dayjs';
import {
  COUNTRY_LEVEL,
  PROVINCE_ZOOM,
  PROVINCE_LEVEL,
  CITY_ZOOM,
  CITY_LEVEL,
  DISTRICT_ZOOM,
  DISTRICT_LEVEL,
} from '@/common/components/AMap/ts-config';
import { isArray } from '@lhb/func';
import { Spin } from 'antd';
import AMap from '@/common/components/AMap';
import TopCon from '@/common/components/AMap/components/TopCon';
// import HeatMap from '../../../../common/components/business/IndustryMap/HeatMap';
import LeftCon from './components/LeftCon';
import RightCon from './components/RightCon';
import Hint from './components/Hint';
import styles from './entry.module.less';
import { tenantCheck } from '@/common/api/common';
import KeepAlive from 'react-activation';
import { getTenantInfo } from '@/common/api/system';
import MassMap from '@/common/components/business/IndustryMap/MassMap';
// import { chartColorList } from './ts-config';

const Industry: FC<any> = () => {
  const [loading, setLoading] = useState(true);
  const [amapIns, setAmapIns] = useState<any>(null);
  const [brandList, setBrandList] = useState<any>([]); // 品牌列表
  const [heatType, setHeatType] = useState<any>([]); // 热力图的类别
  const [month, setMonth] = useState<any>(dayjs().add(-1, 'month'));
  const [brandColorMap, setBrandColorMap] = useState<any>({});
  const [curAreaInfo, setCurAreaInfo] = useState<any>(null);
  const [permissionList, setPermissionList] = useState<any>([]);
  const { city, level } = useMapLevelAndCity(amapIns);
  const [featureEntryOptions, setFeatureEntryOptions] = useState<any>([]);
  const brandListFetchParamsRef: any = useRef<any>({}); // 请求品牌列表时的入参
  // 判断是否为小鹏租户
  const [isXP, setIsXP] = useState<boolean>(true);
  const URLParamsRef = useRef({
    areaCheckList: '',
    brandCheckList: '',
    industryCheckList: '',
    customerCheckList: '',
    levelCheckList: '',
    pushpinInfo: [],
    month: dayjs().add(-1, 'month'),
    // 是否包含台湾信息,0为不包含
    limit: 0,
    city: null,
    level: 0,
  });
  const getTargetTenent = () => {
    tenantCheck().then(({ isXiaoPeng }) => {
      // 小鹏用户不展示说明文档
      setIsXP(!isXiaoPeng);
    });
  };
  useEffect(() => {
    getTargetTenent();
    getPermissionList();
    return () => {
      amapIns && amapIns.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!amapIns) return;
    addClickEvent();
    return () => {
      clearClickEvent();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amapIns]);
  useEffect(() => {
    if (!city) return;
    // 判断是否有品牌网店的权限
    if (!permissionList.includes('brand')) return;
    getBrandList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, level, month, permissionList]);

  const [shopFunctionStatus, setShopFunctionStatus] = useState<boolean>(false);
  const setTenantInfo = async () => {
    const data = await getTenantInfo();
    data && data.shopFunctionStatus && data.shopFunctionStatus > 0 && setShopFunctionStatus(true);
  };

  useEffect(() => {
    setTenantInfo();
  }, []);
  const { getPermissionList, mapLoadedHandle, getBrandList, toCenterAndLevel, clearClickEvent, addClickEvent } =
    useMethods({
      getPermissionList: async () => {
        const res = await getIndustryPermissionList();
        const list: any = [];
        isArray(res) &&
          res.forEach((permission) => {
            const lastIndexOf = permission.event.lastIndexOf(':');
            const eventName = permission.event.slice(lastIndexOf + 1);
            list.push(eventName);
          });
        setPermissionList(list);
      },
      mapLoadedHandle: (mapIns: any) => {
        setAmapIns(mapIns);
        setLoading(false);
        mapIns.addLayer(new window.AMap.TileLayer.Satellite({ visible: false }));
      },
      // 获取品牌网点并生成配色映射，放在这里是因为左右弹窗都要使用相关数据
      getBrandList: async (optionsVal) => {
        const params: any = {};
        level >= PROVINCE_LEVEL && (params.provinceId = city?.provinceId);
        level >= CITY_LEVEL && (params.cityId = city?.id);
        // if (level >= DISTRICT_LEVEL) {
        //   const index:any = city?.districtList.findIndex(e => e.name.includes(city?.district));
        //   index !== -1 && (params.districtId = city?.districtList[index].id);
        // }
        const reqParam = { ...params, month: dayjs(month).format('YYYY-MM'), type: 1 };
        if (shopFunctionStatus) {
          reqParam.shopFunctions = optionsVal || featureEntryOptions;
        }
        // 入参不变时不重复请求
        if (isEqual(reqParam, brandListFetchParamsRef.current)) return;
        brandListFetchParamsRef.current = reqParam;
        const res = await fetchBrandList(reqParam);
        // 颜色获取逻辑,按照之前写法，将id作为key，颜色作为value，放入到colorMap中
        const colorMap: any = {};
        isArray(res) &&
          res.forEach((item) => {
            colorMap[item.id] = item.color;
          });

        setBrandColorMap(colorMap);
        setBrandList(res || []);
      },
      toCenterAndLevel: (e) => {
        if (level === DISTRICT_LEVEL) return;
        const { lnglat } = e;
        let zoom = 4;
        switch (level) {
          case COUNTRY_LEVEL:
            zoom = PROVINCE_ZOOM;
            break;
          case PROVINCE_LEVEL:
            zoom = CITY_ZOOM;
            amapIns.setZoom(CITY_ZOOM);
            break;
          case CITY_LEVEL:
            zoom = DISTRICT_ZOOM;
            break;
        }
        amapIns.setZoomAndCenter(zoom, lnglat, false, 300);
      },
      clearClickEvent: () => {
        amapIns && amapIns.off('click', toCenterAndLevel);
      },
      addClickEvent: () => {
        amapIns && amapIns.on('click', toCenterAndLevel);
      },
    });
  const memoCity = useMemo(() => {
    (URLParamsRef.current.city as any) = {
      ...city,
      districtList: null
    };
    return city;
  }, [city]);
  // 到CITY_LEVEL时关闭聚合显示，展示具体的点圈
  const memoLevel = useMemo(() => {
    (URLParamsRef.current.level as any) = level;
    return level;
  }, [level]);
  return (
    <Spin size='large' spinning={loading}>
      <div className={styles.container}>
        <AMap
          mapOpts={{
            zoom: 4.3,
            zooms: [4, 20],
            center: [93.826777, 38.060634], // 默认地图的中心位置，使中国地图处于地图正中央
          }}
          loaded={mapLoadedHandle}
          plugins={['AMap.HeatMap',
            'AMap.DistrictSearch',
            'AMap.Geocoder',
            'AMap.RangingTool',
            'AMap.PlaceSearch',
            'AMap.HeatMap',
            'AMap.Driving', // 驾车
            'AMap.Riding', // 骑行
            'AMap.Walking' // 走路
          ]}
        >
          <LeftCon
          // 权限
            permissionList={permissionList}
            // 网店品牌
            brandList={brandList}
            // 绘制聚合点位
            brandColorMap={brandColorMap}
            // 客群分布设置热力图
            setHeatType={setHeatType}
            //  月份，和展示数据、绘制聚合点位、绘制点位和商圈相关
            month={month}
            setMonth={setMonth}
            // 绘制点位和商圈  当前城市右侧消息
            setCurAreaInfo={setCurAreaInfo}
            level={memoLevel}
            city={memoCity}
            URLParamsRef={URLParamsRef}
            getBrandList={getBrandList}
            setFeatureEntryOptions={setFeatureEntryOptions}
            heatType={heatType}
          />
          {/* 右侧内容 */}
          <RightCon
            curAreaInfo={curAreaInfo}
            city={memoCity}
            level={memoLevel}
            brandListOnCountry={brandList}
            month={month}
          />
          {/* 顶部搜索 */}
          <TopCon
            clearClickEvent={clearClickEvent}
            addClickEvent={addClickEvent}
            city={memoCity}
            level={memoLevel}
            URLParamsRef={URLParamsRef}
            share={isXP}
            explain={isXP}
          />
          {/* 绘制热力图 */}
          {/* <HeatMap city={memoCity} level={memoLevel} heatType={heatType} /> */}
          {/* 绘制海量点 */}
          <MassMap city={memoCity} level={memoLevel} heatType={heatType} />
        </AMap>
        <Hint />
      </div>
    </Spin>
  );
};

export default ({ location }) => (
  <KeepAlive saveScrollPosition='screen' name={location.pathname}>
    <Industry />
  </KeepAlive>
);
