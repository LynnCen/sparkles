/**
 * @Description 周边五公里品牌门店分布图
 * 从src/views/pdf/pages/fishtogether/components/MainModule9Static.tsx迁移的相关逻辑
 */

import { FC, useEffect, useState } from 'react';
import { useMethods } from '@lhb/hook';
import { rimShopData } from '@/common/api/imageserve';
import { isArray, replaceEmpty } from '@lhb/func';
import { targetValSort } from '@/common/utils/ways';
// import cs from 'classnames';
import styles from '../entry.module.less';
import V2Title from '@/common/components/Feedback/V2Title';
import AMap from '@/common/components/AMap';

const RimShop: FC<any> = ({
  lng,
  lat,
  cityId
}) => {
  const [listData, setListData] = useState<any>(); // 门店数据

  useEffect(() => {
    if (!(lng && lat && cityId)) return;
    methods.loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lng, lat, cityId]);

  const methods = useMethods({
    loadData: async () => {
      // 获取周边5公里数据
      const data = await rimShopData({ lng, lat, cityId });
      const { surroundingShops } = data;
      if (isArray(surroundingShops) && surroundingShops.length) {
        // 排序取距离最近的前5条数据
        const sortData = targetValSort(surroundingShops, 'distance', false);
        setListData(sortData.slice(0, 5));
        return;
      }
      setListData([]);
    },
    mapLoadedHandle(map) {
      const customIcon = new window.AMap.Icon({
        // 图标尺寸
        size: new window.AMap.Size(50, 45),
        // 图标的取图地址
        image: 'https://staticres.linhuiba.com/project-custom/locationpc/map/icon_yuni_operating.png',
        // 图标所用图片大小
        imageSize: new window.AMap.Size(50, 45),
      });
      const mapList: any[] = [];
      listData.forEach(item => {
        // 构造点标记
        const marker = new window.AMap.Marker({
          icon: customIcon,
          position: [item.lng, item.lat],
          offset: new window.AMap.Pixel(-50 / 2, -45)
        });
        mapList.push(marker);
      });
      // 构造矢量圆形
      const circle = new window.AMap.Circle({
        center: new window.AMap.LngLat(lng, lat), // 圆心位置
        radius: 5000, // 半径
        strokeColor: 'transparent', // 线条颜色
        strokeOpacity: 1, // 轮廓线透明度
        strokeWeight: 0, // 线宽
        fillOpacity: 0.18, // 填充透明度
        strokeStyle: 'solid',
        fillColor: '#006AFF', // 填充颜色
        zIndex: 50,
      });
      mapList.push(circle);
      // 将以上覆盖物添加到地图上
      // add方法可以传入一个覆盖物数组，将点标记和矢量圆同时添加到地图上
      map.add(mapList);
      map.setFitView(circle, true);
    }
  });

  return (
    <>
      <div className='fn-32 bold'>
        周边五公里品牌门店分布图
      </div>
      <V2Title
        divider
        type='H3'
        text='5公里商圈'
        className='mt-10'/>
      <div className={styles.flexCon}>
        <div className={styles.conLeft}>
          {
            listData?.length > 0 ? listData.map((item, index) => {
              return <div key={index} className={styles.conLeftFlex}>
                <div className={styles.conLeftNum}>{index + 1}</div>
                <div className={styles.conLeftMain}>
                  <div className={styles.conLeftName}>{replaceEmpty(item.name)}</div>
                  <div className={styles.conLeftTotal}>日均销售额:{replaceEmpty(item.dailySaleAmount)}元</div>
                </div>
                <div className='fn-12'>{replaceEmpty(item.distance)}米</div>
              </div>;
            }) : <>该项目周边5公里无已开门店</>
          }
        </div>
        <div className={styles.conRight}>
          {
            listData ? <AMap
              loaded={methods.mapLoadedHandle}
              mapOpts={{
                WebGLParams: { preserveDrawingBuffer: true }
              }}/> : null
          }
        </div>
      </div>
    </>
  );
};

export default RimShop;
