/**
 * @Description 左侧筛选项和左下地图皮肤工具箱
 */
import MapDrawer from '@/common/components/business/MapDrawer';
import { FC, useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
// import SkinTool from './SkinTool';
import SelectionList from './SelectionList';
import SideBox from './SideBox';
import { businessType, leftListSelectionDOM, sectionKey } from '../../ts-config';

const LeftCon:FC<any> = ({
  showLeftCon,
  setShowLeftCon,
  mapHelpfulInfo,
  setItemData,
  setCurSelectDistrict,
  curSelectDistrict,
  setSearchParams,
  handChange,
  setChecked,
  districtCluster, // 点击区聚合时保存的数据
  checked,
  isGreater1440, // 是否大屏幕1440
  isGreater1920, // 是否大于1920
}) => {
  const [active, setActive] = useState<any>('');// 当前鼠标悬浮的菜单的一级code
  const [options, setOptions] = useState<any>([]);


  const selectionListRef = useRef<any>(null);

  const handleNotHover = (event) => {
    // closest--从触发事件的元素（即 event.target）开始向上查找最接近的具有类名 "leftListSelectionDOM" 的祖先元素。如果找到了这样的祖先元素，closest 方法会返回该元素本身，否则会返回 null
    const isHovering = event.target.closest(`.${leftListSelectionDOM}`) !== null; // 检查鼠标是否在某个元素或其子元素上
    if (!isHovering) {
      setActive('');
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleNotHover);
    return () => {
      document.removeEventListener('mousemove', handleNotHover);
    };
  }, []);

  useEffect(() => {
    // 餐饮门店数、餐饮老店占比、周边人口、周边房屋均价、小区户数、小区建筑年代、商场日均客流指数
    // 这些字段全选相当于全都不选（产品青山要求，兼容现在的没数据问题导致筛选不出来问题）
    const _checked:any = {};
    Object.keys(checked || {}).map((key:any) => {
      let value:any = checked[key];
      if (
        [sectionKey.cateringStore, sectionKey.oldCateringStore, sectionKey.population, sectionKey.housePrice, sectionKey.households, sectionKey.houseYear, sectionKey.passFlow, sectionKey.labelSystemSource].includes(key)) {
        const optionIds = options?.[key].map((item) => item.id);
        if (checked?.[key]?.length === optionIds.length) {
          value = undefined;
        }
      }
      _checked[key] = value;
    });
    if (_checked.labelSystemSource?.length === 2) {
      _checked.userCustomFlag = undefined;
    } else if (_checked?.labelSystemSource?.[0] === 70) {
      _checked.userCustomFlag = false;
    } else if (_checked?.labelSystemSource?.[0] === 71) {
      _checked.userCustomFlag = true;
    }
    // 当推荐商圈只选择一个时，判断中文是不是新增商圈，如果是则userCustomFlag为true，否则为false
    if (_checked.labelSystemSource?.length === 1) {
      _checked.userCustomFlag = options.labelSystemSource.find((item) => item.id === checked.labelSystemSource[0])
        .name === businessType.new;
    } else {
    // 当推荐商圈没选或者两个全选，则userCustomFlag不传
      _checked.userCustomFlag = undefined;
    }
    const params = {
      sortRule: _checked?.sortRule, // 排序规则
      secondLevelCategories: [
        ..._checked?.secondLevelCategoryCultureEducation || [],
        ..._checked?.secondLevelCategoryCommunity || [],
        ..._checked?.secondLevelCategoryTraffic || [],
        ..._checked?.secondLevelCategoryStreet || [],
        ..._checked?.secondLevelCategoryOffice || [],
        ..._checked?.secondLevelCategoryBusiness || [],
        ..._checked?.secondLevelCategoryScenicSpot || [],
        ..._checked?.secondLevelCategoryCompound || [],
      ], // 商圈类型
      labelSystemMallIds: _checked?.labelSystemMall, // 商圈标签
      labelSystemHighQualityIds: _checked?.labelSystemHighQuality, // 商圈特性
      userCustomFlag: _checked?.userCustomFlag, // 来源
      developerBrands: options?.developerBrand?.reduce((pre, item) => {
        if (_checked?.developerBrand?.includes(item.id)) {
          return [...pre, item.name];
        } else {
          return pre;
        };
      }, []), // 开发商品牌 (取selection的name-服务端要求)
      mallLevels: _checked?.mallLevel, // 商场定位
      mallSizes: _checked?.mallSize, // 商场规模
      mallOpenYearsList: _checked?.mallOpenYears, // 商场开业时长
      mallPassFlowTypes: _checked?.passFlow, // 日均客流
      genders: _checked?.gender, // 性别
      ages: _checked?.age, // 年龄
      carProportions: _checked?.carProportion, // 有车客群占比
      preferBrandIds: _checked?.preferBrand, // 偏好品牌
      avoidBrandIds: _checked?.avoidBrand, // 避开品牌
      // 多经点位
      historyCarTours: _checked?.historyCarTour, // 历史是否有汽车巡展
      pointAreas: _checked?.pointArea, // 场地面积
      locationTypes: _checked?.locationType, // 点位的位置类型
      floors: options?.floor?.reduce((pre, item) => {
        if (checked?.floor?.includes(item.id)) {
          return [...pre, item.name];
        } else {
          return pre;
        }
      }, []), // 点位的楼层 (取selection的name-服务端要求)
      tourBrandIds: _checked?.tourBrand, // 巡展品牌
      // 小区特性
      householdsTypes: _checked?.households, // 小区户数
      housePriceTypes: _checked?.housePrice, // 小区房价
      houseYearTypes: _checked?.houseYear, // 建筑年代
      // 居住人口
      populationTypes: _checked?.population, // 居住人口500m
      population3kmTypes: _checked?.population3km, // 居住人口3km
      // 周边配套
      workTypes: _checked?.workType, // 办公
      schoolTypes: _checked?.schoolType, // 学校
      trafficTypes: _checked?.trafficType, // 交通
      scenicTypes: _checked?.scenicType, // 景区
      medicalTypes: _checked?.medicalType, // 医院
      otherTypes: _checked?.otherType, // 其他市场
      // 市场评分
      marketScoreTypes: _checked?.marketScore, // 市场评分
      // 餐饮门店
      cateringStoreTypes: _checked?.cateringStore,
      oldCateringStoreTypes: _checked?.oldCateringStore,

    };
    setSearchParams((state) => ({ ...state, ...params }));
    setItemData({
      visible: false, // 是否显示详情
      id: null,
      detail: null, // 存放详情相关字段
      isFirst: false
    });
  }, [checked]);

  // 当手动更改省市时，默认置空已选的省市
  useEffect(() => {
    if (handChange) {
      setChecked((state) => ({ ...state, area: [] }));
      setCurSelectDistrict({
        districtInfo: [],
        cacheMapInfo: null,
      });
    }
  }, [handChange]);
  return <div className={styles.leftCon}>
    <MapDrawer
      placement='left'
      mapDrawerStyle={{
        width: `${isGreater1440 ? isGreater1920 ? '194px' : '10.0vw' : '146px'}`,
        top: '61px', // 12+37+12
        left: '12px',
        bottom: '5px',
        transform: showLeftCon ? 'translateX(0%)' : (isGreater1440 ? isGreater1920 ? 'translateX(-206px)' : 'translateX(calc(-10.1vw - 12px))' : 'translateX(-158px)'),
      }}
      closeConStyle={{
        top: '175px',
      }}
      visible={showLeftCon}
      setVisible={setShowLeftCon}
    >
      {/* 筛选项列表 */}
      <SelectionList
        setActive={setActive}
        selectionListRef={selectionListRef}
        checked={checked}
        active={active}
        menuStructure={options?.menuStructure || []}
      />
    </MapDrawer>

    {/* 右侧具体筛选项 */}
    <SideBox
      active={active}
      selectionListRef={selectionListRef}
      setChecked={setChecked}
      checked={checked}
      mapHelpfulInfo={mapHelpfulInfo}
      setCurSelectDistrict={setCurSelectDistrict}
      // setFirstLevelCategory={setFirstLevelCategory}
      options={options}
      districtCluster={districtCluster}
      setOptions={setOptions}
      curSelectDistrict={curSelectDistrict}
    />


  </div>;
};
export default LeftCon;
