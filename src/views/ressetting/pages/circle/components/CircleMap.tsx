import { useMethods } from '@lhb/hook';
import { Col, Form, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { CircleMapProps } from '../ts-config';
import { debounce } from '@lhb/func';
import { getLngLatAddress } from '@/common/utils/ways';
import V2AMap, { LngLat } from '@/common/components/Map/V2AMap';

const CircleMap: React.FC<CircleMapProps> = ({ value, onChange, setCenterVal, form, display }) => {
  const [mapIns, setMapIns] = useState<any>(null);
  const [options, setOptions] = useState<any[]>([]);
  const geocoder: any = useRef();
  const autocomplete: any = useRef();
  const circleRef: any = useRef();
  const circleEditorRef: any = useRef(); // 地图圆形编辑器
  // const [address, setAddress] = useState<string>();


  const { onClick, onAdjust, onValueChange, onMove, mapLoadedHandle, setMapCircle } = useMethods({
    onValueChange(val) {
      onChange?.(val);
    },
    onClick(e) {
      setMapCircle(e.lnglat);
      // 默认半径300
      form.setFieldsValue({ radius: circleRef.current.getRadius() || 300 });
      onValueChange({ ...value, longitude: e.lnglat.lng, latitude: e.lnglat.lat });
    },
    onAdjust(e) {
      circleRef.current.setRadius(e.radius);
      onValueChange({ ...value });
      form.setFieldsValue({ radius: e.radius });
    },
    onMove(e) {
      onValueChange({ ...value, longitude: e.lnglat.lng, latitude: e.lnglat.lat });
    },
    mapLoadedHandle(map,) {
      setMapIns(map);

    },
    setMapCircle(lnglat:LngLat) {
      if (!mapIns) return;
      // 需要先关闭编辑器，不然地图上会留下编辑点
      circleEditorRef.current?.close();
      mapIns.clearMap();
      mapIns.setCenter(lnglat);
      circleRef.current = new window.AMap.Circle({
        center: lnglat,
        radius: form.getFieldValue('radius') || 300, // 半径
        strokeStyle: 'dashed',
        strokeColor: 'DarkBlue',
        fillOpacity: 0,
      });

      circleEditorRef.current = new window.AMap.CircleEditor(mapIns, circleRef.current);
      circleEditorRef.current.on('adjust', onAdjust);
      circleEditorRef.current.on('move', onMove);

      // 将以上覆盖物添加到地图上
      mapIns.add(circleRef.current);

      mapIns.setFitView(circleRef.current);
      circleEditorRef.current.open();
    },
  });

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

  useEffect(() => {
    if (value && mapIns) {
      setMapCircle([value?.longitude, value?.latitude]);
    }

    // eslint-disable-next-line
  }, [value]);



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
    setMapCircle(record.option.location);
    getLngLatAddress(geocoder.current, record.option.location).then((newResult: any) => {

      setCenterVal?.(newResult);
      // 默认半径300
      form.setFieldsValue({ radius: circleRef.current.getRadius() || 300 });
      onValueChange({ address: newResult, longitude: lng, latitude: lat });

    });
  };

  return (
    <>
      <Col span={12} style={{ display: display }}>
        <Form.Item label='搜索位置'>
          <Select
            showSearch
            onSearch={handleSearch}
            filterOption={false}
            onChange={handleChange}
            placeholder='搜索位置'
            allowClear
            options={options}
          />
        </Form.Item>
      </Col>
      {/* <Col span={12}>
          <Form.Item label='商圈半径'>
            <InputNumber value={ circleRef.current?.getRadius()} name='radius' addonAfter='m' />
          </Form.Item>
        </Col> */}
      <Col span={24} style={{ display: display }}>
        <Form.Item label='商圈定位'>
          <div style={{ width: '600px', height: '300px' }}>
            <V2AMap loaded={mapLoadedHandle} mapOpts={{
              zoom: 15, // 级别
            }}
            plugins={[
              'AMap.Geocoder',
              'AMap.AutoComplete',
              'AMap.CircleEditor',
            ]}
            />
          </div>
        </Form.Item>
      </Col>
    </>
  );
};
export default CircleMap;
