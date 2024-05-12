/**
 * @Description 门店地理位置分布对比
 */
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import styles from '../index.module.less';
import AMap from '@/common/components/AMap';
import { Radio } from 'antd';
import { ALLTYPE, Comprehensiveness, MUNICIPALITY_ADCODE, colorRadio, mapColor, mapLevel, tabType, } from '../../../ts-config';
import { isArray, isNotEmptyAny } from '@lhb/func';
import { getProvinceAdcode, initDistrictLayer } from '@/common/utils/map';
import { getBrandCount } from '@/common/api/recommend';
import { getCompareBrandRank } from '@/common/api/recommend';
import { targetValSort } from '@/common/utils/ways';


const Map:FC<any> = ({
  selectedInfo,
  selected,
  setSelected,
  selectedBrand,
  amapIns,
  setAmapIns,
  brandIds,
  currentMapLevel,
  setCurrentMapLevel,
  allAreaInfo,
  curTabs,
  storeTypeSelected,
  city,
  curAdcodeRef,
  cityTypes
}) => {
  const [data, setData] = useState<any>([]);
  const [rankData, setRankData] = useState<any>([]);
  const mapConRef = useRef<any>(null);// 地图容器示例
  const currentMouseSite = useRef<any>(null);// 鼠标在地图容器中的相对位置
  const layerRef = useRef<any>(null);// 当前的layer
  const labelMarkerRef = useRef<any>(null);// 数据显示的labelMarker
  const textRef = useRef<any>([]);// 省份名称文字
  const isMunicipality = useRef<boolean>(false);

  // 获取数据
  const getBrandCountInfo = async() => {
    // 接口不支持传空数组
    if (!(isArray(selectedBrand) && selectedBrand.length)) {
      setData([]);
      return;
    }
    console.log('cityTypes', cityTypes);
    let params:any = {
      brandIds,
      cityTypeIds: cityTypes
    };
    // 门店类型状态下
    if (curTabs === tabType.STORE_TYPE) {
      params = {
        ...params,
        isSearchShopType: true,
      };
    }
    if (storeTypeSelected !== ALLTYPE) {
      params = {
        ...params,
        shopType: storeTypeSelected
      };
    }
    // 省状态下传入省id
    if (currentMapLevel === mapLevel.PROVINCE_LEVEL) {
      const provinceId = allAreaInfo.filter((item) => item.code === curAdcodeRef.current)[0]?.id;
      params = { ...params, provinceId: provinceId };
    }
    // 市状态下传入
    if (currentMapLevel === mapLevel.CITY_LEVEL) {
      params = { ...params, provinceId: city?.provinceId, cityId: city?.id };
    }

    // 门店类型
    if (curTabs === tabType.STORE_TYPE) {
      const rankData = await getCompareBrandRank(params);
      setRankData(rankData);
    }
    // 门店数量
    const res = await getBrandCount(params);
    setData(res);

  };

  const mapLoadedHandle = (mapIns: any) => {
    setAmapIns(mapIns);
  };
  // 选择地图上的单选项时
  const onChange = (e) => {
    setSelected(e.target.value);
  };


  // 选择的Index，用于修改颜色
  const selectedIndex = useMemo(() => {
    let idx = 0;
    selectedInfo.map((item, index) => {
      if (item.id === selected) {
        idx = index;
      }
    });
    console.log('ids', idx);
    return idx;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // 展示数据label
  const showLabelMarker:any = async(adcode, lnglat) => {
    let hasContent = false;
    if (!adcode) {
      labelMarkerRef.current.setContent(` `);
      return;
    };
    // data为空数组或不为数组直接return
    if (!(isArray(data) && data.length)) return;
    let content = '';
    labelMarkerRef.current.setPosition(lnglat);
    // 当选择具体一个品牌时，则展示此区域此品牌，每种门店类型的开店数量；
    if (curTabs === tabType.STORE_TYPE && selected !== Comprehensiveness) {

      isArray(rankData) && rankData[0]?.areaCoverList.map((item) => {
        if (+adcode === +item.code) {
          // 遍历所有的品牌，放入content
          hasContent = true;
          const extraContent = isArray(item.shopTypeCoverList) ? item.shopTypeCoverList.map((item) => `<div class="shopTypeItem">
          <span class="name">${item.name || '-'}</span>
          <span>|</span>
          <span class="total">${item.total}</span></div>`)
            : <></>;
          content += `
          <div class="cityName">${item.name}</div>
          <div class="itemContain">
          ${extraContent.join('')}
          </div>`;
        }
      });
    } else {
      data.forEach((item) => {
        // 找到当前对应的省
        if (+adcode === +item.code) {
          // 遍历所有的品牌，放入content
          hasContent = true;
          content += `<div class="cityName">${item.area}</div>`;
          item.brands.forEach((item) => {
            content += `
          <div class="brandItem">
          <span class="name">${item.shortName || item.name}</span>
          <span>|</span>
          <span class="total">${item.total}</span></div>`;
          });
        }
      });
    }

    if (!hasContent) {
      labelMarkerRef.current.setContent(` `);
      return;
    }
    // 默认情况，即label不超出地图容器
    labelMarkerRef.current.setContent(`<div class="label"><div class="triangle"></div><div>${content}</div></div>`);
    labelMarkerRef.current.setOffset((new window.AMap.Pixel(35, 30)));

    // mapConRef.current.offsetHeight地图容器的高度
    // currentMouseSite.current.y 鼠标在地图容器中的y轴位置
    // labelMarkerRef.current._style.height.split('px')[0] label样式在地图中的高度
    // 当label超出地图容器的时候，自适应向上显示，且留50px的区域，已解决同省从上往下移动遮挡情况
    if (mapConRef.current.offsetHeight < (+labelMarkerRef.current._style.height.split('px')[0] + currentMouseSite.current?.y + 50)) {
      labelMarkerRef.current.setOffset(new window.AMap.Pixel(
        0,
        -(+labelMarkerRef.current._style.height.split('px')[0] + 30))
      );
      labelMarkerRef.current.setContent(`<div class="label"><div>${content}</div><div class="bottomTriangle""></div></div>`);
    }
    amapIns.add(labelMarkerRef.current);
  };

  // 返回上一级
  const backPreLevel = () => {
    if (!amapIns) return;
    amapIns.setStatus({
      zoomEnable: true,
    });
    amapIns.remove(layerRef.current);
    layerRef.current = null;
    // 省份状态 -> 返回全国
    if (currentMapLevel === mapLevel.PROVINCE_LEVEL || isMunicipality.current) {
      amapIns.setZoom(3.8);// 地图初始化时的缩放大小
      amapIns.setCenter([103.826777, 37.060634]);// 地图初始化时的中心点
      drawLayer('', selected !== Comprehensiveness);
      setCurrentMapLevel(mapLevel.COUNTRY_LEVEL);
      return;
    }
    if (currentMapLevel === mapLevel.CITY_LEVEL) {
      // 将 区adcode "330100" 处理成 ”330000“
      curAdcodeRef.current = String(Math.floor(+curAdcodeRef.current / 10000) * 10000);
      // const code = Math.round(+curAdcodeRef.current / 10000) * 10000;
      drawLayer(curAdcodeRef.current, selected !== Comprehensiveness);
      setCurrentMapLevel(mapLevel.PROVINCE_LEVEL);
    }

    amapIns.setStatus({
      zoomEnable: false,
    });
  };

  // 地图点击事件
  const mapClick = async(e) => {
    if (currentMapLevel === mapLevel.CITY_LEVEL) return;
    const { lnglat } = e;
    if (!lnglat) throw new Error('没有获取到lnglat');
    // 通过经纬度获取省份adcode
    const res:any = await getProvinceAdcode('', lnglat, currentMapLevel);
    const { adcode } = res;
    if (!adcode) return;
    curAdcodeRef.current = adcode;

    if (MUNICIPALITY_ADCODE.includes(adcode)) {
      setCurrentMapLevel(mapLevel.CITY_LEVEL);
      isMunicipality.current = true;
      return;
    }
    setCurrentMapLevel(currentMapLevel + 1);
    isMunicipality.current = false;
  };

  // 根据数据绘制省份名称
  const drawProvinceName = () => {
    // 不在全国范围下，则不绘制省份名称
    if (currentMapLevel !== mapLevel.COUNTRY_LEVEL) return;
    textRef.current && textRef.current?.map((item) => {
      amapIns.remove(item);
    });
    textRef.current = [];
    data.map((item) => {
      const text = new window.AMap.Text({
        text: item.area,
        anchor: 'center', // 设置文本标记锚点
        cursor: 'pointer',
        position: [item.lng, item.lat],
        style: {
          'background-color': 'transparent',
          'padding': '0',
          'border': 'none',
          'font-size': '10px',
          'color': 'black',
        },
        zooms: [1, 4.75],
        index: 9999
      });
      text.on('click', () => {
        curAdcodeRef.current = item.code;
        if (MUNICIPALITY_ADCODE.includes(item.code)) {
          setCurrentMapLevel(mapLevel.CITY_LEVEL);
          isMunicipality.current = true;
          return;
        }
        // 设置区域级别后会触发对应useEffect
        setCurrentMapLevel(mapLevel.PROVINCE_LEVEL);
      });
      textRef.current.push(text);
      amapIns.add(text);
    });
  };
  // 绘制省份border
  const getProvinceBounds = (adcode) => {
    // 设置可缩放--缩放结束后再设置不可缩放
    amapIns.setStatus({
      zoomEnable: true,
    });
    window.AMapUI.load(['ui/geo/DistrictExplorer', 'lib/$'], function(DistrictExplorer) {
      var districtExplorer = window.districtExplorer = new DistrictExplorer({
        eventSupport: true, // 打开事件支持
        map: amapIns
      });
      districtExplorer.loadAreaNode(adcode, (_, areaNode) => {
        amapIns.setBounds(areaNode.getBounds(), false);
        currentMapLevel === mapLevel.CITY_LEVEL && amapIns.setZoom(9);
        // 缩放到当前省份后，设置不可缩放
        setTimeout(() => {
          amapIns.setStatus({
            zoomEnable: false,
          });
        }, 500);
      });
    });
  };

  const drawLayer = (adcode:string, isSign:boolean) => {
    let colors:any = [];
    // 综合对比
    if (!isSign) {
      data.map((item) => {
        let maxBrandCountId;
        let selectedInfoIndex;
        if (isArray(item.brands) && item.brands.length) {
          maxBrandCountId = item.brands[0].id;
          if (item.brands[0].total === 0) {
            maxBrandCountId = -1;
          }
        }
        selectedInfo.map((item, index) => {
          if (item.id === maxBrandCountId) {
            selectedInfoIndex = index;
          }
        });
        colors.push(colorRadio[selectedInfoIndex]);
      });
    } else {
      console.log('isSign', isSign);
      const newData = isSign ? targetValSort(data, 'total') : data;
      console.log('newData', newData);
      colors = calculateColors(mapColor[selectedIndex], newData);
      console.log('colors', colors);
      // const color1 = Array(3).fill(mapColor[selectedIndex][0]);// 1~3
      // const color2 = Array(7).fill(mapColor[selectedIndex][1]);// 3~10
      // const color3 = Array(10).fill(mapColor[selectedIndex][2]);// 10~20
      // const color4 = Array(14).fill(mapColor[selectedIndex][3]);// 20~34
      // colors = [...color1, ...color2, ...color3, ...color4];
    }



    const targetLayer = initDistrictLayer(
      amapIns,
      {
        'coastline-stroke': '#f2f2f2', // 海岸线颜色
        'province-stroke': 'white', // 省界颜色
        'nation-stroke': '#999999', // 国境线颜色
        'city-stroke': 'white',
        'county-stroke': 'white',
        'stroke-width': 1.5,
      },
      {
        depth: currentMapLevel - 1,
        adcode: adcode || '',
      },
      data as any[],
      {
        dataTargetFields: 'code',
        matchingFields: 'adcode',
        needSort: isSign,
        colors,
      });
    layerRef.current = targetLayer;
    amapIns.add(targetLayer);
  };

  /**
 * @description 将十六进制颜色转化为RGB对象
 * @param color 十六进制颜色
 * @return RGB对象
 */
  const hexToRgb = (color) => ({
    r: parseInt(color.slice(1, 3), 16),
    g: parseInt(color.slice(3, 5), 16),
    b: parseInt(color.slice(5, 7), 16)
  });

  /**
 * @description 根据给定的颜色范围和对象数组计算颜色数组
 * @param initialColor 初始颜色值范围 [maxColor, minColor]
 * @param objects 包含total属性的对象数组
 * @return 颜色数组
 */
  const calculateColors = (initialColor, objects) => {
    const [maxColor, minColor] = initialColor;
    const initialRGB = hexToRgb(maxColor);
    const minRGB = hexToRgb(minColor);

    const maxTotal = Math.max(...objects.map(obj => obj.total));
    const minTotal = Math.min(...objects.map(obj => obj.total));

    const colors = objects.map((obj) => {

      if (obj.total === 0) {
        return '#f2f2f2'; // 默认颜色
      }

      if (obj.total === maxTotal) {
        return maxColor; // 最大颜色
      }

      if (obj.total === minTotal) {
        return minColor; // 最小颜色
      }

      const percentage = (obj.total - minTotal) / (maxTotal - minTotal);
      const newRGB = {
        r: Math.round(minRGB.r + (initialRGB.r - minRGB.r) * percentage),
        g: Math.round(minRGB.g + (initialRGB.g - minRGB.g) * percentage),
        b: Math.round(minRGB.b + (initialRGB.b - minRGB.b) * percentage)
      };
      // 将rgb转化为十六进制
      const newHexColor = `#${(1 << 24 | newRGB.r << 16 | newRGB.g << 8 | newRGB.b).toString(16).slice(1)}`;

      return newHexColor;
    });

    return colors;
  };

  // 获取当前鼠标在地图容器中的相对位置
  const getCurrentMouseSite = (event) => {
    const boundingRect = mapConRef.current.getBoundingClientRect();
    const mouseX = event.clientX - boundingRect.left;
    const mouseY = event.clientY - boundingRect.top;
    currentMouseSite.current = {
      x: mouseX,
      y: mouseY
    };
  };
  const handleMouseMove = (e) => {
    const { adcode } = layerRef.current.getDistrictByContainerPos(e.pixel) || {};
    showLabelMarker(adcode, e.lnglat);
  };
  useEffect(() => {
    if (!amapIns) return;
    // // 设置不可缩放、不可平移
    amapIns.setStatus({
      // dragEnable: false,
      doubleClickZoom: false,
      zoomEnable: false,
    });
    // 初次加载的时候，添加品牌数据label的marker，后续不在重新赋值
    if (!labelMarkerRef.current) {
      const marker = new window.AMap.Marker({
        anchor: 'top-center',
        offset: [35, 30],
        content: ' ',
        zIndex: 999999
      });
      labelMarkerRef.current = marker;
    }
    amapIns.add(labelMarkerRef.current);

    amapIns.on('click', mapClick);
    return () => {
      amapIns.off('click', mapClick);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amapIns, selected, data]);


  useEffect(() => {
    if (!amapIns) return;
    layerRef.current && amapIns.remove(layerRef.current);
    drawProvinceName();
    // 在全国范围下
    if (currentMapLevel === mapLevel.COUNTRY_LEVEL) {
      drawLayer('', selected !== Comprehensiveness);
    }
    // 在省份范围下
    if (currentMapLevel === mapLevel.PROVINCE_LEVEL) {
      drawLayer(curAdcodeRef.current, selected !== Comprehensiveness);
      getProvinceBounds(curAdcodeRef.current);
    }
    // 在城市范围下
    if (currentMapLevel === mapLevel.CITY_LEVEL) {
      drawLayer(curAdcodeRef.current, selected !== Comprehensiveness);
      getProvinceBounds(curAdcodeRef.current);
    }
    amapIns.on('mousemove', handleMouseMove);
    return () => {
      amapIns.off('mousemove', handleMouseMove);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amapIns, currentMapLevel, data]);

  useEffect(() => {
    getBrandCountInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrand, selected, cityTypes, currentMapLevel, curTabs, storeTypeSelected, city?.id]);
  return (
    <div className={styles.mapCon} ref={mapConRef} onMouseMove={getCurrentMouseSite}>
      {/* 地图上的单选按钮 */}
      {isNotEmptyAny(selectedInfo) && <div className={styles.radio}>
        <Radio.Group onChange={onChange} value={selected}>
          <Radio value={Comprehensiveness}>综合占比</Radio>
          {
            selectedInfo.map((item, index) =>
              <Radio value={item.id} key={index}>
                { colorRadio[index] && <span
                  className={styles.radioColor}
                  style={{
                    backgroundColor: colorRadio[index]
                  }}></span>}
                <span>{item.name}</span>
              </Radio>)
          }
        </Radio.Group>
      </div>}

      {currentMapLevel !== mapLevel.COUNTRY_LEVEL && <div
        onClick={backPreLevel}
        className={styles.backCountryBtn}>
        {currentMapLevel === mapLevel.PROVINCE_LEVEL ? '返回全国' : '返回省份'}
      </div>}

      {selected !== Comprehensiveness && <div
        className={styles.storeNum}
      >
       门店数量
        <span>少</span>
        <span
          className={styles.storeColor}
          style={{
            background: `linear-gradient(to right, ${mapColor[selectedIndex][1]} , ${mapColor[selectedIndex][0]})`
          }}
        ></span>
        <span>多</span>
      </div>}

      <AMap
        mapOpts={{
          zoom: 3.8,
          zooms: [3.5, 20],
          center: [103.826777, 37.060634] // 默认地图的中心位置，使中国地图处于地图正中央
        }}
        loaded={mapLoadedHandle}
        plugins={[
          'AMap.DistrictSearch',
          'AMap.Geocoder',
        ]}>

      </AMap>
    </div>
  );
};
export default Map;
