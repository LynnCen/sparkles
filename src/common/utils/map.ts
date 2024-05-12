// 高德地图相关接口
import { isArray } from '@lhb/func';
import { targetValSort } from '@/common/utils/ways';
import { CQ_CODE_SUBURB } from '../components/AMap/ts-config';

// 中国的四个直辖市和特别行政区（包含台湾）
export const MUNICIPALITY_AND_SAR = [
  '北京',
  '天津',
  '上海',
  '重庆',
  '香港',
  '澳门',
  '台湾'
];

// 品牌饼图颜色盘
export const chartColorList = [
  'rgba(210, 89, 217, 1)',
  'rgba(255, 161, 54, 1)',
  'rgba(118, 68, 226, 1)',
  'rgba(10, 153, 81, 1)',
  'rgba(218, 42, 111, 1)',
  'rgba(255, 132, 86, 1)',
  'rgba(246, 239, 0, 1)',
];

// 市级下各区域的行政区围栏颜色
export const districtColor = [
  'rgba(146, 240, 201, 0.8)',
  'rgba(189, 226, 159, 1)',
  'rgba(136, 255, 174, 1)',
  'rgba(249, 133, 87, 1)',
  'rgba(107, 250, 255, 1)',
  'rgba(255, 183, 200, 1)',
  'rgba(78, 176, 255, 1)',
  'rgba(0, 255, 159, 1)',
  'rgba(255, 225, 192, 1)'
];

// https://lbs.amap.com/api/javascript-api-v2/guide/abc/load 永国配的服务端转发
export const aMapServiceHost = 'https://location.locxx.com/_AMapService';
export const aMapServiceHostDev = 'https://ie-loc.lanhanba.net/_AMapService';

export const countryDistrictLayerColors = [
  '#006AFF',
  '#006AFF',
  '#006AFF',
  '#D6E7FF',
  '#D6E7FF',
  '#D6E7FF',
  '#D6E7FF',
  '#D6E7FF',
  '#D6E7FF',
  '#D6E7FF',
];

export const otherDistrictLayerColors = [
  '#006AFF',
  '#D6E7FF',
  '#D6E7FF',
];

/**
* 获取行政区域范围
* TODO待优化，没有针对amapOptions做具体的逻辑区分，amapOptions内参数值不同，返回的结构不同，使用时要注意
* @param {Object} amapOptions 地图查询参数 https://lbs.amap.com/demo/jsapi-v2/example/district-search/draw-district-boundaries
* @param {String} name | adcode  行政区域名称（或者adcode，推荐使用adcode，区名称可能存在重复）
* @param {Boolean} onlyBounds 是否仅返回范围参数
* @return {Array} 对应的行政区域数组
*/
export function getDistrictBounds(amapOptions, name, onlyBounds = true) {
  const district = new window.AMap.DistrictSearch(amapOptions);
  return new Promise((resolve, reject) => {
    district.search(name, (status, result) => {
      if (status === 'complete' && result && isArray(result.districtList)) {
        const { districtList } = result;
        if (onlyBounds) { // 仅返回查询的行政区域的范围，
          const bounds = districtList[0].boundaries;
          resolve(bounds);
        } else { // 返回高德地图的原始数据
          resolve(districtList);
        }
      } else {
        reject(status);
      }
    });
  });
}

/**
 * 绘制地图上单个环状图样式
 * @param data {Array} 环状数组
 * @param total {Number} 总个数
 * @param targetFieldsName 要遍历的字段名
 * @returns {Object} 样式
 */
