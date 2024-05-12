/**
 * @Description 周边查询组件
 */

import { FC, useEffect, useRef, useState } from 'react';
import { Row, Col, Spin, Form } from 'antd';
import { useMethods } from '@lhb/hook';
import { getCurPosition, searchPOI, getLngLatAddress } from '@/common/utils/map';
import { debounce, deepCopy, isArray, isDef } from '@lhb/func';
import { parseValueCatch } from '../config';
// import cs from 'classnames';
import styles from '../index.module.less';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import AMap from '@/common/components/AMap/index';
import { codeToPCD } from '@/common/api/common';
import { standardSurroundSearch } from '@/common/api/surround';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

const Surround: FC<any> = ({
  formItemData,
  form,
  disabled,
  required,
  surroundChange,
  canSelectAddress = false, // 能否选择地址，目前的业务逻辑下不能，从详细地址组件中将信息带过来
}) => {
  const centerMarkerRef: any = useRef();
  const [amapIns, setAmapIns] = useState<any>(null); // 地图实例
  const [options, setOptions] = useState<any[]>([]); // poi结果
  // const [cityInfo, setCityInfo] = useState<any>({}); // 高德返回的当前城市信息
  const [fetching, setFetching] = useState(false); // 是否在搜索中
  const [curCompValue, setCurCompValue] = useState<any>(null); // 组件数据

  // 监听才能触发formItemData.textValue的UseEffect
  Form.useWatch(formItemData.identification, form);

  const restriction = formItemData.restriction ? JSON.parse(formItemData.restriction) : {};

  useEffect(() => {
    // 处理切换tab时因组件的重新渲染导致的options清空的情况
    if (isArray(options) && options.length) return;
    const curVal = parseValueCatch(formItemData);
    // console.log('log useEffect parseValueCatch', curVal);
    // 回显地址
    form.setFieldValue(formItemData.identification, curVal?.address || '');
    // 地图设置位置
    if (curVal && isDef(curVal.lng) && isDef(curVal.lat)) {
      const { lng, lat } = curVal;
      if (amapIns) {
        amapIns.setCenter({ lng, lat });
        addCenterMarker(lng, lat);
      }
    }
    // 回显周边查询结果
    Array.isArray(curVal?.surround) && curVal.surround.forEach((itm: any, idx) => {
      form.setFieldValue(`${formItemData.identification}-${idx}`, itm.text || '');
    });
    setCurCompValue(curVal);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formItemData, formItemData.textValue, options]);

  useEffect(() => {
    if (!amapIns) return;
    canSelectAddress && amapIns.on('click', mapClicked);
    return () => {
      canSelectAddress && amapIns.off('click', mapClicked);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amapIns]);

  const {
    loadedMapHandle,
    searchHandle,
    addCenterMarker,
    changeHandle,
    mapClicked,
    onTextChanged,
  } = useMethods({
    // 地图加载完毕
    loadedMapHandle(mapIns: any) {
      if (!mapIns) return;
      setAmapIns(mapIns);
      const { textValue } = formItemData;
      if (textValue) {
        try {
          const info = parseValueCatch(formItemData);
          const { lng, lat } = info;
          if (!(lng && lat)) return;
          // setCityInfo({
          //   ...info,
          //   city: info.cityName
          // });
          addCenterMarker(lng, lat);
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
        // setCityInfo(res);
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

      searchPOI(keyword, '全国', {}).then((pois) => {
        setFetching(false);
        if (isArray(pois)) {
          // 过滤出有经纬度的数据
          const targetPois = pois.filter((poi: any) => {
            const { location } = poi;
            const { lng, lat } = location || {};
            return lng && lat;
          });
          setOptions(targetPois);
          return;
        }
      }).finally(() => {
        setFetching(false);
      });
    }, 700),
    // 选择搜索的地址
    async changeHandle(id: string, option: any) {
      // clear时option是null
      if (!option) {
        this.onClearAddress();
        return;
      }
      form.setFieldValue(formItemData.identification, option.name || '');
      this.setCenterSub({ lnglat: option.location }, true);
    },
    // 点击地图设置中心点
    mapClicked(e: any) {
      if (disabled) {
        V2Message.error('当前点位禁止编辑');
        return;
      }
      this.setCenterSub(e, false);
    },
    /**
     * @description 地图位置改变
     * @param e 事件参数 { lnglat: {lng, lat} }
     * @param isSelectChange 是否选择列表poi后触发
     */
    async setCenterSub(e: any, isSelectChange: boolean) {
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
      if (!isSelectChange) {
        // 移动地图时，地址赋值
        form.setFieldValue(formItemData.identification, formattedAddress || '');
      }

      const params = {
        adcode,
        lng,
        lat,
        cityName,
        address: formattedAddress,
      };
      this.addressChange(params);
    },
    // 选择地址变动
    async addressChange(params: any) {
      // 省市区信息
      const pcdInfo = await codeToPCD({
        districtCode: params.adcode,
        cityName: params.cityName
      });
      // 周边信息
      const radius = restriction.radius || 0;
      const tplId = restriction.tplId || 0;
      const data = await standardSurroundSearch({
        radius,
        tplId,
        lat: params.lat,
        lng: params.lng
      });
      const surround = Array.isArray(data) ? data.map(itm => ({
        categoryName: itm.categoryName,
        poiName: Array.isArray(itm.poiName) ? itm.poiName : [],
        text: Array.isArray(itm.poiName) ? itm.poiName.join('、') : ''
      })) : [];

      surround.forEach((itm: any, idx) => {
        form.setFieldValue(`${formItemData.identification}-${idx}`, itm.text || '');
      });

      const value = {
        ...params,
        cityId: pcdInfo.cityId,
        surround
      };
      setCurCompValue(value);
      // console.log('周边组件value变动 地址变动', formItemData.identification, value);
      surroundChange && surroundChange(formItemData.identification, value);
    },

    /**
     * @description 地址栏清空
     */
    onClearAddress() {
      setCurCompValue(null);
      // console.log('周边组件value变动 地址清空', formItemData.identification, value);
      surroundChange && surroundChange(formItemData.identification, null);
    },

    /**
     * @description 多行文本组件变动
     * @param index
     * @param val
     * @return
     */
    onTextChanged(index, e: any) {
      const tmpVal = deepCopy(curCompValue);
      if (Array.isArray(tmpVal.surround) && index < tmpVal.surround.length) {
        tmpVal.surround[index].text = e.target.value;
      }
      setCurCompValue(tmpVal);
      // console.log('周边组件value变动 文本变动', formItemData.identification, tmpVal);
      surroundChange && surroundChange(formItemData.identification, tmpVal);
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
            disabled={disabled || !canSelectAddress}
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
        {

        }
      </Row>
      <div className={styles.mapCon}>
        <AMap
          loaded={loadedMapHandle}
          plugins={[
            'AMap.Geocoder',
            'AMap.PlaceSearch'
          ]}
          // @ts-ignore
          disabled={disabled || !canSelectAddress}
        />
      </div>
      {
        curCompValue && Array.isArray(curCompValue.surround) && curCompValue.surround.map((itm: any, idx) => (
          <V2FormTextArea
            key={idx}
            label={itm.categoryName}
            name={`${formItemData.identification}-${idx}`}
            disabled={disabled}
            onChange={(val) => onTextChanged(idx, val)}
          />
        ))
      }
    </>
  );
};

export default Surround;

