import DrawerSide from './DrawerSide';
import { FC, useEffect, useMemo, useState } from 'react';
import styles from '../entry.module.less';
import cs from 'classnames';
import { Checkbox, DatePicker, Popover } from 'antd';
import { useMethods } from '@lhb/hook';
import { isArray } from '@lhb/func';
import { fetchAreaList } from '@/common/api/selection';
import IconFont from '@/common/components/IconFont';
import { AreaChartColorList, areaIcon, featureOptionsEnum, fetchCustomerList } from '../ts-config';
import { tenantCheck } from '@/common/api/common';
import ProvinceListForMap from '@/common/components/AMap/components/ProvinceListForMap';
import { City, CITY_LEVEL } from '@/common/components/AMap/ts-config';
import dayjs from 'dayjs';
import Cluster from '../../../../../common/components/business/IndustryMap/Cluster';
import MapController from '../../../../../common/components/business/IndustryMap/MapController';
import IndustryMarker from '../../../../../common/components/business/IndustryMap/IndustryMarker';
import MassMarker from '../../../../../common/components/business/IndustryMap/MassMarker';
import LevelLayer from '@/common/components/AMap/components/LevelLayer';
import MapTree from './MapTree';
import { useSelector } from 'react-redux';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { bigdataBtn } from '@/common/utils/bigdata';

