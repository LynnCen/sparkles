/**
 * @Description 左侧筛选条件
 */

import { FC, useEffect, useMemo, useRef, useState } from 'react';
// import cs from 'classnames';
import styles from './index.module.less';
import MapDrawer from '@/common/components/business/MapDrawer';
import IconFont from '@/common/components/IconFont';
import { getStorage, setStorage } from '@lhb/cache';
import Card from './Card';
import ScoreSection from './ScoreSection';
import { getHotLabel, getSelection } from '@/common/api/networkplan';
import { labelCustom, labelSystemBrand, labelSystemHighQuality, labelSystemMall, preferenceBrand, avoidBrand, firstLevelCategory, houseYear, households, workType, medicalType, otherType, radiationResidentsList, radiationWorkPopulationList, scenicType, schoolType, trafficType } from '../../ts-config';
import { getBrand } from '@/common/api/recommend';
import { useDebounceEffect } from '@/common/hook/useEffectDebounce';
import { Form } from 'antd';

const HideSiteSelectionMapTips = 'HideSiteSelectionMapTips';// 隐藏tips
const SiteSelectionMapOptions = 'SiteSelectionMapOptions';// 记录上一次筛选项

const ConditionSidebar: FC<any> = ({
  labelOptionsFlag,
  setSearchParams
}) => {
  const [form] = Form.useForm();

  const [mapDrawerOpen, setMapDrawerOpen] = useState<boolean>(true);// 左侧筛选条件
  const [hideTips, setHideTips] = useState<boolean>(getStorage(HideSiteSelectionMapTips));// 是否隐藏tips

  const [options, setOptions] = useState<any>(null);
  const [checked, setChecked] = useState<any>(null);
  const [score, setScore] = useState<any>({
    mainBrandsScoreMin: undefined,
    mainBrandsScoreMax: undefined
  });

  const firstRef = useRef<boolean>(true);
  const changeTypeRef = useRef<any>(null);
  const hasCheckedRef = useRef<boolean>(true);// 是否有选中过

  const showClearAll = useMemo(() => {
    let flag = false;
    if (Object.keys(checked || {}).length) {
      Object.keys(checked || {}).map((key) => {
        if (checked[key].length) {
          flag = true;
        }
      });
    }
    if (score?.mainBrandsScoreMin || score?.mainBrandsScoreMax) {
      flag = true;
    }
    return flag;
  }, [checked, score]);



  const clearAll = () => {
    setChecked(null);
    setScore({
      mainBrandsScoreMin: undefined,
      mainBrandsScoreMax: undefined
    });
    form.resetFields();
  };

  // const renderLabel = (value, index) => {
  //   return <img className={styles.networkLabel} src={labelType[index]}/>;
  // };
  const handleHideTips = () => {
    setHideTips(true);
    setStorage(HideSiteSelectionMapTips, true);
  };
  const getOption = async() => {
    // module 1 网规相关，2行业商圈 （通用版）
    const data = await getSelection({ module: 2, type: 3 });

    let newOptions:any;
    Object.keys(data).forEach((key) => {
      // 特殊处理，ui要求居住和办公人口排名去掉前两个字排名
      if (key === 'radiationType') {
        data[key] = data[key].map((item) => {
          return {
            ...item,
            name: item.name.replace('排名', '')
          };
        });
      }

      newOptions = {
        ...newOptions,
        [key]: {
          showAll: false,
          data: data[key]
        }
      };
    });

    const brandData = await getBrand({ origin: 2, type: 3 });
    newOptions[preferenceBrand] = {
      showAll: false,
      data: brandData
    };
    newOptions[avoidBrand] = {
      showAll: false,
      data: brandData
    };
    // 因为居住和办公的选项值一样的，所以接口就用了一个：radiationType来表示
    newOptions[radiationResidentsList] = newOptions.radiationType;
    newOptions[radiationWorkPopulationList] = newOptions.radiationType;
    setOptions(newOptions);
  };
  const getHotCheckLabel = async() => {
    // 获取热门筛选组合
    const data = await getHotLabel();
    // 拼凑热门筛选组合的id
    const dataIds:any = [];
    const dataRelationIds:any = [];
    data.map((item) => {
      dataIds.push(item.id);
    });
    options?.labelSystemBrand?.data?.map((item) => {
      if (dataIds.includes(item.id) && item.relationId) {
        dataRelationIds.push(item.relationId);
      }
    });

    // 定义key数组，只遍历这里的key，其他数据不可能为热门筛选组合
    // const setKeys = [labelPlanCluster, labelCustom, labelSystemHighQuality, labelSystemBrand, labelSystemFlow, labelSystemMall];

    let selected:any;

    Object.keys(options).map((key) => {
      if (key === labelSystemBrand) {
        // 拿到对应key的筛选项数据
        options[key].data.map((item) => {
          // 如果id数据包括此筛选项id（唯一），则放到selected中，后续统一放到checked
          if (dataIds.includes(item.id)) {
            selected = {
              ...selected,
              [key]: [...selected?.[key] || [], item.id]
            };
          }
        });
      }
    });
    selected = {
      ...selected,
      preferenceBrand: dataRelationIds
    };
    setChecked(selected);
  };

  // 默认带出上一次的筛选项(只对options中存在的筛选项才设置，以免更换租户，导致设置选中不存在的筛选项)
  const handlePreChecked = () => {
    const preChecked = getStorage(SiteSelectionMapOptions);
    let res:any = {};
    Object.keys(preChecked || {}).map((key) => {
      options[key]?.data?.map((item) => {
        if (preChecked[key].includes(item.id)) {
          res = {
            ...res,
            [key]: [...res[key] || [], item.id]
          };
        }
        if (preChecked[key].includes(item?.originBrandId)) {
          res = {
            ...res,
            [key]: [...res[key] || [], item.originBrandId]
          };
        }
      });
    });
    setChecked(res);
  };

  // 获取筛选项
  useEffect(() => {
    getOption();
  }, [labelOptionsFlag]);

  useEffect(() => {
    if (Object.keys(options || {}).length && firstRef.current && !getStorage(SiteSelectionMapOptions)) {
      getHotCheckLabel();
      firstRef.current = false;
    }
    if (Object.keys(options || {}).length && getStorage(SiteSelectionMapOptions)) {
      handlePreChecked();
    }
  }, [options]);
  // 筛选项改变后传给外面

  useDebounceEffect(() => {
    if (!hasCheckedRef.current) {
      setStorage(SiteSelectionMapOptions, {
        ...checked || {},
        ...score
      });
    }



    const params = {
      ...score,
      labelPlanClusterIds: checked?.labelPlanCluster,
      labelCustomIds: checked?.labelCustom,
      labelSystemHighQualityIds: checked?.labelSystemHighQuality,
      labelSystemBrandIds: checked?.labelSystemBrand,
      labelSystemFlowIds: checked?.labelSystemFlow,
      labelSystemMallIds: checked?.labelSystemMall,
      preferBrandIds: checked?.preferenceBrand,
      avoidBrandIds: checked?.avoidBrand,
      firstLevelCategories: checked?.firstLevelCategory,
      houseYearTypes: checked?.houseYear,
      householdsTypes: checked?.households,
      workTypes: checked?.workType,
      schoolTypes: checked?.schoolType,
      trafficTypes: checked?.trafficType,
      scenicTypes: checked?.scenicType,
      medicalTypes: checked?.medicalType,
      otherTypes: checked?.otherType,
      radiationResidentsList: checked?.radiationResidentsList,
      radiationWorkPopulationList: checked?.radiationWorkPopulationList,
    };
    setSearchParams((state) => {
      return {
        ...state,
        ...params
      };
    });
    hasCheckedRef.current = false;
  }, [checked, score], 300);

  // 如果标杆品牌改变了，则拿新标杆品牌数据对应的relationId,
  useEffect(() => {
    if (changeTypeRef.current !== labelSystemBrand) return;
    // 拿新标杆品牌数据对应的relationId,
    const relationIds:any = [];
    // 拿到所有的标杆品牌会联动的品牌id数据
    const allRelationIds:any = [];
    options?.labelSystemBrand?.data?.map((item) => {
      if (checked?.labelSystemBrand?.includes(item.id)) {
        relationIds.push(item.relationId);
      }
      allRelationIds.push(item.relationId);
    });

    const notRelationPreferenceBrand:any = [];
    // 旧的偏好数据去遍历，得到不会根据标杆品牌id联动的数据
    checked?.preferenceBrand?.map((item) => {
      if (!allRelationIds.includes(item)) {
        notRelationPreferenceBrand.push(item);
      }
    });
    // 标杆品牌商圈选中对应的品牌id = 不会根据标杆品牌id联动的数据 + 会与标杆品牌id联动的数据
    const labelStystemRelationBrands = [...notRelationPreferenceBrand, ...relationIds];

    // 根据现有偏好品牌筛选出标杆品牌商圈选中对应的品牌id有的结果
    const res:any = [];
    options?.preferenceBrand?.data?.map((item) => {
      if (labelStystemRelationBrands.includes(item.originBrandId)) {
        res.push(item.originBrandId);
      }
    });
    setChecked({
      ...checked,
      preferenceBrand: res
    });
  }, [checked?.labelSystemBrand, options]);

  /**
   * @description 把标杆品牌分为会联动和不会联动两部分
   * 不会联动的,看看之前是否选中，选中再添加
   * 会联动的,看看偏好品牌中是否选中，选中再添加
   */
  useEffect(() => {
    if (changeTypeRef.current !== preferenceBrand) return;
    const willRelation:any = [];// 这个放的是relationId
    const notRelation:any = [];// 这个放的是标杆品牌的id
    const brandIds = options?.preferenceBrand?.data?.map((item) => item.originBrandId);
    options?.labelSystemBrand?.data?.map((item) => {
      if (brandIds.includes(item.relationId)) {
        willRelation.push(item.relationId);
      } else {
        notRelation.push(item.id);
      }
    });

    // 不会联动的,看看之前是否选中，选中再添加
    const selectedNotRelation:any = [];
    checked?.labelSystemBrand?.map((item) => {
      if (notRelation.includes(item)) {
        selectedNotRelation.push(item);
      }
    });

    // 会联动的,看看偏好品牌中是否选中，选中再添加
    // 新偏好品牌中和标杆品牌（会联动的）重合=>会联动的标杆品牌且偏好品牌中已选
    const arr:any = [];

    checked?.preferenceBrand?.map((item) => {
      if (willRelation.includes(item)) {
        arr.push(item);
      }
    });
    const _arr:any = [];
    // 将品牌id反射为标杆品牌id
    options?.labelSystemBrand?.data?.map((item) => {
      if (arr.includes(item.relationId)) {
        _arr.push(item.id);
      }
    });
    const res = [...selectedNotRelation, ..._arr];
    setChecked({
      ...checked,
      labelSystemBrand: res
    });
  }, [checked?.preferenceBrand, options]);

  return (
    <MapDrawer
      placement='left'
      mapDrawerStyle={{
        width: '240px',
        top: '64px',
        left: '16px',
        bottom: '5px',
        transform: mapDrawerOpen ? 'translateX(0%)' : 'translateX(-256px)'
      }}
      closeConStyle={{
        top: '175px',
      }}
      visible={mapDrawerOpen}
      setVisible={setMapDrawerOpen}
    >
      {/* 筛选条件 */}
      <div className={styles.leftCon}>
        <div className={styles.top}>
          <div className={styles.topTitle}>筛选商圈</div>
          {
            showClearAll
              ? <div className={styles.topClear} onClick={clearAll}>清除所有</div> : <></>
          }
        </div>
        <div className={styles.content}>


          {hideTips ? <></> : <div className={styles.tips}>
            <span className='c-ff8'>已为您选中推荐标签</span>
            {/* ui要求icon大小为8px,但是点击热区为12*12 */}
            <span className={styles.iconBox} onClick={handleHideTips}>
              <IconFont iconHref='pc-common-icon-ic_closeone' className={styles.icon}/>
            </span>
          </div>}
          {/* <Card
            titleText='网规商圈'
            label={labelPlanCluster}
            options={options}
            checked={checked}
            setChecked={setChecked}
            setOptions={setOptions}
            slot={renderLabel}
            changeTypeRef={changeTypeRef}
          /> */}
          <Card
            titleText='自定义标签'
            label={labelCustom}
            options={options}
            checked={checked}
            setChecked={setChecked}
            setOptions={setOptions}
            changeTypeRef={changeTypeRef}
          />
          <Card
            titleText='商圈特性'
            label={labelSystemHighQuality}
            options={options}
            checked={checked}
            setChecked={setChecked}
            setOptions={setOptions}
            changeTypeRef={changeTypeRef}
          />
          <Card
            titleText='标杆品牌商圈'
            label={labelSystemBrand}
            options={options}
            checked={checked}
            setChecked={setChecked}
            setOptions={setOptions}
            changeTypeRef={changeTypeRef}
          />
          {/* <Card
            titleText='商圈客群'
            label={labelSystemFlow}
            options={options}
            checked={checked}
            setChecked={setChecked}
            setOptions={setOptions}
            changeTypeRef={changeTypeRef}
          /> */}
          <Card
            titleText='商圈特点'
            label={labelSystemMall}
            options={options}
            checked={checked}
            setChecked={setChecked}
            setOptions={setOptions}
            changeTypeRef={changeTypeRef}
          />
          <Card
            titleText='偏好品牌'
            label={preferenceBrand}
            options={options}
            checked={checked}
            setChecked={setChecked}
            setOptions={setOptions}
            showSelect
            disabledKey={avoidBrand}
            targetNames={{
              name: 'name',
              id: 'originBrandId'
            }}
            changeTypeRef={changeTypeRef}
          />
          <Card
            titleText='避开品牌'
            label={avoidBrand}
            options={options}
            checked={checked}
            setChecked={setChecked}
            setOptions={setOptions}
            showSelect
            disabledKey={preferenceBrand}
            targetNames={{
              name: 'name',
              id: 'originBrandId'
            }}
            changeTypeRef={changeTypeRef}
          />
          <Card
            titleText='商圈类型'
            label={firstLevelCategory}
            options={options}
            checked={checked}
            setChecked={setChecked}
            setOptions={setOptions}
            changeTypeRef={changeTypeRef}
          />
          {/* 评分区间 */}
          <ScoreSection
            setScore={setScore}
            form={form}
          />
          <Card
            titleText='小区建筑年代'
            label={houseYear}
            options={options}
            checked={checked}
            setChecked={setChecked}
            setOptions={setOptions}
            changeTypeRef={changeTypeRef}
          />
          <Card
            titleText='小区户数'
            label={households}
            options={options}
            checked={checked}
            setChecked={setChecked}
            setOptions={setOptions}
            changeTypeRef={changeTypeRef}
          />
          <Card
            titleText='办公'
            label={workType}
            options={options}
            checked={checked}
            setChecked={setChecked}
            setOptions={setOptions}
            changeTypeRef={changeTypeRef}
          />
          <Card
            titleText='学校'
            label={schoolType}
            options={options}
            checked={checked}
            setChecked={setChecked}
            setOptions={setOptions}
            changeTypeRef={changeTypeRef}
          />
          <Card
            titleText='交通'
            label={trafficType}
            options={options}
            checked={checked}
            setChecked={setChecked}
            setOptions={setOptions}
            changeTypeRef={changeTypeRef}
          />
          <Card
            titleText='景区'
            label={scenicType}
            options={options}
            checked={checked}
            setChecked={setChecked}
            setOptions={setOptions}
            changeTypeRef={changeTypeRef}
          />
          <Card
            titleText='医院'
            label={medicalType}
            options={options}
            checked={checked}
            setChecked={setChecked}
            setOptions={setOptions}
            changeTypeRef={changeTypeRef}
          />
          <Card
            titleText='其他市场'
            label={otherType}
            options={options}
            checked={checked}
            setChecked={setChecked}
            setOptions={setOptions}
            changeTypeRef={changeTypeRef}
          />
          <Card
            titleText='辐射居住人口排名'
            label={radiationResidentsList}
            options={options}
            checked={checked}
            setChecked={setChecked}
            setOptions={setOptions}
            changeTypeRef={changeTypeRef}
          />
          <Card
            titleText='辐射办公人口排名'
            label={radiationWorkPopulationList}
            options={options}
            checked={checked}
            setChecked={setChecked}
            setOptions={setOptions}
            changeTypeRef={changeTypeRef}
            showLine={false}
          />
        </div>
      </div>
    </MapDrawer>
  );
};

export default ConditionSidebar;