export function ringChartStyle(
  data: Array<any>,
  total: number,
  targetFieldsName = 'count'
) {
  const len = chartColorList.length; // 颜色数组长度
  let lDeg = 0;
  let rDeg = 0;
  // 计算每组环状图的总数
  let ringStyle: any = [];
  if (total !== 0) {
    ringStyle = data.map((childItem: any, index: number) => {
      // 计算出每个选中的条目在所有选中项中的比重
      const proportion = childItem[targetFieldsName] / total;
      rDeg = rDeg + 360 * proportion;
      const itemColor = chartColorList[index < len ? index : index % len];
      const color = `${itemColor} ${lDeg}deg ${rDeg}deg`;
      lDeg = rDeg;
      return color;
    });
  }
  return ringStyle;
}

/**
 * 创建浏览器定位实例
 * @param {Object} options 创建浏览器定位实例的相关参数
 * https://lbs.amap.com/api/jsapi-v2/documentation#geolocation
 * @returns 浏览器定位实例
 */
function getGeolocationInstance(options: any) {
  const AMap = window.AMap;
  return new AMap.Geolocation({
    enableHighAccuracy: options.enableHighAccuracy || true, // 是否使用高精度定位，默认:true
    timeout: options.timeout || 5, // 默认5ms，设置5毫秒的原因是大多数浏览器定位不会定位到精确位置，如果timeout设置的过大部分场景会影响页面体验和逻辑
    position: options.position || 'RB', // 定位按钮的停靠位置
    offset: options.offset || new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
    // noIpLocate: 3, // 模拟定位失败时可设置此参数
    // noGeoLocation: 3, // 模拟定位失败时可设置此参数
    zoomToAccuracy: true, // 定位成功后是否自动调整地图视野到定位点
    // 目前高德地图该参数和showCircle冲突，getCityWhenFail为true时，需要将showCircle也设置为true，否则SDK就会报错，已经提工单给高德了
    getCityWhenFail: true, // 定位失败之后是否返回基本城市定位信息
    needAddress: true, // 是否需要将定位结果进行逆地理编码操作
    ...options
  });
}

/**
 * 浏览器精确定位
 * 文档：https://lbs.amap.com/demo/jsapi-v2/example/location/browser-location
 * 浏览器定位失败常见原因：https://lbs.amap.com/faq/js-api/map-js-api/position-related/43361
 * @param {*} map // 地图实例
 * @param {*} options 自定义参数
 */
export function getCurPosition(map: any, options: any) {
  const AMap = window.AMap;
  return new Promise((resolve, reject): void => {
    AMap.plugin('AMap.Geolocation', () => {
      const geolocation = getGeolocationInstance(options);
      map.addControl(geolocation);
      geolocation.getCurrentPosition((status: string, result: any) => {
        if (status === 'complete') { // 获取定位成功，返回定位信息
          return resolve(result);
        }

        reject(result);
      });
    });
  });
}
/**
 * 逆地理编码（根据经纬度解析具体的地址信息）
* 注意使用该方法前，需要初始化高德地图，并引入AMap.Geocoder插件
* @param {Array} lnglat 经纬度
* @param {String} cityName 城市名
* @param {Boolean} onlyAddress 是否仅返回具体地址
*/
export function getLngLatAddress(lnglat: any, cityName = '全国', onlyAddress = true) {
  const geocoder = new window.AMap.Geocoder({
    city: cityName // 默认：“全国”
  });

  return new Promise((resolve, reject) => {
    geocoder.getAddress(lnglat, (status: string, result: any) => {
      if (status === 'complete' && result.regeocode) {
        const { regeocode } = result;
        if (onlyAddress) {
          const { formattedAddress } = regeocode || {};
          resolve(formattedAddress);
        } else {
          resolve(regeocode);
        }
      } else {
        reject(new Error(`根据经纬度查询地址失败，错误信息：${result}`));
      }
    });
  });
}

