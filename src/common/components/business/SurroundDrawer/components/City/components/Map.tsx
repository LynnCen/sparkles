/**
 * @Description 城市地图
 */

import { FC, useState, useEffect, useRef } from 'react';
import { drawDistrictPath } from '@/common/utils/map';
import styles from '../index.module.less';
import AMap from '@/common/components/AMap';
import { Switch } from 'antd';
import HeatMapTool from '@/common/components/AMap/components/HeatMapTool';
import { tenantCheck } from '@/common/api/common';
import { COUNTRY_LEVEL } from '@/common/components/AMap/ts-config';

const Map: FC<any> = ({
  detailInfo,
  setMapLoaded,
  isFromImageserve
}) => {
  const headMapRef: any = useRef();
  const [mapIns, setMapIns] = useState<any>();
  const [switchValue, setSwitchValue] = useState(true);
  const [handleHeatMap, setHandleHeatMap] = useState(false); // 检查是否有人口热力的权限


  useEffect(() => {
    if (!mapIns) return;
    const { lng, lat, radius, cityName } = detailInfo || {};
    cityName && drawDistrictPath(mapIns, cityName || '');
    if (!(lng && lat && radius && cityName)) return;
    addMarkers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapIns, detailInfo]);

  useEffect(() => {
    if (!headMapRef.current) return;
    headMapRef.current.setStatus(switchValue);
  }, [switchValue]);

  const getHeatMapConfig = () => {
    tenantCheck().then(({ heatMapFlag }) => {
      setHandleHeatMap(heatMapFlag);
      headMapRef.current.setStatus(heatMapFlag);
    });
  };

  useEffect(() => {
    if (isFromImageserve) return;
    getHeatMapConfig();
  }, [isFromImageserve]);

  const amapCreated = (ins) => {
    if (!ins) return;
    setMapIns(ins);
    setMapLoaded && setMapLoaded(true);
  };
  const addMarker = (lnglat) => {
    const customIcon = new window.AMap.Icon({
      // 图标尺寸
      size: new window.AMap.Size(30, 30),
      // 图标的取图地址
      image: 'https://staticres.linhuiba.com/project-custom/location-insight/icon_marker_point@2x.png',
      // 图标所用图片大小
      imageSize: new window.AMap.Size(30, 30),
      // 图标取图偏移量
      // imageOffset: new AMap.Pixel(0, 10)
    });
    return new window.AMap.Marker({
      position: lnglat,
      anchor: 'center', // 底部中间为基准点
      icon: customIcon,
      offset: new window.AMap.Pixel(0, 0),
      zIndex: 20,
      // zooms: [13, 20]
    });
  };
  const addContentMarker = (lnglat) => {
    const div = document.createElement('div');
    div.className = 'textMarkerWrapper';
    div.innerHTML = `<div class='textMarkerCon'>
        ${detailInfo?.address}
      </div>`;
    return new window.AMap.Marker({
      position: lnglat,
      offset: [0, 20],
      anchor: 'top-center', // 顶部中间为基准点
      content: div,
      zIndex: 21
    });
  };
  const addMarkers = () => {
    const { lng, lat, radius } = detailInfo;
    const lnglat = [+lng, +lat];
    const circleMarker = new window.AMap.Circle({
      center: lnglat,
      radius,
      strokeColor: 'transparent', // 线条颜色
      strokeOpacity: 1, // 轮廓线透明度
      strokeWeight: 0, // 线宽
      fillOpacity: 0.18, // 填充透明度
      strokeStyle: 'solid',
      // strokeDasharray: [5, 5],
      fillColor: '#006AFF', // 填充颜色
      zIndex: 20,
      // zooms: [13, 20]
    });
    const curCenterMarker = addMarker(lnglat);
    const contentMarker = addContentMarker(lnglat);
    mapIns.add(circleMarker);
    mapIns.add(curCenterMarker);
    mapIns.add(contentMarker);
    // mapIns.setFitView(curCenterMarker);
    // mapIns.setFitView(circleMarker);
    mapIns.setCenter([lng, lat], true);
  };

  /**
   * @description 是否开启热力图
   * @param val 切换后的值
   */
  const onSwitchChange = (val) => {
    setSwitchValue(val);
  };

  return (
    <div className={styles.mapCon}>
      <AMap
        loaded={amapCreated}
        mapOpts={{
          // zoom: 14
          WebGLParams: { preserveDrawingBuffer: true }
        }}
        plugins={[
          'AMap.HeatMap',
          'AMap.DistrictSearch',
          'AMap.Geocoder'
        ]} />
      {handleHeatMap && <HeatMapTool
        _mapIns={mapIns}
        ref={headMapRef}
        // isShowInCountry
        topLevel={COUNTRY_LEVEL}
        customSlot={
          <div className={styles.peopleHeadSwitch}>
            <span className='mr-8'>人口热力</span><Switch checked={switchValue} onChange={onSwitchChange} />
          </div>
        } />}
    </div>
  );
};

export default Map;
