import { useMethods } from '@lhb/hook';
import { Form, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { debounce } from '@lhb/func';
import TextArea from 'antd/lib/input/TextArea';
import V2AMap, { LngLat } from '../Map/V2AMap';
// / 逆地理编码(经纬度转换成具体地址)
/**
 * @param {Array} lnglat 经纬度
 * @param {String} cityName 城市名
 * @param {Boolean} onlyAddress 是否仅返回具体地址
 */
export function getLngLatAddress(geocoder, lnglat, onlyAddress = true) {
  return new Promise((resolve, reject) => {
    geocoder.getAddress(lnglat, (status, result) => {
      if (status === 'complete' && result.regeocode) {
        const { regeocode } = result;
        if (onlyAddress) {
          const { formattedAddress } = regeocode || {};
          resolve(formattedAddress);
        } else {
          resolve(regeocode);
        }
      } else {
        reject(new Error(`根据经纬度查询地址失败`));
      }
    });
  });
}

const defaultLayout = {
  labelCol: { span: 4 }, wrapperCol: { span: 20 }
};

const DynamicAddress: React.FC<any> = ({ value, onChange, label = '详细地址', selectLabel, selectRules, layout = defaultLayout, ...reseProps }) => {
  const [mapIns, setMapIns] = useState<any>(null);

  const [address, setAddress] = useState<string>();
  const [options, setOptions] = useState<any[]>([]);
  const geocoder: any = useRef();
  const autocomplete: any = useRef();
  const centerMarkerRef: any = useRef();

  const { onClick, onValueChange, onInputChange, mapLoadedHandle, setMapMarketer } = useMethods({
    onValueChange(val: any) {
      // (!val.address && !val.longitude && !val.latitude) && (val = undefined);
      onChange?.(val);
    },
    onClick(e) {
      setMapMarketer(e.lnglat);

      getLngLatAddress(geocoder.current, e.lnglat).then((result: any) => {
        setAddress(result);
        onValueChange({ address: result, longitude: e.lnglat.lng, latitude: e.lnglat.lat });
      });
    },
    onInputChange(e) {
      setAddress(e.target.value);
      onValueChange({ ...value, address: e.target.value });
    },
    mapLoadedHandle(map,) {
      setMapIns(map);

      // 构造点标记
      centerMarkerRef.current = new window.AMap.Marker();
    },
    setMapMarketer(lnglat:LngLat) {
      if (!mapIns || !centerMarkerRef.current) return;
      mapIns.setCenter(lnglat);
      centerMarkerRef.current.setPosition(lnglat);
      // 将以上覆盖物添加到地图上
      mapIns.add(centerMarkerRef.current);

      mapIns.setFitView(centerMarkerRef.current);
    },
  });

  useEffect(() => {
    if (value && value.longitude && value?.latitude) {
      mapIns.setCenter([value.longitude, value.latitude]);
    }
    if (value && value.address) {
      setAddress(value?.address);
    }

    // eslint-disable-next-line
  }, [value]);

  useEffect(() => {
    if (mapIns) {
      mapIns.on('click', onClick); // 点击
      geocoder.current = new window.AMap.Geocoder(); // 用于地址描述与经纬度坐标之间的转换
      // 默认全国
      const autoOptions = { city: '全国' };
      autocomplete.current = new window.AMap.Autocomplete(autoOptions);
    }
    return () => { // 解除监听事件
      mapIns && mapIns.off('click', onClick);
    };
  }, [mapIns]);

  const handleSearch = debounce((value) => {
    autocomplete.current.search(value, function (_status: string, result: any) {
      const addressResult =
        result?.tips?.map((item) => ({
          label: `${item.district}${item.name}`,
          value: item.id,
          option: item
        })) || [];
      setOptions(addressResult);
    });
  }, 500);

  const handleChange = (value, record) => {

    // 查询成功时，result即为对应的POI详情
    const lng = record.option.location.lng;
    const lat = record.option.location.lat;

    // 设置地图中心点来触发地图平移
    setMapMarketer(record.option.location);
    getLngLatAddress(geocoder.current, record.option.location).then((newResult: any) => {
      setAddress(newResult);
      const poiName = record.option.name;
      const poiId = record.option.id;
      onValueChange({ address: newResult, longitude: lng, latitude: lat, poiName, poiId });

    });
  };

  return (
    <>
      <Form.Item {...layout} label={ selectLabel || '高德项目'} name='search' rules={selectRules}>
        <Select
          showSearch
          onSearch={handleSearch}
          filterOption={false}
          onChange={handleChange}
          placeholder='请输入搜索位置'
          allowClear
          options={options}
        />
      </Form.Item>
      <Form.Item {...layout} label={label} {...reseProps}>
        <TextArea value={address} placeholder={`请输入${label}`} onChange={onInputChange} />
      </Form.Item>
      <Form.Item {...layout} label={<></>} colon={false}>
        <div style={{ width: '100%', height: '300px', marginTop: '10px' }}>
          <V2AMap loaded={mapLoadedHandle} mapOpts={{
            zoom: 15, // 级别
          }}
          plugins={[
            'AMap.Geocoder',
            'AMap.AutoComplete'
          ]}
          />
        </div>
      </Form.Item>
    </>
  );
};
export default DynamicAddress;