/**
 * 获取搜索数据 https://lbs.amap.com/api/javascript-api-v2/documentation#placesearch
* 注意使用该方法前，需要初始化高德地图，并引入AMap.PlaceSearch插件
* 注意，除了特殊要求，以后优先使用 keywordPrompt 方法
* @param {String} keyword 关键词
* @param {String} cityName 城市名，不传默认全国
* @param {Object} options 其他参数
*/
export function searchPOI(keyword: string, cityName, options: any) {
  const placeSearch = new window.AMap.PlaceSearch({
    pageIndex: options?.page || 1, // 页码
    pageSize: options?.pageSize || 10, // 分页大小
    city: cityName, // 城市
    citylimit: !!cityName && !!options?.citylimit, // //是否强制限制在设置的城市内搜索
    ...options
  });

  return new Promise((resolve, reject) => {
    placeSearch.search(keyword, (status: string, res: any) => {
      if (status === 'complete' && res) {
        const { poiList } = res;
        const { pois } = poiList || {};
        // 返回的数据包含不存在经纬度的数据，需要过滤
        const resultArr = pois?.filter((item: any) => {
          const { location } = item;
          const { lat, lng } = location || {};
          if (+lng && +lat) return item;
        });
        resolve(resultArr);
      } else {
        reject(new Error(`根据关键词搜索失败，错误信息：${res}`));
      }
    });
  });
}

/**
 * 根据关键词输入的提示，使用该方法前需要先初始化高德SDK
 * @param {String} keywords 输入的关键词
 * @param {Object} params 其他入参：https://lbs.amap.com/api/javascript-api-v2/documentation#autocomplete
 * @return {Array} 对应的搜素数据
 */
export function keywordPrompt(
  keywords: string,
  params = {}
) {
  return new Promise((resolve, reject) => {
    if (!window.AMap) {
      return reject('请先初始化高德地图SDK！');
    } else if (!window.AMap.AutoComplete) {
      return reject('未引入AMap.AutoComplete插件！');
    }
    const acIns = new window.AMap.AutoComplete(params); // 实例化输入提示对象

    acIns.search(keywords, (status: string, result: any) => {
      if (status === 'complete') {
        const { tips } = result || {};
        const data = isArray(tips) ? tips : [];
        // console.log(`高德输入提示返回的数据`, data);
        // 返回的数据包含不存在经纬度的数据，需要过滤
        const resultArr = data.filter((item: any) => {
          const { location } = item;
          const { lat, lng } = location || {};
          if (lng && lat) {
            item.lng = lng; // 把经纬度数据平铺出来
            item.lat = lat;
            // 合并显示的原因是district是省市区的合称，address只是地址信息
            item.address = `${item.district || ''}${item.address}`; // 合并显示
            return item;
          }
        });
        resolve(resultArr || []);
      } else if (status === 'no_data') { // 搜索没数据时
        resolve([]);
      } else if (result === 'USER_DAILY_QUERY_OVER_LIMIT') {
        reject(`
          状态：${status}
          错误信息：'高德搜索接口超过日调用次数'
        `);
      } else {
        reject(`
          状态：${status}
          错误信息：${JSON.stringify(result)}
        `);
      }
    });
  });
}
/**
 * 绘制市级下面区的行政区围栏
 * 注意使用该方法前，需要引入'AMap.DistrictSearch'插件
 *
 */
