import { FC, useEffect, useRef, useMemo } from 'react';
import { isArray } from '@lhb/func';
import { CITY_LEVEL } from '@/common/components/AMap/ts-config';
import { storePoint } from '@/common/api/fishtogether';

const Points: FC<any> = ({
  _mapIns,
  level,
  city,
  searchParams,
  // dataRef,
  // battleIds,
  // start,
  // end
  // treeCheckedKeys
}) => {
  const pointMarkersGroup: any = useRef(null);
  const textMarker: any = useRef({
    marker: null,
    isShow: false,
  });

  // 是否展示点位
  const showShopPoi = useMemo(() => {
    // 全国范围、省范围时不展示
    if (level < CITY_LEVEL) return;
    return true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, level]);

  useEffect(() => {
    if (showShopPoi) {
      getShopsPoi();
      return;
    }
    // 不展示markers
    pointMarkersGroup.current && pointMarkersGroup.current.clearOverlays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showShopPoi, searchParams]);

  useEffect(() => {
    if (level < CITY_LEVEL) {
      // 不展示markers
      pointMarkersGroup.current && pointMarkersGroup.current.clearOverlays();
      return;
    }
    if (showShopPoi) {
      getShopsPoi();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city?.id, level]);

  const getShopsPoi = async () => {
    pointMarkersGroup.current && pointMarkersGroup.current.clearOverlays();
    // console.log(`city`, city);
    const { id: cityId } = city;
    const params: any = {
      cityId,
      attributeIds: [2, 9, 10]
    };
    // try {
    const data = await storePoint(params);
    if (isArray(data)) {
      drawPointMarks(data);
    }
  };


  // 地图上绘制品牌点
  const drawPointMarks = (data: Array<any>) => {
    const markers: Array<any> = [];
    data.forEach((item: any) => {
      const {
        lng,
        lat,
        image
      } = item;
      if (!lng || !lat) return; // 没有经纬度时跳过
      const lnglat = [+lng, +lat];
      // 点位覆盖物
      const marker = new window.AMap.Marker({
        // zooms: [CITY_ZOOM, 20],
        // <div class='imgCon'>
        //     ${icon ? `<img src=${icon} width='100%' height='100%'/>` : ''}
        //   </div>
        // icon: 'https://cert.linhuiba.com/FvXTDbdszYbn04tMbbs-99JK7wvR',
        content: `<div class='pointCon' style="background-image:url(${image})"></div>`,
        anchor: 'top-center',
        position: lnglat,
        offset: [-1.5, -36],
      });
      markers.push(marker);

      // 鼠标移入时展示具体信息
      marker.on('mouseover', () => {
        // 创建div后，利用事件委托，监听鼠标的移入移出
        const div = document.createElement('div');
        div.className = 'cardMarkerWrapper';
        div.innerHTML = `<div class='contentWrapper'>
            <div class='fs-14 bold'>${item.name}</div>
          </div>`;
        // <div class='itemRow'>
        //     <div class='label'>门店名称：</div>
        //     <div class='valCon'>${item.shopName}</div>
        //   </div>
        //   <div class='itemRow'>
        //     <div class='label'>门店地址：</div>
        //     <div class='valCon'>${item.shopAddress}</div>
        //   </div>
        div.addEventListener('mouseenter', () => {
          textMarker.current.isShow = true;
          textMarker.current.marker && textMarker.current.marker.show();
        });

        div.addEventListener('mouseleave', () => {
          textMarker.current.isShow = false;
          textMarker.current.marker && textMarker.current.marker.hide();
        });
        textMarker.current.marker = new window.AMap.Marker({
          position: lnglat,
          content: div,
          anchor: 'top-left',
          offset: [-35, 0],
        });
        _mapIns.add(textMarker.current.marker);
      });
      marker.on('mouseout', () => {
        if (textMarker.current.isShow) return;
        textMarker.current.isShow = false;
        textMarker.current.marker && textMarker.current.marker.hide();
      });
    });

    // 覆盖物群组
    pointMarkersGroup.current = new window.AMap.OverlayGroup(markers);
    _mapIns.add(pointMarkersGroup.current);
  };

  return <></>;
};

export default Points;
