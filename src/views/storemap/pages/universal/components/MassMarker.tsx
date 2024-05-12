import { CITY_LEVEL, CITY_ZOOM } from '@/common/components/AMap/ts-config';
import { useMethods } from '@lhb/hook';
import { FC, useEffect, useRef, useState } from 'react';

import { storeMapSearchStandard } from '@/common/api/storemap';
import { useStadiometry } from '@/common/hook/Amap/useStadiometry';

const MassMarker: FC<{
  _mapIns?: any;
  checkedList: number[];
  city: any;
  level: number;
  isShow:boolean;
}> = ({
  _mapIns,
  checkedList,
  city,
  level,
  isShow
}) => {
  const labelMarkerRef = useRef<any>(null);
  const [groupIns, setGroupIns] = useState<any>(null);
  const isStadiometry: any = useStadiometry(); // 是否在使用测距功能
  const isStadiometryRef = useRef(isStadiometry);

  useEffect(() => {
    labelMarkerRef.current = new window.AMap.Marker({
      content: ' ',
      map: _mapIns,
      anchor: 'top-left',
      offset: [-34, 6],
      zIndex: 15
    });
    const group = new window.AMap.OverlayGroup();
    _mapIns.add(group);
    setGroupIns(group);
  }, [_mapIns]);
  useEffect(() => {
    switchLevel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_mapIns, checkedList, city?.citycode, level, isShow]);

  useEffect(() => {
    labelMarkerRef.current && labelMarkerRef.current.setContent('<div></div>');
  }, [checkedList]);

  useEffect(() => {
    isStadiometryRef.current = isStadiometry;
  }, [isStadiometry]);
  const {
    switchLevel,
    createMassMarker,
    matchLabel,
    createCircle
  } = useMethods({
    switchLevel: async () => {
      groupIns && groupIns.clearOverlays();
      if (!checkedList.length) return;
      // let provinceId = city.provinceId;
      // let districtId;
      // const index = city.districtList.findIndex(e => e.name.includes(city.district));
      // index !== -1 && (districtId = city.districtList[index].id);
      if (level >= CITY_LEVEL) {
        const res = await storeMapSearchStandard({
          ids: checkedList,
          cityId: city.id,
          // districtId: districtId
          // type: 2
        });
        createMassMarker(res);
      } else {
        labelMarkerRef.current && labelMarkerRef.current.setContent('<div></div>');
      }
    },
    createMassMarker(list) {
      const markerList: any = [];
      list.forEach((item) => {
        const marker = new window.AMap.Marker({
          zooms: [CITY_ZOOM, 20],
          anchor: 'center',
          bubble: true, // 允许冒泡
          position: new window.AMap.LngLat(+item.lng, +item.lat),
          // <div style='width: 32px;height: 32px; position: relative'>
          //     <div style='position: absolute; left: 0; right: 0; height: 24px;background: #fff;'></div
          //     <svg
          //       class="icon fs-32"
          //       aria-hidden="true"
          //       style='color: ${item.color}'>
          //       <use xlink:href="#iconic_mendian"></use>
          //     </svg>
          //   <div>
          content: `
            <div class='universalMapIconCon'>
              <div class='placeholderCon'></div>
              <div class='iconBox'>
                <svg
                class="icon fs-32"
                aria-hidden="true"
                style='color: ${item.color}'>
                  <use xlink:href="#iconic_mendian"></use>
                </svg>
              </div>
            <div>
          `
        });
        // marker.on('mouseover', function () {
        // 由原来的hover改为点击事件触发
        marker.on('click', () => {
          if (isStadiometryRef.current) return;
          const labelContent = matchLabel(item);
          labelMarkerRef.current.setPosition(new window.AMap.LngLat(+item.lng, +item.lat));
          labelMarkerRef.current.setContent(labelContent);
          labelMarkerRef.current.setOffset(new window.AMap.Pixel(-100, 25));
          // setContent是字符串无法直接绑定事件
          const targetCloseEle = document.querySelector('.ant-layout-content .amap-maps .amap-layers .amap-markers #storemapMarkerCloseIcon');
          if (!targetCloseEle) return;
          targetCloseEle.addEventListener('click', () => {
            // 这里得加一个空的div，不加的话地图上会有默认的一个icon出现
            labelMarkerRef.current.setContent('<div></div>');
          });
        });
        // marker.on('mouseout', function () {
        //   labelMarkerRef.current.setContent(' ');
        // });
        if (isShow) {
          const circle = createCircle(item);
          markerList.push(circle);
        }
        markerList.push(marker);
      });
      groupIns && groupIns.addOverlays(markerList);
    },
    matchLabel(data) {
      // let labelContent = `<div class='label'>
      // <span class='title'>${data.name || '-'}</span>
      // <div class='row'><span class='contentLabel'>当前状态：</span><span class='content'>${data.statusName || '-'}</span></div>
      // <div class='row'><span class='contentLabel'>地址：</span><span class='content'>${data.address}</span></div>
      // `;

      // labelContent += `</div>`;
      // return labelContent;
      const {
        name,
        color,
        address,
        statusName,
        openDate,
        closeDate,
        closeReason,
        status,
        type // 1 机会点 2门店
      } = data;
      // 只有“营业中、已闭店”的门店显示此字段
      const showOpenDate = type === 2 && (status === 500 || status === 700);
      // 已闭店状态时才显示
      const showClose = type === 2 && status === 700;

      return `<div class='markerItemCon'>
        <div class='titleCon' style='background: ${color || '#333'}'>
          <div class='color-white fs-14 font-weight-500'>
            ${name}
          </div>
          <div id='storemapMarkerCloseIcon' class='pointer'>
            <svg
              class="icon fs-16 color-white"
              aria-hidden="true">
              <use xlink:href="#iconic_fail"></use>
            </svg>
          </div>
        </div>
        <div class="contentCon fs-12">
          <div class='abstractCon'>
            <div class='mr-16'>
              <div class='c-222 font-weight-500'>当前状态</div>
              <div class='c-ff8 mt-4'>${statusName}</div>
            </div>
            ${showOpenDate ? `<div class='mr-16'>
              <div class='c-222 font-weight-500'>开业时间</div>
              <div class='c-999 mt-4'>${openDate || '-'}</div>
            </div>` : ''}
            ${showClose ? `<div>
              <div class='c-222 font-weight-500'>闭店时间</div>
              <div class='c-999 mt-4'>${closeDate || '-'}</div>
            </div>` : ''}
          </div>
          ${showClose ? `<div class='mt-10'>
            <div class='c-222 font-weight-500'>闭店原因</div>
            <div class='c-999 mt-4' style="word-break: break-all">${closeReason || '-'}</div>
          </div>` : ''}
          <div class='mt-10'>
            <div class='c-222 font-weight-500'>门店地址</div>
            <div class='c-999 mt-4'>${address}</div>
          </div>
        </div>
      </div>`;
    },
    createCircle(data) {
      const circle = new window.AMap.Circle({
        center: [+data.lng, +data.lat],
        radius: data.protectRadius, // 半径
        strokeColor: `#FF1D1D`,
        strokeWeight: 1,
        strokeOpacity: 1,
        fillOpacity: 0.1,
        strokeStyle: 'dashed',
        strokeDasharray: [8, 5],
        fillColor: `#FF1D1D`,
        zIndex: 50,
        bubble: true,
      });
      circle.on('mouseover', function () {
        circle.setOptions({
          fillOpacity: 0.2
        });
      });
      circle.on('mouseout', function () {
        circle.setOptions({
          fillOpacity: 0.1
        });
      });
      return circle;
    },
  });
  return <></>;
};

export default MassMarker;
