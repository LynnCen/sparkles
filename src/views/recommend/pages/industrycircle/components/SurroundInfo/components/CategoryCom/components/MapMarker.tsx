/**
 * @Description
 */

import { isArray, isNotEmptyAny } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import { FC, useEffect, useRef } from 'react';

// 地图绘制
const MapMarker: FC<any> = ({
  _mapIns, // 地图实例
  data, // poi点位数据
  icon,
}) => {

  const labelRef:any = useRef();
  const massRef:any = useRef();

  useEffect(() => {
    if (!_mapIns || !isNotEmptyAny(data)) return;

    methods.createPointMarker(data);
    const option = {
      map: _mapIns,
      content: ' ',
      offset: [17, 30]
    };
    const textIns = new window.AMap.Marker(option);
    labelRef.current = textIns;
    return () => {
      massRef.current && massRef.current.clear();
    };
  }, [_mapIns, data]);


  const methods = useMethods({
    /**
     * @description 绘制poi点位
     * @param icon
     */
    createPointMarker: (list): any => {
      // 创建一个 Marker 实例：

      const massData = isArray(list) && list.length ? list.map((item) => ({
        ...item,
        lnglat: [+item.lng, +item.lat],
      })) : [];

      const mass = new window.AMap.MassMarks(massData, {
        style: {
          url: icon,
          size: [24, 29]
        }
      });

      mass.on('mouseover', function (e) {
        const { data } = e;

        const showText = data.code === '120300';
        // if (!showText) {
        //   return;
        // }
        labelRef.current.setPosition(data.lnglat);
        labelRef.current.setContent(
          `<div class='poi'>
            <span class='poi-name'>${data.name}</span><br/>

            ${showText ? ` <div class='poi-info'>
            ${data.housePrice ? ` <span class='poi-label'>参考房价 <span class='poi-value'>${data.housePrice}</span></span>` : ''}
            ${data.houseHolds ? ` <span class='poi-label'>小区户数 <span class='poi-value'>${data.houseHolds}</span></span>` : ''}
            ${data.buildTime ? ` <span class='poi-label'>建造时间 <span class='poi-value'>${data.buildTime}</span></span>` : ''}
            </div>` : ''}`
        );
      });

      mass.on('mouseout', function () {
        labelRef.current.setContent(` `);
      });

      massRef.current = mass;
      mass.setMap(_mapIns);
    },
  });

  return (
    <></>
  );
};

export default MapMarker;
