/**
 * @Description 门店地图-通用版，从views/storemap/pages/index拷贝出来的一份
 */
import AMap from '@/common/components/AMap';
import { useAmapLevelAndCityNew } from '@/common/hook/useAmapLevelAndCityNew';
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
import { storeMapSearchStandard } from '@/common/api/storemap';
import { MapHelpfulContextProvider } from '@/common/components/AMap/MapHelpfulContext';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

// 搜索类型选项
const selectOptions = [
  { label: '地图POI', value: 'POI' },
  { label: '品牌门店名称', value: 'BRANDNAME' },
  // { label: '加盟商姓名', value: 'SHOPNAME' },
];
// marker样式
const iconStyle = (poi) => {
  return {
    icon: new window.AMap.Icon({
      image: 'https://staticres.linhuiba.com/project-custom/locationpc/ic_map_standard_marker@2x.png',
      size: [40, 40],
      imageSize: [40, 40],
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
  const { city, level } = useAmapLevelAndCityNew(amapIns, true);
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
        const data = await storeMapSearchStandard({
          // 搜索类型 1:品牌门店名称；2:加盟商姓名
          // searchType: selectType === 'BRANDNAME' ? 1 : 2,
          keyword: inputValue,
          ids: checkedList
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
      // 目前只有机会点
      let labelContent = `<div class='label'>
      <span class='title'>${data.name || '-'}</span>
      <div class='row'><span class='contentLabel'>当前状态：</span><span class='content'>${data.statusName || '-'}</span></div>
      <div class='row'><span class='contentLabel'>地址：</span><span class='content'>${data.address}</span></div>
      `;
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

  useEffect(() => {
    getSearchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

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
              width: '255px'
            }}
          />
          {/* 左侧侧边栏 */}
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
