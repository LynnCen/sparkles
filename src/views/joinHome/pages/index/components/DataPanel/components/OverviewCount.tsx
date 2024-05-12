import {
  FC,
  useEffect,
  useMemo,
  useRef
} from 'react';
import { isArray } from '@lhb/func';
import {
  COUNTRY_LEVEL,
  PROVINCE_LEVEL,
  // CITY_LEVEL
} from '@/common/components/AMap/ts-config';
import { carHomeMapCount } from '@/common/api/carhome';

const OverviewCount: FC<any> = ({
  _mapIns,
  level,
  targetZoom,
  city,
  searchParams,
}) => {
  const markersGroup: any = useRef(null);
  const levelRef = useRef(level);

  // 是否展示卡片覆盖物
  const showCard = useMemo(() => {
    // 地图的缩放级别大于区级时不展示markers
    if (level > PROVINCE_LEVEL) return;
    return true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, level]);


  useEffect(() => {
    if (showCard) { // 需要展示卡片覆盖物
      getShopsCount();
      return;
    }
    // 不展示markers
    markersGroup.current && markersGroup.current.clearOverlays();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCard, searchParams]);

  useEffect(() => {
    // 全国范围的缩放级别下，移动地图中心点不触发
    if (level === COUNTRY_LEVEL && levelRef.current === level) return;
    if (showCard) {
      getShopsCount();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city?.id, level]);


  const getShopsCount = async () => {
    markersGroup.current && markersGroup.current.clearOverlays();
    const params: any = {};

    const { provinceId } = city || {};
    // 省缩放级别
    if (level === PROVINCE_LEVEL && provinceId) {
      params.provinceId = provinceId;
    }

    levelRef.current = level; // 记录请求接口时的level值
    // try {
    const data = await carHomeMapCount(params);

    if (isArray(data)) {
      drawOverviewCount(data);
    }
    // } catch (error) {
    //   drawOverviewCount([
    //     {
    //       'id': 1,
    //       name: '北京',
    //       lng: '116.407387',
    //       lat: '39.904179',
    //       'count': 823
    //     },
    //     {
    //       'id': 2,
    //       name: '天津',
    //       lng: '117.201509',
    //       lat: '39.085318',
    //       'count': 431
    //     },
    //     {
    //       'id': 3,
    //       name: '河北',
    //       lng: '114.530399',
    //       lat: '38.037707',
    //       'count': 1710
    //     },
    //     {
    //       'id': 4,
    //       name: '山西',
    //       lng: '112.578781',
    //       lat: '37.813948',
    //       'count': 1006
    //     },
    //     {
    //       'id': 5,
    //       name: '内蒙古',
    //       lng: '111.765226',
    //       lat: '40.818233',
    //       'count': 798
    //     },
    //     {
    //       'id': 6,
    //       name: '辽宁',
    //       lng: '123.435093',
    //       lat: '41.836743',
    //       'count': 1077
    //     },
    //     {
    //       'id': 7,
    //       name: '吉林',
    //       lng: '125.325802',
    //       lat: '43.896942',
    //       'count': 594
    //     },
    //     {
    //       'id': 8,
    //       name: '黑龙江',
    //       lng: '126.661998',
    //       lat: '45.742253',
    //       'count': 844
    //     },
    //     {
    //       'id': 9,
    //       name: '上海',
    //       lng: '121.473667',
    //       lat: '31.230525',
    //       'count': 844
    //     },
    //     {
    //       'id': 10,
    //       name: '江苏',
    //       lng: '118.763563',
    //       lat: '32.061377',
    //       'count': 3071
    //     },
    //     {
    //       'id': 11,
    //       name: '浙江',
    //       lng: '120.152575',
    //       lat: '30.266619',
    //       'count': 2585
    //     },
    //     {
    //       'id': 12,
    //       name: '安徽',
    //       lng: '117.330139',
    //       lat: '31.734559',
    //       'count': 1565
    //     },
    //     {
    //       'id': 13,
    //       name: '福建',
    //       lng: '119.296194',
    //       lat: '26.101082',
    //       'count': 1180
    //     },
    //     {
    //       'id': 14,
    //       name: '江西',
    //       lng: '115.816587',
    //       lat: '28.637234',
    //       'count': 966
    //     },
    //     {
    //       'id': 15,
    //       name: '山东',
    //       lng: '117.020725',
    //       lat: '36.670201',
    //       'count': 2680
    //     },
    //     {
    //       'id': 16,
    //       name: '河南',
    //       lng: '113.753094',
    //       lat: '34.767052',
    //       'count': 2302
    //     },
    //     {
    //       'id': 17,
    //       name: '湖北',
    //       lng: '114.341552',
    //       lat: '30.546222',
    //       'count': 1342
    //     },
    //     {
    //       'id': 18,
    //       name: '湖南',
    //       lng: '112.982951',
    //       lat: '28.116007',
    //       'count': 1831
    //     },
    //     {
    //       'id': 19,
    //       name: '广东',
    //       lng: '113.266887',
    //       lat: '23.133306',
    //       'count': 2853
    //     },
    //     {
    //       'id': 20,
    //       name: '广西',
    //       lng: '108.327537',
    //       lat: '22.816659',
    //       'count': 1005
    //     },
    //     {
    //       'id': 21,
    //       name: '海南',
    //       lng: '110.348781',
    //       lat: '20.018639',
    //       'count': 170
    //     },
    //     {
    //       'id': 22,
    //       name: '重庆',
    //       lng: '106.550483',
    //       lat: '29.563707',
    //       'count': 749
    //     },
    //     {
    //       'id': 23,
    //       name: '四川',
    //       lng: '104.076452',
    //       lat: '30.651696',
    //       'count': 2055
    //     },
    //     {
    //       'id': 24,
    //       name: '贵州',
    //       lng: '106.705251',
    //       lat: '26.600328',
    //       'count': 743
    //     },
    //     {
    //       'id': 25,
    //       name: '云南',
    //       lng: '102.709372',
    //       lat: '25.046432',
    //       'count': 1078
    //     },
    //     {
    //       'id': 26,
    //       name: '西藏',
    //       lng: '91.117449',
    //       lat: '29.648694',
    //       'count': 85
    //     },
    //     {
    //       'id': 27,
    //       name: '陕西',
    //       lng: '108.953939',
    //       lat: '34.266611',
    //       'count': 1106
    //     },
    //     {
    //       'id': 28,
    //       name: '甘肃',
    //       lng: '103.826777',
    //       lat: '36.060634',
    //       'count': 547
    //     },
    //     {
    //       'id': 29,
    //       name: '青海',
    //       lng: '101.780482',
    //       lat: '36.622538',
    //       'count': 129
    //     },
    //     {
    //       'id': 30,
    //       name: '宁夏',
    //       lng: '106.258889',
    //       lat: '38.472273',
    //       'count': 172
    //     },
    //     {
    //       'id': 31,
    //       name: '新疆',
    //       lng: '87.628579',
    //       lat: '43.793301',
    //       'count': 467
    //     },
    //     {
    //       'id': 32,
    //       name: '台湾',
    //       lng: '121.509062',
    //       lat: '25.044332',
    //       'count': 0
    //     },
    //     {
    //       'id': 33,
    //       name: '香港',
    //       lng: '114.171203',
    //       lat: '22.277468',
    //       'count': 115
    //     },
    //     {
    //       'id': 34,
    //       name: '澳门',
    //       lng: '113.543076',
    //       lat: '22.186927',
    //       'count': 25
    //     }
    //   ]);
    // }

  };

  // 绘制数量卡片覆盖物
  const drawOverviewCount = (data: Array<any>) => {
    const markers: Array<any> = [];
    data.forEach((item: any) => {
      const { lat, lng, count, cityId } = item;
      // 没有经纬度、数量时，跳过
      if (!(lat && lng && count > 0)) return;
      const marker = new window.AMap.Marker({
        // https://staticres.linhuiba.com/project-custom/locationpc/new/icon_active_card_markers.png
        content: `<div class='cardWrapper'>
          <div class='cardTitle ${city?.id === cityId ? `isCurrent` : ''}'>
            <div class='cardIcon'>
              <img
                src=${city?.id === cityId
    ? 'https://staticres.linhuiba.com/project-custom/locationpc/new/icon_active_card_markers.png'
    : 'https://staticres.linhuiba.com/project-custom/locationpc/new/icon_card_markers.png'}
                width='100%'
                height='100%'/>
            </div>
            <div class='cardName'>
              ${item.name}
            </div>
          </div>
          <div class='cardVal'>${item.count || 0}</div>
          </div>`,
        anchor: 'bottom-center',
        position: new window.AMap.LngLat(+lng, +lat),
        offset: [0, -6],
        zIndex: city?.id === cityId ? 99 : 12 // 12是默认值
      });
      marker.on('click', () => {
        _mapIns.setZoomAndCenter(targetZoom, [lng, lat]);
      });
      markers.push(marker);
    });
    // 覆盖物群组
    markersGroup.current = new window.AMap.OverlayGroup(markers);
    _mapIns.add(markersGroup.current);
  };

  return (
    <></>
  );
};

export default OverviewCount;
