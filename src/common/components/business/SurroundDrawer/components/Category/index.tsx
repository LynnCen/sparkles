/**
 * @Description 周边详情-某个模板的poi信息
 *  按照模板配置展示
 *
 * 参照原有组件实现
 *  src/views/recommend/pages/detail/components/Report.tsx
 */
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Skeleton, Spin } from 'antd';
import V2Tabs from '@/common/components/Data/V2Tabs';
import PoiMap from './components/PoiMap';
import PoiTable from './components/PoiTable';
import { useMethods } from '@lhb/hook';
import { getSourroundPoiCount } from '@/common/api/surround';
import { modelCircleCount } from '@/common/api/recommend';
import styles from './index.module.less';
import cs from 'classnames';
import { Select } from 'antd';


const reference = {
  around: '小区、写字楼、酒店、教育机构、学校、医院、公园等人流聚集场所的数量',
  business: '有利于消费的大型商场、购物中心、旅游景点、餐饮、零售、服装品类数量',
  competition: '同类型店铺的品类及数量',
  traffic: '交通相关点位中地铁、公交站、停车场、火车站、机场的数量',
};

interface CategoryProps {
  tabKey: string; // 周边信息的code，around/business/competition/traffic
  categoryId?: number; // 类目id
  lat?: number;
  lng?: number;
  radius?: number; // 半径（米）
  detail?:any;// 详情
  address?: string;
  isShowAddress?: boolean; // 是否在表格中展示poi详情地址
  poiSearchType?:1|2;// 1为圆形、2为多边形
  borders?:any// 围栏
  cityName?:string // 城市名称
  showRadiusSelect?:boolean // 是否显示半径选择器
  isReport?:boolean // 是否是推荐区域报告内
  props?:any
  stickyLeft?:boolean // 地图固定，表格自适应
}

const Category: FC<CategoryProps> = ({
  tabKey,
  categoryId,
  lat,
  lng,
  radius,
  detail,
  address,
  isShowAddress = false,
  poiSearchType,
  borders,
  cityName,
  stickyLeft = false, // 地图容器样式
  showRadiusSelect = false,
  isReport = false,
  props
}) => {

  const poiMapRef = useRef<any>();
  const [amapIns, setAmapIns] = useState<any>(null); // 地图实例
  const [activePoiTypeList, setActivePoiTypeList] = useState<any>([]); // 当前二级tab信息
  const [rangeVal, setRangeVal] = useState<number>(250);
  const [poiCount, setPoiCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [tabActive, setTabActive] = useState<string>(''); // 当前tab值
  const [tabItems, setTabItems] = useState<any>();

  useEffect(() => {
    amapIns && amapIns.clearMap();

    if (categoryId) {
      methods.getTabs();
    }
  }, [lat, lng, categoryId, rangeVal]);

  const params = useMemo(() => ({
    categoryId,
    lng,
    lat,
    address, // 具体地址
    poiSearchType, // 搜索类型
    cityName,
    radius: showRadiusSelect ? rangeVal : radius,
    borders, // 获取poi点位需要
  }), [categoryId, rangeVal]);

  const methods = useMethods({

    /**
     * @description 获取tab数字
     */
    getTabs: async () => {
      try {
        const _params = isReport ? {
          categoryId,
          reportId: props.reportId,
          lng,
          lat,
          radius: showRadiusSelect ? rangeVal : radius,
        } : params;
        const api = isReport ? modelCircleCount : getSourroundPoiCount;
        const data = await api(_params);
        const res = isReport ? data.filter((item) => item.count !== 0) : data.filter((item) => item.pointNum !== 0);
        const tabs = Array.isArray(res) ? res.map((itm) => ({
          label: `${itm.attributeName || itm.name} ${itm.pointNum || itm.count}`,
          key: `${itm.code}`,
          children: <PoiTable
            poiMapRef={poiMapRef.current}
            tabItem={itm}
            isReport={isReport}
            params={_params}
            radius={showRadiusSelect ? rangeVal : radius}
            setLoading={setLoading}
            setPoiCount={setPoiCount}
            isShowAddress={isShowAddress}
            activePoiTypeList={activePoiTypeList}
            setActivePoiTypeList={setActivePoiTypeList}
          />
        })) : [];
        setTabItems(tabs);
        setPoiCount(0);
        setTabActive(tabs?.[0]?.key); // 设置初始值
      } catch (error) {
        console.error('获取tab失败', error);
      }
    },
  });

  /**
   * @description 改变tab
   * @param val code
   * @return
   */
  const onChangeTab = async (val) => {
    setTabActive(val);
  };


  /**
   * @description 获取poi点位 TODO: 轮询请求的效果不好
   * @param code 当起二级类型
   * @return
   */
  // const getPoiList = async (itm, pageValue?) => {
  //   try {
  //     setLoading(true);
  //     const res = await getSourroundPois({
  //       page: 1,
  //       size: 500, // TODO: 先写死
  //       ...pageValue,
  //       ...params,
  //       code: itm.code,
  //     });
  //     setActivePoiTypeList({ list: res.objectList, icon: itm.icon, attributeName: itm.attributeName });
  //     setPoiCount(res.totalNum);
  //     return res?.objectList;
  //   } catch (error) {
  //     V2Message.error('获取失败');
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  return (
    <>
      <div className={cs(styles.report, stickyLeft && styles.stickyLeft)}>
        <div className={styles.leftPart}>
          <Spin spinning={loading}>
            <div className={styles.mapBox}>
              {showRadiusSelect ? <div className={cs(styles.radiusSelect, 'bg-fff c-132 pl-10')}>
            POI统计范围半径：
                <Select
                  bordered={false}
                  style={{ width: 100 }}
                  value={rangeVal}
                  onChange={(val) => setRangeVal(val)}
                  options={[{
                    value: 1000,
                    label: '1000m'
                  }, {
                    value: 500,
                    label: '500m'
                  }, {
                    value: 250,
                    label: '250m'
                  }]}
                />
              </div> : <></>}

              <PoiMap
                ref={poiMapRef}
                poiTypeList={activePoiTypeList}
                lat={lat}
                lng={lng}
                radius={showRadiusSelect ? rangeVal : radius}
                amapIns={amapIns}
                setAmapIns={setAmapIns}
                poiSearchType={poiSearchType}
                borders={borders} />
              {/* area是平方千米 */}
              <span className={styles.radius}>可选址范围：{detail?.area ? (detail?.area * 1000 * 1000) : (3.14 * (radius || rangeVal) * (radius || rangeVal))}m²</span>
            </div>
            <div className={styles.iconList}>
              {
                <div className={styles.poiType}>
                  <div className={styles.imgBox}><img src={activePoiTypeList?.icon}/></div>
                  <span>{activePoiTypeList?.attributeName}</span>
                </div>
              }
            </div>
          </Spin>
        </div>

        <div className={styles.rightPart}>
          <div className={styles.poiTitle}>
            <Skeleton loading={loading} active={true} paragraph={{ rows: 1 }}>
              <p className={styles.poiNum}>
                <span>POI点位</span>
                <span>{poiCount}</span>
                <span>个</span>
              </p>
              <p>(参考因素：{reference[tabKey]})</p>
            </Skeleton>
          </div>


          <V2Tabs
            items={tabItems}
            activeKey={tabActive}
            destroyInactiveTabPane
            onTabClick={(val) => onChangeTab(val)}
          />
        </div>
      </div>
    </>
  );
};

export default Category;

