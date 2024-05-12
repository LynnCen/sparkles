import { FC, useEffect, useMemo } from 'react';
import { Descriptions } from 'antd';
// import cs from 'classnames';
import styles from '../../entry.module.less';
import Header from '../../Header';
import DoubleCircle from '../../DoubleCircle';
import ModuleInfoWrapper from '../../ModuleInfoWrapper';
import RowItem from '../../RowItem';
import ColItem from '../../ColItem';
import cs from 'classnames';

const Overview: FC<any> = ({
  info,
  isIntegration
}) => {

  const complexInfo = useMemo(() => (info.complex || {}), [info]);
  const overviewInfo = useMemo(() => (info.overview || {}), [info]);

  useEffect(() => {

  }, []);

  return (
    <div className={cs(styles.trafficOverviewCon, isIntegration && styles.integration)}>
      <Header
        hasIndex
        indexVal='05'
        name='交通便利评估-交通概况'/>
      <div className={styles.flexCon}>
        <div className={styles.sectionLeftCon}>
          <ModuleInfoWrapper title='交通概况' hasDivider={false}>
            <RowItem className='mt-20'>
              <ColItem label='火车站' labelVal={overviewInfo.trainStationCount} unit={overviewInfo.trainStationCount ? '个' : ''}/>
              <ColItem label='公交车站' labelVal={overviewInfo.busStopCount} unit={overviewInfo.busStopCount ? '个' : ''}/>
              <ColItem label='长途汽车站' labelVal={overviewInfo.busStationCount} unit={overviewInfo.busStationCount ? '个' : ''}/>
            </RowItem>
            <RowItem className='mt-20'>
              <ColItem label='地铁站' labelVal={overviewInfo.subwayStationCount} unit={overviewInfo.subwayStationCount ? '个' : ''}/>
              <ColItem label='加油站' labelVal={overviewInfo.gasStationCount} unit={overviewInfo.gasStationCount ? '个' : ''}/>
              <ColItem label='停车场' labelVal={overviewInfo.parkingLotCount} unit={overviewInfo.parkingLotCount ? '个' : ''}/>
            </RowItem>
          </ModuleInfoWrapper>
        </div>
        <div className={styles.sectionRightCon}>
          <div className='fs-19 bold'>
            交通便利评估
          </div>
          <div>
            <span className='c-02e fs-50'>{complexInfo?.trafficScoreDescription}</span>
            {/* <span className='fs-14 cOpaWhite pl-8'>分/100</span> */}
          </div>
          <div className='fs-14 cOpaWhite'>
            {complexInfo?.message}
          </div>
          <Descriptions column={24} className='mt-30'>
            <Descriptions.Item
              label='范围内公交站'
              labelStyle={{
                color: '#d9d9d9'
              }}
              contentStyle={{
                color: '#fff'
              }}
              span={24}>
              {complexInfo.radius ? `${complexInfo.radius}内可达${complexInfo.busStop}个` : `可达${complexInfo.busStop || 0}个`}
            </Descriptions.Item>
            <Descriptions.Item
              label='范围内地铁站'
              labelStyle={{
                color: '#d9d9d9'
              }}
              contentStyle={{
                color: '#fff'
              }}
              span={24}>
              {complexInfo.radius ? `${complexInfo.radius}内可达${complexInfo.subwayStation}个` : `可达${complexInfo.subwayStation || 0}个`}
            </Descriptions.Item>
            <Descriptions.Item
              label='范围内加油站'
              labelStyle={{
                color: '#d9d9d9'
              }}
              contentStyle={{
                color: '#fff'
              }}
              span={24}>
              {complexInfo.radius ? `${complexInfo.radius}内可达${complexInfo.gasStation}个` : `可达${complexInfo.gasStation || 0}个`}
            </Descriptions.Item>
            <Descriptions.Item
              label='范围内火车站'
              labelStyle={{
                color: '#d9d9d9'
              }}
              contentStyle={{
                color: '#fff'
              }}
              span={24}>
              {complexInfo.radius ? `${complexInfo.radius}内可达${complexInfo.trainStation}个` : `可达${complexInfo.trainStation || 0}个`}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
      <div className={styles.leftFooterDoubleCircle}>
        <DoubleCircle layout='vertical'/>
      </div>
    </div>
  );
};

export default Overview;
