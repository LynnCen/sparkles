import React, { useEffect, useMemo, useRef, useState } from 'react';
import Amap from '@/common/components/AMap';
import styles from './index.module.less';
import { ModelClusterInfo, ShopItem } from '@/common/components/business/ExpandStore/CircleBasicInfo/ts-config';
import { debounce, isArray, isNotEmptyAny } from '@lhb/func';
import { CircleBusinessZoom, TargetZoom } from '../CircleBusinessMap/ts-config';
import { markerActiveColorOption } from '@/views/recommend/pages/industrycircle/ts-config';
import ReactDOM from 'react-dom';
import IconFont from '@/common/components/IconFont';
import { useHoverMarker } from './config';
import { StoreStatus } from '../ts-config';
import { Typography } from 'antd';


interface CircleTaskDetailMapProps{
businessDetail:{
  modelClusterInfo:ModelClusterInfo;
  [k:string]:any
}
}

const CircleTaskDetailMap:React.FC<CircleTaskDetailMapProps> = (props) => {
  const { businessDetail } = props;
  const { modelClusterInfo } = businessDetail;
  const [mapIns, setMapIns] = useState<any>(null);// 地图实例
  const overLayers = useRef<any>(null);
  const { createHoverMarker, removeHoverMarker } = useHoverMarker(mapIns);

  useEffect(() => {
    if (!mapIns) return;
    if (isNotEmptyAny(businessDetail.modelClusterInfo)) {
      const { modelClusterInfo } = businessDetail;
      flyToCurrentPos(modelClusterInfo.centerLng, modelClusterInfo.centerLat);
      createBusinessLayers(modelClusterInfo);
      createSurroundMarkers(modelClusterInfo);
    }
  }, [mapIns]);

  const storeStatus = useMemo<Array<ShopItem>>(() => {
    if (!isNotEmptyAny(modelClusterInfo?.shopList)) return [];
    const storeStatusMap:Partial<Record<StoreStatus, ShopItem | null>> = {
      [StoreStatus.Signed]: null, // 已签约
      [StoreStatus.HouseDelivered]: null, // 已交房
      [StoreStatus.Opened]: null, // 开业中
      [StoreStatus.Closed]: null, // 已闭店
    };

    modelClusterInfo?.shopList?.forEach((item) => {
      if (Reflect.has(storeStatusMap, item.status)) {
        storeStatusMap[item.status] = item;
      }
    });
    return Object.values(storeStatusMap).filter(Boolean) as Array<ShopItem> || [];
  }, [modelClusterInfo?.shopList]);

  // 创建商圈和marker
  const createBusinessLayers = (businessInfo:ModelClusterInfo) => {
    const markers: any = []; // 围栏覆盖物
    const { radius, polygon } = businessInfo;
    let marker;
    if (radius) {
      marker = createBusinessCircle(businessInfo); // 绘制商圈围栏（圆）覆盖物
    } else if (isArray(polygon) && polygon.length) {
      marker = createBusinessPolygon(businessInfo);
    }
    markers.push(...marker);
    const railOverlayGroups = new window.AMap.OverlayGroup(markers); // 围栏覆盖物群组
    mapIns.add(railOverlayGroups); // 添加到地图
    marker[0] && mapIns.setFitView(marker[0]); // 视口自适应
    renderMarkerContent(businessInfo.modelClusterId, businessInfo.modelClusterName);
    overLayers.current = railOverlayGroups;
  };

  // 创建周边500米门店marker
  const createSurroundMarkers = (businessInfo:ModelClusterInfo) => {
    if (!isNotEmptyAny(businessInfo?.shopList)) return;

    const surroundMarkerList:Array<any> = [];
    businessInfo.shopList.forEach((item) => {
      const marker = new window.AMap.Marker({
        zooms: [CircleBusinessZoom.MinZomm, 20],
        anchor: 'center',
        position: new window.AMap.LngLat(+item.lng, +item.lat),
        content: `<div id=${item.id}></div>`
      });
      mapIns.add(marker); // 添加到地图
      renderSurroundMarker(item.id, item);
      surroundMarkerList.push(marker);
      marker.on('mousemove', () => mouseMoveMarker(item));
      marker.on('mouseout', () => mouseOutMarker());
    });

  };
  // 创建多边形商圈
  const createBusinessPolygon = (item:ModelClusterInfo) => {
    const { centerLng, centerLat } = item;
    if (!(+centerLng && +centerLat)) return;
    const lnglat = [+centerLng, +centerLat];
    const path = item?.polygon?.map((item) => {
      return [+item.lng, +item.lat];
    });
    const fillColor = markerActiveColorOption;
    const polygon = new window.AMap.Polygon({
      zooms: [CircleBusinessZoom.MinZomm, 20],
      path,
      strokeOpacity: 1,
      fillOpacity: 0.2,
      strokeWeight: 1,
      strokeStyle: 'dashed',
      // zIndex: 60,
      anchor: 'bottom-center',
      bubble: true,
      extData: {
        id: item.modelClusterId
      },
      ...fillColor
    });
    const marker = new window.AMap.Marker({
      zooms: [CircleBusinessZoom.MinZomm, 20],
      position: lnglat,
      anchor: 'center',
      extData: item,
      content: `<div id="${item.modelClusterId}"></div>`,
    });


    return [polygon, marker];
  };

  // 创建圆形商圈
  const createBusinessCircle = (item: ModelClusterInfo) => {
    const { centerLng, centerLat } = item;
    if (!(+centerLng && +centerLat)) return;
    const lnglat = [+centerLng, +centerLat];
    const fillColor = markerActiveColorOption;
    const circle = new window.AMap.Circle({
      zooms: [CircleBusinessZoom.MinZomm, 20],
      center: lnglat,
      radius: item?.radius, // 半径（米）
      strokeWeight: 1,
      strokeOpacity: 1,
      fillOpacity: 0.2,
      strokeStyle: 'dashed',
      strokeDasharray: [10, 10],
      bubble: true, // 为了支持在商圈围栏上测距
      extData: item,
      ...fillColor,
    });
    const marker = new window.AMap.Marker({
      position: lnglat,
      zooms: [CircleBusinessZoom.MinZomm, 20],
      anchor: 'center',
      extData: item,
      content: `<div id="${item.modelClusterId}"></div>`,
    });
    return [circle, marker];
  };

  // 监听hover marker

  const mouseMoveMarker = debounce((info) => {
    createHoverMarker(info);
  }, 0);
  const mouseOutMarker = debounce(() => {
    removeHoverMarker();
  }, 0);

  const renderMarkerContent = (id, info) => {
    const Node = <div className={styles.markerWrapper}>
      <div
        className={styles.markerContent} >
        <Typography.Text style={{ maxWidth: 165, color: '#fff', fontSize: 12 }} ellipsis={{ tooltip: info }}>{info}</Typography.Text>
      </div>
      <div className={styles.point} />
    </div>;
    ReactDOM.render(Node, document.getElementById(id));
  };

  const renderSurroundMarker = (id, item:ShopItem) => {
    const Node = <IconFont
      iconHref='iconic_mendian'
      style={{
        color: item.color,
        width: 24,
        height: 26
      }}
    />;
    ReactDOM.render(Node, document.getElementById(id));
  };

  const flyToCurrentPos = (lng, lat) => {
    mapIns && mapIns.setZoomAndCenter(TargetZoom, [+lng, +lat], false, 200);
  };
  const handleClickPosition = () => {
    if (!isNotEmptyAny(modelClusterInfo)) return;
    const { centerLat, centerLng } = modelClusterInfo;
    flyToCurrentPos(centerLng, centerLat);
  };
  // 地图加载完成
  const mapLoadedHandle = (ins: any) => {
    ins && setMapIns(ins);
  };

  return <div className={styles.circleTaskDetailMapWrapper}>
    <Amap
      mapOpts={{
        // zooms: [3, 16],
      }}
      loaded={mapLoadedHandle}
      plugins={[
        'AMap.DistrictSearch',
        'AMap.PlaceSearch',
      ]}
    />
    {
      // modelClusterInfo?.shopList
      isNotEmptyAny(modelClusterInfo?.shopList) && isNotEmptyAny(storeStatus) && <div className={styles.surroundShopWrapper}>
        {
          // modelClusterInfo.shopList
          storeStatus.map((item) => {
            return <div className={styles.brandItem} key={item.id}>
              <IconFont
                iconHref='iconic_mendian'
                style={{
                  width: 16,
                  height: 16,
                  color: item!.color,
                  marginRight: '5px'
                }}
              />
              <div className={styles.text}>{item.statusName}</div>
            </div>;
          })
        }

      </div>
    }

    <div className={styles.toolBottomBar}>
      <IconFont
        iconHref='iconic_mendiangengzhong'
        className='c-666'
        onClick={handleClickPosition}
      />
    </div>


  </div>;
};

export default CircleTaskDetailMap;
