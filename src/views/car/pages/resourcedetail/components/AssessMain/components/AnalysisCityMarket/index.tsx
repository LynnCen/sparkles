/** 城市市场评估 */
//
import styles from './index.module.less';
import { Row, Col, Tooltip } from 'antd';
import V2Title from '@/common/components/Feedback/V2Title';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import ModuleInfoWrapper from '@/common/components/business/ModuleInfoWrapper';
import InfoItemWrapper from '@/common/components/business/ModuleInfoWrapper/InfoItemWrapper';
import BoardCard from '../BoardCard';
import BusinessProfile from './components/BusinessProfile';
import { FC } from 'react';
import AMapDistrict from '@/common/components/AMap/AMapDistrict';
import DemographicChangesCharts from './components/DemographicChangesCharts';
import GdpGrowthCharts from './components/GdpGrowthCharts';
import LazyLoad from '@/common/components/LazyLoad';
import IconFont from '@/common/components/Base/IconFont';

const tips = <div>
  <p>数据保密性声明：本页面数据分析的数据源来自公开渠道，你在本网站录入的任何数据都被加密存储，不会参与本页面的计算和呈现。</p>
  <p>免责声明：本页面的数据源来自公开渠道，以上数据分析结果仅作为你的经营参考，本网站不对用户使用本网站所引起的任何损失负责，用户应自行承担因使用本网站而带来的风险。</p>
</div>;

// const demographicChanges = [
//   {
//     name: '常住人口',
//     data: [{ name: 2016, value: 50000 }, { name: 2017, value: 60000 }, { name: 2018, value: 70000 }, { name: 2019, value: 80000 }, { name: 2020, value: 90000 }, { name: 2021, value: 100000 }]
//   },
//   {
//     name: '同比增长',
//     data: [{ name: 2016, value: 0 }, { name: 2017, value: 0.2 }, { name: 2018, value: 0.16 }, { name: 2019, value: 0.14 }, { name: 2020, value: 0.12 }, { name: 2021, value: 0.11 }]
//   },
// ];


// const colData = [{ name: '城市名称', value: '杭州市1' }, { name: '城市名称', value: '杭州市2' }, { name: '城市名称', value: '杭州市3' }, { name: '城市名称', value: '杭州市4' }, { name: '城市名称', value: '杭州市5' }, { name: '城市名称', value: '杭州市6' }];

const CityMarketAssessment:FC<any> = ({
  data = {}
}) => {

  return (
    <div className={styles.competitiveAnalysis}>
      <div id={'CityMarketAssessment'}>
        <div className={styles.title}>
          <V2Title type='H2' text='城市市场评估' divider/>
          <Tooltip title={tips} color={'#333333'} placement='top' >
            <span><IconFont iconHref={'iconxq_ic_shuoming_normal'} className={(styles.moreDescriptionIcon)} /></span>
          </Tooltip>
        </div>
        <div className={styles.info}>
          <Row gutter={20}>
            <Col span={10}>
              <div className={styles.leftBox}>
                <AMapDistrict name={data?.cityName || '杭州'} />
              </div>
            </Col>
            <Col span={14} className={styles.rightBox}>
              <div className={styles.scoreTop}>
                <span className={styles.score}>{data?.level}</span><span className={styles.scoreTitle}>城市市场评估</span>
              </div>
              <div>
                <V2DetailItem rows={1} value={data?.description} />
              </div>
              <div>
                <V2DetailGroup labelLength={4} direction='horizontal'>
                  <Row gutter={16}>
                    {
                      data?.reportDetails?.map((item, index) => {
                        return <Col span={index + 1 === data?.reportDetails.length ? 24 : 12} key={index}>
                          <V2DetailItem label={item.name} value={item.value} />
                        </Col>;
                      })
                    }
                  </Row>
                </V2DetailGroup>
              </div>
            </Col>
          </Row>
        </div>
        {/* 图表区域 */}
        <Row gutter={[28, 20]}>
          <Col span={12}>
            <div className={styles.box}>
              <BoardCard>
                <ModuleInfoWrapper title='城市概况'>
                  <InfoItemWrapper columns={3}data={data?.cityProfile}/>
                </ModuleInfoWrapper>
                <ModuleInfoWrapper title='经济概况'>
                  <InfoItemWrapper columns={3} maxSize={3} data={data?.economicProfile}/>
                </ModuleInfoWrapper>
              </BoardCard>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.box}>
              <BoardCard>
                <BusinessProfile data={data}/>
              </BoardCard>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.box}>
              <LazyLoad>
                <DemographicChangesCharts
                  data={data?.demographicChanges}
                  className={styles.charts}
                />
              </LazyLoad>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.box}>
              <LazyLoad>
                <GdpGrowthCharts
                  data={data?.gdpGrowth}
                  className={styles.charts}
                />
              </LazyLoad>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default CityMarketAssessment;
