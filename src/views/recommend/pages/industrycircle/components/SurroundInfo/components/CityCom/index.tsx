/**
 * @description 城市信息 TODO: 去除默认值
 */
import { surroundCity, surroundDistrict } from '@/common/api/surround';
import { FC, useEffect, useState } from 'react';
import styles from '../../index.module.less';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import V2Title from '@/common/components/Feedback/V2Title';
import { Col, Row, Spin } from 'antd';
import SingleDev from '../SingleDev';
import LazyLoad from '@/common/components/LazyLoad';
import DemographicChangesCharts from '@/common/components/business/SurroundDrawer/components/City/components/DemographicChangesCharts';
import GdpGrowthCharts from '@/common/components/business/SurroundDrawer/components/City/components/GdpGrowthCharts';
import cs from 'classnames';
import { getDistrictBlock } from './ts-config';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import V2Empty from '@/common/components/Data/V2Empty';

interface Props {
  cityId?:number;// 当前的页面的cityId
  districtId?:number // 当前行政区的distictId
  params?// 报告需要的参数
}

const CityInfo: FC<Props> = ({
  cityId,
  districtId,
}) => {
  const [cityInfo, setCityInfo] = useState<any>(); // 城市信息
  const [districtInfo, setDistrictInfo] = useState<any>([]); // 行政区信息

  useEffect(() => {
    fetchData();
  }, []);

  // 表格名称 TODO: 两个表格的名称
  const lineData = cityInfo?.demographicChanges?.find((item) => item.name === '同比增长');
  const startYear = lineData?.data?.[0]?.name ?? '-';
  const endYear = lineData?.data?.[lineData.data.length - 1]?.name ?? '-';
  const title = `${startYear}-${endYear}${cityInfo?.cityName || ''}`;

  const [loading, setLoading] = useState<boolean>(false);


  /** 获取数据 */
  const fetchData = async () => {
    try {
      setLoading(true);

      const [cityResult, districtResult] = await Promise.all([
        surroundCity({ cityId }),
        surroundDistrict({ districtId }),
      ]);

      // 处理城市数据
      setCityInfo(cityResult);

      // 处理行政区数据
      const disInfo = getDistrictBlock(districtResult);
      setDistrictInfo(disInfo);
    } catch (error) {
      V2Message.error('获取数据失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  const renderSingleDevItems = (items: any[]) => {
    return items.length ? items.map((item, index) => (
      <Col span={12} key={index}>
        <SingleDev index={index} item={item} />
      </Col>
    ))
      : <Col span={24}>
        <V2Empty />
      </Col>;
  };

  // 在这里编写组件的逻辑和渲染
  return (
    <div className={styles.cityInfo}>
      <Spin spinning={loading}>
        <div className={styles.cityContent}>
          <div className={styles.desContent}>
            <span className={styles.title}>城市市场评估得分</span>
            <span className={styles.level}>{cityInfo?.level || '-'}</span>
            <span className={styles.recommend}>{cityInfo?.description || '-'}</span>
          </div>
          <div className={styles.tips}>
            <V2DetailGroup direction='horizontal' labelLength={4}>
              <V2DetailItem
                className={styles.item}
                labelStyle={{ color: '#eee', marginRight: '12px' }}
                valueStyle={{ color: '#fff' }}
                label='城市类比'
                value={cityInfo?.reportDetails?.[0].value}
              />
              <V2DetailItem
                labelStyle={{ color: '#eee', marginRight: '12px' }}
                valueStyle={{ color: '#fff' }}
                className={styles.item}
                label='交通情况'
                value={cityInfo?.reportDetails?.[3].value}

              />
              <V2DetailItem
                labelStyle={{ color: '#eee', marginRight: '12px' }}
                valueStyle={{ color: '#fff' }}
                className={styles.item}
                label='商业情况'
                rows={4}
                value={cityInfo?.reportDetails?.[4].value}
              />
            </V2DetailGroup>
          </div>
          {/* 城市概况 */}

          <div className={styles.sheets}>
            <V2Title className={styles.title} text='城市概况' type='H3' divider/>
            <Row gutter={8}>
              {renderSingleDevItems(cityInfo?.cityProfile || [])}
            </Row>
          </div>

          <div className={styles.sheets}>
            <V2Title className={styles.title} text='经济概况' type='H3' divider/>
            <Row gutter={8}>
              {renderSingleDevItems(cityInfo?.economicProfile || [])}
            </Row>
          </div>

          <div className={styles.sheets}>
            <V2Title className={styles.title} text='行政区概况' type='H3' divider/>
            <Row gutter={8}>
              {renderSingleDevItems(districtInfo)}
            </Row>
          </div>

          {/* 图表 */}
          <div className={styles.sheets}>
            <V2Title className={styles.title} text={title + '人口变化一览'} type='H3' divider/>
            <div className={cs(styles.box, styles.chartbox)}>

              <LazyLoad>
                <DemographicChangesCharts
                  showTitle={false}
                  cityName={cityInfo?.cityName}
                  data={cityInfo?.demographicChanges}
                  className={styles.charts}
                />
              </LazyLoad>
            </div>
          </div>

          <div className={styles.sheets}>
            <V2Title className={styles.title} text={title + 'GDP及增速情况'} type='H3' divider/>
            <div className={cs(styles.box, styles.chartbox)}>
              <LazyLoad>
                <GdpGrowthCharts
                  showTitle={false}
                  cityName={cityInfo?.cityName}
                  data={cityInfo?.gdpGrowth}
                  className={styles.charts} />
              </LazyLoad>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default CityInfo;
