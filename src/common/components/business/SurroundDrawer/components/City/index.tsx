/**
 * @Description 周边详情各-城市信息
 *
 *  参照已有组件实现:商场初筛-场地详情-商场详情-城市市场评估
 *  src/views/car/pages/resourcedetail/components/AssessDrawer/components/AnalysisCityMarket
 *  注意生成图片中也用到了该组件 /imageserve/attachment
 */

import styles from './index.module.less';
import cs from 'classnames';
import { Row, Col } from 'antd';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import ModuleInfoWrapper from '@/common/components/business/ModuleInfoWrapper';
import InfoItemWrapper from '@/common/components/business/ModuleInfoWrapper/InfoItemWrapper';
import BoardCard from './components/BoardCard';
import { FC, useEffect, useMemo, useState } from 'react';
// import AMapDistrict from '@/common/components/AMap/AMapDistrict';
import Map from './components/Map';
import DemographicChangesCharts from './components/DemographicChangesCharts';
import GdpGrowthCharts from './components/GdpGrowthCharts';
import LazyLoad from '@/common/components/LazyLoad';
import { surroundCity, surroundDistrict } from '@/common/api/surround';
import { getLngLatAddress } from '@/common/utils/map';
import { codeToPCD } from '@/common/api/common';
import { deduplicateObjects } from '@/common/utils/ways';

const City: FC<any> = ({
  detail,
  cityId,
  isActiveTab,
  isFromImageserve
}) => {
  const [data, setData] = useState<any>({});
  const [loaded, setLoaded] = useState<boolean>(false);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [districtInfo, setDistrictInfo] = useState<any>([]);
  const [cityInfo, setCityInfo] = useState<any>([]);
  useEffect(() => {
    cityId && isActiveTab && getDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityId, isActiveTab]);

  // 目前该组件使用地方很多，部分接口没有返回城市名称，也就是传入的detail里没有cityName,统一从data里再拿一次
  const targetDetail = useMemo(() => {
    if (!(Object.keys(detail).length && Object.keys(data).length)) return;
    // detail是外层传入的数据
    const { cityName } = detail;
    const dataInfo = Object.assign({}, detail);
    // 传入的数据中没有城市名时，从当前的城市信息数据中拿城市名
    if (!cityName) {
      Object.assign(dataInfo, detail, { cityName: data?.cityName });
    }
    return dataInfo;
  }, [data, detail]);

  const getDetail = async () => {
    const res = await surroundCity({ cityId });
    setCityInfo([]);
    const cityInfoArr = cityInfo.concat(
      res.cityProfile.filter((item) => item.name !== '常住人口数'),
      res.reportDetails,
      res.economicProfile.filter((item) => item.name !== '人均GDP')
    );
    const cityResult = deduplicateObjects(cityInfoArr); // 去重
    setLoaded(true);
    res && setData(res);
    cityResult && setCityInfo(cityResult);
  };

  /**  行政区概况*/
  const loadDistrictInfo = async () => {
    try {
      let lnglat = [+detail.lng, +detail.lat];
      if (Array.isArray(detail.borders) && detail.borders.length) { // 如果是多边形则默认取第一个点
        lnglat = detail.borders[0];
      }
      const addressInfo: any = await getLngLatAddress(lnglat, detail.cityName, false);
      const pcdInfo = await codeToPCD({
        districtCode: addressInfo?.addressComponent.adcode,
        cityName: detail.cityName,
      });
      const result = await surroundDistrict({ districtId: pcdInfo.districtId });
      setDistrictInfo([
        {
          name: '行政区名称',
          value: result.districtName,
        },
        {
          name: '常住人口数',
          value: result.population,
          unit: '万人',
        },
        {
          name: '常住人口全市占比',
          value: result.populationRate,
          unit: '%',
        },
        // {
        //   name: '户籍人口数',
        //   value: result.householdPopulation,
        //   unit: '万人',
        // },
        {
          name: '行政区GDP',
          value: result.gdp,
          unit: '亿元',
        },
        {
          name: 'GDP全市占比',
          value: result.gdpRate,
          unit: '%',
        },
        {
          name: '行政区住房均价',
          value: result.avgHousePrice,
          unit: '元',
        },
      ]);
    } catch (err) {}
  };

  useEffect(() => {
    mapLoaded && loadDistrictInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded]);

  return (
    <div className={styles.competitiveAnalysis}>
      <div className={styles.info}>
        <div className={styles.leftBox}>
          {Object.keys(data).length > 0
            ? <Map
              detailInfo={targetDetail}
              setMapLoaded={setMapLoaded}
              isFromImageserve={isFromImageserve}
            /> : null}
          {/* <AMapDistrict name={data?.cityName || '杭州'} /> */}
        </div>
        <div className={styles.rightBox}>
          {/* <div className={styles.scoreTop}>
            <span className={styles.score}>{data?.level}</span>
            <span className={styles.scoreTitle}>城市市场评估</span>
          </div>
          <div>
            <V2DetailItem rows={1} value={data?.description} />
          </div> */}
          <div className={styles.lables}>

            <V2DetailGroup labelLength={5} direction='horizontal'>
              <Row gutter={[16, 8]}>
                <Col span={24}>
                  <span className={styles.tip}>城市信息</span>
                </Col>
                {cityInfo?.map((item, index) => {
                  return (
                    <Col span={24} key={index}>
                      <V2DetailItem className={styles.item} label={`${item.name}：`} value={`${item.value}${item.unit}`} />
                    </Col>
                  );
                })}
              </Row>
            </V2DetailGroup>
          </div>
        </div>
      </div>
      {/* 图表区域 */}
      <Row gutter={[28, 20]}>
        <Col span={24}>
          <div className={styles.box}>
            <BoardCard>
              {/* <ModuleInfoWrapper title='城市概况' className='bold'>
                <InfoItemWrapper columns={6} data={data?.cityProfile} />
              </ModuleInfoWrapper>
              <ModuleInfoWrapper title='经济概况' className='bold'>
                <InfoItemWrapper columns={6} maxSize={3} data={data?.economicProfile} />
              </ModuleInfoWrapper> */}
              {districtInfo.length > 0 && (
                <ModuleInfoWrapper title='行政区概况' className='bold last-module'>
                  <InfoItemWrapper columns={6} maxSize={8} data={districtInfo} />
                </ModuleInfoWrapper>
              )}
            </BoardCard>
          </div>
        </Col>
        <Col span={12}>
          <div className={cs(styles.box, styles.chartbox)}>
            <LazyLoad>
              <DemographicChangesCharts
                cityName={data?.cityName}
                loaded={loaded}
                data={data?.demographicChanges}
                className={styles.charts}
              />
            </LazyLoad>
          </div>
        </Col>
        <Col span={12}>
          <div className={cs(styles.box, styles.chartbox)}>
            <LazyLoad>
              <GdpGrowthCharts
                cityName={data?.cityName}
                loaded={loaded}
                data={data?.gdpGrowth}
                className={styles.charts}
              />
            </LazyLoad>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default City;
