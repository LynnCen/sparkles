import { FC } from 'react';
import styles from './entry.module.less';
import Amap from '@/common/components/AMap';
import { urlParams } from '@lhb/func';
// import { getModelReportPOI } from '@/common/api/recommend';
import { modelCircleCount } from '@/common/api/recommend';
import { modelCirclePoiList } from '@/common/api/recommend';

// let number = 0;
const queryParams = urlParams(location.search);
const categoryId = Number(queryParams?.categoryId);
const lng = queryParams?.lng;
const lat = queryParams?.lat;
const reportId = queryParams?.reportId;
const Model: FC<any> = () => {
  const loadedMapHandle = async (amapIns) => {
    amapIns.on('zoomend', function() { // 地图默认会缩放一次，而后面的setFitView也会缩放一次
      setTimeout(() => {
        // html转img提供的工具，需与服务端约定字段
        window.renderReady = 1;
      }, 1000);
    });
    // 获取二级 tabs
    const data = await modelCircleCount({
      categoryId,
      lng,
      lat,
      reportId,
      radius: 250
    });

    // 绘制 massmarkers
    const createPointMarker = (val, icon) => {
      // 创建一个 Marker 实例：
      const list:any = [];
      val.map((item) => {
        list.push({
          ...item,
          lnglat: [+item.lng, +item.lat]
        });
      });
      const mass = new window.AMap.MassMarks(list, {
        style: {
          url: icon,
          size: [25, 28]
        }
      });
      mass.setMap(amapIns);
    };

    // 绘制圆圈
    const circle = new window.AMap.Circle({
      center: [lng, lat],
      radius: 250, // 半径
      strokeColor: '#006AFF',
      strokeWeight: 2,
      strokeOpacity: 1,
      fillOpacity: 0.2,
      strokeStyle: 'dashed',
      strokeDasharray: [10, 10],
      fillColor: '#006AFF',
      zIndex: 50,
    });
    amapIns.add(circle);
    // 缩放地图到合适的视野级别
    amapIns.setFitView(circle, true);
    // 添加点位标记（全部的点位信息）

    for (const item of data) {
      if (item.count > 0) {
        const res = await modelCirclePoiList({
          attributeId: item.id,
          lng,
          lat,
          reportId,
          radius: 250,
          page: 1,
          size: 10000,
        });
        createPointMarker(res.objectList, item.icon);
      }
    }
  };
  return (
    <div className={styles.container}>
      <Amap
        mapOpts={{
          WebGLParams: { preserveDrawingBuffer: true }
        }}
        loaded={loadedMapHandle} />
    </div>
  );
};

export default Model;
