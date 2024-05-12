import { FC, useMemo } from 'react';
import { Descriptions } from 'antd';
import styles from '../../entry.module.less';
import Header from '../../Header';
import DoubleCircle from '../../DoubleCircle';
import ModuleInfoWrapper from '../../ModuleInfoWrapper';
import RowItem from '../../RowItem';
import ColItem from '../../ColItem';
import cs from 'classnames';

const Basic: FC<any> = ({
  info,
  isIntegration
}) => {

  // const [state, setState] = useState<>();
  const overviewInfo = useMemo(() => (info.overview || {}), [info]);
  const economicsInfo = useMemo(() => (info.economic || {}), [info]);
  const complexInfo = useMemo(() => (info.complex || {}), [info]);
  return (
    <div className={cs(styles.cityBasicCon, isIntegration && styles.integration)}>
      <Header
        hasIndex
        indexVal='02'
        name='城市市场评估'/>
      <div className={styles.flexCon}>
        <div className={styles.sectionLeftCon}>
          <ModuleInfoWrapper title='城市概况'>
            <RowItem className='mt-20'>
              <ColItem label='城市名称' labelVal={overviewInfo.name}/>
              <ColItem label='城市级别' labelVal={overviewInfo.levelName}/>
              <ColItem label='城市类别' labelVal={overviewInfo.categoryName}/>
            </RowItem>
            <RowItem className='mt-20'>
              <ColItem label='城市面积' labelVal={overviewInfo.area} unit='k㎡'/>
              <ColItem label='常住人口数' labelVal={overviewInfo.population} unit='万人'/>
              <ColItem label='流动人口数' labelVal={overviewInfo.flowPopulation} unit='万人'/>
            </RowItem>
          </ModuleInfoWrapper>
          <ModuleInfoWrapper title='经济概况'>
            <RowItem className='mt-20'>
              <ColItem label='城市GDP' labelVal={economicsInfo.gdp} unit='亿元'/>
              <ColItem label='人均GDP' labelVal={economicsInfo.avgGdp} unit='万元'/>
              <ColItem label='GDP增速' labelVal={`${economicsInfo.gdpGrowthRate ? `${economicsInfo.gdpGrowthRate}%` : ''}`}/>
            </RowItem>
          </ModuleInfoWrapper>
        </div>
        <div className={styles.sectionRightCon}>
          <div className='fs-19 bold'>
            城市市场评估
          </div>
          <div>
            <span className='c-02e fs-50'>{complexInfo?.cityScoreDescription}</span>
            {/* <span className='fs-14 cOpaWhite pl-8'>分/100</span> */}
          </div>
          <div className='fs-14 cOpaWhite'>
            {complexInfo?.message}
          </div>
          <Descriptions column={24} className='mt-30'>
            <Descriptions.Item
              label='城市类别'
              labelStyle={{
                color: '#d9d9d9'
              }}
              contentStyle={{
                color: '#fff'
              }}
              span={24}>
              { complexInfo?.categoryName || '-'}
            </Descriptions.Item>
            <Descriptions.Item
              label='常住人口数'
              labelStyle={{
                color: '#d9d9d9'
              }}
              contentStyle={{
                color: '#fff'
              }}
              span={24}>
              {`${complexInfo.population || '-'}万人，全国排名第${complexInfo.populationRank || '-'}名`}
            </Descriptions.Item>
            <Descriptions.Item
              label='人均GDP'
              labelStyle={{
                color: '#d9d9d9'
              }}
              contentStyle={{
                color: '#fff'
              }}
              span={24}>
              {`${complexInfo.avgGdp || '-'}万元，全国排名第${complexInfo.avgGdpRank || '-'}名`}
            </Descriptions.Item>
            <Descriptions.Item
              label='商圈情况'
              labelStyle={{
                color: '#d9d9d9'
              }}
              contentStyle={{
                color: '#fff'
              }}
              span={24}>
              {`${complexInfo.businessCircleCount || '-'}个，覆盖购物中心${complexInfo.shoppingCenterCount || '-'}个`}
            </Descriptions.Item>
            <Descriptions.Item
              label='交通情况'
              labelStyle={{
                color: '#d9d9d9'
              }}
              contentStyle={{
                color: '#fff'
              }}
              span={24}>
              { complexInfo?.trafficStatus || '-' }
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
      <div className={styles.rightFooterDoubleCircle}>
        <DoubleCircle layout='vertical'/>
      </div>
    </div>
  );
};

export default Basic;