export function drawDistrictPath(mapIns: any, cityName: string, colors = districtColor, options = {}) {
  if (!mapIns || !cityName) return;
  let districtLayer:any;
  const district = new window.AMap.DistrictSearch();
  // 目前北京、上海、天津、重庆四个直辖市需要特殊处理，如果不处理，搜索北京和北京市的结果不一样
  let name = cityName;
  if (MUNICIPALITY_AND_SAR.find((item: any) => name.indexOf(item) !== -1)) {
    name = name.replace('市', '');
  }

  return new Promise((resolve, reject) => {
    district.search(name, (status, result): any => {
      if (status === 'complete') {
        const { districtList } = result;
        if (!(isArray(districtList) && districtList.length)) return;
        const cityLevel = districtList.filter((item: any) => item.level === 'city');
        if (!cityLevel?.length) return false;
        const adcodes: string[] = [];
        cityLevel.forEach((item: any) => {
          const { adcode } = item;
          if ((options as any)?.customOpenCQCheck && adcode === CQ_CODE_SUBURB) return;
          adcode && adcodes.push(adcode);
        });
        let colorIndex = 0;
        districtLayer = new window.AMap.DistrictLayer.Province({
          zIndex: 10,
          // 行政区的编码 adcode与省市行政区对照表
          adcode: adcodes,
          // depth设定数据的层级深度，depth为0的时候只显示国家面，depth为1的时候显示省级， 当国家为中国时设置depth为2的可以显示市一级
          depth: 2,
          opacity: 0.5,
          styles: {
            'fill': () => {
              let color = '';
              if (colorIndex > colors.length - 1) {
                colorIndex = 0;
              }
              color = colors[colorIndex];
              colorIndex++;
              return color;
            },
            'stroke-width': 4,
            'province-stroke': '#0051C2',
            // 'city-stroke': '#f23030', // 中国地级市边界
            'city-stroke': '#fff', // 中国地级市边界
            'county-stroke': '#fff' // 中国区县边界
          },
          ...options
        });
        districtLayer.setMap(mapIns);
        return resolve(districtLayer);
      }
      return reject(status);
    });
  });
}



/**
 * @description 自定义图层（全国省份 | 省份下所有城市 | 城市下所有区）
 * https://lbs.amap.com/api/javascript-api-v2/documentation#districtlayer
 * 使用该方法前一定要实例化高德地图对象
 * @param {Object} mapIns 地图实例
 * @param {Object} styles 为简易行政区图设定各面的填充颜色和描边颜色
 * @param {Object} options 其他配置参数
 * @param {Array}  associatedData 关联的数据需要根据排序（降序）在对应的省份|城市显示对应颜色
 * @param {Object} associatedDataConfig associatedData的相关配置项
 */
export function initDistrictLayer(
  mapIns: any,
  styles = {},
  options,
  associatedData: any[],
  associatedDataConfig = {}
) {
  if (!mapIns) throw new Error('未实例化高德地图对象');
  // 默认的配置项
  const dataConfig = {
    needSort: true, // 是否需要排序，目前的场景只有降序，
    sortFields: 'total', // 排序时依据的字段名，需要对应值是Number类型
    matchingFields: 'name', // fill方法中匹配对应省份的字段名，可选值：'name', 'adcode',默认'name'
    dataTargetFields: 'name', // associatedData中需要匹配的字段名
    colors: countryDistrictLayerColors, // 排序时的颜色数组，注意是降序，1-3名是一种颜色，4-10是另外一种颜色，其他的使用defaultColor
    defaultColor: '#f2f2f2', // 默认颜色
    ...(associatedDataConfig && { ...associatedDataConfig }), // 覆盖默认配置
  };
  let data = associatedData;
  const {
    needSort,
    sortFields,
    colors,
    matchingFields,
    dataTargetFields,
    defaultColor
  } = dataConfig;
  let hasAssociatedData = false;
  // 判断是否传入了关联数据
  if (isArray(associatedData) && associatedData.length) {
    hasAssociatedData = true;
    if (needSort) { // 降序排序
      data = targetValSort(associatedData, sortFields);
    }
  }
  // 默认是全国下的省份图层 depth为0的时候只显示国家面，depth为1的时候显示省级， 当国家为中国时设置depth为2的可以显示市一级
  const { depth, adcode } = options;
  const params = {
    SOC: 'CHN', // 国家代码
    opacity: 1,
    styles: { // 默认值
      'coastline-stroke': '#f2f2f2', // 海岸线颜色
      'province-stroke': '#e2e2e2', // 省界颜色
      'nation-stroke': '#ADB7B7', // 国境线颜色
      'fill': (props) => {
        const { NAME_CHN: name, adcode } = props;
        if (hasAssociatedData) {
          const targetIndex = data.findIndex((item: any) => (
            matchingFields === 'name' && name.includes(item[dataTargetFields])
          ) ||
          (
            // 目前接口返回的adcode是字符串，但是高德返回的adcode是Number
            matchingFields === 'adcode' && adcode === +item[dataTargetFields]
          ));
          return colors[targetIndex] || defaultColor;
        }
        return defaultColor;
      },
      'stroke-width': 2, // 描边线宽
      ...styles,
    },
    ...options
  };
  // console.log(`params`, params);
  // console.log(`实例化的对象`, depth === 1 ? 'Country' : 'Province');
  return depth === 1 && !adcode
    ? new window.AMap.DistrictLayer.Country(params)
    : new window.AMap.DistrictLayer.Province(params);
}

