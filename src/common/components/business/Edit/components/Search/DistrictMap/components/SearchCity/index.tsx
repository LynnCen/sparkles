/**
 * @Description 默认当前城市，基于选择的城市进行poi搜索
 */

import { FC, useEffect, useState, useRef } from 'react';
import { Spin, Select } from 'antd';
import { isArray, debounce } from '@lhb/func';
import { getCurPosition, searchPOI } from '@/common/utils/map';
import cs from 'classnames';
import styles from './index.module.less';
import ProvinceList from '@/common/components/ProvinceList';
import { SearchOutlined } from '@ant-design/icons';
const { Option } = Select;
const SearchCity: FC<any> = ({
  className,
  amapIns,
  selectWidth = '90px',
  inputWidth = '150px',
  setCenter
}) => {
  const centerMarkerRef: any = useRef(); // 中心点marker
  // const [cityOptions, setCityOptions] = useState<any[]>([]);
  const [selectCity, setSelectCity] = useState<any>();
  const [provinceValue, setProvinceValue] = useState<number[]>([]);
  const [fetching, setFetching] = useState(false); // 是否在搜索中
  const [searchOptions, setSearchOptions] = useState<any[]>([]); // 搜索结果
  const [provinceData, setProvinceData] = useState<any[]>([]); // 省市数据

  useEffect(() => {
    if (!amapIns) return;
    curPositionHandle();
  }, [amapIns, provinceData]);

  const curPositionHandle = () => {
    // 浏览器定位
    getCurPosition(amapIns, {
      // https://lbs.amap.com/api/javascript-api-v2/documentation#geolocation
      // 是否显示定位按钮
      showButton: false,
      // showCircle: false,
      showMarker: false
    }).then((res: any) => {
      const { city: cityName, province: provinceName } = res;
      amapIns.setCity(cityName || provinceName); // 直辖市没有cityName
      provinceData?.forEach((province: any) => {
        const { children, id: provinceId } = province;
        if (!(isArray(children) && children.length)) return;
        children.forEach((city: any) => {
          const { name, id: cityId } = city;
          if ((cityName || provinceName).includes(name)) {
            setProvinceValue([provinceId, cityId]);
            setSelectCity(city);
            return;
          }
        });
      });
    });
  };

  const handleSearch = debounce((keyword: string) => {
    // 地图没加载完成时，不搜索
    setSearchOptions([]);
    setFetching(true);

    searchPOI(keyword, selectCity?.name, { extensions: 'all' }).then((pois) => {
      setFetching(false);
      if (isArray(pois)) {
        // 过滤出有经纬度的数据
        const targetPois = pois.filter((poi: any) => {
          const { location } = poi;
          const { lng, lat } = location || {};
          return lng && lat;
        });
        setSearchOptions(targetPois);
      }
    }).finally(() => {
      setFetching(false);
    });
  }, 300);

  const displayRender = (label) => {
    if (!(isArray(label) && label.length)) return <></>;
    const city = label[1];
    // label可能是number[]
    const cityName = city && typeof (city) === 'string' ? city.substring(0, city.length - 1) : '';
    return <>{cityName}</>;
  };

  const provinceChangeHandle = (value, selectedOptions: any[]) => {
    setProvinceValue(value);
    setSelectCity(selectedOptions[1]);
  };

  const changeHandle = (id: string) => {
    const target = searchOptions.find((item) => item.id === id);
    if (!target) return;
    const { location } = target;
    const { lng, lat } = location || {};
    if (lng && lat) addCenterMarker(lng, lat);
    if (lng && lat)setCenter({ lng, lat });
  };

  const addCenterMarker = (lng, lat) => {
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
  };

  return (
    <div className={cs(styles.searchCityCom, className)}>
      <ProvinceList
        type={2}
        style={{
          width: selectWidth
        }}
        value={provinceValue}
        allowClear={false}
        displayRender={displayRender}
        onChange={(value, selectedOptions) => provinceChangeHandle(value, selectedOptions)}
        finallyData={(data: any[]) => setProvinceData(data)}
      />
      <Select
        style={{ width: inputWidth }}
        filterOption={false}
        showSearch={true}
        notFoundContent={fetching ? <Spin size='small' /> : null}
        onSearch={handleSearch}
        onChange={changeHandle}
        placeholder='请输入地址'
        clearIcon={null}
        suffixIcon={ <SearchOutlined className='fs-12'/>}
        allowClear
      >
        {
          searchOptions.map((item: any, index: number) => (<Option
            value={item?.id}
            label={item?.name}
            key={index}>
            <div className='fs-14'>
              { item?.name}
            </div>
            <div className='c-999 fs-12'>{item?.cityname || item?.pname}{item?.adname}</div>
          </Option>)

          )
        }
      </Select>
    </div>
  );
};

export default SearchCity;
