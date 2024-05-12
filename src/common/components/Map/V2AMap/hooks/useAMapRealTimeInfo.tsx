/**
 * @Description 地图中心点变化时，获取当前定义的缩放级别和当前地图中心点的城市信息
 */
import { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import {
  COUNTRY_LEVEL,
  PROVINCE_LEVEL,
  CITY_LEVEL,
  PROVINCE_ZOOM,
  CITY_ZOOM,
  DISTRICT_ZOOM,
  DISTRICT_LEVEL,
  getAMapCityName
} from '../utils/amap';
import { changeProvinceCityDistrict, areaList } from '../../../config-v2';

const debounceDelay = 200;
/**
 * @param {Object} mapIns 地图实例
 * @param {Boolean} isInit 是否需要在地图初始化完成的时候执行一次（默认初始化地图时不会触发地图的zoomend/moveend等事件）
 * @param {Boolean} districtGranularity 是否监听区的变化
 * @return {Object} { city, level } 城市和显示Markers缩放级别
 */
export default function useAMapRealTimeInfo(
  mapIns,
  isInit = false,
  districtGranularity = false,
) {
  const [level, setLevel] = useState<number>(COUNTRY_LEVEL); // 定义全国、省、市、区
  const [city, setCity] = useState<any>(); // 当前城市信息
  const levelRef: any = useRef(level);
  const cityRef: any = useRef(); // 存储最新的城市信息
  const nameRef: any = useRef();
  const cityForAMap = useSelector((state: any) => state.common.cityForAMap);
  const dispatch = useDispatch();

  const methods = useMethods(({
    // 获取当前地图level
    getLevel() {
      const curZoom = mapIns.getZoom(); // 获取当前缩放级别
      if (curZoom < PROVINCE_ZOOM) {
        return COUNTRY_LEVEL;
      } else if (curZoom < CITY_ZOOM) {
        return PROVINCE_LEVEL;
      } else if (curZoom < DISTRICT_ZOOM) {
        return CITY_LEVEL;
      }
      return DISTRICT_LEVEL;
    },
    // 地图缩放事件
    zoomChange: debounce(() => {
      const curLevel = methods.getLevel();
      if (curLevel !== levelRef.current) {
        setLevel(curLevel);
        levelRef.current = curLevel;
      }
    }, debounceDelay),
    // 地图移动结束
    centerChange: debounce(() => {
      mapIns.getCity((curInfo: any) => {
        // 城市没有变化且，1、不监听区，2、监听区，但区没有变化
        if (curInfo?.citycode === cityRef.current?.citycode && (!districtGranularity || curInfo?.district === cityRef.current?.district)) return;
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
        // const name = methods.getName(curInfo);
        const name = getAMapCityName(curInfo);
        if (name) {
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
          return;
        }
        // 移出中华人民共和国领土范围时
        setCity(null);
      });
    }, debounceDelay),
  }));

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
    if (mapIns && cityForAMap?.length) {
      // 监听地图缩放和移动结束
      mapIns.on('zoomend', methods.zoomChange);
      mapIns.on('moveend', methods.centerChange);
      if (isInit) {
        methods.zoomChange();
        methods.centerChange();
      }
    }
    return () => { // 解除监听事件
      if (mapIns) {
        mapIns.off('zoomend', methods.zoomChange);
        mapIns.off('moveend', methods.centerChange);
      };
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapIns, cityForAMap]);

  useEffect(() => {
    city && (cityRef.current = city);
  }, [city]);

  return useMemo(() => ({
    level,
    city,
    district: city?.districtList?.find((item: any) => item.name === city?.district)
  }), [level, city?.id, districtGranularity ? city?.district : null]);
}
