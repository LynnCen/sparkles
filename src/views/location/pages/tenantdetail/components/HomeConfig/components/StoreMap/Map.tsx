/**
 * @Description
 */

import V2AMap from '@/common/components/Map/V2AMap';
import styles from './index.module.less';
import { FC, useEffect, useRef, useState } from 'react';
import { mapLevel } from '../../ts.config';
import { getProvinceAdcode } from '@/common/utils/map';
const Map:FC<any> = () => {
  const [mapIns, setMapIns] = useState<any>(null);
  const [curMapLevel, setCurMapLevel] = useState<mapLevel>(mapLevel.country);
  const curAdcodeRef = useRef<any>(null);
  const mapLayerRef = useRef<any>(null);// 存储当前的地图layer
  const textLayerRef = useRef<any>(null);// 省份、市区文本 layer
  const hoverLabelMarkerRef = useRef<any>(null);// hover对应显示的marker
  const hoverLayerRef = useRef<any>(null);// hover时候的地图颜色
  const hoverAdcodeRef = useRef<any>(null);// 存储hover时候的adcode

  // 打开地图缩放功能，在执行完fn后关闭缩放功能
  const openAndCloseZoomChange = async(fn) => {
    mapIns.setStatus({
      zoomEnable: true,
    });

    new Promise((resolve) => {
      resolve(fn());
    }).then(() => {
      mapIns.setStatus({
        zoomEnable: false,
      });
    });
  };
  const getColorByAdcode = function (adcode, colors) {
    if (!colors[adcode]) {
      var r = 3;
      var g = 140;
      var b = 230;
      var a = Math.random() + 0.3;
      colors[adcode] = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    }

    return colors[adcode];
  };
  // 绘制全国颜色
  const drawerCountryLayer = () => {
    const colors = {};
    const getColor = function(adcode) {
      if (!colors[adcode]) {
        var gdp = GDPSpeed[adcode];
        if (!gdp) {
          colors[adcode] = 'rgb(227,227,227)';
        } else {
          var r = 3;
          var g = 140;
          var b = 230;
          var a = gdp / 10;
          colors[adcode] = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        }
      }
      return colors[adcode];
    };
    const countryLayer = new window.AMap.DistrictLayer.Country({
      zIndex: 10,
      SOC: 'CHN',
      depth: 1,
      styles: {
        'nation-stroke': '#ffffff', // 国境线颜色
        'coastline-stroke': '#ffffff', // 海岸线颜色
        'province-stroke': 'ffffff', // 省界颜色
        'fill': function(props) { // 填充色
          return getColor(props.adcode);
        }
      }
    });
    return countryLayer;
  };
  // 绘制省份颜色
  const drawerSignProvinces = (code = '', config = {}) => {
    const colors = {};
    const provinceLayer = new window.AMap.DistrictLayer.Province({
      adcode: [code || curAdcodeRef.current],
      depth: 1,
      styles: {
        'nation-stroke': '#ffffff', // 国境线颜色
        'coastline-stroke': '#ffffff', // 海岸线颜色
        'province-stroke': 'ffffff', // 省界颜色
        'fill': function (props) {
          var adcode = props.adcode;
          return getColorByAdcode(adcode, colors);
        },
      },
      ...config
    });
    return provinceLayer;
  };
  // 缩放到省份的合适级别
  const fitViewProvince = () => {
    window.AMapUI.load(['ui/geo/DistrictExplorer', 'lib/$'], function(DistrictExplorer) {
      var districtExplorer = window.districtExplorer = new DistrictExplorer({
        eventSupport: true, // 打开事件支持
        map: mapIns
      });
      districtExplorer.loadAreaNode(curAdcodeRef.current, (_, areaNode) => {
        openAndCloseZoomChange(() =>
          mapIns.setBounds(areaNode.getBounds(), false)
        );
      });
    });
  };

  // 绘制省市名称
  const drawerAreaName = () => {
    const textLayer = new window.AMap.LabelsLayer({
      // 开启标注避让，默认为开启，v1.4.15 新增属性
      collision: false,
      // 开启标注淡入动画，默认为开启，v1.4.15 新增属性
      animation: true,
    });
    districts.map((district) => {
      const name = district.name;
      const config:any = { name: '',
        text: {
          content: name,
          style: {
            fontSize: 12,
            fontWeight: 'normal',
            fillColor: '#eee',
            strokeColor: '#88f',
            strokeWidth: 1,
          }
        },
        position: district.center.split(',')
      };
      const labelsMarker = new window.AMap.LabelMarker(config);
      labelsMarker.on('click', clickMap);
      labelsMarker.on('mousemove', mouseMoveMap);

      textLayer.add(labelsMarker);
    });
    return textLayer;
  };

  // 点击下钻-获取adcode、设置地图级别
  const clickMap = async (e) => {
    // 只有全国视角点击才会下钻到省级别
    if (curMapLevel !== mapLevel.country) return;
    const { lnglat } = e;
    if (!lnglat) throw new Error('没有获取到lnglat');
    // 通过经纬度获取省份adcode
    const res:any = await getProvinceAdcode('', lnglat, curMapLevel);
    const { adcode } = res;
    if (!adcode) return;
    curAdcodeRef.current = adcode;
    setCurMapLevel(mapLevel.province);
  };
  // 处理mousemove事件
  const mouseMoveMap = (e) => {
    const { adcode } = mapLayerRef.current.getDistrictByContainerPos(e.pixel) || {};

    // 处理hover后的label
    hoverLabelMarkerRef.current.show();
    hoverLabelMarkerRef.current.setPosition(e.lnglat);
    hoverLabelMarkerRef.current.setContent(`<div>${adcode}</div>`);
    // adcode不存在，或者如果省份编码不同，就不往下处理
    if (!adcode || adcode % 10000 !== 0 && String(adcode).slice(0, 2) !== String(curAdcodeRef.current).slice(0, 2)) {
      hoverLabelMarkerRef.current.hide();
    }
    // 处理hover后的layer
    handleHoverLayer(adcode);
  };
  const handleHoverLayer = (adcode) => {
    if (hoverAdcodeRef.current === adcode) return;
    hoverAdcodeRef.current = adcode;

    hoverLayerRef.current && mapIns.removeLayer(hoverLayerRef.current);
    if (adcode && !(adcode % 10000 !== 0 && String(adcode).slice(0, 2) !== String(curAdcodeRef.current).slice(0, 2))) {
      // 全国级别hover省份，省份code为350000、360000,则depth为1
      const depth = adcode % 10000 === 0 ? 0 : 1;
      hoverLayerRef.current = drawerSignProvinces(adcode, {
        depth,
        styles: {
          'nation-stroke': '#ffffff', // 国境线颜色
          'coastline-stroke': '#ffffff', // 海岸线颜色
          'province-stroke': 'ffffff', // 省界颜色
          fill: '#FF861D'
        },
        zIndex: 1000
      });
      mapIns.addLayer(hoverLayerRef.current);
      mapIns.setLayers([hoverLayerRef.current, textLayerRef.current, mapLayerRef.current]);
    }
  };
  // 初始化 绑定点击事件
  useEffect(() => {
    if (!mapIns) return;
    hoverLabelMarkerRef.current = new window.AMap.Marker({
      map: mapIns,
      position: [0, 0],
      offset: [30, 30],
      content: `<div>hover内容</div>`,
    });

    mapIns.on('click', clickMap);
    mapIns.on('mousemove', mouseMoveMap);
    return () => {
      mapIns.off('click', clickMap);
      mapIns.off('mousemove', mouseMoveMap);
    };
  }, [mapIns]);

  useEffect(() => {
    if (!mapIns) return;
    // 清除旧的layer
    mapLayerRef.current && mapIns.removeLayer(mapLayerRef.current);
    textLayerRef.current && mapIns.removeLayer(textLayerRef.current);

    if (curMapLevel === mapLevel.country) {
      // 获取layer
      mapLayerRef.current = drawerCountryLayer();
      textLayerRef.current = drawerAreaName();
      mapIns.addLayer(mapLayerRef.current);
      mapIns.addLayer(textLayerRef.current);
      mapIns.setLayers([mapLayerRef.current, textLayerRef.current]);// 将多个图层一次替代地图上原有图层，会移除地图原有图层

      // 缩放到合适的全国级别
      openAndCloseZoomChange(() => {
        mapIns.setZoom(4);
        mapIns.setCenter([102.747068, 37.784754]);
      });

    } else if (curMapLevel === mapLevel.province) {
      // 获取layer
      mapLayerRef.current = drawerSignProvinces();
      mapIns.addLayer(mapLayerRef.current);// 添加图层到地图上
      // TODO-0411-前台 这里需要添加一份textLayer,通过drawerAreaName获取
      // 前台无论从接口还是useAmapLevelAndCityNew都可以拿到对应省份下的市区，我觉得前台会有对应的接口去获取数据，这里就不去mock了
      // textLayerRef.current = drawerAreaName();
      // mapIns.addLayer(textLayerRef.current);
      mapIns.setLayers([mapLayerRef.current]);// 将多个图层一次替代地图上原有图层，会移除地图原有图层
      // 缩放到合适的省级别
      fitViewProvince();
    }
  }, [curMapLevel, mapIns]);

  return <div className={styles.map}>
    <V2AMap
      loaded={setMapIns}
      mapOpts={{
        zoom: 4,
        zooms: [3.5, 20],
        center: [102.747068, 37.784754], // 默认地图的中心位置，使中国地图处于地图正中央
        zoomEnable: false,
      }}
      plugins={[
        'AMap.DistrictSearch',
        'AMap.Geocoder',
      ]}
    />
    {curMapLevel === mapLevel.province
      ? <div
        className={styles.backBtn}
        onClick={() => setCurMapLevel(mapLevel.country)}>
    返回全国</div>
      : <></>}
    <div className={styles.bottom}>
      <span>少</span>
      <span className={styles.bar}></span>
      <span>多</span>
    </div>
  </div>;
};
export default Map;
const GDPSpeed = {
  '520000': 10, // 贵州
  '540000': 10, // 西藏
  '530000': 8.5, // 云南
  '500000': 8.5, // 重庆
  '360000': 8.5, // 江西
  '340000': 8.0, // 安徽
  '510000': 7.5, // 四川
  '350000': 8.5, // 福建
  '430000': 8.0, // 湖南
  '420000': 7.5, // 湖北
  '410000': 7.5, // 河南
  '330000': 7.0, // 浙江
  '640000': 7.5, // 宁夏
  '650000': 7.0, // 新疆
  '440000': 7.0, // 广东
  '370000': 7.0, // 山东
  '450000': 7.3, // 广西
  '630000': 7.0, // 青海
  '320000': 7.0, // 江苏
  '140000': 6.5, // 山西
  '460000': 7, // 海南
  '310000': 6.5, // 上海
  '110000': 6.5, // 北京
  '130000': 6.5, // 河北
  '230000': 6, // 黑龙江
  '220000': 6, // 吉林
  '210000': 6.5, // 辽宁
  '150000': 6.5, // 内蒙古
  '120000': 5, // 天津
  '620000': 6, // 甘肃
  '610000': 8.5, // 甘肃
  '710000': 2.64, // 台湾
  '810000': 3.0, // 香港
  '820000': 4.7 // 澳门

};
const districts = [
  {
    citycode: [],
    adcode: '440000',
    name: '广东',
    center: '113.280637,23.125178',
    level: 'province',
    districts: []
  },
  {
    citycode: [],
    adcode: '410000',
    name: '河南',
    center: '113.665412,34.757975',
    level: 'province',
    districts: []
  },
  {
    citycode: [],
    adcode: '150000',
    name: '内蒙古',
    center: '111.670801,40.818311',
    level: 'province',
    districts: []
  },
  {
    citycode: [],
    adcode: '230000',
    name: '黑龙江',
    center: '126.642464,45.756967',
    level: 'province',
    districts: []
  },
  {
    citycode: [],
    adcode: '650000',
    name: '新疆',
    center: '87.617733,43.792818',
    level: 'province',
    districts: []
  },
  {
    citycode: [],
    adcode: '420000',
    name: '湖北',
    center: '114.298572,30.584355',
    level: 'province',
    districts: []
  },
  {
    citycode: [],
    adcode: '210000',
    name: '辽宁',
    center: '123.429096,41.796767',
    level: 'province',
    districts: []
  },
  {
    citycode: [],
    adcode: '370000',
    name: '山东',
    center: '117.000923,36.675807',
    level: 'province',
    districts: []
  },
  {
    citycode: [],
    adcode: '610000',
    name: '陕西',
    center: '108.948024,34.263161',
    level: 'province',
    districts: []
  },
  {
    citycode: '021',
    adcode: '310000',
    name: '上海',
    center: '121.472644,31.231706',
    level: 'province',
    districts: []
  },
  {
    citycode: [],
    adcode: '520000',
    name: '贵州',
    center: '106.713478,26.578343',
    level: 'province',
    districts: []
  },
  {
    citycode: '023',
    adcode: '500000',
    name: '重庆',
    center: '106.504962,29.533155',
    level: 'province',
    districts: []
  },
  {
    citycode: [],
    adcode: '540000',
    name: '西藏',
    center: '91.132212,29.660361',
    level: 'province',
    districts: []
  },
  {
    citycode: [],
    adcode: '340000',
    name: '安徽',
    center: '117.283042,31.86119',
    level: 'province',
    districts: []
  },
  {
    citycode: [],
    adcode: '350000',
    name: '福建',
    center: '119.306239,26.075302',
    level: 'province',
    districts: []
  },
  {
    citycode: [],
    adcode: '430000',
    name: '湖南',
    center: '112.982279,28.19409',
    level: 'province',
    districts: []
  },
  {
    citycode: [],
    adcode: '460000',
    name: '海南',
    center: '110.33119,20.031971',
    level: 'province',
    districts: []
  },
  {
    citycode: [],
    adcode: '320000',
    name: '江苏',
    center: '118.767413,32.041544',
    level: 'province',
    districts: []
  },
  {
    citycode: [],
    adcode: '630000',
    name: '青海',
    center: '101.778916,36.623178',
    level: 'province',
    districts: []
  },
  {
    citycode: [],
    adcode: '450000',
    name: '广西',
    center: '108.320004,22.82402',
    level: 'province',
    districts: []
  },
  {
    citycode: [],
    adcode: '640000',
    name: '宁夏',
    center: '106.278179,38.46637',
    level: 'province',
    districts: []
  },
  {
    citycode: [],
    adcode: '360000',
    name: '江西',
    center: '115.892151,28.676493',
    level: 'province',
    districts: []
  },
  {
    citycode: [],
    adcode: '330000',
    name: '浙江',
    center: '120.153576,30.287459',
    level: 'province',
    districts: []
  },
  {
    citycode: [],
    adcode: '130000',
    name: '河北',
    center: '114.502461,38.045474',
    level: 'province',
    districts: []
  },
  {
    citycode: '1853',
    adcode: '820000',
    name: '澳门',
    center: '113.54909,22.198951',
    level: 'province',
    districts: []
  },
  {
    citycode: '1886',
    adcode: '710000',
    name: '台湾',
    center: '121.509062,25.044332',
    level: 'province',
    districts: []
  },
  {
    citycode: '1852',
    adcode: '810000',
    name: '香港',
    center: '114.173355,22.320048',
    level: 'province',
    districts: []
  },
  {
    citycode: [],
    adcode: '620000',
    name: '甘肃',
    center: '103.823557,36.058039',
    level: 'province',
    districts: []
  },
  {
    citycode: [],
    adcode: '510000',
    name: '四川',
    center: '104.065735,30.659462',
    level: 'province',
    districts: []
  },
  {
    citycode: [],
    adcode: '220000',
    name: '吉林',
    center: '125.3245,43.886841',
    level: 'province',
    districts: []
  },
  {
    citycode: '022',
    adcode: '120000',
    name: '天津',
    center: '117.190182,39.125596',
    level: 'province',
    districts: []
  },
  {
    citycode: [],
    adcode: '530000',
    name: '云南',
    center: '102.712251,25.040609',
    level: 'province',
    districts: []
  },
  {
    citycode: '010',
    adcode: '110000',
    name: '北京',
    center: '116.405285,39.904989',
    level: 'province',
    districts: []
  },
  {
    citycode: [],
    adcode: '140000',
    name: '山西',
    center: '112.549248,37.857014',
    level: 'province',
    districts: []
  }
];
