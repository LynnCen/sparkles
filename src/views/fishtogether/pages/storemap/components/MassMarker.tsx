// import { storePoint } from '@/common/api/selection';
import { storePoint } from '@/common/api/fishtogether';
import { CITY_LEVEL, CITY_ZOOM } from '@/common/components/AMap/ts-config';
import { isUndef } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import { FC, useEffect, useRef, useState } from 'react';
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
        const res = await storePoint({
          attributeIds: checkedList,
          cityId: city.id,
          // districtId: districtId
          // type: 2
        });
        createMassMarker(res);
      }
    },
    createMassMarker(list) {
      const markerList: any = [];
      list.forEach((item) => {
        const marker = new window.AMap.Marker({
          zooms: [CITY_ZOOM, 20],
          anchor: 'center',
          position: new window.AMap.LngLat(+item.lng, +item.lat),
          icon: new window.AMap.Icon({
            image: item.areaImage,
            size: [46, 46],
            imageSize: [46, 46]
          })
        });
        marker.on('mouseover', function () {
          const labelContent = matchLabel(item);
          labelMarkerRef.current.setPosition(new window.AMap.LngLat(+item.lng, +item.lat));
          labelMarkerRef.current.setContent(labelContent);
          labelMarkerRef.current.setOffset(new window.AMap.Pixel(-100, 25));
        });
        marker.on('mouseout', function () {
          labelMarkerRef.current.setContent(' ');
        });
        if (isShow) {
          const circle = createCircle(item);
          markerList.push(circle);
        }
        markerList.push(marker);
      });
      groupIns && groupIns.addOverlays(markerList);
    },
    matchLabel(data) {
      const attributeNameAr = data.attributeName.split('-');
      let labelContent = `<div class='label'>
      <span class='title'>${data.name || '-'}</span>
      <div class='row'><span class='contentLabel'>授权号：</span><span class='content'>${data.authNo || '-'}</span></div>
      <div class='row'><span class='contentLabel'>状态：</span><span class='content'>${attributeNameAr[0]} | ${attributeNameAr[1]}</span></div>
      <div class='row'><span class='contentLabel'>门店地址：</span><span class='content'>${data.address || '-'}</span></div>
      `;
      // 未开业的点位 展示点位地址，点位状态；如果有保护圈还需要展示：保护范围，保护人，保护有效期
      // 1.未开业-区域保护、
      // 2.未开业-签约前保护：签约前保护点位、
      // 3.未开业-测评已提报、
      // 5.未开业-选址中、
      // 6.未开业-筹建中、
      // 7.未开业-选址已提报、
      // 8.已开业-迁址筹建中 -- 筹建中
      if ([1, 2, 3, 5, 6, 7, 8].includes(data.attributeId)) {
        // 如果有保护圈还需要展示：保护范围，保护人，保护有效期
        if (data.protectRadius) {
          labelContent += `
          <div class='row'><span class='contentLabel'>保护范围：</span><span class='content'>${data.protectScope || '-'}</span></div>
          <div class='row'><span class='contentLabel'>保护申请人：</span><span class='content'>${data.protectAccountName || '-'}</span></div>
          <div class='row'><span class='contentLabel'>保护有效期：</span><span class='content'>${data.protectEndTime || '-'}</span></div>
          `;
        }
      }
      // 已开业的店铺  显示门店名称，授权号，地址，开业日期、日均销售额，保护范围（1KM保护或者2KM保护）
      // 9.已开业—运营中、
      // 10.已开业-迁址中
      if ([9, 10].includes(data.attributeId)) {
        labelContent += `
        <div class='row'><span class='contentLabel'>开业时间：</span><span class='content'>${data.openTime || '-'}</span></div>
        ${data.showDailySaleAmount ? `<div class='row'><span class='contentLabel'>日销售额：</span><span class='content'>${isUndef(data.dailySaleAmount) ? '-' : data.dailySaleAmount}</span></div>` : `<div></div>`}
        <div class='row'><span class='contentLabel'>保护范围：</span><span class='content'>${data.protectScope || '-'}</span></div>
        `;
      }
      // 已闭店的店铺：展示原门店名称、授权号，地址，闭店前日均销售额，必点日期
      // 11.闭店-迁址闭店、
      // 12.闭店-停止加盟
      // 13.暂停营业-暂停营业
      // 14.暂停营业-闭店
      if ([11, 12].includes(data.attributeId)) {
        labelContent += `
        <div class='row'><span class='contentLabel'>开业时间：</span><span class='content'>${data.openTime || '-'}</span></div>
        ${data.showDailySaleAmount ? `<div class='row'><span class='contentLabel'>日销售额：</span><span class='content'>${isUndef(data.dailySaleAmount) ? '-' : data.dailySaleAmount}</span></div>` : `<div></div>`}
        <div class='row'><span class='contentLabel'>闭店日期：</span><span class='content'>${data.closeTime || '-'}</span></div>
        <div class='row'><span class='contentLabel'>闭店原因：</span><span class='content'>${data.closeCause || '-'}</span></div>
        `;
      }
      // 4.未开业-已中止 显示点位地址，点位状态
      if (data.attributeId === 4) {
        //
      }
      labelContent += `</div>`;
      return labelContent;
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
