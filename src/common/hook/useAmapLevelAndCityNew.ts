/**
 * @Description 监听地图缩放/移动时，获取当前地图中心点的城市信息和当前地图Markers显示的缩放级别（自定义的缩放级别，比如显示全国省份的级别、省份下所有地级市的级别等）
 */
import { debounce } from '@lhb/func';
import {
  useState,
  useEffect,
  useMemo,
  useRef
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeProvinceCityDistrict } from '@/store/common';
// import { fetchCityIdByName } from '@/common/api/selection';
import {
  COUNTRY_LEVEL,
  PROVINCE_ZOOM,
  CITY_ZOOM,
  PROVINCE_LEVEL,
  DISTRICT_ZOOM,
  CITY_LEVEL,
  DISTRICT_LEVEL,
  City,
  // CQ_SUBURB_NAME,
  getAMapCityName
} from '@/common/components/AMap/ts-config';
// import { MUNICIPALITY_AND_SAR } from '@/common/utils/map';
// import { getStorage, removeStorage } from '@lhb/cache';
import { areaList } from '../api/common';

/**
 * @description 返回当前地图中心点的城市信息和地图显示Markers的缩放级别hooks
 * @param {Object} amapIns 地图实例
 * @param {Boolean} isInit 是否需要在地图初始化完成的时候执行一次（默认初始化地图时不会触发地图的zoomend/moveend等事件）
 * @param {Boolean} districtGranularity 是否监听区级别的变化
 * @return {Object} { city, level } 城市和显示Markers缩放级别
 */
export function useAmapLevelAndCityNew(
  amapIns,
  isInit = false,
  districtGranularity = false
) {
  const [level, setLevel] = useState<number>(COUNTRY_LEVEL); // 当前显示Markers的缩放级别
  const levelRef: any = useRef(level);
  const [city, setCity] = useState<City | null>(); // 当前城市信息
  const cityRef: any = useRef(); // 存储最新的城市信息
  // const [] = useState<number>();
  const nameRef: any = useRef();
  const cityForAMap = useSelector((state: any) => state.common.cityForAMap);
  const dispatch = useDispatch();


  useEffect(() => {
    const getAreaList = async () => {
      const cityResult = await areaList({ type: 1 });
      dispatch(changeProvinceCityDistrict(cityResult));
    };
    // 如果不存在则进行请求
    if (!cityForAMap.length) {
      getAreaList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!amapIns) return;
    if (!cityForAMap?.length) return;
    // 监听地图缩放
    amapIns.on('zoomend', zoomChange);
    // 监听地图移动结束
    amapIns.on('moveend', centerChange);
    // 需要主动触发对应的方法来获取缩放级别和地图中心点城市
    if (isInit) {
      zoomChange();
      centerChange();
    }

    return () => { // 解除监听事件
      amapIns && amapIns.off('zoomend', zoomChange);
      amapIns && amapIns.off('moveend', centerChange);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amapIns, cityForAMap]);
  useEffect(() => {
    if (!city) return;
    cityRef.current = city;
  }, [city]);

  // 地图缩放事件
  const zoomChange = debounce(() => {
    const curZoom = amapIns.getZoom(); // 获取当前缩放级别
    let curLevel = 0;
    // 定义地图的缩放级别在不同范围时映射到自定义的显示Markers级别
    if (curZoom < PROVINCE_ZOOM) {
      curLevel = COUNTRY_LEVEL;
    } else if (curZoom < CITY_ZOOM) {
      curLevel = PROVINCE_LEVEL;
    } else if (curZoom < DISTRICT_ZOOM) {
      curLevel = CITY_LEVEL;
    } else {
      curLevel = DISTRICT_LEVEL;
    };
    if (curLevel !== levelRef.current) {
      setLevel(curLevel);
      levelRef.current = curLevel;
    }
  }, 150);
  // 地图移动结束
  const centerChange = debounce(() => {
    amapIns.getCity((curInfo: any) => {
      // 城市没有变化时
      if (curInfo?.citycode === cityRef.current?.citycode) {
        // 不监听区的变化
        if (!districtGranularity) return;
        // 区没有变化时
        if (curInfo?.district === cityRef.current?.district) return;
      };
      /**
       * 直辖市、特别行政区、台湾省或者某些县级市没有city值，例如:
       * { // 直辖市
          city:  "",
          citycode: "021",
          district: "崇明区",
          province: "上海市"
        }
        { // 县级市
          city: ""
          citycode: "1391"
          district:"济源市"
          province:"河南省”
        }
        { // 特别行政区
          city: "",
          citycode: "1853",
          district: "花王堂区",
          province: "澳门特别行政区"
        }
        {
          city: "",
          citycode: "1886",
          district: "",
          province: "台湾省"
        }
       */
      const name = getAMapCityName(curInfo);
      // if (isTargetCQ) {
      //   name = CQ_SUBURB_NAME;
      //   removeStorage('CQ_SUBURB_NAME');
      // }
      if (!name) {
        // 移出中华人民共和国领土范围时
        setCity(null);
        return;
      };
      // name没有变化时不重复请求接口
      if (nameRef.current === name && !districtGranularity) return;
      nameRef.current = name;
      const target = cityForAMap.find(item => item.name.indexOf(name) > -1);
      if (target) {
        setCity({
          ...curInfo,
          name: target.name,
          id: target.id,
          provinceId: target.provinceId,
          districtList: target.district
        });
      }

      // fetchCityIdByName({ name }).then((cityRes) => {
      //   const { id } = cityRes || {};
      //   // 台湾省无数据返回，暂时不做处理
      //   if (!id) return;
      //   setCity({ ...curInfo, ...cityRes });
      // });
    });
  }, 150);
  /**
   * @description 获取高德api返回的城市数据中的城市名
   * @param {Object} amapCityInfo 高德api返回的城市数据
   * @return {String} 城市名
   */
  // const getName = (amapCityInfo: any) => {
  //   // province 会有是数组的情况，地图中心点不在中国的时候
  //   const { province, district } = amapCityInfo;
  //   // 地图定位在重庆
  //   if (province.includes('重庆')) {
  //     // 如果当前district是县
  //     if (district.includes('县')) return CQ_SUBURB_NAME;
  //     return province;
  //   }
  //   if (MUNICIPALITY_AND_SAR.find((item: any) => province.includes(item))) return province;
  //   return district || (isArray(province) ? '' : province);
  // };

  return useMemo(() => ({
    // if (districtGranularity) {
    //   const { district, districtList, name: cityName } = city || {};
    //   const targetDistrict = districtList?.find((item: any) => item.name === (district || cityName));
    //   const { id, name } = targetDistrict || {};
    //   return {
    //     level,
    //     city,
    //     district: {
    //       id,
    //       name
    //     }
    //   };
    // }
    // return { level, city };
    level,
    city,
    district: city?.districtList?.find((item: any) => item.name === city?.district)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [level, city?.id, districtGranularity ? city?.district : null]);

}
