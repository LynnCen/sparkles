/** 商业氛围评估 */
import { FC } from 'react';
import { Row, Col, Tooltip } from 'antd';
import { replaceEmpty } from '@lhb/func';
import styles from './index.module.less';
import V2Title from '@/common/components/Feedback/V2Title';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import CateringDistributionCharts from './components/CateringDistributionCharts';
import LeisureDistributionCharts from './components/LeisureDistributionCharts';
import ShoppingDistributionCharts from './components/ShoppingDistributionCharts';
import EnterpriseDistributionCharts from './components/EnterpriseDistributionCharts';
import AMapPolygonMarkers, { businessColorEnum } from '@/common/components/AMap/AMapPolygonMarkers';
import LazyLoad from '@/common/components/LazyLoad';
import IconFont from '@/common/components/Base/IconFont';

const tips = <div>
  <p>数据保密性声明：本页面数据分析的数据源来自公开渠道，你在本网站录入的任何数据都被加密存储，不会参与本页面的计算和呈现。</p>
  <p>免责声明：本页面的数据源来自公开渠道，以上数据分析结果仅作为你的经营参考，本网站不对用户使用本网站所引起的任何损失负责，用户应自行承担因使用本网站而带来的风险。</p>
</div>;


// const mock:any = {
//   center: [120.046906, 30.291705], // 中心点坐标
//   circleRadius: 3000, // 圆半径
//   markers: [ // 打点
//     {
//       position: [120.046906, 30.291705],
//       title: '中餐厅',
//       showLabel: 1,
//     },
//     {
//       position: [120.040176, 30.293044],
//       title: '外国餐厅'
//     }
//   ],
//   pathList: [ // 围栏
//     {
//       path: [{
//         'longitude': 120.046906,
//         'latitude': 30.291705
//       },
//       {
//         'longitude': 120.043988,
//         'latitude': 30.291371
//       },
//       {
//         'longitude': 120.045447,
//         'latitude': 30.287777
//       },
//       {
//         'longitude': 120.048107,
//         'latitude': 30.289296
//       }],
//     }, {
//       path: [
//         {
//           'longitude': 120.040176,
//           'latitude': 30.293044
//         },
//         {
//           'longitude': 120.043437,
//           'latitude': 30.293674
//         },
//         {
//           'longitude': 120.043888,
//           'latitude': 30.291692
//         },
//         {
//           'longitude': 120.040905,
//           'latitude': 30.29134
//         }
//       ]
//     },
//     {
//       path: [
//         {
//           'longitude': 120.047848,
//           'latitude': 30.300704
//         },
//         {
//           'longitude': 120.034218,
//           'latitude': 30.300275
//         },
//         {
//           'longitude': 120.03753,
//           'latitude': 30.295871
//         },
//         {
//           'longitude': 120.046886,
//           'latitude': 30.296834
//         }
//       ]
//     }
//   ]
// };


const AnalysisBusinessClimate:FC<any> = ({
  data = {}
}) => {

  return (
    <div className={styles.competitiveAnalysis}>
      <div id={'AnalysisBusinessClimate'}>
        <div className={styles.title}>
          <V2Title type='H2' text='商业氛围评估（3KM）' divider/>
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
                  src='https://staticres.linhuiba.com/project-custom/pms/img/food.png'
                  preview={false}/> */}
                <LazyLoad>
                  <AMapPolygonMarkers data={data.locationPoi}/>
                </LazyLoad>
              </div>
            </Col>
            <Col span={14} className={styles.rightBox}>
              <div className={styles.scoreTop}>
                <span className={styles.score}>{data?.level}</span><span className={styles.scoreTitle}>商业氛围评估</span>
              </div>
              <div>
                <V2DetailItem rows={1} value={replaceEmpty(data?.description)} />
              </div>
              <div>
                <V2DetailGroup labelLength={4} direction='horizontal'>
                  <Row gutter={16}>
                    {
                      data?.reportDetails?.map((item, index) => {
                        return <Col span={ 12} key={index}>
                          <V2DetailItem label={<span><IconFont iconHref='res-servise-a-bianzu131' style={{ marginRight: '4px', color: businessColorEnum(item.name), fontSize: '6px', verticalAlign: 'middle' }} />{item.name}</span>} value={item.value} labelLength={5}/>
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
              <LazyLoad>
                <CateringDistributionCharts
                  data={data?.cateringDistribution}
                  className={styles.charts}
                />
              </LazyLoad>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.box}>
              <LazyLoad>
                <LeisureDistributionCharts
                  data={data?.leisureDistribution}
                  className={styles.charts}
                />
              </LazyLoad>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.box}>
              <LazyLoad>
                <ShoppingDistributionCharts
                  data={data?.shoppingDistribution}
                  className={styles.charts}
                />
              </LazyLoad>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.box}>
              <LazyLoad>
                <EnterpriseDistributionCharts
                  data={data?.enterpriseDistribution}
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
export default AnalysisBusinessClimate;
