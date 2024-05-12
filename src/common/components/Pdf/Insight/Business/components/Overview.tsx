import { FC, useMemo } from 'react';
import { Descriptions } from 'antd';
import { showTargetChart } from '@/common/utils/ways';
import styles from '../../entry.module.less';
import Header from '../../Header';
import PieEcharts from '../../PieEcharts';
import DoubleCircle from '../../DoubleCircle';
import cs from 'classnames';

const Overview: FC<any> = ({
  info,
  detailInfo,
  isIntegration

}) => {
  const complexInfo = useMemo(() => (info.complex || {}), [info]);
  const proportionData = useMemo(() => (info.proportion || []), [info]);

  const targetStr = useMemo(() => {
    const { report } = detailInfo;
    if (report && report.type === 1) {
      return `集中在${report.radius / 1000}km内`;
    }
    return '';
  }, [detailInfo]);

  const showProportionPie = useMemo(() => (showTargetChart(proportionData)), [proportionData]);

  return (
    <div className={cs(styles.businessOverviewCon, isIntegration && styles.integration)}>
      <Header
        hasIndex
        indexVal='03'
        name='商业氛围评估'/>
      <div className={styles.flexCon}>
        {
          showProportionPie &&
          (
            <div className={styles.sectionLeftCon}>
              <div className='fs-19 bold'>
                业态分布图
              </div>
              <PieEcharts
                config={{
                  data: proportionData,
                  legendLeft: 'left',
                  legendTop: 15,
                  tooltipConfig: {
                    formatter: '{b}： {d}%',
                  }
                }}
                width='390px'
                height='250px'/>
            </div>
          )
        }
        <div className={styles.sectionRightCon}>
          <div className='fs-19 bold'>
            商业氛围评估
          </div>
          <div>
            <span className='c-02e fs-50'>{complexInfo?.situationScoreDescription}</span>
            {/* <span className='fs-14 cOpaWhite pl-8'>分/100</span> */}
          </div>
          <div className='fs-14 cOpaWhite'>
            {complexInfo?.message}
          </div>
          <Descriptions column={24} className='mt-30'>
            <Descriptions.Item
              label='餐饮业态'
              labelStyle={{
                color: '#d9d9d9'
              }}
              contentStyle={{
                color: '#fff'
              }}
              span={24}>
              {complexInfo.catering ? `${complexInfo.catering}为主` : '-'}
            </Descriptions.Item>
            <Descriptions.Item
              label='购物业态'
              labelStyle={{
                color: '#d9d9d9'
              }}
              contentStyle={{
                color: '#fff'
              }}
              span={24}>
              {complexInfo.mallCount ? `${complexInfo.mallCount}个商场${targetStr || ''}` : ''}
            </Descriptions.Item>
            <Descriptions.Item
              label='机构业态'
              labelStyle={{
                color: '#d9d9d9'
              }}
              contentStyle={{
                color: '#fff'
              }}
              span={24}>
              {complexInfo.agency ? `${complexInfo.agency}类门店为主` : '-'}
            </Descriptions.Item>
            <Descriptions.Item
              label='休闲业态'
              labelStyle={{
                color: '#d9d9d9'
              }}
              contentStyle={{
                color: '#fff'
              }}
              span={24}>
              {complexInfo.leisure ? `${complexInfo.leisure}类门店为主` : '-'}
            </Descriptions.Item>
            <Descriptions.Item
              label='服务业态'
              labelStyle={{
                color: '#d9d9d9'
              }}
              contentStyle={{
                color: '#fff'
              }}
              span={24}>
              {complexInfo.service ? `${complexInfo.service}类门店为主` : ''}
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
