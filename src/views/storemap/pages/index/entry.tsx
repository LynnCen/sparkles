// 门店地图
import AMap from '@/common/components/AMap';
import { useMapLevelAndCity } from '@/common/hook/useMapLevelAndCity';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import styles from './entry.module.less';
import { COUNTRY_LEVEL, PROVINCE_ZOOM, PROVINCE_LEVEL, CITY_ZOOM, CITY_LEVEL, DISTRICT_ZOOM, DISTRICT_LEVEL } from '@/common/components/AMap/ts-config';
import TopCon from '@/common/components/AMap/components/TopCon';
import { useMethods } from '@lhb/hook';
import LevelLayer from '@/common/components/AMap/components/LevelLayer';
import RecommendSidebar from '@/common/components/business/RecommendSidebar';
import MapDrawer from '@/common/components/business/MapDrawer';
import Left from './components/Left';
import Cluster from './components/Cluster';
import MassMarker from './components/MassMarker';
import ProvinceListForMap from '@/common/components/AMap/components/ProvinceListForMap';
import V2Form from '@/common/components/Form/V2Form';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { Form } from 'antd';
import { isUndef } from '@lhb/func';
import { storePointDemo } from '@/common/api/fishtogether';
import { MapHelpfulContextProvider } from '@/common/components/AMap/MapHelpfulContext';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

