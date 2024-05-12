/**
 * @Description 周边搜索-地图
 */
import { FC, useEffect } from 'react';
import AMap from '@/common/components/AMap';
import { useMethods } from '@lhb/hook';
import styles from '../entry.module.less';
import { getCurPosition } from '@/common/utils/map';
interface ResultMapProps {
  amapIns: any;
  setAmapIns: Function;
  style?: any;
  setCurPosition?: any;
}

const ResultMap: FC<ResultMapProps> = ({
  amapIns,
  setAmapIns,
  style,
  setCurPosition,
}) => {

  useEffect(() => {
    return () => {
      amapIns && amapIns.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const methods = useMethods({
    mapLoadedHandle: (mapIns: any) => {
      setAmapIns(mapIns);
      // 浏览器定位
      getCurPosition(mapIns, {
        showMarker: false,
        // https://lbs.amap.com/api/javascript-api-v2/documentation#geolocation
      }).then((res: any) => {
        setCurPosition?.(res);
      });
    },
  });

  return (
    <div className={styles.mapCon} style={style || {} }>
      <AMap
        mapOpts={{
          // zoom: 16,
          zooms: [4, 20],
          // center: [103.826777, 36.060634], // 默认地图的中心位置，使中国地图处于地图正中央
        }}
        loaded={methods.mapLoadedHandle}
        plugins={[
          // 'AMap.DistrictSearch',
          'AMap.Geolocation',
          'AMap.Geocoder',
          'AMap.PlaceSearch',
          'AMap.MouseTool', // 鼠标工具-新增商圈
          'AMap.PolygonEditor', // 多边形编辑
        ]}
      >
      </AMap>
    </div>
  );
};

export default ResultMap;
