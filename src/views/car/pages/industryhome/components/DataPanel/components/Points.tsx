import { FC, useEffect, useRef, useMemo } from 'react';
import { isArray } from '@lhb/func';
// import { poiMapBrandList } from '@/common/api/selection';
import { carHomeMapPoi } from '@/common/api/carhome';
import { CITY_LEVEL } from '@/common/components/AMap/ts-config';

const Points: FC<any> = ({
  _mapIns,
  level,
  city,
  searchParams,
  setFunnelTitle,
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
    const { battles } = searchParams;
    if (isArray(battles) && battles.length) {
      return true;
    }
    return false;
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
    const { id: cityId, name: cityName } = city;
    const params: any = {
      ...searchParams,
      cityId,
    };
    // try {
    const data = await carHomeMapPoi(params);
    if (isArray(data)) {
      drawPointMarks(data);
      setFunnelTitle(`${cityName}${data.length}家`);
    }

    // } catch (error) {
    // drawPointMarks(
    //   [
    //     {
    //       brandName: '鸿星尔克ERKE',
    //       shopName: '鸿星尔克(文明街)',
    //       location: '120.457507,30.174966',
    //       shopAddress: '航坞路218-4号',
    //       'icon': null
    //     },
    //     {
    //       brandName: '鸿星尔克ERKE',
    //       shopName: '鸿星尔克(恒隆广场)',
    //       location: '120.261311,30.178321',
    //       shopAddress: '山阴路688号恒隆广场F3层',
    //       'icon': null
    //     },
    //     {
    //       brandName: '鸿星尔克ERKE',
    //       shopName: '鸿星尔克(建浦路店)',
    //       location: '120.249282,29.978905',
    //       shopAddress: '浦阳镇购物广场市场建浦路',
    //       'icon': null
    //     },
    //     {
    //       brandName: '鸿星尔克ERKE',
    //       shopName: '鸿星尔克(新农都物流中心店)',
    //       location: '120.30341,30.202249',
    //       shopAddress: '新农都物流中心一区块13幢110号专卖店',
    //       'icon': null
    //     },
    //     {
    //       brandName: '阿迪达斯Adidas',
    //       shopName: '阿迪达斯(鸿宁路店)',
    //       location: '120.255303,30.237457',
    //       shopAddress: '鸿宁路与皓月路交叉口西220米',
    //       'icon': null
    //     },
    //     {
    //       brandName: '阿迪达斯Adidas',
    //       shopName: '阿迪达斯(浙江国际影视中心店)',
    //       location: '120.293869,30.248046',
    //       shopAddress: '弘慧路浙江国际影视中心',
    //       'icon': null
    //     },
    //     {
    //       brandName: '阿迪达斯Adidas',
    //       shopName: '阿迪达斯(东灵北路店)',
    //       location: '120.460613,30.186078',
    //       shopAddress: '航坞文化创意园南门旁',
    //       'icon': null
    //     },
    //     {
    //       brandName: '阿迪达斯Adidas',
    //       shopName: '阿迪达斯(通惠南路店)',
    //       location: '120.286145,30.144945',
    //       shopAddress: '通惠南路667号银泰百货(萧山店)F1',
    //       'icon': null
    //     },
    //     {
    //       brandName: '阿迪达斯Adidas',
    //       shopName: '阿迪达斯(罗婆路店)',
    //       location: '120.278176,30.144606',
    //       shopAddress: '南环路1288号阿迪达斯',
    //       'icon': null
    //     },
    //     {
    //       brandName: '阿迪达斯Adidas',
    //       shopName: '阿迪达斯(东灵北路店)',
    //       location: '120.460562,30.186024',
    //       shopAddress: '东灵北路阳光名居西北侧约40米',
    //       'icon': null
    //     },
    //     {
    //       brandName: '阿迪达斯Adidas',
    //       shopName: '阿迪达斯(党山店)',
    //       location: '120.522653,30.166126',
    //       shopAddress: '碧苑路173号',
    //       'icon': null
    //     },
    //     {
    //       brandName: '阿迪达斯Adidas',
    //       shopName: '阿迪达斯(航坞路店)',
    //       location: '120.457561,30.174956',
    //       shopAddress: '瓜沥镇航坞路218号(近航坞路)',
    //       'icon': null
    //     },
    //     {
    //       brandName: '阿迪达斯Adidas',
    //       shopName: '阿迪达斯(双健萧山强身店)',
    //       location: '120.269263,30.163822',
    //       shopAddress: '萧山市心广场A座1009号',
    //       'icon': null
    //     },
    //     {
    //       brandName: '阿迪达斯Adidas',
    //       shopName: '阿迪达斯(印力汇德隆杭州奥体印象城店)',
    //       location: '120.252931,30.22331',
    //       shopAddress: '奥体印象城',
    //       'icon': null
    //     },
    //     {
    //       brandName: '阿迪达斯Adidas',
    //       shopName: '阿迪达斯(商贸路店)',
    //       location: '120.407811,30.183307',
    //       shopAddress: '商贸路杭州萧山舒情商务酒店西南侧约50米',
    //       'icon': null
    //     },
    //     {
    //       brandName: '阿迪达斯Adidas',
    //       shopName: '阿迪达斯(峙山北路店)',
    //       location: '120.241098,30.040793',
    //       shopAddress: '峙山北路香格名苑',
    //       'icon': null
    //     },
    //     {
    //       brandName: '阿迪达斯Adidas',
    //       shopName: '阿迪达斯(峙山北路店)',
    //       location: '120.248691,30.040999',
    //       shopAddress: '临浦镇峙山北路107号',
    //       'icon': null
    //     },
    //     {
    //       brandName: '阿迪达斯Adidas',
    //       shopName: '阿迪达斯(万象汇店)',
    //       location: '120.269105,30.182119',
    //       shopAddress: '北干街区金城路927号万象汇F4',
    //       'icon': null
    //     },
    //     {
    //       brandName: '波司登BOSIDENG',
    //       shopName: '波司登(银隆百货A座店)',
    //       location: '120.268316,30.171657',
    //       shopAddress: '银隆百货A座2楼',
    //       'icon': null
    //     },
    //     {
    //       brandName: '波司登BOSIDENG',
    //       shopName: '波司登(萧山市心广场店)',
    //       location: '120.268703,30.164494',
    //       shopAddress: '萧山市心广场G座1049号1层',
    //       'icon': null
    //     },
    //     {
    //       brandName: '波司登BOSIDENG',
    //       shopName: '波司登(航坞路店)',
    //       location: '120.458996,30.174858',
    //       shopAddress: '航坞路173号',
    //       'icon': null
    //     },
    //     {
    //       brandName: '波司登BOSIDENG',
    //       shopName: '波司登(万象汇店)',
    //       location: '120.268595,30.181669',
    //       shopAddress: '北干街道金城路927号万象汇3楼L373号',
    //       'icon': null
    //     },
    //     {
    //       brandName: '波司登BOSIDENG',
    //       shopName: '波司登(lse城市生活广场)',
    //       location: '120.251944,30.182715',
    //       shopAddress: '金城路333号加州阳光・开元广场F1',
    //       'icon': null
    //     }
    //   ]
    // );
    // }
  };
  // 获取对应的品牌列表
  // const getPoiBrandList = async () => {
  //   pointMarkersGroup.current && pointMarkersGroup.current.clearOverlays();
  //   const { district: districtName, districtList } = city;
  //   const targetDistrict = districtList.find((item: any) => item.name === districtName);
  //   const params: any = {
  //     districtId: targetDistrict?.id,
  //     brandIdList: getTargetBrandIds || [],
  //   };
  //   const data = await poiMapBrandList(params);
  //   pointMarkersGroup.current && pointMarkersGroup.current.clearOverlays();
  //   isArray(data) && drawPointMarks(data);
  // };

  // 地图上绘制品牌点
  const drawPointMarks = (data: Array<any>) => {
    const markers: Array<any> = [];
    data.forEach((item: any) => {
      const {
        lng,
        lat,
        icon
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
        content: `<div class='pointCon' style="background-image:url(${icon})"></div>`,
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
