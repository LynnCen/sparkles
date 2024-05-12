/**
 * @Description 周边配套-某个模板的poi信息
 *  按照模板配置展示
 *
 * 页面已废弃
 *
 */
import { FC, useEffect, useRef, useState } from 'react';
import { Spin } from 'antd';
import V2Tabs from '@/common/components/Data/V2Tabs';
import PoiMap from '../../Category/components/PoiMap';
import PoiTable from './components/PoiTable';
import { useMethods } from '@lhb/hook';
import styles from './index.module.less';
import cs from 'classnames';
import RadiusSlider from '../../Category/components/RadiusSlider';
import { post } from '@/common/request';

interface CategoryProps {
  lat?: number;
  lng?: number;
  radius?: number; // 半径（米）
  centerName?: string;
  centerAddress?: string;
  poiSearchType?:1|2;// 1为圆形、2为多边形
  borders?:any// 围栏
  parentTabActive?: string; // 父级tab
  // cityName?:string // 城市名称
  setCategoryCounts?: Function; // 各category的poi数统计回调
}

const Category: FC<CategoryProps> = ({
  lat,
  lng,
  radius = 500,
  centerName,
  centerAddress,
  poiSearchType = 1,
  borders,
  parentTabActive,
  // cityName,
  setCategoryCounts,
}) => {

  const poiMapRef = useRef<any>();
  const [amapIns, setAmapIns] = useState<any>(null); // 地图实例
  const [activePoiTypeList, setActivePoiTypeList] = useState<any>([]); // 当前二级tab信息
  const [loading, setLoading] = useState<boolean>(false);
  const [tabItems, setTabItems] = useState<any>();
  const [tabActive, setTabActive] = useState<string>('0');
  const [sliderValue, setSliderValue] = useState<number>(radius);
  const [originCategoryCounts, setOriginCategoryCounts] = useState<any>([]); // 分类原始数据

  useEffect(() => {
    amapIns && amapIns.clearMap();
    methods.getTabs();
  }, []);

  useEffect(() => {
    if (parentTabActive && originCategoryCounts?.length) {
      const currentItem = originCategoryCounts[+parentTabActive];
      const _params = {
        longitude: lng,
        latitude: lat,
        name0: currentItem.name,
        name1: currentItem?.children[+tabActive]?.name,
        range: sliderValue, // 默认 500m 以内
      };
      // 处理某category下的attributes
      // todo: 当前暂时不显示icon, 后端（宋道涵）和产品确认暂时拿不到，
      const tabs = currentItem?.children?.map((itm, index) => ({
        label: `${itm.name} ${itm.poiNum}`,
        key: `${index}`,
        disabled: !itm.poiNum,
        children: <PoiTable
          poiMapRef={poiMapRef.current}
          tabItem={itm}
          isReport={false}
          params={_params}
          radius={sliderValue}
          setLoading={setLoading}
          // setPoiCount={setPoiCount}
          isShowAddress={true}
          activePoiTypeList={activePoiTypeList}
          setActivePoiTypeList={setActivePoiTypeList}
        />
      }));
      setTabItems(tabs);
    }
  }, [parentTabActive, tabActive, originCategoryCounts, sliderValue]);

  const methods = useMethods({
    /**
     * @description 获取tab数字
     */
    getTabs: async () => {
      try {
        const _params = {
          // poiSearchType, // 必须，搜索类型
          longitude: lng,
          latitude: lat,
          // address: centerAddress, // 具体地址
          // cityName,
          range: sliderValue, // 默认 500m 以内
          // borders, // 获取poi点位需要
        };
        // https://yapi.lanhanba.com/project/511/interface/api/69782
        const { industries } = await post(`/surround/poi/level_count`, _params);

        // 处理各category的统计
        setCategoryCounts && setCategoryCounts(industries);
        setOriginCategoryCounts(industries);
      } catch (error) {
        console.log('获取tab失败 error', error);
      }
    },
  });

  return (
    <>
      <div className={styles.category}>
        <Spin spinning={loading}>
          <div className={styles.mapBox}>

            <PoiMap
              ref={poiMapRef}
              poiTypeList={activePoiTypeList}
              lat={lat}
              lng={lng}
              radius={sliderValue}
              amapIns={amapIns}
              setAmapIns={setAmapIns}
              poiSearchType={poiSearchType}
              borders={borders}
              centerName={centerName}
              centerAddress={centerAddress}
            />

            <RadiusSlider
              setRadius={setSliderValue}
              defaultValue={0.5}
            />
          </div>

          <div className={cs(styles.childListWrapper, 'bg-fff')}>
            <V2Tabs
              items={tabItems}
              activeKey={tabActive}
              // type='fullCard'
              destroyInactiveTabPane
              onTabClick={(val) => setTabActive(val)}
            />
          </div>
        </Spin>
      </div>
    </>
  );
};

export default Category;

