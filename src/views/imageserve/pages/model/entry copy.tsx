import { FC } from 'react';
import styles from './entry.module.less';
import Amap from '@/common/components/AMap';
import { urlParams } from '@lhb/func';
import { getModelReportPOI } from '@/common/api/recommend';
// let number = 0;
const queryParams = urlParams(location.search);
const categoryId = queryParams?.categoryId;
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
    const data = await getModelReportPOI({
      categoryId,
      lng,
      lat,
      reportId,
      radius: 250
    });
    const createPointMarker = (val) => {
      // 创建一个 Marker 实例：
      const data:any = [];
      val.pointList.map((item) => {
        data.push({
          ...item,
          lnglat: [+item.lng, +item.lat]
        });
      });
      const mass = new window.AMap.MassMarks(data, {
        style: {
          url: val.icon,
          size: [25, 28]
        }
      });
      mass.setMap(amapIns);
    };
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
    // 添加点位标记
    data.forEach((item) => {
      item.pointNum > 0 && createPointMarker(item);
    });
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


// import { FC, useEffect, useRef, useState } from 'react';
// import styles from './entry.module.less';
// import Amap from '@/common/components/AMap';
// import { getModelReportPOI } from '@/common/api/recommend';
// import { useMethods } from '@lhb/hook';
// import Html2canvas from '@/common/components/html2canvas';
// import { UploadToQiniu } from '@/common/utils/ways';


// const Model: FC<any> = ({
//   categoryId,
//   lng,
//   lat,
//   reportId,
//   setUrl,
//   qiniuToken
// }) => {

//   const mapRef = useRef<any>(null);
//   const [data, setData] = useState<any>();
//   const [mapIns, setMapIns] = useState<any>(null);
//   const methods = useMethods({
//     async loadData() {
//       if (!categoryId) return;
//       const _data = await getModelReportPOI({
//         categoryId,
//         lng,
//         lat,
//         reportId,
//         radius: 250
//       });
//       setData(_data);
//     }
//   });

//   const loadedMapHandle = async (amapIns) => {
//     setMapIns(amapIns);
//     amapIns.on('zoomend', () => {
//       setTimeout(() => {
//         // 绘制生成canvas
//         mapRef.current.drawCanvas().then((canvas:any) => {
//           UploadToQiniu(canvas.toDataURL('image/png'), qiniuToken).then((res:any) => {
//             // 获取到结果，在传出去
//             setUrl((data) => [...data, res.url]);
//           });
//         }); ;
//       }, 1000);
//     });

//     const mapList: any[] = [];
//     const customIcon = (url) => {
//       return new window.AMap.Icon({
//         // 图标尺寸
//         size: new window.AMap.Size(25, 29.375),
//         // 图标的取图地址--外层已判断，此处只显示已开业门店
//         image: url,
//         // 图标所用图片大小
//         imageSize: new window.AMap.Size(25, 29.375),
//       });
//     };

//     const createPointMarker = (val) => {
//       // 创建一个 Marker 实例：
//       val.pointList.map((item) => {
//         const marker = new window.AMap.Marker({
//           icon: customIcon(val.icon + '?imageView2/2/w/50/h/50/format/jpg'),
//           position: [+item.lng, +item.lat],
//           offset: new window.AMap.Pixel(-25 / 2, -29.375)
//         });
//         mapList.push(marker);
//       });
//     };

//     // 添加点位标记
//     data.forEach((item) => {
//       item.pointNum > 0 && createPointMarker(item);
//     });
//     const circle = new window.AMap.Circle({
//       center: [lng, lat],
//       radius: 250, // 半径
//       strokeColor: '#006AFF',
//       strokeWeight: 2,
//       strokeOpacity: 1,
//       fillOpacity: 0.2,
//       strokeStyle: 'dashed',
//       strokeDasharray: [10, 10],
//       fillColor: '#006AFF',
//       zIndex: 50,
//     });
//     mapList.push(circle);
//     amapIns.add(mapList);
//     // 缩放地图到合适的视野级别
//     amapIns.setFitView(circle);
//   };


//   useEffect(() => {
//     methods.loadData();
//     return () => {
//       mapIns && mapIns.destroy();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);
//   return (
//     <div className={styles.container}>
//       {
//         data && reportId &&
//           <Html2canvas ref={mapRef}>
//             <Amap
//               mapOpts={{
//                 WebGLParams: { preserveDrawingBuffer: true }
//               }}
//               loaded={loadedMapHandle} />
//           </Html2canvas>
//       }
//     </div>
//   );
// };

// export default Model;


