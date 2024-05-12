/**
 * @Description 周边详情-poi列表显示用地图
 */

import { FC, forwardRef, useEffect, useRef } from 'react';
import Amap from '@/common/components/AMap';
import { useMethods } from '@lhb/hook';
import { isArray } from '@lhb/func';
import React from 'react';

const PoiMap: FC<any> = forwardRef(({
  poiTypeList,
  lat,
  lng,
  radius,
  amapIns,
  setAmapIns,
  poiSearchType = 1,
  borders,
  centerName,
  centerAddress,
}, ref) => {
  const labelRef = useRef<any>(null);

  useEffect(() => {
    if (!amapIns) return;
    methods.drawArea(poiTypeList, radius);
    const option = {
      map: amapIns,
      content: ' ',
      zIndex: 13,
      offset: [17, 30]
    };
    const textIns = new window.AMap.Marker(option);
    labelRef.current = textIns;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poiTypeList, amapIns, radius]);


  const methods = useMethods({
    loadedMapHandle: (map) => {
      setAmapIns(map);
    },
    drawArea: (drawList, range) => {
      amapIns && amapIns.clearMap();
      // 添加中心点标记
      methods.createCenterMarker(lat, lng);
      // 添加点位标记
      const { list, icon } = drawList;
      methods.createPointMarker(list, icon);
      // 添加区域
      if (+lng && +lat && poiSearchType === 1) {
        const circle = new window.AMap.Circle({
          center: [+lng, +lat],
          radius: range, // 半径（米）
          strokeColor: '#006AFF',
          strokeWeight: 2,
          strokeOpacity: 1,
          fillOpacity: 0.2,
          strokeStyle: 'dashed',
          strokeDasharray: [10, 10],
          fillColor: '#006AFF',
          zIndex: 50,
        });
        circle.setMap(amapIns);
        // 缩放地图到合适的视野级别
        amapIns.setFitView([circle], false, [18, 18, 96, 368]);
      }

      if (isArray(borders) && borders.length && poiSearchType === 2) {
      // 将字符串的经纬度转为数字类型
        const arr = borders.map((item: any) => {
          return [+item[0], +item[1]];
        });
        const polygon = new window.AMap.Polygon({
          path: arr,
          fillColor: '#006aff',
          strokeOpacity: 1,
          fillOpacity: 0.3,
          strokeColor: '#006aff',
          strokeWeight: 1,
          strokeStyle: 'dashed',
        });
        amapIns.add(polygon);
        amapIns.setFitView(polygon);
        return;
      };

    },
    createCenterMarker: (lat: number, lng: number) => {
      const lnglat = [lng, lat];
      const marker = new window.AMap.Marker({
        map: amapIns,
        icon: new window.AMap.Icon({
          image: 'https://staticres.linhuiba.com/project-custom/locationpc/ic_map_standard_marker@2x.png',
          size: [35, 35],
          imageSize: [35, 35],
          position: lnglat,
        }),
        anchor: 'bottom-center',
        position: lnglat,
      });

      marker.on('mouseover', function (e) {
        const { lnglat } = e;
        labelRef.current.setPosition([lnglat.lng, lnglat.lat]);
        labelRef.current.setContent(
          `<div class='center-label'><div class='trangle'></div><span class='center-name'>${centerName}</span><br/><span class='center-address'>${centerAddress || ''}</span></div>`
        );
      });
      marker.on('mouseout', function () {
        labelRef.current.setContent(` `);
      });

      marker.setMap(amapIns);
    },
    createPointMarker: (list :any[] = [], icon): any => {
      // 创建一个 Marker 实例：
      const data: any = [];
      list.map((item) => {
        data.push({
          ...item,
          lnglat: [+item.lng, +item.lat],
        });
      });
      const massIconW = 24;
      const massIconH = 28;
      const mass = new window.AMap.MassMarks(data, {
        style: {
          url: icon,
          size: [massIconW, massIconH],
          // 海量点icon位置调整为icon中心点与地图经纬度对齐
          anchor: new window.AMap.Pixel(massIconW / 2, massIconH / 2)
        }
      });
      mass.on('mouseover', function (e) {
        const { data } = e;
        const showText = data.code === '120300'; // 小区类型展示房价等字段
        // 拿到相对于地图容器的物理像素位置
        // const lnglat = new window.AMap.LngLat(data.lng, data.lat);
        // const pixel = amapIns.lngLatToContainer(lnglat);
        // console.log(`pixel`, pixel.round());
        labelRef.current.setPosition([data.lng, data.lat]);
        labelRef.current.setContent(
          `<div class='icon-label'>
            <div class='poi-name'>${data.name}</div>
            ${showText ? ` <div class='poi-info'>
              ${data.housePrice ? ` <div class='poi-label'>参考房价 <span class='poi-value'>${data.housePrice}</span></div>` : ''}
              ${data.houseHolds ? ` <div class='poi-label'>小区户数 <span class='poi-value'>${data.houseHolds}</span></div>` : ''}
              ${data.buildTime ? ` <div class='poi-label'>建造时间 <span class='poi-value'>${data.buildTime}</span></div>` : ''}
            </div>` : ''}
          </div>`
        );
      });
      mass.on('mouseout', function () {
        labelRef.current.setContent(` `);
      });

      mass.setMap(amapIns);
    },
  });

  // 暴露方法供给外部调用
  React.useImperativeHandle(ref, () => ({
    mapIns: amapIns,
    createPointMarker: (list, icon) => methods.createPointMarker(list, icon)
  }));

  return <Amap
    loaded={methods.loadedMapHandle}
    mapOpts={{
      // 取消注释的原因：部分边缘的marker在hover后有遮挡
      // dragEnable: false,
      // zoomEnable: false,
    }}/>;
});

export default PoiMap;

