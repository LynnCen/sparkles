/**
 * @Description 地址组件
 */

import { FC, useEffect, useRef, useState } from 'react';
import { Row, Col, Spin } from 'antd';
import { useMethods } from '@lhb/hook';
import { getCurPosition, keywordPrompt, getLngLatAddress } from '@/common/utils/map';
import { debounce, isArray } from '@lhb/func';
import { parseValueCatch } from '../config';
// import cs from 'classnames';
import styles from '../index.module.less';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import AMap from '@/common/components/AMap/index';

export interface AddressChangeParams {
  isInitChange?: boolean; // true编辑表单回显时，false手动变更地址
  lng: any;
  lat: any;
  cityName: any;
  poiId: any;
  name: any;
  identification: any
};

const Address: FC<any> = ({
  formItemData,
  form,
  disabled,
  required,
  addressChange, // 详细地址的特殊赋值逻辑
}) => {
  const centerMarkerRef: any = useRef();
  const [amapIns, setAmapIns] = useState<any>(null); // 地图实例
  const [options, setOptions] = useState<any[]>([]); // poi结果
  const [cityInfo, setCityInfo] = useState<any>({}); // 高德返回的当前城市信息
  const [fetching, setFetching] = useState(false); // 是否在搜索中

  useEffect(() => {
    // 处理切换tab时因组件的重新渲染导致的options清空的情况
    if (isArray(options) && options.length) return;
    const curVal = parseValueCatch(formItemData);
    if (!curVal) return;
    form.setFieldValue(formItemData.identification, curVal?.poiName || curVal?.address || '');

    const params: AddressChangeParams = {
      isInitChange: true, // 编辑表单回显时特殊处理的标记，区分手动变更地址的情况
      lng: curVal.longitude,
      lat: curVal.latitude,
      cityName: curVal.cityName,
      poiId: curVal.poiId,
      name: curVal.address,
      identification: formItemData.identification
    };
    addressChange && addressChange(params);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formItemData, options]);

  useEffect(() => {
    if (!amapIns) return;
    amapIns.on('click', setCenter);
    return () => {
      amapIns.off('click', setCenter);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amapIns]);

  const {
    loadedMapHandle,
    searchHandle,
    addCenterMarker,
    changeHandle,
    setCenter
  } = useMethods({
    // 地图加载完毕
    loadedMapHandle(mapIns: any) {
      if (!mapIns) return;
      setAmapIns(mapIns);
      const { textValue } = formItemData;
      if (textValue) {
        try {
          const info = parseValueCatch(formItemData);
          const { longitude, latitude } = info;
          if (!(longitude && latitude)) return;
          setCityInfo({
            ...info,
            city: info.cityName
          });
          addCenterMarker(longitude, latitude);
          return;
        } catch (error) {
          console.log(`地址组件的地图回显出错`, error);
        }
      }
      // 浏览器定位
      getCurPosition(mapIns, {
        // https://lbs.amap.com/api/javascript-api-v2/documentation#geolocation
        // 是否显示定位按钮
        showButton: false,
        showCircle: false,
        showMarker: false
      }).then((res: any) => {
        setCityInfo(res);
        const { position } = res;
        if (!(isArray(position))) return;
        addCenterMarker(position[0], position[1]);
      });
    },
    // 添加详细地址的marker
    addCenterMarker(lng, lat) {
      // 更新位置
      if (centerMarkerRef.current) {
        centerMarkerRef.current.setPosition([lng, lat]);
        amapIns.setFitView(centerMarkerRef.current);
        return;
      }
      const customIcon = new window.AMap.Icon({
        // 图标尺寸
        size: new window.AMap.Size(41, 48.5),
        // 图标的取图地址
        image: `https://staticres.linhuiba.com/project-custom/store-assistant-h5/shop_location@2x.png`,
        // 图标所用图片大小
        imageSize: new window.AMap.Size(41, 48.5),
        // 图标取图偏移量
        // imageOffset: new AMap.Pixel(0, 10)
      });

      const marker = new window.AMap.Marker({
        position: new window.AMap.LngLat(lng, lat),
        // 将一张图片的地址设置为 icon
        icon: customIcon,
        // 设置了 icon 以后，设置 icon 的偏移量，以 icon 的 [center bottom] 为原点
        offset: new window.AMap.Pixel(-41 / 2, -48.5),
      });
      amapIns.add(marker);
      amapIns.setFitView(marker);
      centerMarkerRef.current = marker;
    },
    // 关键词搜索
    searchHandle: debounce((keyword: string) => {
      // 地图没加载完成时，不搜索
      if (!amapIns) return;
      setOptions([]);
      setFetching(true);

      keywordPrompt(keyword, {
        city: '全国'
      }).then((pois) => {
        setFetching(false);
        if (isArray(pois)) {
          setOptions(pois);
          return;
        }
      }).finally(() => {
        setFetching(false);
      });
    }, 700),
    // 选择搜索的地址
    async changeHandle(id: string, option: any) {
      // clear时option是null
      if (!option) return;
      // console.log(`选择的地址：`, option);
      const { location, id: poiId, name } = option;
      const { lng, lat } = location || {};
      if (lng && lat) addCenterMarker(lng, lat);
      const params: AddressChangeParams = {
        lng,
        lat,
        cityName: cityInfo?.city,
        poiId,
        name,
        identification: formItemData.identification
      };
      addressChange && addressChange(params);
    },
    // 点击地图设置中心点
    async setCenter(e: any) {
      if (disabled) return;

      // console.log(`eee`, e);
      const { lnglat } = e;
      const { lng, lat } = lnglat;
      amapIns.setCenter(lnglat);
      if (!(lng && lat)) return;
      addCenterMarker(lng, lat);
      // 将点击的位置解析出具体位置
      const res: any = await getLngLatAddress(lnglat, '', false);
      if (!res) return;
      const { formattedAddress, addressComponent } = res;
      const { city: cityName, adcode } = addressComponent || {};
      // 手动构造options
      setOptions([{
        id: adcode,
        name: formattedAddress
      }]);
      form.setFieldValue(formItemData.identification, formattedAddress || '');
      const params: AddressChangeParams = {
        lng,
        lat,
        cityName,
        poiId: null,
        name: formattedAddress,
        identification: formItemData.identification
      };
      (!disabled && addressChange) && addressChange(params);
    }
  });

  return (
    <>
      <Row gutter={24}>
        <Col span={24}>
          <V2FormSelect
            required={required}
            label={formItemData.anotherName || formItemData.name}
            name={formItemData.identification}
            disabled={disabled}
            options={options}
            config={{
              showSearch: true,
              filterOption: false,
              fieldNames: {
                label: 'name',
                value: 'id'
              },
              notFoundContent: fetching ? <Spin size='small' /> : null,
              onSearch: searchHandle,
              onChange: changeHandle
            }}
          />
        </Col>
      </Row>
      <div className={styles.mapCon}>
        <AMap
          loaded={loadedMapHandle}
          plugins={[
            'AMap.Geocoder',
            // 'AMap.PlaceSearch',
            'AMap.AutoComplete',
          ]}
        />
      </div>
    </>
  );
};

export default Address;