/**
 * 注意使用该方法前，需要先实例化高德地图
 * 经纬度和省份名称任选其一传入
 * @param {String} provinceName 省份名
 * @param {Array} lnglat 经纬度
 * @param {number} level 查询等级，1为省份，2为城市
 * @param {any} config DistrictSearch相关配置，可参照 https://lbs.amap.com/api/javascript-api-v2/documentation#districtsearch
 * @returns {Object} 返回省份信息（adcode、省份名、下属市区）
 */
export async function getProvinceAdcode(provinceName?:string, lnglat?:any, level:number = 1, config?:any) {
  // 创建AMap.DistrictSearch对象
  const districtSearch = new window.AMap.DistrictSearch({
    subdistrict: 1, // 返回下一级行政区
    level: level === 1 ? 'province' : 'city', // 查询省级行政区
    ...config
  });

  // 通过经纬度获取省份名称
  const res:any = await getLngLatAddress(lnglat, '', false);
  const { addressComponent } = res || {};
  if (!addressComponent && !provinceName) throw new Error('获取数据失败');
  const { province, city } = addressComponent || {};
  if (!province && !provinceName) throw new Error('获取数据失败');

  // 使用AMap.DistrictSearch进行查询
  let name;
  if (level === 1) {
    name = provinceName || province;
  } else if (level === 2) {
    // 当处在直辖市的状态下，city为null，取province
    name = city || province;
  }

  return new Promise((resolve, reject) => {
    districtSearch.search(name, (status, result) => {
      if (status === 'complete' && result) {
        if (result.districtList && result.districtList.length > 0) {
          const province = result.districtList[0];
          if (province) return resolve(province);// 输出省份信息
        }
      }
      return reject(status);
    });
  });
}

/**
 * @description 获取多边形中心点
 * @param {Object} PolygonArr 多边形坐标数组
 */
export function getPolygonCenter(PolygonArr) {
  // console.log(PolygonArr);

  const total = PolygonArr.length;
  let X = 0; let Y = 0; let Z = 0;
  PolygonArr.forEach((lnglat) => {
    const lng = lnglat[0] * Math.PI / 180;
    const lat = lnglat[1] * Math.PI / 180;
    const x = Math.cos(lat) * Math.cos(lng);
    const y = Math.cos(lat) * Math.sin(lng);
    const z = Math.sin(lat);
    X += x;
    Y += y;
    Z += z;
  });
  X = X / total;
  Y = Y / total;
  Z = Z / total;

  const Lng = Math.atan2(Y, X);
  const Hyp = Math.sqrt(X * X + Y * Y);
  const Lat = Math.atan2(Z, Hyp);
  // console.log(Lng, Lat, Hyp);
  return [Lng * 180 / Math.PI, Lat * 180 / Math.PI];
}


/**
 * 将圆形转换为多边形
 *
 * @param center 圆心坐标
 * @param radius 半径
 * @param sideNumber 边数，默认为20
 * @returns 返回多边形坐标数组
 */
