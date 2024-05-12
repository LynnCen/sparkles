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
  borders
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
      // 添加点位标记
      const { list, icon } = drawList;
      methods.createPointMarker(list, icon);
      // 添加区域
      if (lng && lat && poiSearchType === 1) {
        const circle = new window.AMap.Circle({
          center: [lng, lat],
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
        amapIns.setFitView([circle]);
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
    createPointMarker: (list :any[] = [], icon): any => {

      // 创建一个 Marker 实例：
      const data: any = [];
      list.map((item) => {
        data.push({
          ...item,
          lnglat: [+item.lng, +item.lat],
        });
      });
      const mass = new window.AMap.MassMarks(data, {
        style: {
          url: icon,
          size: [25, 28],
          anchor: [12, 14]
        }
      });
      mass.on('mouseover', function (e) {
        const { data } = e;
        labelRef.current.setPosition([data.lng, data.lat]);
        labelRef.current.setContent(
          `<div class='icon-label'><div class='trangle'></div><span class='text-name'>${data.name}</span><br/><span class='text-address'>${data.address}</span></div>`
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

  return <Amap loaded={methods.loadedMapHandle} />;
});

export default PoiMap;