// 搜索类型选项
const selectOptions = [
  { label: '地图POI', value: 'POI' },
  { label: '品牌门店名称', value: 'BRANDNAME' },
  { label: '加盟商姓名', value: 'SHOPNAME' },
];
// marker样式
const iconStyle = (poi) => {
  return {
    icon: new window.AMap.Icon({
      image: poi.areaImage,
      size: [46, 46],
      imageSize: [46, 46],
      position: [poi.location.lng, poi.location.lat],
    }),
    anchor: 'center',
    position: [poi.location.lng, poi.location.lat],
  };
};
const Storemap: FC<any> = () => {
  const TopSearchRef = useRef<any>(null);
  const [form] = Form.useForm();

  const [amapIns, setAmapIns] = useState<any>(null);
  const { city, level } = useMapLevelAndCity(amapIns);
  const [checkedList, setCheckList] = useState<any>([]);
  const [rightDrawerVisible, setRightDrawerVisible] = useState(true);
  const [isShow, setIsShow] = useState<boolean>(true);// 是否显示保护区范围
  const [selectType, setSelectType] = useState<string>('POI');// 搜索选项类型
  const [inputValue, setInputValue] = useState<string>('');// 输入框内容（通过子组件拿到）
  const [searchData, setSearchData] = useState<any>([]);// 搜索后得到的数据
  const [mapontext, setMapontext] = useState<any>({
    // 工具箱
    toolBox: {
      stadiometry: null
    },
    // 如果未来还有其他场景，往下加
  });
  const [isOutStadiometry, setIsOutStadiometry] = useState<boolean>(false);
  const isOutStadiometryRef = useRef(isOutStadiometry);

  const {
    mapLoadedHandle,
    toCenterAndLevel,
    clearClickEvent,
    addClickEvent,
    onSelected,
    getSearchData,
    matchLabel
  } = useMethods({
    mapLoadedHandle: (mapIns: any) => {
      setAmapIns(mapIns);
    },
    toCenterAndLevel: (e) => {
      if (level === DISTRICT_LEVEL) return;
      const { lnglat } = e;
      let zoom = 4;
      switch (level) {
        case COUNTRY_LEVEL:
          zoom = PROVINCE_ZOOM;
          break;
        case PROVINCE_LEVEL:
          zoom = CITY_ZOOM;
          amapIns.setZoom(CITY_ZOOM);
          break;
        case CITY_LEVEL:
          zoom = DISTRICT_ZOOM;
          break;
      };
      amapIns.setZoomAndCenter(zoom, lnglat, false, 300);
    },
    clearClickEvent: () => {
      amapIns && amapIns.off('click', toCenterAndLevel);
    },
    addClickEvent: () => {
      amapIns && amapIns.on('click', toCenterAndLevel);
    },
    // 选择完后清空搜索框及地图上的点位
    onSelected: (val) => {
      TopSearchRef?.current?.clear();
      setSelectType(val);
    },
    // 拿到搜索结果值
    getSearchData: async() => {
      if (['BRANDNAME', 'SHOPNAME'].includes(selectType)) {
        const data = await storePointDemo({
          // 搜索类型 1:品牌门店名称；2:加盟商姓名
          searchType: selectType === 'BRANDNAME' ? 1 : 2,
          keyword: inputValue
        });
        const _data = data.map((item) => {
          return {
            ...item,
            location: {
              lng: item.lng,
              lat: item.lat
            }
          };
        });
        setSearchData(_data);
      }
    },
    // 设置传入的label样式
    matchLabel(data) {
      const attributeNameAr = data.attributeName.split('-');
      let labelContent = `<div class='label'>
      <span class='title'>${data.name || '-'}</span>
      <div class='row'><span class='contentLabel'>授权号：</span><span class='content'>${data.authNo || '-'}</span></div>
      <div class='row'><span class='contentLabel'>状态：</span><span class='content'>${attributeNameAr[0]} | ${attributeNameAr[1]}</span></div>
      <div class='row'><span class='contentLabel'>门店地址：</span><span class='content'>${data.address || '-'}</span></div>
      `;
      // 未开业的点位 展示点位地址，点位状态；如果有保护圈还需要展示：保护范围，保护人，保护有效期
      // 1.未开业-区域保护、
      // 2.未开业-签约前保护：签约前保护点位、
      // 3.未开业-测评已提报、
      // 5.未开业-选址中、
      // 6.未开业-筹建中、
      // 7.未开业-选址已提报、
      // 8.已开业-迁址筹建中 -- 筹建中
      if ([1, 2, 3, 5, 6, 7, 8].includes(data.attributeId)) {
        // 如果有保护圈还需要展示：保护范围，保护人，保护有效期
        if (data.protectRadius) {
          labelContent += `
          <div class='row'><span class='contentLabel'>保护范围：</span><span class='content'>${data.protectScope || '-'}</span></div>
          <div class='row'><span class='contentLabel'>保护申请人：</span><span class='content'>${data.protectAccountName || '-'}</span></div>
          <div class='row'><span class='contentLabel'>保护有效期：</span><span class='content'>${data.protectEndTime || '-'}</span></div>
          `;
        }
      }
      // 已开业的店铺  显示门店名称，授权号，地址，开业日期、日均销售额，保护范围（1KM保护或者2KM保护）
      // 9.已开业—运营中、
      // 10.已开业-迁址中
      if ([9, 10].includes(data.attributeId)) {
        labelContent += `
        <div class='row'><span class='contentLabel'>开业时间：</span><span class='content'>${data.openTime || '-'}</span></div>
        <div class='row'><span class='contentLabel'>日销售额：</span><span class='content'>${isUndef(data.dailySaleAmount) ? '-' : data.dailySaleAmount}</span></div>
        <div class='row'><span class='contentLabel'>保护范围：</span><span class='content'>${data.protectScope || '-'}</span></div>
        `;
      }
      // 已闭店的店铺：展示原门店名称、授权号，地址，闭店前日均销售额，必点日期
      // 11.闭店-迁址闭店、
      // 12.闭店-停止加盟
      // 13.暂停营业-暂停营业
      // 14.暂停营业-闭店
      if ([11, 12].includes(data.attributeId)) {
        labelContent += `
        <div class='row'><span class='contentLabel'>开业时间：</span><span class='content'>${data.openTime || '-'}</span></div>
        <div class='row'><span class='contentLabel'>日销售额：</span><span class='content'>${isUndef(data.dailySaleAmount) ? '-' : data.dailySaleAmount}</span></div>
        <div class='row'><span class='contentLabel'>闭店日期：</span><span class='content'>${data.closeTime || '-'}</span></div>
        <div class='row'><span class='contentLabel'>闭店原因：</span><span class='content'>${data.closeCause || '-'}</span></div>
        `;
      }
      // 4.未开业-已中止 显示点位地址，点位状态
      if (data.attributeId === 4) {
        //
      }
      labelContent += `</div>`;
      return labelContent;
    },
  });

  useEffect(() => {
    if (!amapIns) return;
    addClickEvent();
    return () => {
      clearClickEvent();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amapIns]);
  useEffect(() => {
    return () => {
      amapIns && amapIns.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getSearchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  useEffect(() => {
    const { stadiometry } = mapontext.toolBox;
    if (stadiometry) {
      setIsOutStadiometry(true);
      isOutStadiometryRef.current = true;
      V2Message.warning(`使用测距功能时会隐藏选择的重点品牌门店分布在地图的显示`);
      return;
    }
    setIsOutStadiometry(false);
    isOutStadiometryRef.current = false;
  }, [mapontext]);

  const model = useMemo(() => {
    return { provinceCode: city?.provinceId, cityId: city?.id };
  }, [city?.provinceId, city?.id]);

  return (
    <div className={styles.container}>
      <MapHelpfulContextProvider
        helpInfo={mapontext}
        stateEvent={setMapontext}
      >
        <AMap
          loaded={mapLoadedHandle}
          mapOpts={{
            zoom: 4,
            zooms: [4, 20],
            center: [103.826777, 36.060634]
          }}
          plugins={[
            'AMap.PlaceSearch',
            'AMap.DistrictSearch',
            'AMap.Geocoder',
            'AMap.RangingTool',
            'AMap.HeatMap',
            'AMap.Driving', // 驾车
            'AMap.Riding', // 骑行
            'AMap.Walking' // 走路
          ]} >
          {/* 顶部搜索+工具箱 */}
          <TopCon
            clearClickEvent={clearClickEvent}
            addClickEvent={addClickEvent}
            level={level}
            city={city}
            searchSelect={
              <div className={styles.searchSelect}>
                <V2Form form={form} initialValues={{ type: 'POI' }}>
                  <V2FormSelect
                    allowClear={false}
                    name='type'
                    options={selectOptions}
                    className={styles.select}
                    onChange={onSelected}
                  />
                </V2Form>
              </div>
            }
            searchData={searchData}
            isPOISearch={selectType === 'POI'}
            setInputValue={setInputValue}
            ref={TopSearchRef}
            matchLabel={matchLabel}
            iconStyle={iconStyle}
          />
          {/* 行政区背景色插件 */}
          <LevelLayer
            level={level}
            city={city} />
          <ProvinceListForMap
            type={1}
            city={city}
            level={level}
            className={styles.provinceCon}
            style={{
              minWidth: 225
            }}
          />
          <Left
            setCheckList={setCheckList}
            level={level}
            city={city}
            setIsShow={setIsShow}
          />
          <Cluster
            checkedList={checkedList}
            level={level}
            city={city} />
          <MassMarker
            checkedList={checkedList}
            level={level}
            city={city}
            isShow={isShow}
          />
        </AMap>
      </MapHelpfulContextProvider>
      <MapDrawer
        placement='right'
        mapDrawerStyle={{
          width: '240px',
          top: '50px',
          height: 'max-content', // 动态高度
          right: '40px',
          maxHeight: 'calc(100vh - 70px)', // 动态高度，70是根据UI稿
          transform: rightDrawerVisible ? 'translateX(0%)' : 'translateX(280px)'
        }}
        visible={rightDrawerVisible}
        setVisible={setRightDrawerVisible}
      >
        <RecommendSidebar
          amapIns={amapIns}
          model={model}
          isStadiometry={isOutStadiometry}
          isStadiometryRef={isOutStadiometryRef}
        />
      </MapDrawer>
    </div>
  );
};

export default Storemap;
