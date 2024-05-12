/** 交通便利评估 */
//
import { Row, Col, Tooltip } from 'antd';
import { FC } from 'react';
import { replaceEmpty } from '@lhb/func';

import styles from './index.module.less';
import V2Title from '@/common/components/Feedback/V2Title';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import BusList from './components/BusList';
import MetroList from './components/MetroList';
import BoardCard from '../BoardCard';
import ModuleInfoWrapper from '@/common/components/business/ModuleInfoWrapper';
import InfoItemWrapper from '@/common/components/business/ModuleInfoWrapper/InfoItemWrapper';
import GasStationList from './components/GasStationList';
import TrainStationList from './components/TrainStationList';
import AMapMarkers, { colorEnum } from '@/common/components/AMap/AMapMarkers';
import LazyLoad from '@/common/components/LazyLoad';
import IconFont from '@/common/components/Base/IconFont';

// const colData = [{ name: '城市名称', value: '杭州市1' }, { name: '城市名称', value: '杭州市2' }, { name: '城市名称', value: '杭州市3' }, { name: '城市名称', value: '杭州市4' }, { name: '城市名称', value: '杭州市5' }, { name: '城市名称', value: '杭州市6' }, { name: '城市名称', value: '杭州市7' }, { name: '城市名称', value: '杭州市8' }, { name: '城市名称', value: '杭州市9' }];

const tips = <div>
  <p>数据保密性声明：本页面数据分析的数据源来自公开渠道，你在本网站录入的任何数据都被加密存储，不会参与本页面的计算和呈现。</p>
  <p>免责声明：本页面的数据源来自公开渠道，以上数据分析结果仅作为你的经营参考，本网站不对用户使用本网站所引起的任何损失负责，用户应自行承担因使用本网站而带来的风险。</p>
</div>;

// const mock:any = {
//   center: [116.397428, 39.90923],
//   circleRadius: 1000,
//   markers: [
//     {
//       position: [116.405285, 39.904989],
//       title: '北京市',
//       showLabel: 1, // 打点显示的序号，没有就显示默认定位icon
//     },
//     {
//       position: [116.413701, 39.900416],
//       title: '上海市'
//     }
//   ]
// };


const PlaceAnalysisTraffic:FC<any> = ({
  data = {}
}) => {

  return (
    <div className={styles.competitiveAnalysis}>
      <div id={'PlaceAnalysisTraffic'}>
        <div className={styles.title}>
          <V2Title type='H2' text='交通便利评估（3KM）' divider/>
          <Tooltip title={tips} color={'#333333'} placement='top' >
            <span><IconFont iconHref={'iconxq_ic_shuoming_normal'} className={(styles.moreDescriptionIcon)} /></span>
          </Tooltip>
        </div>
        <div className={styles.info}>
          <Row gutter={20}>
            <Col span={10}>
              <div className={styles.leftBox}>
                <LazyLoad>
                  <AMapMarkers data={data.locationPoi || {}}/>
                </LazyLoad>
              </div>
            </Col>
            <Col span={14} className={styles.rightBox}>
              <div className={styles.scoreTop}>
                <span className={styles.score}>{data?.level}</span><span className={styles.scoreTitle}>交通便利评估</span>
              </div>
              <div>
                <V2DetailItem rows={1} value={replaceEmpty(data?.description)} />
              </div>
              <div>
                <V2DetailGroup labelLength={4} direction='horizontal'>
                  <Row gutter={16}>
                    {
                      data?.reportDetails?.map((item, index) => {
                        return <Col span={12} key={index}>
                          <V2DetailItem labelLength={4} label={<span><IconFont iconHref='res-servise-a-bianzu131' style={{ marginRight: '4px', color: colorEnum(item.name), fontSize: '6px', verticalAlign: 'middle' }} />{item.name}</span>} value={item.value} />
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
                <BoardCard>
                  <ModuleInfoWrapper title='交通概况'>
                    <InfoItemWrapper columns={3} gap={28} maxSize={9} data={data?.trafficProfile}>
                    </InfoItemWrapper>
                  </ModuleInfoWrapper>
                </BoardCard>
              </LazyLoad>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.box}>
              <LazyLoad>
                <BusList
                  data={data?.busStop}
                />
              </LazyLoad>
            </div>
          </Col>
          {/* 第二行 */}
          <Col span={12}>
            <div className={styles.box}>
              <LazyLoad>
                <MetroList
                  data={data?.subwayStation}
                />
              </LazyLoad>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.box}>
              <LazyLoad>
                <GasStationList
                  data={data?.gasStation}
                />
              </LazyLoad>
            </div>
          </Col>
          {/* 第三行 */}
          <Col span={12}>
            <div className={styles.box}>
              <LazyLoad>
                <TrainStationList
                  data={data?.trainStation}
                />
              </LazyLoad>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default PlaceAnalysisTraffic;
