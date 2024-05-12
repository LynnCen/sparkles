/**
 * @Description 高德地图相关
 */
import { isArray } from '@lhb/func';
import { searchResultMock } from '../ts-config';

// 显示全国范围的level值（展示全国范围下的不同省份）
export const COUNTRY_LEVEL = 1;
// 显示省范围的level值 （展示省范围下的不同城市）
export const PROVINCE_LEVEL = 2;
// 显示市范围的level值 （展示市范围下的不同区）
export const CITY_LEVEL = 3;
// 显示区范围的level值
export const DISTRICT_LEVEL = 4;


// 定义省市区对应的zoom的值的区间起始值
// 显示全国范围的地图缩放级别
export const PROVINCE_ZOOM = 6;
// 显示市范围的地图缩放级别
export const CITY_ZOOM = 8;
// 显示区范围的地图缩放级别
export const DISTRICT_ZOOM = 10;

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

// 重庆市下的重庆郊县name
export const CQ_SUBURB_NAME = '重庆郊县';

/**
 * 创建浏览器定位实例
 * @param {Object} options 创建浏览器定位实例的相关参数
 * https://lbs.amap.com/api/jsapi-v2/documentation#geolocation
 * @returns 浏览器定位实例
 */
function getGeolocationInstance(options: any) {
  const AMap = window.AMap;
  return new AMap.Geolocation({
    enableHighAccuracy: true, // 是否使用高精度定位，默认:true
    timeout: 1000, // 默认100ms
    position: 'RB', // 定位按钮的停靠位置
    offset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
    // noIpLocate: 3, // 模拟定位失败时可设置此参数
    // noGeoLocation: 3, // 模拟定位失败时可设置此参数
    zoomToAccuracy: true, // 定位成功后是否自动调整地图视野到定位点
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

/**
 * @description 根据对象数组中某个属性值进行排序（属性值必须是number）,默认降序
 * @param {Array} arr 需要排序的数组
 * @param {string} property 排序时依赖的字段名
 * @param {any} desc 是否降序
 * @return {any} 排序后的对象数组
 */
export function targetValSort(
  arr: Array<any>,
  property: string,
  desc = true
) {
  return arr.sort((a: any, b: any) => {
    const val1 = +a[property];
    const val2 = +b[property];
    return desc ? val2 - val1 : val1 - val2;
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
    defaultFillColor: '#f2f2f2', // 默认颜色
    ...(associatedDataConfig && { ...associatedDataConfig }), // 覆盖默认配置
  };
  let data = associatedData;
  const {
    needSort,
    sortFields,
    colors,
    matchingFields,
    dataTargetFields,
    defaultFillColor
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
          return colors[targetIndex] || defaultFillColor;
        }
        return defaultFillColor;
      },
      'stroke-width': 2, // 描边线宽
      ...styles,
    },
    ...options
  };
  return depth === 1 && !adcode
    ? new window.AMap.DistrictLayer.Country(params)
    : new window.AMap.DistrictLayer.Province(params);
}

/**
 * 通过高德地图获取到的城市名，特殊场景：直辖市、直辖县
 * @param data 通过高德获取到的当前地图中心点的省市区信息
 */
export function getAMapCityName(data: any) {
  const { city, province, district } = data || {};
  // 有城市名时
  if (city) return city;
  // 地图定位在重庆，重庆作为直辖市（相当于省级行政单位），分为重庆市（相当于市级行政单位）、重庆郊县（相当于市级行政单位），重庆郊县下的区级数据共通的规则是'xxx县'
  if (province.includes('重庆')) {
    // 如果当前district是重庆下的县时
    if (district && district.substring(district.length - 1) === '县') return CQ_SUBURB_NAME;
    return province;
  }
  // 直辖市时
  if (MUNICIPALITY_AND_SAR.find((item: any) => province.includes(item))) return province;
  // 省辖县（全国有15个）
  return district;
}


/**
 * 根据关键词输入的提示，使用该方法前需要先初始化高德SDK以及对应的插件['AMap.AutoComplete']
 * @param {String} keywords 输入的关键词
 * @param {Object} params 其他入参：https://lbs.amap.com/api/javascript-api-v2/documentation#autocomplete
 * @param {Boolean} isMock 是否是mock数据，因为该接口高德有日调用次数的限制
 * @return {Array} 对应的搜素数据
 */
export function keywordPrompt(
  keywords: string,
  params = {},
  isMock = false,
) {
  return new Promise((resolve, reject) => {
    if (!window.AMap) {
      return reject('请先初始化高德地图SDK！');
    } else if (!window.AMap.AutoComplete) {
      return reject('未引入AMap.AutoComplete插件！');
    }
    if (isMock) {
      resolve(searchResultMock);
      return;
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
