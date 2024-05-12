import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMethods } from '@lhb/hook';
import { isArray, isDef } from '@lhb/func';
import { getLngLatAddress, getCurPosition, getAMapCityName } from '../utils/amap';
import { changeProvinceCityDistrict, areaList } from '../../../config-v2';

/**
 * 获取用户定位信息，默认返回省市区的id和name
 * @param mapIns 地图实例
 * @param config 自定义配置
 * @param hasAddress 是否需要定位的地址
 */
export default function useCurLocation(
  mapIns,
  config = {},
  hasAddress = false, // 是否需要返回具体的位置信息
) {
  const [locationInfo, setLocationInfo] = useState<any>({}); // 用户当前位置信息
  const cityForAMap = useSelector((state: any) => state.common.cityForAMap);
  const dispatch = useDispatch();

  const methods = useMethods({
    async getLocation() {
      try {
        const info: any = await getCurPosition(mapIns, {
          // https://lbs.amap.com/api/javascript-api-v2/documentation#geolocation
          // 是否显示定位按钮
          showButton: false,
          showCircle: true,
          showMarker: false,
          ...config,
        });
        // 拿到用户所在的省市信息和定位
        if (isDef(info?.accuracy)) { // 能够获取到地理定位
          methods.withLocationSuccess(info);
        } else { // 无法获取到地理定位，就使用ip定位
          methods.withIpSuccess(info);
        }
      } catch (error) {
        console.log(`获取用户定位失败：`, error);
      }
    },
    // 此时location_type的值为'html5'
    withLocationSuccess(info) { // 地理定位，一般是开了vpn或者精准定位的用户
      const res: any = {};
      const { addressComponent, position, formattedAddress } = info || {};
      const { province, district } = addressComponent;
      // 此时高德是会返回省、市、区的字段
      const name = getAMapCityName(addressComponent);
      if (hasAddress) {
        res.address = formattedAddress;
      }
      if (position) {
        res.lng = position.lng;
        res.lat = position.lat;
      }
      const cityInfo = cityForAMap.find(item => item.name.indexOf(name) > -1);
      const { district: districtList, id: cityId, provinceId, name: cityName } = cityInfo || {};
      res.provinceId = provinceId;
      res.provinceName = province;
      res.cityId = cityId;
      res.cityName = cityName;
      const targetDistrict = districtList?.find((districtItem: any) => districtItem?.name?.includes(district));
      if (targetDistrict) {
        const { id: districtId, name: districtName } = targetDistrict;
        res.districtId = districtId;
        res.districtName = districtName;
        setLocationInfo(res);
        return;
      }
      setLocationInfo(res);
    },
    // 此时location_type的值为'ipcity'
    async withIpSuccess(info) { // ip定位，法获取到地理定位时，就会默认使用此定位。
      const res: any = {};
      const { city, province, position } = info || {};
      const name = city || province; // 直辖市没有city名
      if (isArray(position) && position.length) { // 需要地址信息
        if (hasAddress) {
          const address = await getLngLatAddress(position);
          address && (res.address = address);
        }
        +(position[0]) && (res.lng = +position[0]);
        +(position[1]) && (res.lat = +position[1]);
      }
      // 拿到区的信息（是因为getCurPosition中的zoomToAccuracy这个参数）
      mapIns.getCity(async (curInfo: any) => {
        const { district } = curInfo; // 拿到当前所在的区
        const cityInfo = cityForAMap.find(item => item.name.indexOf(name) > -1);
        // fetchCityIdByName({ name }); // 通过城市查找该城市下所有的区
        const { district: districtList, id: cityId, provinceId, name: cityName } = cityInfo || {};
        res.provinceId = provinceId;
        res.provinceName = province;
        res.cityId = cityId;
        res.cityName = cityName;
        // 匹配到对应的区信息
        const targetDistrict = districtList?.find((districtItem: any) => districtItem?.name?.includes(district));
        if (targetDistrict) {
          const { id: districtId, name: districtName } = targetDistrict;
          res.districtId = districtId;
          res.districtName = districtName;
          setLocationInfo(res);
          return;
        }
        setLocationInfo(res);
      });
    },
  });

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
    if (!mapIns || !cityForAMap?.length) return;
    methods.getLocation();
  }, [mapIns, cityForAMap]);

  return locationInfo;
}
