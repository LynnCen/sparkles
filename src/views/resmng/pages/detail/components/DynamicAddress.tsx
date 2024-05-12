import { useMethods } from '@lhb/hook';
import { getLngLatAddress } from '@/common/utils/ways';
import { Form, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { debounce } from '@lhb/func';
import V2AMap, { LngLat } from '@/common/components/Map/V2AMap';

const DynamicAddress: React.FC<any> = ({ value, onChange, label, selectRules }) => {
  const [mapIns, setMapIns] = useState<any>(null);
  const [address, setAddress] = useState<string>();
  const [options, setOptions] = useState<any[]>([]);
  const [selectValue, setSelectValue] = useState<any>();
  const geocoder: any = useRef();
  const autocomplete: any = useRef();
  const centerMarkerRef: any = useRef();


  const { onClick, onValueChange, mapLoadedHandle, setMapMarketer } = useMethods({
    onValueChange(val: any) {
      // (!val.address && !val.longitude && !val.latitude) && (val = undefined);
      onChange?.(val);
    },
    onClick(e) {
      setMapMarketer(e.lnglat);

      getLngLatAddress(geocoder.current, e.lnglat, false).then((result: any) => {
        const { formattedAddress, addressComponent, pois } = result || {};
        const { district, streetNumber, street } = addressComponent || {};
        // 如果街道和街道号存在就取
        if (streetNumber && street) {
          setAddress(`${district}${street}${streetNumber}`);
          onValueChange({
            address: `${district}${street}${streetNumber}`,
            longitude: e.lnglat.lng,
            latitude: e.lnglat.lat,
            poiName: formattedAddress,
            poiId: pois?.[0].id,
          });
        }

        const lastIndex = formattedAddress.lastIndexOf('市');
        if (lastIndex > -1) {
          setAddress(formattedAddress.slice(lastIndex + 1));
          onValueChange({
            address: formattedAddress.slice(lastIndex + 1),
            longitude: e.lnglat.lng,
            latitude: e.lnglat.lat,
            poiName: formattedAddress,
            poiId: pois?.[0].id,
          });
        }
      });
    },
    onInputChange(e) {
      setAddress(e.target.value);
      onValueChange({ ...value, address: e.target.value, adcode: selectValue });
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
    const { latitude, longitude, address, poiName, poiId } = value || {};
    if (longitude && latitude && mapIns) {
      setMapMarketer([longitude, latitude]);
    };

    if (address) {
      setAddress(address);
    };

    if (poiName && poiId) {
      setSelectValue(poiId);
      setOptions([{ label: poiName, value: poiId }]);
    }

    // eslint-disable-next-line
  }, [value,mapIns]);

  useEffect(() => {
    if (mapIns) {
      mapIns.on('click', onClick); // 点击
      geocoder.current = new window.AMap.Geocoder({
        radius: 1000, // 以已知坐标为中心点，radius为半径，返回范围内兴趣点和道路信息
        extensions: 'all' // 返回地址描述以及附近兴趣点和道路信息，默认“base”
      }); // 用于地址描述与经纬度坐标之间的转换
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
          adcode: item.adcode,
          location: item?.location
        })) || [];
      setOptions(addressResult);
    });
  }, 500);

  const handleChange = (_, option) => {
    if (!option) {
      setAddress(undefined);
      return;
    }
    const { label, value, location } = option;
    setSelectValue(value);
    if (location) { // 如果有经纬度，用经纬度逆向地理编码获取地理是最准的
      const { lat, lng } = location;
      setMapMarketer(location);

      getLngLatAddress(geocoder.current, location, false).then((result: any) => {
        const { formattedAddress, addressComponent } = result || {};
        const { district, streetNumber, street } = addressComponent || {};
        // 如果街道和街道号存在就取
        if (streetNumber && street) {
          setAddress(`${district}${street}${streetNumber}`);
          onValueChange({
            address: `${district}${street}${streetNumber}`,
            longitude: lng,
            latitude: lat,
            poiName: label,
            poiId: value,
          });
          return;
        }

        const lastIndex = formattedAddress.lastIndexOf('市');
        if (lastIndex > -1) {
          setAddress(formattedAddress.slice(lastIndex + 1));
          onValueChange({
            address: formattedAddress.slice(lastIndex + 1),
            longitude: lng,
            latitude: lat,
            poiName: label,
            poiId: value,
          });
          return;
        }
      });
    } else { // 如果没有经纬度，用地理名正向地理编码查一遍后再用经纬度去查位置
      geocoder.current.getLocation(label, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          // result中对应详细地理坐标信息
          const { geocodes = [] } = result;
          const { location = {}, } = geocodes[0] || {};
          const { lat, lng } = location;

          setMapMarketer(location);

          getLngLatAddress(geocoder.current, location, false).then((result: any) => {
            const { formattedAddress, addressComponent } = result || {};
            const { district, streetNumber, street } = addressComponent || {};
            // 如果街道和街道号存在就取
            if (streetNumber && street) {
              setAddress(`${district}${street}${streetNumber}`);
              onValueChange({
                address: `${district}${street}${streetNumber}`,
                longitude: lng,
                latitude: lat,
                poiName: label,
                poiId: value,
              });
              return;
            }

            const lastIndex = formattedAddress.lastIndexOf('市');
            if (lastIndex > -1) {
              setAddress(formattedAddress.slice(lastIndex + 1));
              onValueChange({
                address: formattedAddress.slice(lastIndex + 1),
                longitude: lng,
                latitude: lat,
                poiName: label,
                poiId: value,
              });
              return;
            }
          });

        }
      });
    }
  };

  const onClear = () => {
    setSelectValue(undefined);
    setAddress(undefined);
    onChange?.({
      address: undefined,
      poiName: undefined
    });
  };

  return (
    <>
      <Form.Item rules={selectRules} style={{ marginBottom: 12 }}>
        <Select
          showSearch
          onSearch={handleSearch}
          onClear={onClear}
          filterOption={false}
          value={selectValue}
          onChange={handleChange}
          placeholder='搜索位置'
          style={{ width: '400px' }}
          allowClear
          labelInValue={true}
          options={options}
        />
      </Form.Item>
      <Form.Item label={label}colon={false} style={{ marginBottom: 12 }}>
        {address}
      </Form.Item>
      <Form.Item help={<span>经度：{mapIns?.getCenter().lng} 纬度：{mapIns?.getCenter().lat}</span>}>
        <div style={{ width: '600px', height: '300px', marginTop: '10px' }}>
          <V2AMap loaded={mapLoadedHandle} mapOpts={{
            zoom: 15, // 级别
          }}
          plugins={[
            'AMap.Geocoder',
            'AMap.AutoComplete',
          ]}
          />
        </div>
      </Form.Item>
    </>
  );
};
export default DynamicAddress;
