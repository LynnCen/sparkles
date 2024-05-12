/**
 * @Description 机会点详情-周边200米地图
 */

import { FC, useEffect, useState } from 'react';
import { useMethods } from '@lhb/hook';
import { isArray } from '@lhb/func';
import { storeRimPointOfYN } from '@/common/api/fishtogether';
import Amap from '@/common/components/AMap';
import styles from './index.module.less';
import cs from 'classnames';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

const StoreMap: FC<any> = ({
  detail,
  className,
}) => {
  const [amapIns, setAmapIns] = useState<any>(null); // 地图实例

  // 组件卸载时清空覆盖物
  useEffect(() => {
    return () => {
      amapIns && amapIns.clearMap();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    amapIns && amapIns.clearMap(); // 每次清空地图，否则覆盖物不断叠加
    amapIns && init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amapIns, detail]);


  const {
    loadedMapHandle,
    init,
    loadData,
    addCenterMarker,
    addMarkers,
    drawCircle
  } = useMethods({
    loadedMapHandle: (map) => {
      setAmapIns(map);
    },
    init: async () => {
      // 接口返回的经纬度是字符串
      const { lng, lat } = detail;
      const lngVal = +lng;
      const latVal = +lat;
      if (!(lngVal && latVal)) {
        V2Message.warning(`经纬度数据缺失`);
        return;
      }
      amapIns.setCenter([lngVal, latVal]);
      // // 显示位置
      addCenterMarker({ lng: lngVal, lat: latVal });
      drawCircle({ lng: lngVal, lat: latVal });
      loadData();
    },
    loadData: () => {
      const { lng, lat } = detail;
      const params = {
        lng: +lng,
        lat: +lat,
        radius: 200
      };
      storeRimPointOfYN(params).then((data: any) => {
        const {
          chancePointList,
          industryShopList,
          ynMapShopList
        } = data;
        if (isArray(chancePointList)) {
          addMarkers(chancePointList, 1);
          chancePointList.forEach((item: any) => {
            drawCircle({
              lng: item.lng,
              lat: item.lat,
              strokeColor: '#F23030',
              strokeWeight: 1,
              strokeStyle: 'dashed',
              fillColor: 'rgba(242, 48, 48, 0.2)',
              radius: item.protectRadius || 200,
            });
          });
        }
        if (isArray(industryShopList)) {
          addMarkers(industryShopList, 2);
        }
        if (isArray(ynMapShopList)) {
        // process 1:已开业-迁址筹建中 2:已开业—运营中 3:已开业-迁址中 4:闭店-迁址闭店 5:闭店-停止加盟,只展示已开业的点位
          const targetListData = ynMapShopList.filter((item: any) => [1, 2, 3].includes(item.process));
          addMarkers(targetListData, 3);
          targetListData.forEach((item: any) => {
            drawCircle({
              lng: item.lng,
              lat: item.lat,
              strokeColor: '#F23030',
              strokeWeight: 1,
              strokeStyle: 'dashed',
              fillColor: 'rgba(242, 48, 48, 0.2)',
              radius: item.protectRadius || 200,
            });
          });
        }

      });
    },
    addCenterMarker: ({ lng, lat }) => {
      const AMap = window.AMap;
      const w = 24.0; // 之前32
      const h = 28.5; // 之前38
      const customIcon = new AMap.Icon({
      // 图标尺寸
        size: new AMap.Size(w, h),
        // 图标的取图地址
        image: 'https://staticres.linhuiba.com/project-custom/store-assistant-h5/shop_location@2x.png',
        // 图标所用图片大小
        imageSize: new AMap.Size(w, h),
      // 图标取图偏移量
      // imageOffset: new AMap.Pixel(0, 10)
      });
      const marker = new AMap.Marker({
        position: new AMap.LngLat(lng, lat),
        // 将一张图片的地址设置为 icon
        icon: customIcon,
        // 设置了 icon 以后，设置 icon 的偏移量，以 icon 的 [center bottom] 为原点
        offset: new AMap.Pixel(-w / 2, -h)
      });
      amapIns.add(marker);
    },
    // 添加不同类型的markers
    /**
   * data {Array} 点位数据
   * type {Number} 类型 1. 机会点 2. 竞品 3. 已开门店
   */
    addMarkers(data: any[], type: number) {
      if (!isArray(data)) return;
      const markers: any[] = [];
      const AMap = window.AMap;
      // 1和3时是固定的图片
      let targetIcon = 'icon_fish_store_chancepoint'; // 机会点
      if (type === 3) {
        targetIcon = 'icon_fish_store_opened'; // 已开门店
      }

      data.forEach((item: any) => {
        let content: any = null;
        // 2时需要自定义markers
        if (type === 2) {
          content = `<div class="contend-con">
          <div class="contend-brand-logo">
            <img src=${item.logo} width='100%' height='100%'>
          </div>
        <div>`;
        }
        const w = 24.0; // 之前32
        const h = 25.5; // 之前34
        const customIcon = new AMap.Icon({
          // 图标尺寸
          size: new AMap.Size(w, h),
          // 图标的取图地址
          image: `https://staticres.linhuiba.com/project-custom/store-assistant-h5/fish/${targetIcon}.png`,
          // 图标所用图片大小
          imageSize: new AMap.Size(w, h),
          // 图标取图偏移量
          // imageOffset: new AMap.Pixel(0, 10)
        });
        const marker = new AMap.Marker({
          position: new AMap.LngLat(+item.lng, +item.lat),
          // 将一张图片的地址设置为 icon
          icon: customIcon,
          // 设置了 icon 以后，设置 icon 的偏移量，以 icon 的 [center bottom] 为原点
          offset: new AMap.Pixel(-w / 2, -h),
          content
        });
        markers.push(marker);
      });
      const overlayGroups = new AMap.OverlayGroup(markers);
      amapIns.add(overlayGroups);
    },
    drawCircle: ({
      lng,
      lat,
      radius = 200,
      strokeColor = 'transparent',
      strokeWeight = 0,
      strokeStyle = 'solid',
      fillColor = '#006AFF'
    }) => {
      const circleMarker = new window.AMap.Circle({
        center: [lng, lat],
        radius,
        strokeColor: strokeColor, // 'transparent', // 线条颜色
        strokeOpacity: 1, // 轮廓线透明度
        strokeWeight: strokeWeight, // 0 // 线宽
        fillOpacity: 0.18, // 填充透明度
        strokeStyle: strokeStyle, // 'solid',
        // strokeDasharray: [5, 5],
        fillColor: fillColor, // '#006AFF', // 填充颜色
        zIndex: 50,
        // zooms: [13, 20]
      });
      amapIns.add(circleMarker);
      amapIns.setFitView(circleMarker, true);
    }
  });

  return (<div className={cs(styles.map, className)}>
    <Amap loaded={loadedMapHandle}/>
  </div>);
};

export default StoreMap;
