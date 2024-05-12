/**
 * @Description 竞品品牌在地图的显示
 * 注意这里的样式在 src/views/iterate/pages/siteselectionmap/components/MapCon/index.module.less
 */

import { FC, useEffect, useRef } from 'react';
import { isArray } from '@lhb/func';
import { v4 } from 'uuid';
import { fetchMapDistrict } from '@/common/api/selection';
import {
  DISTRICT_ZOOM,
} from '@/common/components/AMap/ts-config';
// import cs from 'classnames';
// import styles from './index.module.less';
import ReactDOM from 'react-dom';

const TargetBrand = ({
  data
}) => {

  return <div className='competitorOverview'>
    <div className='fs-14 bold'>{data?.name}</div>
    <div className='mt-8'>
      <span className='c-999'>开店类型：</span>
      <span>{data?.openTypeName || '-'}</span>
    </div>
    <div className='mt-4'>
      <span className='c-999'>营业状态：</span>
      <span>{data?.statusName || '-'}</span>
    </div>
    <div className='mt-4'>
      <span className='c-999'>门店类型：</span>
      <span>{data?.typeName || '-'}</span>
    </div>
    <div className='mt-4'>
      <span className='c-999'>门店功能：</span>
      <span>{data?.function || '-'}</span>
    </div>
    <div className='mt-4'>
      <span className='c-999'>地址：</span>
      <span>{data?.address || '-'}</span>
    </div>
  </div>;
};

const uid:any = v4();
const targetNode = `<div id="${uid}"></div>`;

const CompetitorInMap: FC<any> = ({
  mapIns,
  checkedIds, // 选中项
  cityInfo, // 城市信息
}) => {
  const contentMarker: any = useRef(); // hover时的覆盖物
  const massMarkerRef: any = useRef(); // 海量点
  useEffect(() => {
    if (!mapIns) return;
    if ((isArray(checkedIds) && checkedIds.length) && cityInfo?.id) {
      loadData();
      return;
    }
    clearMarkers();
  }, [mapIns, checkedIds, cityInfo?.id]);

  const loadData = async () => {
    const params = {
      brandIds: checkedIds,
      cityId: cityInfo?.id
    };
    const data = await fetchMapDistrict(params);
    const points = data?.filter(item => +item.lng && +item.lat);
    if (isArray(points) && points.length) {
      const massPointsStyle: any[] = []; // 相同品牌id公用一个logo
      const massPoints: any[] = []; // 海量点
      points.forEach((item: any) => {
        const { brandId, logo, lng, lat } = item;
        const itemData: any = {
          ...item,
          lnglat: [+lng, +lat]
        };
        const targetIndex = massPointsStyle.findIndex((styleItem: any) => styleItem.brandId === brandId);
        // 已经有了
        if (targetIndex !== -1) {
          itemData.style = targetIndex;
          massPoints.push(itemData);
          return; // 跳出此次循环
        };
        // 没有
        massPointsStyle.push({
          url: logo,
          size: new window.AMap.Size(32, 32),
          brandId,
          // anchor:
        });
        itemData.style = massPointsStyle.length > 0 ? massPointsStyle.length - 1 : 0;
        massPoints.push(itemData);
      });
      // 根据相同的品牌id过滤出来同一个logo，归为一类
      const mass = new window.AMap.MassMarks(massPoints, {
        cursor: 'pointer',
        zooms: [DISTRICT_ZOOM, 20],
        style: massPointsStyle
      });

      mass.setMap(mapIns); // 将海量点插入地图
      // 清除上一次
      massMarkerRef.current && massMarkerRef.current.setMap(null);
      massMarkerRef.current = mass; // 保存本次

      // mapIns.add(mass);
      mass.on('mouseover', function (e) {
        const { data } = e;
        const { lng, lat } = data || {};
        if (!(lng && lat)) return;
        const marker = new window.AMap.Marker({
          position: [+lng, +lat],
          content: targetNode,
          anchor: 'bottom-center',
          zooms: [DISTRICT_ZOOM, 20],
        });
        contentMarker.current = marker;
        mapIns.add(contentMarker.current);
        ReactDOM.render(<TargetBrand
          data={data}
        />,
        document.getElementById(uid));
      });
      mass.on('mouseout', () => {
        contentMarker.current && mapIns.remove(contentMarker.current);
      });
    }
  };

  const clearMarkers = () => {
    massMarkerRef.current && (massMarkerRef.current.setMap(null));
  };
  return (
    <></>
  );
};

export default CompetitorInMap;
