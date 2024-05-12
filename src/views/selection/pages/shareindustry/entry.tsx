import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { COUNTRY_LEVEL, PROVINCE_ZOOM, PROVINCE_LEVEL, CITY_ZOOM, CITY_LEVEL, DISTRICT_ZOOM, DISTRICT_LEVEL } from '@/common/components/AMap/ts-config';
import { isArray, isMobile, urlParams } from '@lhb/func';
import { fetchAreaListShare, fetchBrandListShare, } from '@/common/api/selection';
import { useMethods } from '@lhb/hook';
import { useMapLevelAndCity } from '@/common/hook/useMapLevelAndCity';
import { AreaChartColorList, areaIcon, chartColorList } from './ts-config';
import dayjs from 'dayjs';
import AMap from '@/common/components/AMap';
import styles from './entry.module.less';
// import HeatMap from '@/common/components/business/IndustryMap/HeatMap';
import Cluster from '@/common/components/business/IndustryMap/Cluster';
import MapController from '@/common/components/business/IndustryMap/MapController';
import IndustryMarker from '@/common/components/business/IndustryMap/IndustryMarker';
import MassMarker from '@/common/components/business/IndustryMap/MassMarker';
import LevelLayer from '@/common/components/AMap/components/LevelLayer';
import MassMap from '@/common/components/business/IndustryMap/MassMap';

