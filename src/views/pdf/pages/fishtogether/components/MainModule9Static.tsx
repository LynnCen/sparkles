import { FC } from 'react';
import styles from '../entry.module.less';
import cs from 'classnames';
import V2Title from '@/common/components/Feedback/V2Title';
import AMap from '@/common/components/AMap';
import TopTitle from './Base/TopTitle';
import BottomLogo from './Base/BottomLogo';
import { useMethods } from '@lhb/hook';
import { replaceEmpty } from '@lhb/func';
const MainModule9Static: FC<any> = ({
  number,
  res = {}
}) => {
  const methods = useMethods({
    mapLoadedHandle(map) {
      const customIcon = new window.AMap.Icon({
        // 图标尺寸
        size: new window.AMap.Size(40, 47),
        // 图标的取图地址--外层已判断，此处只显示已开业门店
        image: 'https://staticres.linhuiba.com/project-custom/locationpc/map/icon_yuni_operating.png',
        // 图标所用图片大小
        imageSize: new window.AMap.Size(40, 47),
      });
      const mapList: any[] = [];
      res.module9StaticList?.forEach(item => {
        // 构造点标记
        const marker = new window.AMap.Marker({
          icon: customIcon,
          position: [item.lng, item.lat],
          offset: new window.AMap.Pixel(-40 / 2, -47)
        });
        mapList.push(marker);
      });
      // 构造矢量圆形
      const circle = new window.AMap.Circle({
        center: new window.AMap.LngLat(res.module9StaticCenter.longitude, res.module9StaticCenter.latitude), // 圆心位置
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
    <div className={cs(styles.mainModule, styles.mainModule9Static)}>
      <TopTitle number={number}>5公里商圈鱼店状态</TopTitle>
      <div className={styles.mainModuleWrapper}>
        <V2Title divider type='H3' text='5公里商圈' style={{ marginBottom: '10px' }}/>
        <div className={styles.module9StaticFlex}>
          <div className={styles.conLeft}>
            {
              res.module9StaticList?.length && res.module9StaticList?.length > 1 ? res.module9StaticList.slice(1, 6).map((item, index) => {
                return <div key={index} className={styles.conLeftFlex}>
                  <div className={styles.conLeftNum}>{index + 1}</div>
                  <div className={styles.conLeftMain}>
                    <div className={styles.conLeftName}>{replaceEmpty(item.name)}</div>
                    <div className={styles.conLeftTotal}>日均销售额:{replaceEmpty(item.dailySaleAmount)}元</div>
                  </div>
                  <div className={styles.conLeftSize}>{replaceEmpty(item.distance)}米</div>
                </div>;
              }) : <>该项目周边5公里无鱼你在一起门店</>
            }
          </div>
          <div className={styles.conRight}>
            {
              res.module9StaticCenter?.longitude && res.module9StaticCenter?.latitude && <AMap loaded={methods.mapLoadedHandle} mapOpts={{
                WebGLParams: { preserveDrawingBuffer: true }
              }}/>
            }
          </div>
        </div>
      </div>
      <BottomLogo/>
    </div>
  );
};

export default MainModule9Static;
