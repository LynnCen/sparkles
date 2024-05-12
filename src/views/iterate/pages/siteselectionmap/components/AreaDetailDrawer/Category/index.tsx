/**
 * @Description 周边配套-某个模板的poi信息
 *  按照模板配置展示
 *
 */
import { FC, useEffect, useRef, useState } from 'react';
import { Spin } from 'antd';
import V2Tabs from '@/common/components/Data/V2Tabs';
import PoiMap from './components/PoiMap';
import PoiTable from './components/PoiTable';
import { useMethods } from '@lhb/hook';
import { getSourroundPoiCount2Level } from '@/common/api/surround';
import styles from './index.module.less';
import cs from 'classnames';
import { isArray } from '@lhb/func';
import RadiusSlider from './components/RadiusSlider';

interface CategoryProps {
  categoryIds: number[];
  categoryId: number; // 类目id
  lat?: number;
  lng?: number;
  radius?: number; // 半径（米）
  centerName?: string;
  centerAddress?: string;
  poiSearchType?:1|2;// 1为圆形、2为多边形
  borders?:any// 围栏
  cityName?:string // 城市名称
  setCategoryCounts?: Function; // 各category的poi数统计回调
}

const Category: FC<CategoryProps> = ({
  categoryIds,
  categoryId,
  lat,
  lng,
  radius = 1000,
  centerName,
  centerAddress,
  poiSearchType = 1,
  borders,
  cityName,
  setCategoryCounts,
}) => {

  const poiMapRef = useRef<any>();
  const [amapIns, setAmapIns] = useState<any>(null); // 地图实例
  const [activePoiTypeList, setActivePoiTypeList] = useState<any>([]); // 当前二级tab信息
  const [loading, setLoading] = useState<boolean>(false);
  const [tabItems, setTabItems] = useState<any>();
  const [tabActive, setTabActive] = useState<string>('');
  const [sliderValue, setSliderValue] = useState<number>(radius);

  useEffect(() => {
    amapIns && amapIns.clearMap();
    if (categoryId && isArray(categoryIds) && categoryIds.length && sliderValue) {
      methods.getTabs();
    }
  }, [categoryId, categoryIds, sliderValue]);

  const methods = useMethods({
    /**
     * @description 获取tab数字
     */
    getTabs: async () => {
      try {
        const _params = {
          categoryIds, // 必须，所有categoryId，用于获取所有category各自poi总数
          categoryId, // 必须
          poiSearchType, // 必须，搜索类型
          lng,
          lat,
          address: centerAddress, // 具体地址
          cityName,
          radius: sliderValue, // 默认 1000m 以内
          borders, // 获取poi点位需要
        };
        const { attributeCounts, categoryCounts } = await getSourroundPoiCount2Level(_params);

        // 处理各category的统计
        setCategoryCounts && setCategoryCounts(categoryCounts);

        // 处理某category下的attributes
        const attributesInfo = isArray(attributeCounts) ? attributeCounts.filter((item) => item.pointNum !== 0) : [];
        const tabs = attributesInfo.map((itm) => ({
          label: `${itm.attributeName || itm.name} ${itm.pointNum || itm.count}`,
          key: `${itm.code}`,
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
        // setPoiCount(0);
        setTabActive(tabs.length ? tabs?.[0]?.key : ''); // 设置初始值
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
              defaultValue ={ 0.5}
            />
          </div>

          <div className={cs(styles.listWrapper, 'bg-fff')}>
            <V2Tabs
              items={tabItems}
              activeKey={tabActive}
              type='card'
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

