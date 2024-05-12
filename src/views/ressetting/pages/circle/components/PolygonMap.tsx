import { useMethods } from '@lhb/hook';
import { Col, Form, Row, Select } from 'antd';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { debounce } from '@lhb/func';
import { getLngLatAddress } from '@/common/utils/ways';
import V2AMap, { LngLat } from '@/common/components/Map/V2AMap';

interface PolygonMapProps {
  value?: PolygonMapValue;
  onChange?: (value: PolygonMapValue) => void;
  display: string;
  setCenterVal?: Function
  anotherName?: ReactNode
}

interface PolygonMapValue {
  path: any;
}

const PolygonMap: React.FC<PolygonMapProps> = ({ value, onChange, display, setCenterVal, anotherName }) => {
  const [mapIns, setMapIns] = useState<any>(null);
  const [markers, setMarkers] = useState<any>([]);
  const [options, setOptions] = useState<any[]>([]);
  const geocoder: any = useRef();
  const autocomplete: any = useRef();
  const polygonRef: any = useRef();
  const polygonEditorRef: any = useRef();


  const { onClick, onAdjust, onAddNode, onValueChange, mapLoadedHandle, addMarker, setPolygonEditor } = useMethods({
    onClick (e) {
      const ms: any = [].concat(markers);
      ms.push(e.lnglat);
      setMarkers(ms);
      addMarker(e.lnglat);
      if (ms.length === 3) {
        setMarkers([]);

        setPolygonEditor(ms);
        console.log('ms', ms);
        onValueChange({
          path: ms.map((marker) => ({ longitude: marker.lng, latitude: marker.lat })),
        });
      }
    },
    onValueChange(val) {
      onChange?.(val);
    },
    onAdjust(e) {
      onValueChange({ path: e.target.getPath().map((marker) => ({ longitude: marker.lng, latitude: marker.lat })) });
    },
    onAddNode(e) {
      onValueChange({ path: e.target.getPath().map((marker) => ({ longitude: marker.lng, latitude: marker.lat })) });
    },

    mapLoadedHandle(map,) {
      setMapIns(map);
    },
    addMarker(lnglat:LngLat) {
      const marker = new window.AMap.Marker({
        position: lnglat,
      });
      // 将以上覆盖物添加到地图上
      mapIns.add(marker);
    },
    setPolygonEditor(lnglat:LngLat) {
      if (!mapIns) return;
      // 需要先关闭编辑器，不然地图上会留下编辑点
      polygonEditorRef.current?.close();
      mapIns.clearMap();
      // 创建多边形 Polygon 实例
      polygonRef.current = new window.AMap.Polygon({
        path: lnglat, // 路径
        fillColor: '#fff', // 多边形填充颜色
        strokeWeight: 2, // 线条宽度，默认为 2
      });
      // 多边形 Polygon对象添加到 Map
      mapIns.add(polygonRef.current);
      // 实例化多边形编辑器，传入地图实例和要进行编辑的多边形实例
      polygonEditorRef.current = new window.AMap.PolygonEditor(mapIns, polygonRef.current);
      // 点击白色点触发 adjust
      polygonEditorRef.current.on('adjust', onAdjust);
      // 电机蓝色点触发 addnode
      polygonEditorRef.current.on('addnode', onAddNode);

      polygonEditorRef.current.open();
      // 异步操作，防止地图阻塞
      setTimeout(() => {
        // 将覆盖物调整到合适视野
        mapIns.setFitView([polygonRef.current]);
      }, 100);
    }
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
    if (value && value.path && mapIns) {
      const path = value.path.map((item:any) => [item.longitude, item.latitude]);
      setPolygonEditor(path);
    }
    // eslint-disable-next-line
  }, [value,mapIns]);

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
    // 设置地图中心点来触发地图平移
    mapIns.setCenter(record.option.location);
    getLngLatAddress(geocoder.current, record.option.location).then((newResult: any) => {

      setCenterVal?.(newResult);

    });
  };

  return (
    <div style={{ display: display }}>
      <Row gutter={16}>
        <Col span={12}>
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
        <Col span={24}>
          <Form.Item label={anotherName || '商圈定位'}>
            <div style={{ width: '600px', height: '300px' }}>
              <V2AMap loaded={mapLoadedHandle} mapOpts={{
                zoom: 15, // 级别
              }}
              plugins={[
                'AMap.Geocoder',
                'AMap.AutoComplete',
                'AMap.PolygonEditor',
              ]}
              />
            </div>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};
export default PolygonMap;