const brandTitle = 'title2';
const LeftCon: FC<{
  _mapIns?: any;
  brandList: any[];
  permissionList: any[];
  brandColorMap: any;
  city: City | undefined;
  level: number;
  month: any;
  setHeatType: Function; // 设置选中的热力图类别
  setMonth: Function;
  setCurAreaInfo: Function;
  URLParamsRef: any;
  getBrandList?: Function;
  setFeatureEntryOptions?: Function;
  heatType?:any;
}> = ({
  _mapIns,
  brandList,
  permissionList,
  brandColorMap,
  city,
  level,
  month,
  setHeatType,
  setMonth,
  setCurAreaInfo,
  URLParamsRef,
  getBrandList,
  setFeatureEntryOptions,
  heatType
}) => {
  const [areaList, setAreaList] = useState<any>([]); // 重点商圈列表
  const [open, setOpen] = useState<boolean>(true); // 左侧卡片隐藏开关
  const [customerList, setCustomerList] = useState<any>(null); // 客群分布情况列表---不是babycare用户时是默认值
  const [currCheckedTree, setCurrCheckedTree] = useState<string>('all'); // 用来判断禁止选择的树
  const [brandCheckList, setBrandCheckList] = useState<any>([]); // 品牌网店被选择项
  const [areaCheckList, setAreaCheckList] = useState<any>([]); // 重点商圈被选择项
  const [industryCheckList, setIndustryCheckList] = useState<any>([]); // 全品牌网点分布被选择项
  const [customerCheckList, setCustomerCheckList] = useState<any>([]); // 客群分布情况被选择项
  const [areaColorMap, setAreaColorMap] = useState<any>({});
  const [areaIconMap, setAreaIconMap] = useState<any>({});
  const [levelCheckList, setLevelCheckList] = useState<any>([]);
  const [featureVal, setFeatureVal] = useState<any>([]);
  const tenantInfo = useSelector((state: any) => state.common.tenantInfo);
  const [featureOptions, setFeatureOptions] = useState<any>([]);
  // 是否展示排名
  const [showRankArea, setShowRankArea] = useState<any>([]);
  // 选择了品牌网点分布 || 重点商圈后，聚合状态下的数据
  const [targetClusterData, setTargetClusterData] = useState<any[]>([]);

  useEffect(() => {
    if (tenantInfo.shopFunctionStatus) {
      // 门店功能选择展示状态 0-不展示 1-汽车行业（销售、售后、交付） 2-餐饮行业（堂食、外卖）
      setFeatureOptions([...(tenantInfo.shopFunctionStatus === 1 ? featureOptionsEnum.car : featureOptionsEnum.food)]);
      const values = [
        ...(tenantInfo.shopFunctionStatus === 1
          ? featureOptionsEnum.car.map((item) => item.value)
          : featureOptionsEnum.food.map((item) => item.value)),
      ];

      setFeatureEntryOptions && setFeatureEntryOptions(values);
      setFeatureVal(values);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantInfo]);

  useEffect(() => {
    // 当回退到省/全国的时候检查是否还是多个树选择，如果是保留第一个
    if (level < CITY_LEVEL) {
      let flag = false;
      if (brandCheckList.length > 0) {
        flag = true;
        setCurrCheckedTree('brand');
      }
      if (areaCheckList.length > 0) {
        if (flag) {
          setAreaCheckList([]);
          URLParamsRef.current.areaCheckList = [];
        } else {
          flag = true;
          setCurrCheckedTree('area');
        }
      }
      if (customerCheckList.length > 0) {
        if (flag) {
          setCustomerCheckList([]);
          URLParamsRef.current.customerCheckList = [];
        } else {
          setCurrCheckedTree('customer');
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);
  useEffect(() => {
    // 根据权限判断是否获取商圈和客群分布
    permissionList.includes('area') && getAreaList();
    permissionList.includes('customer') && getCustomerList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionList]);
  const {
    onCheckBrandTree,
    onSelectBrandTree,
    onCheckAreaTree,
    getAreaList,
    getCustomerList,
    onClickCustomerSwitch,
    onClickAreaSwitch,
    onCheckCustomerTree,
    onCheckIndustry,
    onCheckDistrict,
    onChangeDate,
    disabledDate,
    onFeatureChange,
    getClusterData
  } = useMethods({
    onCheckBrandTree: (checkedKeys) => {
      bigdataBtn('6d898836-7988-491c-a983-5dc59ea9d70b', '行业地图', '品牌网点分布', '点击了品牌网点分布');
      if (checkedKeys.length === 0) {
        setCurrCheckedTree('all');
      } else if (currCheckedTree !== 'brand') {
        setCurrCheckedTree('brand');
      }
      const data = checkedKeys.filter((key) => key.toString().indexOf('title') === -1);
      setBrandCheckList(data);
      URLParamsRef.current.brandCheckList = data;
    },
    onSelectBrandTree: (checkedKeys, node) => {
      bigdataBtn('6d898836-7988-491c-a983-5dc59ea9d70b', '行业地图', '品牌网点分布', '点击了品牌网点分布');

      const curSelectValue = node.node.key;
      // 当选择了标题（品牌网点分布）
      if (curSelectValue === brandTitle) {
        if (brandList.length === brandCheckList.length) {
          setBrandCheckList([]);
          URLParamsRef.current.brandCheckList = [];
          return;
        } else {
          const selectArr = brandList.map((item) => item.id);
          setBrandCheckList(selectArr);
          URLParamsRef.current.brandCheckList = selectArr;
          return;
        }
      }
      // 选择树的子项
      if (brandCheckList.includes(curSelectValue)) {
        setBrandCheckList((state) => state.filter((item) => item !== curSelectValue));
        URLParamsRef.current.brandCheckList = brandCheckList.filter((item) => item !== curSelectValue);
      } else {
        setBrandCheckList((state) => [...state, curSelectValue]);
        URLParamsRef.current.brandCheckList = [[...brandCheckList, curSelectValue]];
      }
    },
    // 重点商圈模块change事件
    onCheckAreaTree: (checkedKeys) => {
      bigdataBtn('a99bc51a-4578-42a5-b8b5-e20c6880a971', '行业地图', '重点商圈', '');
      if (areaList.length === 0) {
        V2Message.error('当前没有重点商圈数据，请添加后查看');
        return;
      }
      if (checkedKeys.length === 0) {
        setCurrCheckedTree('all');
      } else if (currCheckedTree !== 'area') {
        setCurrCheckedTree('area');
      }
      const data = checkedKeys.filter((key) => Number.isInteger(key));
      setAreaCheckList(data);
      URLParamsRef.current.areaCheckList = data;
    },
    onCheckIndustry: (checkedKeys) => {
      bigdataBtn('d3820287-fcab-4872-927d-45df6468aec3', '行业地图', '行业网点分布', '');
      setIndustryCheckList(checkedKeys);
      URLParamsRef.current.industryCheckList = checkedKeys;
    },
    onCheckDistrict: (checkedKeys) => {
      setLevelCheckList(checkedKeys);
      URLParamsRef.current.levelCheckList = checkedKeys;
    },
    getAreaList: async () => {
      const res = await fetchAreaList();
      const colorMap: any = {};
      const iconMap: any = {};
      isArray(res) &&
        res.forEach((item, ind) => {
          item.color = AreaChartColorList[ind < AreaChartColorList.length ? ind : ind % AreaChartColorList.length];
          item.icon = areaIcon[ind < AreaChartColorList.length ? ind : ind % AreaChartColorList.length];
          colorMap[item.id] = item.color;
          iconMap[item.id] = item.icon;
        });
      setAreaIconMap(iconMap);
      setAreaColorMap(colorMap);
      setAreaList(res || []);
    },
    getCustomerList: async () => {
      // 判断是否是babycare用户
      const result = await tenantCheck();
      if (!result || !result.isBabyCare) return;
      const res: any = await fetchCustomerList();
      setCustomerList(res || []);
    },
    onClickCustomerSwitch: (node, checked) => {
      customerList.forEach((item) => {
        if (item.key === node.key) {
          item.checked = checked;
        } else {
          item.checked && (item.checked = false);
        }
      });
      setCustomerList([...customerList]);
      // setHeatType(checked ? node.key : '');
      let arr:any = [];
      if (checked) {
        arr = heatType.includes(node.key) ? heatType : [...heatType, node.key];
      } else {
        arr = heatType.filter((item) => item !== node.key);
      }
      setHeatType(arr);

      URLParamsRef.current.heatType = arr;
    },
    onClickAreaSwitch: (node, checked) => {
      if (checked) {
        setShowRankArea([...showRankArea, node.key]);
        URLParamsRef.current.showRankArea = [...showRankArea, node.key];
      } else {
        const index = showRankArea.indexOf(node.key);
        showRankArea.splice(index, 1);
        setShowRankArea([...showRankArea]);
        URLParamsRef.current.showRankArea = [...showRankArea];
      }
    },
    onCheckCustomerTree: (checkedKeys) => {
      bigdataBtn('72871553-f7a0-4e45-b867-8a68ceb59e59', '行业地图', '客群分布情况', '');
      if (checkedKeys.length === 0) {
        setCurrCheckedTree('all');
      } else if (currCheckedTree !== 'customer') {
        setCurrCheckedTree('customer');
      }
      const data = checkedKeys.filter((key) => key.toString().indexOf('title') === -1);
      setCustomerCheckList(data);
      URLParamsRef.current.customerCheckList = data;
    },
    onChangeDate: (date) => {
      setMonth(date);
      URLParamsRef.current.month = date;
    },
    disabledDate: (currentDate) => {
      return !dayjs(currentDate).isBefore(dayjs().add(-1, 'month'));
    },
    onFeatureChange: (checked) => {
      setFeatureVal(checked);
      setFeatureEntryOptions && setFeatureEntryOptions(checked && checked.length ? checked : [-1]);
      getBrandList && getBrandList(checked && checked.length ? checked : [-1]);
    },
    getClusterData: (data: any[]) => { // 获取对应的聚合数据
      setTargetClusterData(data);
    }
  });
  const brandTreeData = useMemo(
    () => [
      {
        title: '品牌网点分布',
        key: brandTitle,
        icon: <IconFont iconHref='iconmendian' className='c-333' />,
        children: brandList.map((item) => {
          return {
            color: item.color,
            title: `${item.shortName || item.name} | ${item.total}个`,
            key: item.id,
            icon: (
              <div className='treeLogo'>
                <img
                  src={
                    item.logo
                      ? item.logo
                      : 'https://staticres.linhuiba.com/project-custom/locationpc/img_placeholder.png'
                  }
                />
              </div>
            ),
          };
        }),
        isTitle: true,
      },
    ],
    [brandList]
  );

  const areaTreeData = useMemo(
    () => [
      {
        title: (
          <span className={styles.areaTreeTitle}>
            重点商圈
            <Popover
              overlayClassName={styles.popoverOverlay}
              content={
                <div className={cs(styles.areaTreeLabel, 'bg-fff pl-12 pr-12')}>
                  {areaList.map((item) => (
                    <div className='mt-10' key={item.id}>
                      <div className='bold fn-14 c-333'>{item.name}</div>
                      <div className='c-656 fn-12'>{item.content}</div>
                    </div>
                  ))}
                </div>
              }
              placement='bottom'
              autoAdjustOverflow={false}
            >
              <span className='inline-block ml-5'>
                <IconFont iconHref='iconic_tip' className={styles.areaTreeIcon} />
              </span>
            </Popover>
          </span>
        ),
        key: 'title1',
        icon: <IconFont iconHref='iconmendian' className='c-333' />,
        children: areaList.map((item) => {
          return {
            show: item.showStatus,
            checked: item.showRanking,
            title: item.name,
            key: item.id,
            icon: <IconFont iconHref={item.icon} />,
          };
        }),
        isTitle: true,
      },
    ],
    [areaList]
  );
  const customerTreeData = useMemo(() => {
    if (!customerList) {
      return null;
    } else {
      return [
        {
          title: '客群分布情况',
          key: 'title3',
          icon: <IconFont iconHref='iconmendian' className='c-333' />,
          children: customerList.map((item) => {
            return {
              checked: 1,
              title: item.title,
              key: item.key,
              color: item.color,
              icon: (
                <div className='treeLogo'>
                  <img
                    src={
                      item.icon
                        ? item.icon
                        : 'https://staticres.linhuiba.com/project-custom/locationpc/img_placeholder.png'
                    }
                  />
                </div>
              ),
            };
          }),
          isTitle: true,
        },
      ];
    }
  }, [customerList]);

  return (
    <DrawerSide
      placement='left'
      visible={open}
      onClose={() => setOpen(false)}
      btnTop='90px'
      onShow={() => setOpen(true)}
    >
      <div className={cs(styles.leftCon, 'ml-16 mt-16')}>
        <ProvinceListForMap
          type={1}
          _mapIns={_mapIns}
          city={city}
          level={level}
          className='mb-16 bg-fff'
          style={{
            width: '294px'
          }}/>
        <div className='pd-12 bg-fff'>
          <div className={cs(styles.borderBottom, 'fn-16 c-132 bold pb-16')}>
            竞品分布地图
            <DatePicker
              allowClear={false}
              value={month}
              onChange={onChangeDate}
              disabledDate={disabledDate}
              picker='month'
            />
          </div>
          {!!tenantInfo.shopFunctionStatus && (
            <div className={styles.featureBox}>
              <div className={styles.featureLabel}>门店功能</div>
              <div className={styles.featureValue}>
                <Checkbox.Group options={featureOptions} value={featureVal} onChange={onFeatureChange} />
              </div>
            </div>
          )}
          <div className={styles.treeBox}>
            {/* 品牌网点 */}
            {permissionList.includes('brand') && (
              <MapTree
                onCheck={onCheckBrandTree}
                treeData={brandTreeData}
                checkedKeys={brandCheckList}
                onSelectBrandTree={onSelectBrandTree}
                disabled={currCheckedTree !== 'all' && currCheckedTree !== 'brand' && level < CITY_LEVEL}
              />
            )}
            {/* 重点商圈 */}
            {permissionList.includes('area') && (
              <MapTree
                onCheck={onCheckAreaTree}
                treeData={areaTreeData}
                clickSwitch={onClickAreaSwitch}
                showSwitch={true}
                switchTitle='显示排名'
                checkedKeys={areaCheckList}
                disabled={currCheckedTree !== 'all' && currCheckedTree !== 'area' && level < CITY_LEVEL}
              />
            )}
            {/* 行业网点分布 选用树组件便于后边产品扩充时增加层级 */}
            {permissionList.includes('spot') && (
              <MapTree
                onCheck={onCheckIndustry}
                treeData={[
                  {
                    title: '全品牌网点分布',
                    key: 'title4',
                    icon: <IconFont iconHref='iconmendian' className='c-333' />,
                    children: [],
                    isTitle: true,
                  },
                ]}
                checkedKeys={industryCheckList}
              />
            )}
            {/* 行政区划分布，到城市级别展示按钮 */}
            {level >= CITY_LEVEL && (
              <MapTree
                onCheck={onCheckDistrict}
                treeData={[
                  {
                    title: '行政区划分布',
                    key: 'title5',
                    icon: <IconFont iconHref='iconmendian' className='c-333' />,
                    children: [],
                    isTitle: true,
                  },
                ]}
                checkedKeys={levelCheckList}
              />
            )}
            {/* 客群分布 */}
            {permissionList.includes('customer') && customerTreeData && (
              <MapTree
                onCheck={onCheckCustomerTree}
                treeData={customerTreeData}
                checkedKeys={customerCheckList}
                clickSwitch={onClickCustomerSwitch}
                showSwitch={true}
                hasBtBorder={false}
                disabled={currCheckedTree !== 'all' && currCheckedTree !== 'customer' && level < CITY_LEVEL}
              />
            )}
          </div>
        </div>
        {/* 绘制聚合点位 */}
        {/* 将品牌网点分布和重点商圈的聚合状态Marker的逻辑耦合在一起，不好维护，重构的时候应该分开 */}
        <Cluster
          month={month}
          _mapIns={_mapIns}
          brandCheckList={brandCheckList}
          featureVal={featureVal}
          areaCheckList={areaCheckList}
          brandColorMap={brandColorMap}
          areaColorMap={areaColorMap}
          customerCheckList={customerCheckList}
          level={level}
          city={city}
          getBrandList={getBrandList}
          finallyData={getClusterData}
        />
        {/* 绘制点位和商圈 */}
        <MapController
          showRankArea={showRankArea}
          month={month}
          _mapIns={_mapIns}
          brandCheckList={brandCheckList}
          featureVal={featureVal}
          areaCheckList={areaCheckList}
          areaColorMap={areaColorMap}
          areaIconMap={areaIconMap}
          level={level}
          setCurAreaInfo={setCurAreaInfo}
          city={city}
          tenantInfo={tenantInfo}
        />
        {/* 全品牌网点-地图网点 */}
        {/* 绘制行业网点 */}
        <IndustryMarker _mapIns={_mapIns} city={city} level={level} industryCheck={industryCheckList} />
        {/* 绘制客群分布点位和聚合点 */}
        <MassMarker checkList={customerCheckList} _mapIns={_mapIns} city={city} level={level} />
        {/* 绘制行政区颜色 */}
        <LevelLayer
          _mapIns={_mapIns}
          level={level}
          city={city}
          targetData={targetClusterData}
          isAllLevel={!!levelCheckList?.length}
        />
      </div>
    </DrawerSide>
  );
};

export default LeftCon;
