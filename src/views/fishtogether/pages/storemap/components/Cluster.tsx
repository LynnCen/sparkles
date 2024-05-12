// import { storeCount } from '@/common/api/selection';
import { areaCount } from '@/common/api/fishtogether';
import { COUNTRY_LEVEL, PROVINCE_LEVEL } from '@/common/components/AMap/ts-config';
import { chartColorList } from '@/common/utils/map';
import { useMethods } from '@lhb/hook';
import { FC, useEffect, useRef, useState } from 'react';
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
  const {
    switchLevel,
    drawCluster
  } = useMethods({
    switchLevel: async () => {
      groupIns && groupIns.clearOverlays();
      if (!checkedList.length) return;
      switch (level) {
        case COUNTRY_LEVEL:
          const provinceRes = await areaCount({
            attributeIds: checkedList,
            // type: 2
          });
          drawCluster(provinceRes, 'provinceName');
          break;
        case PROVINCE_LEVEL:
          const cityRes = await areaCount({
            provinceId: city.provinceId,
            attributeIds: checkedList,
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
          styleList = cluster.data.map((item, index) => {
            // 计算出每个选中的条目在所有选中项中的比重
            item.scale = item.count / total;
            rDeg = rDeg + 360 * item.scale;
            const res = `${chartColorList[index % chartColorList.length]} ${lDeg}deg ${rDeg}deg`;
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
                    <img src=${item.areaImage && item.areaImage !== '' ? item.areaImage : 'https://staticres.linhuiba.com/project-custom/locationpc/img_placeholder.png'} />
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
        markerList.push(marker);
      });
      groupIns.addOverlays(markerList);
    }

  });

  return <></>;
};

export default Cluster;
