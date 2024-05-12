/**
 * @Description 门店地理位置分布对比
 */
import styles from './index.module.less';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import Map from './Map';
import { ALLTYPE, mapLevel, tabType } from '../../ts-config';
import { Checkbox, Select } from 'antd';
import { areaList } from '@/common/api/common';
import { useAmapLevelAndCityNew } from '@/common/hook/useAmapLevelAndCityNew';
import V2Tabs from '@/common/components/Data/V2Tabs';
import RightTable from './Table';
import { isArray, refactorSelection } from '@lhb/func';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
// import V2FormCheckbox from '@/common/components/Form/V2FormCheckbox/V2FormCheckbox';



const renderTabBar:any = (props, DefaultTabBar) => {
  return (<div className={styles.tabs}>
    <DefaultTabBar {...props}/>
  </div>
  );
};

const MapContrast:FC<any> = ({
  selectedInfo,
  selectedBrand,
  selected,
  setSelected,
  setCurTabs,
  curTabs,
  selections,
  isShowStoreType,
  cityTypes,
  setCityTypes
}) => {

  const checkboxContainRef:any = useRef();
  const [amapIns, setAmapIns] = useState<any>(null);// 地图示例
  const [currentMapLevel, setCurrentMapLevel] = useState<any>(mapLevel.COUNTRY_LEVEL);// 当前地图缩放级别
  const [allAreaInfo, setAllAreaInfo] = useState<any>([]);// 获取所有地区
  const [storeTypeSelected, setStoreTypeSelected] = useState<any>(ALLTYPE); // 当前选中的门店类型
  const { city } = useAmapLevelAndCityNew(amapIns); // 缩放层级和城市相关信息
  const [isOverflow, setIsOverflow] = useState(true); // TODO-77:


  // const { provinceId } = city || {};
  const curAdcodeRef = useRef<any>(null);// 当前城市的adcode

  // 地图上选中的类型
  const brandIds = useMemo(() => {
    return selected === 'comprehensiveness' ? selectedBrand : [selected];
  }, [selected, selectedBrand]);
  // 切换到门店数量or门店类型
  const onChange = (tab) => {
    setCurTabs(tab);
  };

  const items = useMemo(() => {
    if (isShowStoreType) {
      return [
        { label: '城市类型', key: tabType.STORE_NUM },
        { label: '门店类型', key: tabType.STORE_TYPE }
      ];
    } else {
      return [
        { label: '城市类型', key: tabType.STORE_NUM },
      ];
    }
  }, [isShowStoreType]);

  // 获取行政区信息
  const getAreaCode = async() => {
    const res = await areaList({ type: 1 });
    setAllAreaInfo(res);
  };
  // 门店类型筛选项
  // 门店类型筛选项
  const shopTypeListSelections = useMemo(() => {
    const arr = selections?.shopTypeList || [];
    const modifiedArray = [{
      label: '全部类型',
      value: ALLTYPE,
      id: ALLTYPE,
      name: '全部类型'
    }, ...arr].map(item => ({
      ...item,
      label: item?.name,
      value: item?.id
    }));

    return modifiedArray;
  }, [selections?.shopTypeList]);

  // 门店类型筛选项
  const cityTypesSelections = useMemo(() => {
    let count: number = 0;
    const citys: any[] = selections?.cityTypeList?.map(item => {
      count += item?.name?.length;
      return {
        ...item,
        label: item?.name,
        value: item?.id
      };
    }) || [];
    setIsOverflow(count > 36);
    setCityTypes(citys.map(item => item.id)); // 只存储城市的 id
    return citys;
  }, [selections?.cityTypeList]);


  useEffect(() => {
    getAreaCode();
  }, []);


  return <div className={styles.mapContainer}>
    <V2Tabs items={items} onChange={onChange} renderTabBar={renderTabBar}/>
    <div className={styles.title}>
      <div className={styles.left}>
        <span className={styles.titleText}>
          {curTabs === tabType.STORE_NUM ? '门店地理位置分布对比' : '商圈所在区域对比'}
        </span>
        {/* 门店类型选择框 */}
        {curTabs === tabType.STORE_TYPE
          ? <Select
            style={{ width: 160 }}
            options={shopTypeListSelections}
            defaultValue={shopTypeListSelections[0].value}
            onChange={(e) => {
              setStoreTypeSelected(e);
            }}
          />
          : <></>}
      </div>

      {/* 城市类型选择 */}
      <div ref={checkboxContainRef} className={styles.checkboxContain} >

        { isOverflow
          ? <V2FormSelect
            label='城市类别'
            options={refactorSelection(cityTypesSelections)}
            onChange={(val) => {
              console.log('val', val);
              setCityTypes(val);
            }}
            className={styles.select}
            config={{
              value: cityTypes,
              maxTagCount: 'responsive',
              mode: 'multiple',
              showSearch: false,
              allowClear: false,
            }}
          />
          : (isArray(cityTypesSelections) && cityTypesSelections.length ? (
            <div className={styles.checkbox}>
              <Checkbox.Group
                options={refactorSelection(cityTypesSelections)}
                value={cityTypes}
                onChange={(val) => setCityTypes(val)}
              />
            </div>
          ) : <></>)
        }

      </div>

    </div>
    <div className={styles.container}>
      <Map
        selectedInfo={selectedInfo}
        selected={selected}
        setSelected={setSelected}
        selectedBrand={selectedBrand}
        cityTypes={cityTypes}
        amapIns={amapIns}
        setAmapIns={setAmapIns}
        brandIds={brandIds}
        currentMapLevel={currentMapLevel}
        setCurrentMapLevel={setCurrentMapLevel}
        allAreaInfo={allAreaInfo}
        curTabs={curTabs}
        storeTypeSelected={storeTypeSelected}
        city={city}
        curAdcodeRef={curAdcodeRef}
      />


      <RightTable
        currentMapLevel={currentMapLevel}
        curTabs={curTabs}
        selected={selected}
        city={city}
        cityTypes={cityTypes}
        brandIds={brandIds}
        selectedBrand={selectedBrand}
        allAreaInfo={allAreaInfo}
        curAdcodeRef={curAdcodeRef}
        storeTypeSelected={storeTypeSelected}
      />
    </div>
  </div>;
};
export default MapContrast;