const Industry: FC<any> = () => {
  const {
    level,
    city,
    tenantId,
    lng,
    lat,
    zoom,
    month,
    heatType, poiMarkerLng, poiMarkerLat, poiMarkerName, pushpinInfo, brandCheckList, areaCheckList,
    customerCheckList, showRankArea, industryCheckList, levelCheckList, satellite, cityIds
  } = useMemo(() => {
    return JSON.parse(decodeURI(urlParams(location.search)?.params)) || {};
  }, []);
  const firstRef = useRef<any>(true);
  const labelMarkerRef = useRef<any>(null);

  const [amapIns, setAmapIns] = useState<any>(null);
  const [groupIns, setGroupIns] = useState<any>(null);
  const [areaIconMap, setAreaIconMap] = useState<any>({});
  const [areaColorMap, setAreaColorMap] = useState<any>({});
  const [brandColorMap, setBrandColorMap] = useState<any>({});

  const { city: curCity, level: curLevel } = useMapLevelAndCity(amapIns);
  const memoLevel:any = useMemo(() => level, [level]);
  const memoCity:any = useMemo(() => city, [city]);
  // const memoCity:any = useMemo(() =>
  //   amapIns?.getCity((val) => {
  //     if (!isEqual(val, city)) {
  //     // 部分市（一般是省直辖市）没有city值，取district，依然没有时取省份名
  //       const name = val.city === '' ? val.province : val.city;
  //       // 非有效省市区，不再处理，参照src/common/components/AMap/ts-config.ts
  //       if (!isNotEmptyAny(name)) return;
  //       fetchCityIdByName({ name })
  //         .then((cityRes) => {
  //         // 台湾省无数据返回，暂时不做处理
  //           if (cityRes.id) {
  //             return ({ ...val, ...cityRes });
  //           }
  //         });
  //     }
  //   })
  // , [zoom, amapIns]);


  // const memoLevel:any = useMemo(() => {
  //   const curZoom = amapIns?.getZoom();
  //   let curLevel = 0;
  //   if (curZoom < PROVINCE_ZOOM) {
  //     curLevel = COUNTRY_LEVEL;
  //   } else if (curZoom < CITY_ZOOM) {
  //     curLevel = PROVINCE_LEVEL;
  //   } else if (curZoom < DISTRICT_ZOOM) {
  //     curLevel = CITY_LEVEL;
  //   } else {
  //     curLevel = DISTRICT_LEVEL;
  //   };
  //   return (curLevel);
  // }, [zoom, amapIns]);
  // console.log('memoCity', memoCity);
  // console.log('memoLevel', memoLevel);
  // useEffect(() => {
  //   return () => {
  //     amapIns && amapIns.destroy();
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  useEffect(() => {
    if (!amapIns) return;
    // 搜索地图的点位
    labelMarkerRef.current = new window.AMap.Marker({
      content: ' ',
      map: amapIns,
      anchor: 'top-left',
      offset: [-34, 6]
    });
    poiMarkerLng && poiMarkerLat && poiMarkerName && createPoiMarker({
      poiMarkerLng,
      poiMarkerLat,
      poiMarkerName
    });

    const group = new window.AMap.OverlayGroup();
    amapIns.add(group);
    setGroupIns(group);

    addClickEvent();
    return () => {
      clearClickEvent();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amapIns]);

  useEffect(() => {
    getBrandList();
    getAreaList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // }, [city, level, month]);

  const {
    mapLoadedHandle,
    getBrandList,
    toCenterAndLevel,
    clearClickEvent,
    addClickEvent,
    createPoiMarker,
    regeoCode,
    getAreaList
  } = useMethods({
    getAreaList: async () => {
      const res = await fetchAreaListShare({ tenantId: +tenantId });
      const colorMap: any = {};
      const iconMap: any = {};
      isArray(res) && res.forEach((item, ind) => {
        item.color = AreaChartColorList[ind < AreaChartColorList.length ? ind : ind % AreaChartColorList.length];
        item.icon = areaIcon[ind < AreaChartColorList.length ? ind : ind % AreaChartColorList.length];
        colorMap[item.id] = item.color;
        iconMap[item.id] = item.icon;
      });
      setAreaIconMap(iconMap);
      setAreaColorMap(colorMap);
    },
    mapLoadedHandle: (mapIns: any) => {
      setAmapIns(mapIns);
      mapIns.addLayer(new window.AMap.TileLayer.Satellite({ visible: !!satellite }));
    },
    // 获取品牌网点并生成配色映射，放在这里是因为左右弹窗都要使用相关数据
    getBrandList: async () => {
      const params: any = { type: 1 };
      memoLevel >= PROVINCE_LEVEL && (params.provinceId = memoCity?.provinceId);
      memoLevel >= CITY_LEVEL && (params.cityId = memoCity?.id);
      const res = await fetchBrandListShare({ ...params, month: dayjs(month).format('YYYY-MM'), tenantId: +tenantId, cityIds, brandIds: brandCheckList || [] });
      const colorMap: any = {};
      isArray(res) && res.forEach((item, ind) => {
        item.color = chartColorList[ind < chartColorList.length ? ind : ind % chartColorList.length];
        colorMap[item.id] = item.color;
      });
      setBrandColorMap(colorMap);
    },
    toCenterAndLevel: (e) => {
      if (memoLevel === DISTRICT_LEVEL) return;
      const { lnglat } = e;
      let zoom = 4;
      switch (memoLevel) {
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
      };
      amapIns.setZoomAndCenter(zoom, lnglat, false, 300);
    },
    clearClickEvent: () => {
      if (isMobile()) return;
      amapIns && amapIns.off('click', toCenterAndLevel);
    },
    addClickEvent: () => {
      if (isMobile()) return;
      amapIns && amapIns.on('click', toCenterAndLevel);
    },
    // 搜索地图的点位
    createPoiMarker: (poiMarker) => {
      const marker = new window.AMap.Marker({
        map: amapIns,
        icon: new window.AMap.Icon({
          image: 'https://staticres.linhuiba.com/project-custom/locationpc/recommend/icon_poi@2x.png',
          size: [25, 35],
          imageSize: [25, 35],
          position: [poiMarker.poiMarkerLng, poiMarker.poiMarkerLat],
        }),
        anchor: 'bottom-center',
        position: [poiMarker.poiMarkerLng, poiMarker.poiMarkerLat],
      });
      marker.on('mouseover', () => {
        const labelContent = `<div class='poiMarkerLabel'>
        <div class='trangle'></div>
        <div class='marker'>${poiMarker.poiMarkerName}</div>
        </div>`;
        labelMarkerRef.current.setMap(amapIns); // 防止有的页面使用map.clear()
        labelMarkerRef.current.setPosition([poiMarker.poiMarkerLng, poiMarker.poiMarkerLat]);
        labelMarkerRef.current.setContent(labelContent);
      });
      marker.on('mouseout', () => {
        labelMarkerRef.current.setContent(' ');
      });


      if (isMobile()) {
        marker.on('click', () => {
          const labelContent = `<div class='poiMarkerLabel'>
      <div class='trangle'></div>
      <div class='marker'>${poiMarker.poiMarkerName}</div>
      </div>`;
          labelMarkerRef.current.setMap(amapIns); // 防止有的页面使用map.clear()
          labelMarkerRef.current.setPosition([poiMarker.poiMarkerLng, poiMarker.poiMarkerLat]);
          labelMarkerRef.current.setContent(labelContent);
          setTimeout(() => {
            labelMarkerRef.current.setContent(' ');
          }, (3000));
        });
      }
      return marker;
    },
    // 标记-图钉
    regeoCode: (lnglat, address) => {
      const content = "<svg style='width: 16px; height: 16px;' aria-hidden><use xlink:href='#iconic_sign' style='fill:#F23030'/></svg>";
      const marker = new window.AMap.Marker({
        content,
        position: lnglat,
        anchor: 'bottom-center',
      });
      const labelContent = `<div class='signLabel'>${address}
          <svg style='width: 7px; height: 7px;' aria-hidden>
          <use xlink:href='#iconic_close_colour_seven' style='fill:#132144 '/>
          </svg>
          </div>`;
      const labelMarker = new window.AMap.Marker({
        content: labelContent,
        position: lnglat,
        anchor: 'top-left',
      });
      labelMarker.on('click', (e) => {
        // 判断点中的是关闭按钮
        if (e.originEvent?.target?.nodeName === 'svg') {
          groupIns?.removeOverlay(marker);
          groupIns?.removeOverlay(labelMarker);
        }
      });
      groupIns?.addOverlay(marker);
      groupIns?.addOverlay(labelMarker);
      firstRef.current = false;
    },

  });
  // 只会执行一次
  firstRef.current &&
  groupIns && pushpinInfo.map((item) => {
    regeoCode && regeoCode(item.lnglat, item.address);
  });

  return (
    <div className={styles.container}>
      <AMap
        mapOpts={{
          zoom: zoom,
          zooms: [4, 20],
          center: [lng, lat]
        }}
        loaded={mapLoadedHandle}
        plugins={[
          'AMap.HeatMap',
          'AMap.DistrictSearch',
          'AMap.Geocoder',
          'AMap.RangingTool',
          'AMap.PlaceSearch']}
      >

        {/* 绘制聚合点位 */}
        <Cluster
          customerCheckList={customerCheckList}
          month={month}
          _mapIns={amapIns}
          brandCheckList={brandCheckList}
          areaCheckList={areaCheckList}
          brandColorMap={brandColorMap}
          areaColorMap={areaColorMap}
          level={memoLevel}
          city={memoCity} />
        {/* 绘制点位和商圈 */}
        <MapController
          showRankArea={showRankArea || null}
          month={month}
          _mapIns={amapIns}
          brandCheckList={brandCheckList}
          areaCheckList={areaCheckList}
          areaColorMap={areaColorMap}
          areaIconMap={areaIconMap}
          level={memoLevel}
          setCurAreaInfo={() => {}}
          city={memoCity}
          cityIds={cityIds}
        />
        {/* 绘制行业网点 */}
        <IndustryMarker
          _mapIns={amapIns}
          city={memoCity}
          level={memoLevel}
          industryCheck={industryCheckList} />
        {/* 绘制客群分布点位和聚合点 */}
        <MassMarker
          checkList={customerCheckList}
          _mapIns={amapIns}
          city={memoCity}
          level={memoLevel} />
        {/* 绘制行政区颜色 */}
        <LevelLayer
          _mapIns={amapIns}
          level={curLevel}
          city={curCity}
          isAllLevel={!!levelCheckList?.length}
        />
        {/* 绘制热力图 */}
        {/* <HeatMap
          city={memoCity}
          level={memoLevel}
          heatType={heatType || ''}
        /> */}
        {/* 海量点 */}
        <MassMap
          city={curCity}
          level={curLevel}
          heatType={heatType || []}
        />
      </AMap>
    </div>
  );
};

export default Industry;


