import { useMethods } from '@lhb/hook';
import { Col, Form, Row, Select, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { debounce } from '@lhb/func';
import V2AMap, { LngLat } from '../Map/V2AMap';

const { Option } = Select;

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

const FormMapAddress: React.FC<any> = ({
  label,
  name,
  form,
  defaultAddress,
  rules = [],
  formItemConfig = {},
  needLayout = true,
  onChange,
  placeholder = `请输入${label}`
}) => {
  const [mapIns, setMapIns] = useState<any>(null);
  const [options, setOptions] = useState<any[]>([]);
  const geocoder: any = useRef();
  const autocomplete: any = useRef();
  const centerMarkerRef: any = useRef();
  const [info, setInfo] = useState<any>({}); // 地址相关信息
  const [hasLoaded, setHasLoaded] = useState(false);

  const layout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 16
    }
  };

  useEffect(() => {
    if (defaultAddress && !hasLoaded && mapIns && autocomplete.current && defaultAddress.longitude && defaultAddress.latitude) {
      mapIns.setCenter([defaultAddress.longitude, defaultAddress.latitude]);
      autocompleteSearch(defaultAddress.address, true);
      setHasLoaded(true);
    }
  }, [defaultAddress, hasLoaded, mapIns, autocomplete.current]);

  useEffect(() => {
    if (mapIns) {
      mapIns.on('click', onClick); // 点击
      geocoder.current = new window.AMap.Geocoder({
        radius: 1000, // 以已知坐标为中心点，radius为半径，返回范围内兴趣点和道路信息
        extensions: 'all' // 返回地址描述以及附近兴趣点和道路信息，默认“base”
      });
      // 默认全国
      const autoOptions = { city: '全国' };
      autocomplete.current = new window.AMap.Autocomplete(autoOptions);
    }
    return () => { // 解除监听事件
      mapIns && mapIns.off('click', onClick);
    };
  }, [mapIns]);

  // 根据地址搜索获取地址列表并赋值
  const autocompleteSearch = (text, needMarker = false) => {
    autocomplete.current.search(text, function (_status: string, result: any) {
      const addressResult =
        (result.tips?.filter((item) => !!item.id) || []).map((item) => ({
          label: `${item.district}${item.address}`,
          value: item.id,
          name: item.name,
          option: item
        }));
      setOptions(addressResult);
      if (addressResult.length) {
        form.setFieldValue('address', addressResult[0].value);
        form.validateFields(['address']);
        if (needMarker) {
          setMapMarketer(addressResult[0].option.location);
        }
        onValueChange({ address: addressResult[0].label, longitude: addressResult[0].option.location.lng, latitude: addressResult[0].option.location.lat, poiName: addressResult[0].label, poiId: addressResult[0].value });
      }
    });
  };

  const { onClick, onValueChange, mapLoadedHandle, setMapMarketer } = useMethods({
    onValueChange(val: any) {
      onChange?.(val);
      setInfo({ ...info, ...val });
    },
    onClick(e) {
      setHasLoaded(true); // 触发点击时为已加载状态，需要标记
      setMapMarketer(e.lnglat);
      getLngLatAddress(geocoder.current, e.lnglat).then((text: any) => {
        autocompleteSearch(text);
      });
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

  const handleSearch = debounce((value) => {
    autocomplete.current.search(value, function (_status: string, result: any) {
      const addressResult =
        (result.tips?.filter((item) => !!item.id) || []).map((item) => ({
          label: `${item.district}${item.address}`,
          value: item.id,
          name: item.name,
          option: item
        }));
      setOptions(addressResult);
    });
  }, 500);

  const handleChange = (value, record) => {
    setHasLoaded(true); // 触发搜索选择时为已加载状态，需要标记
    // 查询成功时，result即为对应的POI详情
    const lng = record.option.location.lng;
    const lat = record.option.location.lat;
    // 设置地图中心点来触发地图平移
    setMapMarketer(record.option.location);
    getLngLatAddress(geocoder.current, record.option.location).then(() => {
      const poiName = record.option.name;
      const poiId = record.option.id;
      onValueChange({ address: record.label, longitude: lng, latitude: lat, poiName, poiId });
    });
  };

  return (
    <>
      <Form.Item {...(needLayout ? layout : {})} label={label} name={name} rules={rules} {...formItemConfig} style={{ marginBottom: '16px' }}>
        <Select
          showSearch
          onSearch={handleSearch}
          filterOption={false}
          onChange={(value, record: any) => handleChange(value, record.data)}
          placeholder={placeholder}
          allowClear
          getPopupContainer={(node) => node.parentNode}
          optionLabelProp='label'
        >
          {options.map((item) => (
            <Option key={item.value} value={item.value} label={item.label} data={item}>
              <Space direction='vertical'>
                <span>{item.name}</span>
                <span style={{ color: '#999' }}>{item.label}</span>
              </Space>
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Row>
        { needLayout && <Col span={6} />}
        <Col span={needLayout ? 16 : 24}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ height: '300px' }}>
              <V2AMap
                loaded={mapLoadedHandle}
                mapOpts={{
                  zoom: 15, // 级别
                }}
                plugins={[
                  'AMap.Geocoder',
                  'AMap.AutoComplete'
                ]}
              />
            </div>
            { info?.longitude && <div style={{ color: '#999', fontSize: '12px', lineHeight: 1, marginTop: '4px' }}>经度：{info.longitude} 纬度：{info.latitude}</div> }
          </div>
        </Col>
      </Row>
    </>
  );
};
export default FormMapAddress;
