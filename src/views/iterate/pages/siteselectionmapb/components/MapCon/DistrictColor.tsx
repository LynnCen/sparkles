/**
 * @Description 绘制行政区色块围栏
 */
import { CITY_LEVEL } from '@/common/components/AMap/ts-config';
import { districtColor, drawDistrictPath } from '@/common/utils/map';
import { FC, useEffect, useRef } from 'react';
const DistrictColor:FC<any> = ({
  mapIns,
  mapHelpfulInfo
}) => {
  const { level, city } = mapHelpfulInfo;

  const districtLayerRef = useRef<any>(null);// 行政区围栏
  const levelRef: any = useRef(level);

  const drawLayer = async() => { // 绘制行政区
    districtLayerRef.current?.setMap(null);
    if (city?.name && levelRef.current === CITY_LEVEL) {
      const districtLayer = await drawDistrictPath(mapIns, city?.name, districtColor, {
        customOpenCQCheck: city?.name === '重庆市'
      });
      //  过快的滑动会出现页面有多个行政区色块的场景
      districtLayerRef.current?.setMap(null);
      districtLayerRef.current = districtLayer;
      // 异步问题的处理
      if (levelRef.current !== CITY_LEVEL) {
        districtLayerRef.current?.setMap(null);
      }
    }
  };
  // 绘制城市下面的行政区
  useEffect(() => {
    if (!mapIns) return;
    levelRef.current = level;
    drawLayer();
  }, [city?.id, level]);

  return <div>

  </div>;
};
export default DistrictColor;
