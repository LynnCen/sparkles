import { areaCountStandard } from '@/common/api/storemap';
import { CITY_LEVEL, CITY_ZOOM, COUNTRY_LEVEL, DISTRICT_ZOOM, PROVINCE_LEVEL, PROVINCE_ZOOM } from '@/common/components/AMap/ts-config';
// import { chartColorList } from '@/common/utils/map';
import { useMethods } from '@lhb/hook';
import { FC, useEffect, useRef, useState } from 'react';
import { useStadiometry } from '@/common/hook/Amap/useStadiometry';

const Cluster: FC<{
  _mapIns?: any;
  checkedList: number[];
  city: any;
  level: number;
}> = ({
  _mapIns,
  checkedList,
  city,
  level
}) => {
  const labelMarkerRef = useRef<any>(null);
  const [groupIns, setGroupIns] = useState<any>(null);
  const isStadiometry: any = useStadiometry(); // 是否在使用测距功能
  const isStadiometryRef = useRef(isStadiometry);

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
  }, [_mapIns, checkedList, city?.citycode, level]);
  useEffect(() => {
    isStadiometryRef.current = isStadiometry;
  }, [isStadiometry]);
  const {
    switchLevel,
    drawCluster,
    handleMarkerClick
  } = useMethods({
    switchLevel: async () => {
      groupIns && groupIns.clearOverlays();
      if (!checkedList.length) return;
      switch (level) {
        case COUNTRY_LEVEL:
          const provinceRes = await areaCountStandard({
            ids: checkedList,
            // type: 2
          });
          drawCluster(provinceRes, 'provinceName');
          break;
        case PROVINCE_LEVEL:
          const cityRes = await areaCountStandard({
            provinceId: city.provinceId,
            ids: checkedList,
            // type: 2
          });
          drawCluster(cityRes, 'cityName');
          break;
      }
    },
    drawCluster: (clusterData, name) => {
      groupIns.clearOverlays();
      const markerList: any = [];

      clusterData.forEach((cluster) => {
        let total = 0;
        let lDeg = 0;
        let rDeg = 0;
        // 需要先遍历求和 count
        cluster.data.map((item) => {
          total += item.count;
        });

        let styleList: any = [];
        // 先计算每个圈的占比样式
        if (total !== 0) {
          styleList = cluster.data.map((item) => {
            // 计算出每个选中的条目在所有选中项中的比重
            item.scale = item.count / total;
            rDeg = rDeg + 360 * item.scale;
            // const res = `${chartColorList[index % chartColorList.length]} ${lDeg}deg ${rDeg}deg`;
            const res = `${item.color} ${lDeg}deg ${rDeg}deg`;
            lDeg = rDeg;
            return res;
          });
        }
        // 数量为0则不显示
        if (total === 0) return;
        const content = `<div style='background: conic-gradient(${styleList.join(',')});' class='circlebox'>
      <div class='whiteBg'><p class='text-name '>${cluster[name]}</p><p class='text-total'>${total}</p></div>
      </div>`;
        // 生成聚合圈
        const marker = new window.AMap.Marker({
          zooms: [2, 20],
          content: content,
          anchor: 'center',
          bubble: true,
          zIndex: total < 1 ? 8 : 9,
          position: [cluster.lng, cluster.lat],
        });
        marker.on('mouseover', () => {
          if (labelMarkerRef.current) {
            let labelContent = `<div class='label'>`;
            cluster.data?.forEach(item => {
              labelContent += `
              <div class='item'>
                <div>
                  <svg
                    class="icon"
                    aria-hidden="true"
                    style='color: ${item.color}'>
                    <use xlink:href="#iconic_mendian"></use>
                  </svg>
                </div>
                <div>
                  <span>${item.name}：${item.count} </span>
                </div>
            </div>`;
            });
            labelContent += '</>';
            labelMarkerRef.current.setMap(_mapIns);
            labelMarkerRef.current.setPosition([cluster.lng, cluster.lat]);
            labelMarkerRef.current.setContent(labelContent);
            labelMarkerRef.current.setOffset(new window.AMap.Pixel(-100, 38));
          }
          // onMouseover && onMouseover(cluster);
        });
        marker.on('mouseout', () => {
          if (labelMarkerRef.current) {
            labelMarkerRef.current.setContent(' ');
            labelMarkerRef.current.setOffset(new window.AMap.Pixel(-34, 6));
          }
          // onMouseout && onMouseout();
        });
        marker.on('click', (e: any) => {
          // 在使用工具箱的测距功能时，不执行点击后的逻辑
          if (isStadiometryRef.current) return;
          handleMarkerClick([cluster.lng, cluster.lat]);
          e.stopPropagation(); // 防止点击marker冒泡到地图绑定的点击事件上
        });
        markerList.push(marker);
      });
      groupIns.addOverlays(markerList);
    },
    handleMarkerClick: (lnglat) => {
      let zoom = 4;
      switch (level) {
        case COUNTRY_LEVEL:
          zoom = PROVINCE_ZOOM;
          break;
        case PROVINCE_LEVEL:
          zoom = CITY_ZOOM;
          // _mapIns.setZoom(CITY_ZOOM);
          break;
        case CITY_LEVEL:
          zoom = DISTRICT_ZOOM;
          break;
      };
      _mapIns.setZoomAndCenter(zoom, lnglat, false, 300);
    }

  });

  return <></>;
};

export default Cluster;