export async function circleToPolygon(center, radius, sideNumber = 300) {
  // return new Promise((resolve, reject) => {
  //   // 按照sideNumber等分360度（圆）
  //   const polygonPoints:any = [];
  //   const earthRadius = 6371000; // 地球半径，单位米

  //   for (let i = 0; i < sideNumber; i++) {
  //     const angle = i * 360 / sideNumber;

  //     // 根据角度结合半径计算对应的点位经纬度
  //     // const earthRadius = 6371000;  // 地球半径，单位：米
  //     const angularDistance = radius / earthRadius;
  //     const lat1 = center.lat * Math.PI / 180; // 转换为弧度
  //     const lng1 = center.lng * Math.PI / 180; // 转换为弧度
  //     const bearing = angle * Math.PI / 180; // 角度转弧度

  //     const lat2 = Math.asin(Math.sin(lat1) * Math.cos(angularDistance) + Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearing));
  //     const lng2 = lng1 + Math.atan2(Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat1), Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2));

  //     polygonPoints.push([lng2 * 180 / Math.PI, lat2 * 180 / Math.PI]); // 将结果转换为经纬度
  //   }

  //   // 将最后一个点设置为起点，以形成封闭多边形
  //   polygonPoints.push(polygonPoints[0]);
  //   if (polygonPoints.length <= 1) {
  //     reject(new Error(`polygonPoints:${polygonPoints} is not a valid value`));
  //   }
  //   resolve(polygonPoints);
  // });
  return new Promise((resolve) => {
    // 球面坐标不会算，转换成三角坐标简单点，经度代表值大约：0.01≈1km 0.1≈10km 1≈100km 10≈1000km
    var km = radius / 1000;
    var a = km < 5 ? 0.01 : km < 50 ? 0.1 : km < 500 ? 1 : 10;
    var b = window.AMap.GeometryUtil.distance([center.lng, center.lat], [center.lng + a, center.lat]);
    // var c = Distance(lng, lat, lng, lat + a);
    var c = window.AMap.GeometryUtil.distance([center.lng, center.lat], [center.lng, center.lat + a]);
    var rb = radius / b * a;
    var rc = radius / c * a;
    var arr:any = [];
    var n = 0; var step = 360.0 / sideNumber; var N = 360 - step / 2; // 注意浮点数±0.000000001的差异
    for (var i = 0; n < N; i++, n += step) {
      var x = center.lng + rb * Math.cos(n * Math.PI / 180);
      var y = center.lat + rc * Math.sin(n * Math.PI / 180);
      arr[i] = [x, y];
    }
    arr.push([arr[0][0], arr[0][1]]); // 闭环
    // return arr;
    resolve(arr);
  });
}

/**
 * 计算两个多边形的重叠面积占比
 *
 * @param polygon1Path path1
 * @param polygon2Path path2
 * @returns 返回重叠面积占比的Promise对象，如果两个多边形被包含则返回100
 */
export async function overlappingArea(polygon1Path, polygon2Path) {
  try {
    // 判断两个多边形是否被包含
    const isOverlap = window.AMap.GeometryUtil.isRingInRing(polygon1Path, polygon2Path);
    let overPercent;// 相交面积占比（相交面积与polygon1、polygon2占比的最大值）
    if (!isOverlap) {
      // 获取相交区域
      const ringRingClip = window.AMap.GeometryUtil.ringRingClip(polygon1Path, polygon2Path);
      // 获取相交面积
      const ringArea = parseInt(window.AMap.GeometryUtil.ringArea(ringRingClip));
      // polygon1面积
      const polygon1Area = parseInt(window.AMap.GeometryUtil.ringArea(polygon1Path));
      // polygon2面积
      const polygon2Area = parseInt(window.AMap.GeometryUtil.ringArea(polygon2Path));
      overPercent = Math.max(ringArea / polygon1Area, ringArea / polygon2Area);
    }

    return new Promise((resolve) => {
      resolve(isOverlap ? 100 : overPercent * 100);
    });
  } catch (error:any) {
    throw new Error(error);
  }
}
