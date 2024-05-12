import { FC, useMemo } from 'react';
import { Table } from 'antd';
import styles from '../../entry.module.less';
import Header from '../../Header';
import ModuleInfoWrapper from '../../ModuleInfoWrapper';
import RowItem from '../../RowItem';
import ColItem from '../../ColItem';
import DoubleCircle from '../../DoubleCircle';
import cs from 'classnames';

const Business: FC<any> = ({
  info,
  isIntegration
}) => {
  const circles = useMemo(() => {
    if (Array.isArray(info.circles) && info.circles.length) {
      return info.circles.filter((item, index) => index < 5);
    }
    return [];
  }, [info]);
  const business = useMemo(() => (info?.business || {}), [info]);
  const trafficInfo = useMemo(() => (info?.traffic || {}), [info]);
  const columns = [
    { title: '商圈名称', dataIndex: 'name' },
    { title: '城市客流排名', dataIndex: 'rankOfCity' },
    { title: '全国客流排名', dataIndex: 'rank' },
  ];

  return (
    <div className={cs(styles.cityBusinessCon, isIntegration && styles.integration)}>
      <Header
        hasIndex
        indexVal='02'
        name='城市市场评估'/>
      <div className={styles.flexCon}>
        { circles.length > 0 && (
          <div className={styles.sectionLeftCon}>
            <Table
              rowKey='name'
              dataSource={circles}
              columns={columns}
              pagination={false}/>
          </div>
        )
        }
        <div className={styles.sectionRightCon}>
          <ModuleInfoWrapper title='商业概况'>
            <RowItem className='mt-20'>
              <ColItem label='商圈数量' labelVal={business.businessCircleCount} unit='个'/>
              <ColItem label='购物中心数量' labelVal={business.shoppingCenterCount} unit='个'/>
              <ColItem label='购物中心总面积' labelVal={business.shoppingCenterCountRank} unit={business.shoppingCenterCountRank ? '万方' : ''}/>
            </RowItem>
          </ModuleInfoWrapper>
          <ModuleInfoWrapper title='交通概况'>
            <RowItem className='mt-20'>
              <ColItem label='火车站数量' labelVal={trafficInfo.trainStationCount}/>
              <ColItem label='公交车站数量' labelVal={trafficInfo.busStopCount}/>
              <ColItem label='长途汽车站数量' labelVal={trafficInfo.busStationCount}/>
            </RowItem>
            <RowItem className='mt-20'>
              <ColItem label='地铁站数量' labelVal={trafficInfo.subwayStationCount}/>
              <ColItem label='加油站数量' labelVal={trafficInfo.gasStationCount}/>
              <ColItem label='停车场数量' labelVal={trafficInfo.parkingLotCount}/>
            </RowItem>
          </ModuleInfoWrapper>
        </div>
      </div>
      <DoubleCircle/>
    </div>
  );
};

export default Business;
