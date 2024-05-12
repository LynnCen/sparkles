/**
 * @Description 绘制行政区围栏
 */
import { DISTRICT_ZOOM } from '@/common/components/AMap/ts-config';
import { getDistrictBounds } from '@/common/utils/map';
import { FC, useEffect, useRef, useState } from 'react';
const DistrictBounds:FC<any> = ({
  mapIns,
  mapHelpfulInfo,
  curSelectDistrict
}) => {
  const districtPolygonRef = useRef<any>([]);
  const [count, setCount] = useState<number>(0);// getDistrictBounds返回数据太慢，通过count计算共返回了几条数据
  const { level } = mapHelpfulInfo;


  const getBounds = async(districtInfo) => {
    const bounds: any = await getDistrictBounds(
      {
        subdistrict: 0, // 获取边界不需要返回下级行政区
        extensions: 'all', // 返回行政区边界坐标组等具体信息
        level, // 查询行政级别为 市
      },
      districtInfo.code
    );
    // bounds可能有多项
    bounds.map((bound) => {
      drawDistrict(bound);
    });
  };
  const drawDistrict = (bounds) => {
    const polygon = new window.AMap.Polygon({
      strokeWeight: 3,
      path: bounds,
      fillOpacity: 0,
      // fillColor: '#006aff',
      strokeColor: '#006aff'
    });
    // mapIns.add(polygon);
    districtPolygonRef.current.push(polygon);
    setCount((state) => state + 1);
  };

  useEffect(() => {
    if (!mapIns) return;
    setCount(0);
    districtPolygonRef.current?.map((polygon) => {
      mapIns.remove(polygon);
    });
    districtPolygonRef.current = [];
    curSelectDistrict?.districtInfo?.map((item) => {
      getBounds(item);
    });
  }, [mapIns, curSelectDistrict?.districtInfo?.length]);

  useEffect(() => {
  // 需要通过计算总数等于curSelectDistrict数组的长度后才触发
    if (count >= curSelectDistrict?.districtInfo?.length && count > 0) {
      const curZoom = mapIns?.getFitZoomAndCenterByOverlays(districtPolygonRef.current)?.[0];// 获取根据 overlays 计算出合适的 zoom 级别
      mapIns?.setFitView(districtPolygonRef.current);
      setTimeout(() => {
        if (curZoom >= DISTRICT_ZOOM) {
          districtPolygonRef.current.map((polygon) => {
            mapIns.add(polygon);
          });
        }
      }, 0);
    }
  }, [count, curSelectDistrict?.districtInfo?.length]);

  return <div>

  </div>;
};
export default DistrictBounds;
