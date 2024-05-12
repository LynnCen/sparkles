/** 客群客流评估 */
//
import { FC } from 'react';
import { replaceEmpty } from '@lhb/func';
import { Row, Col, Tooltip } from 'antd';

import styles from './index.module.less';
import V2Title from '@/common/components/Feedback/V2Title';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import CustomerFlowCharts from './components/CustomerFlowCharts';
import MaritalStatus from './components/MaritalStatus';
import AppCharts from './components/AppCharts';
import PersonCharts from './components/PersonCharts';
import IndustryCharts from './components/IndustryCharts';
import SexCharts from './components/SexCharts';
import EducationCharts from './components/EducationCharts';
import AgeCharts from './components/AgeCharts';
import ChildrenAgeCharts from './components/ChildrenAgeCharts';
import ConsumptionCharts from './components/ConsumptionCharts';
import HousePriceCharts from './components/HousePriceCharts';
import VisitingCharts from './components/VisitingCharts';
import MapPolygonWithCenter from '@/pagesComponents/PlaceOrPointDetail/components/MapPolygonWithCenter';
import LazyLoad from '@/common/components/LazyLoad';
import IconFont from '@/common/components/Base/IconFont';

const tips = <div>
  <p>数据保密性声明：本页面数据分析的数据源来自公开渠道，你在本网站录入的任何数据都被加密存储，不会参与本页面的计算和呈现。</p>
  <p>免责声明：本页面的数据源来自公开渠道，以上数据分析结果仅作为你的经营参考，本网站不对用户使用本网站所引起的任何损失负责，用户应自行承担因使用本网站而带来的风险。</p>
</div>;
// const mock = {
//   path: [
//     {
//       'longitude': '121.55533075332642',
//       'latitude': '31.244434394966056'
//     },
//     {
//       'longitude': 121.55406475067139,
//       'latitude': 31.243663880829857
//     },
//     {
//       'longitude': 121.55421495437622,
//       'latitude': 31.243480424156594
//     },
//     {
//       'longitude': 121.55376434326172,
//       'latitude': 31.24311350974102
//     },
//     {
//       'longitude': 121.55483722686768,
//       'latitude': 31.241921028045983
//     },
//     {
//       'longitude': 121.55457973480225,
//       'latitude': 31.241792606042356
//     },
//     {
//       'longitude': 121.55539512634277,
//       'latitude': 31.24107710882568
//     },
//     {
//       'longitude': 121.55573844909668,
//       'latitude': 31.241003724189312
//     },
//     {
//       'longitude': 121.55696153640747,
//       'latitude': 31.24160914573425
//     },
//     {
//       'longitude': 121.55573844909668,
//       'latitude': 31.243021780914393
//     },
//     {
//       'longitude': 121.55623197555542,
//       'latitude': 31.243700572121753
//     }
//   ],
//   center: { longitude: 121.55533075332642, latitude: 31.244434394966056 }
// };



const PlaceAnalysisCustomer:FC<any> = ({
  data = {}
}) => {

  return (
    <div className={styles.competitiveAnalysis} >
      <div id={'PlaceAnalysisCustomer'}>
        <div className={styles.title}>
          <V2Title type='H2' text='客群客流评估' divider/>
          <Tooltip title={tips} color={'#333333'} placement='top' >
            <span><IconFont iconHref={'iconxq_ic_shuoming_normal'} className={(styles.moreDescriptionIcon)} /></span>
          </Tooltip>
        </div>
        <div className={styles.info}>
          <Row gutter={20}>
            <Col span={10}>
              <div className={styles.leftBox}>
                {/* <Image
                  height={240}
                  width={'100%'}
                  className={styles.emptyImg}
                  src='https://staticres.linhuiba.com/project-custom/pms/img/grate.png'
                  preview={false}/> */}
                <LazyLoad>
                  <MapPolygonWithCenter data={data?.geofence || {}}/>
                </LazyLoad>
              </div>
            </Col>
            <Col span={14} className={styles.rightBox}>
              <div className={styles.scoreTop}>
                <span className={styles.score}>{data?.level}</span><span className={styles.scoreTitle}>客群客流评估</span>
              </div>
              <div>
                <V2DetailItem rows={1} value={replaceEmpty(data?.description)} />
              </div>
              <div>
                <V2DetailGroup labelLength={6} direction='horizontal'>
                  <Row gutter={16}>
                    {
                      data?.reportDetails?.map((item, index) => {
                        return <Col span={24} key={index}>
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
          {/* 第一行 */}
          <Col span={12}>
            <div className={styles.box}>
              <LazyLoad>
                <CustomerFlowCharts
                  data={data?.flow}
                  className={styles.charts}
                />
              </LazyLoad>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.box}>
              <LazyLoad>
                <PersonCharts
                  data={data?.person}
                  className={styles.charts}
                />
              </LazyLoad>
            </div>
          </Col>
          {/* 第二行 */}
          <Col span={12}>
            <div className={styles.box}>
              <LazyLoad>
                <SexCharts
                  data={data?.sex}
                  className={styles.charts}
                />
              </LazyLoad>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.box}>
              <LazyLoad>
                <EducationCharts
                  data={data?.education}
                  className={styles.charts}
                />
              </LazyLoad>
            </div>
          </Col>
          {/* 第三行 */}
          <Col span={12}>
            <div className={styles.box}>
              <LazyLoad>
                <AgeCharts
                  data={data?.age}
                  className={styles.charts}
                />
              </LazyLoad>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.box}>
              <LazyLoad>
                <MaritalStatus
                  data={data?.married}/>
              </LazyLoad>
            </div>
          </Col>
          {/* 第四行 */}
          <Col span={12}>
            <div className={styles.box}>
              <LazyLoad>
                <ChildrenAgeCharts
                  data={data?.childrenAge}
                  className={styles.charts}
                />
              </LazyLoad>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.box}>
              <LazyLoad>
                <IndustryCharts
                  data={data?.industry}
                  className={styles.charts}
                />
              </LazyLoad>
            </div>
          </Col>
          {/* 第五行 */}
          <Col span={12}>
            <div className={styles.box}>
              <LazyLoad>
                <ConsumptionCharts
                  data={data?.consumption}
                  className={styles.charts}
                />
              </LazyLoad>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.box}>
              <LazyLoad>
                <HousePriceCharts
                  data={data?.housePrice}
                  className={styles.charts}
                />
              </LazyLoad>
            </div>
          </Col>
          {/* 第六行 */}
          <Col span={12}>
            <div className={styles.box}>
              <LazyLoad>
                <VisitingCharts
                  data={data?.visiting}
                  className={styles.charts}
                />
              </LazyLoad>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.box}>
              <LazyLoad>
                <AppCharts
                  data={data?.app}
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
export default PlaceAnalysisCustomer;
