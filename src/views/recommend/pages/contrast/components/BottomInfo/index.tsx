/**
 * @Description 底部柱状图
 * 1207 - 【地理区域门店数量对比】模块无数据，去除
 */

import { FC, useEffect, useMemo, useState } from 'react';
import styles from './index.module.less';
import {
  getChartData,
  getStoreTypeData,
  getAddShopData,
  getCloseShopData,
  getCityTypeChartData
} from '@/common/api/recommend';
import { isArray, refactorSelection } from '@lhb/func';
import Card from './components/Card';
import { tabType } from '../../ts-config';
import { getSelectionArea } from '@/common/api/yhtang';
import V2Form from '@/common/components/Form/V2Form';
import { Cascader, Form } from 'antd';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';

const BottomInfo:FC<any> = ({
  selectedInfo,
  selectedBrand, //
  cityTypes,
  curTabs,
  selections,
}) => {
  const [form] = Form.useForm();
  const cityIds = Form.useWatch('cityIds', form);

  const [baseInfo, setBaseInfo] = useState<any>([]);
  const [cityInfo, setCityInfo] = useState<any>([]);
  // const [areaInfo, setAreaInfo] = useState<any>([]);
  const [addTendency, setAddTendency] = useState<any[]>([]);
  const [closeTendency, setCloseTendency] = useState<any[]>([]);
  const [cityLevelInfo, setCityLevelInfo] = useState<any>([]);
  const [areaStoreInfo, setAreaStoreInfo] = useState<any>([]);

  const [addTendencySelected, setAddTendencySelected] = useState<any>('');
  const [closeTendencySelected, setCloseTendencySelected] = useState<any>('');
  const [cityLevelSelected, setCityLevelSelected] = useState<any>('');
  const [areaStoreSelected, setAreaStoreSelected] = useState<any>('');

  const [areaOptions, setAreaOptions] = useState<any>([]);
  const storeTendencySelections = useMemo(() => {
    if (!(isArray(selections?.periodList) && selections?.periodList.length)) return;
    const arr:any = [];
    selections?.periodList?.map((item) => {
      arr.push({
        ...item,
        label: item.name,
        value: item.id
      });
    });
    setAddTendencySelected(selections?.periodList[0].id);
    setCloseTendencySelected(selections?.periodList[0].id);
    return arr;
  }, [selections]);


  const curCityLevelInfo = useMemo(() => {
    let res:any = [];
    cityLevelInfo?.map((item) => {
      if (item.positionId === cityLevelSelected) {
        res = item.dataList;
      }
    });
    return res;
  }, [cityLevelInfo, cityLevelSelected]);

  const curAreaStoreInfo = useMemo(() => {
    let res:any = [];
    areaStoreInfo?.map((item) => {
      if (item.positionId === areaStoreSelected) {
        res = item.dataList;
      }
    });
    return res;
  }, [areaStoreInfo, areaStoreSelected]);

  const cityInfoSelections = useMemo(() => {
    const arr:any = [];
    cityLevelInfo?.map((item) => {
      arr.push({
        ...item,
        label: item.positionName,
        value: item.positionId
      });
    });
    return arr;
  }, [cityLevelInfo]);

  const areaStoreInfoSelections = useMemo(() => {
    const arr:any = [];
    areaStoreInfo?.map((item) => {
      arr.push({
        ...item,
        label: item.positionName,
        value: item.positionId
      });
    });
    return arr;
  }, [areaStoreInfo]);

  // 获取基本信息数据
  const getBaseInfo = async() => {
    getChartData({ type: 1, brandIds: selectedBrand })
      .then((data) => {
        setBaseInfo(data);
      });
  };

  // 获取城市等级分布数据 TODO:
  const getCityInfo = async() => {
    getCityTypeChartData({ type: 5, brandIds: selectedBrand })
      .then((data) => {
        setCityInfo(data);
      });
  };

  // 获取地理区域分布数据 TODO:
  // const getAreaInfo = async() => {
  //   getChartData({ type: 3, brandIds: selectedBrand })
  //     .then((data) => {
  //       setAreaInfo(data);
  //     });
  // };

  // 获取新增门店趋势数据
  const getAddStoreTendency = async() => {
    if (!addTendencySelected) return;

    const { cityIds: cities } = form.getFieldsValue();
    const cityIds: number[] = cities ? cities.map(subArray => subArray[1]) : []; // 获取每个子数组的第2个元素--城市id
    getAddShopData({
      brandIds: selectedBrand,
      type: addTendencySelected || selections?.periodList[0].id,
      cityIds
    })
      .then((data) => {
        setAddTendency(data);
      });
  };
  // 获取闭店门店趋势数据
  const getCloseStoreTendency = async() => {
    if (!closeTendencySelected) return;

    const { cityIds: cities } = form.getFieldsValue();
    const cityIds: number[] = cities ? cities.map(subArray => subArray[1]) : []; // 获取每个子数组的第2个元素--城市id
    getCloseShopData({
      brandIds: selectedBrand,
      type: closeTendencySelected || selections?.periodList[0].id,
      cityIds
    })
      .then((data) => {
        setCloseTendency(data);
      });
  };
  //  获取新增门店趋势数据-区域筛选下拉选项
  const getAreas = () => {
    getSelectionArea().then((data) => {
      isArray(data) && data.length && setAreaOptions(data);
    });
  };

  // 获取城市线级商圈对比
  const getCityLevelInfo = async(params = {}) => {
    getStoreTypeData({ type: 2, brandIds: selectedBrand, ...params })
      .then((data) => {
        setCityLevelSelected(data[0].positionId);
        setCityLevelInfo(data);
      });
  };

  // 获取城市线级商圈对比
  const getAreaStoreInfo = async(params = {}) => {
    getStoreTypeData({ type: 4, brandIds: selectedBrand, ...params })
      .then((data) => {
        setAreaStoreSelected(data[0].positionId);
        setAreaStoreInfo(data);

      });
  };

  useEffect(() => {
    if (!(isArray(selectedBrand) && selectedBrand.length)) {
      setBaseInfo([]);
      setCityInfo([]);
      // setAreaInfo([]);
      setAddTendency([]);
      setCloseTendency([]);
      setCityLevelInfo([]);
      setAreaStoreInfo([]);
      return;
    };
    if (curTabs === tabType.STORE_NUM) {
      getBaseInfo();
      getCityInfo();
      // getAreaInfo();
      return;
    }
    if (curTabs === tabType.STORE_TYPE) {
      getAreas();
      getCityLevelInfo();
      getAreaStoreInfo();
      getAddStoreTendency();
      getCloseStoreTendency();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrand, curTabs, cityTypes]);

  useEffect(() => {
    if (!(isArray(selectedBrand) && selectedBrand.length)) {
      return;
    }
    // 获取新增门店趋势的接口根据选项重新请求
    getAddStoreTendency();
  }, [addTendencySelected, cityIds]);

  useEffect(() => {
    if (!(isArray(selectedBrand) && selectedBrand.length)) {
      return;
    }
    // 获取闭店门店趋势的接口根据选项重新请求
    getCloseStoreTendency();
  }, [closeTendencySelected, cityIds]);

  return <div className={styles.bottomInfoContainer}>
    {
      curTabs === tabType.STORE_NUM
        ? <>
          <Card
            label='省市门店数量对比'
            selectedInfo={selectedInfo}
            data={baseInfo}
            noborder
            noLengend
            dataType='storeNumCharts'
          />
          <Card
            label='各线级城市门店数量对比'
            selectedInfo={selectedInfo}
            data={cityInfo}
            selectedBrand={selectedBrand}
            dataType='cityTypeCharts'
          />
          {/* <Card
            label='地理区域门店数量对比'
            selectedInfo={selectedInfo}
            data={areaInfo}
          /> */}

        </> : <></>
    }
    {
      curTabs === tabType.STORE_TYPE
        ? <>
          <Card
            label='城市线级商圈对比'
            selectedInfo={selectedInfo}
            data={curCityLevelInfo}
            options={cityInfoSelections}
            setState={setCityLevelSelected}
            // extarTips='线级城市全部按照国家标准进行统计'
          />
          <Card
            label='新增门店趋势'
            selectedInfo={selectedInfo}
            data={addTendency}
            dataType='addStoreTendency'
            options={storeTendencySelections}
            curSelected={addTendencySelected}
            setState={setAddTendencySelected}
            // 其他筛选
            otherScreens={(
              <>
                <V2Form layout = 'horizontal' form={form} className={styles.extrSelectCon}>
                  <V2FormCascader
                    label='区域筛选'
                    name='cityIds'
                    options={refactorSelection(areaOptions, { children: 'cities' })}
                    className={styles.regionalScreens}
                    config={{
                      multiple: true,
                      showCheckedStrategy: Cascader.SHOW_CHILD,
                      maxTagCount: 'responsive',
                      getPopupContainer: (node) => node.parentNode,
                    }}

                  />
                </V2Form>
              </>
            )}
          />
          <Card
            label='关闭门店趋势'
            selectedInfo={selectedInfo}
            data={closeTendency}
            dataType='closeStoreTendency'
            options={storeTendencySelections}
            curSelected={closeTendencySelected}
            setState={setCloseTendencySelected}
            // 其他筛选
            otherScreens={(
              <>
                <V2Form layout = 'horizontal' form={form} className={styles.extrSelectCon}>
                  <V2FormCascader
                    label='区域筛选'
                    name='cityIds'
                    options={refactorSelection(areaOptions, { children: 'cities' })}
                    className={styles.regionalScreens}
                    config={{
                      multiple: true,
                      showCheckedStrategy: Cascader.SHOW_CHILD,
                      maxTagCount: 'responsive',
                      getPopupContainer: (node) => node.parentNode,
                    }}

                  />
                </V2Form>
              </>
            )}
          />
          <Card
            label='地理区域门店数量对比'
            selectedInfo={selectedInfo}
            data={curAreaStoreInfo}
            options={areaStoreInfoSelections}
            setState={setAreaStoreSelected}
          />
        </> : <></>
    }
  </div>;
};
export default BottomInfo;
