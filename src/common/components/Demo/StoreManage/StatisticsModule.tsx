import { FC } from 'react';
import cs from 'classnames';
import styles from './index.module.less';
import DetailInfo from '@/common/components/business/DetailInfo';

const StatisticsModule: FC<{
  isFunnel?: boolean;
  taregtData?: any;
}> = ({
  isFunnel = false,
  taregtData
}) => {

  const statisticsInfo = {
    // district: '华东区域',
    // total: 57,
    shop: 21,
    streetShop: 36,
    rentScope: '3,000-20,000',
    deadline: '2022-12-31',
    contact: '杨乐'
  };
  return (
    <div className={cs(styles.statisticsCon, 'mt-16')}>
      <div className='fs-20 bold'>
        数据统计
      </div>
      <div className={styles.mainCon}>
        <div className={styles.leftCon}>
          <div className='fs-20 bold'>分配开店计划</div>
          {
            isFunnel
              ? <div className={styles.funnelCon}>
                <img
                  src='https://staticres.linhuiba.com/project-custom/locationpc/demo/bg_funnel_plan@2x.png'
                  width='100%'
                  height='100%'/>
              </div>
              : <div className='mt-12'>
                <DetailInfo
                  title='开店区域'
                  value={taregtData.name}
                  titleClass='fs-18'
                  valueClass='fs-18'/>
                <DetailInfo
                  title='开店总数'
                  value={taregtData.value}
                  titleClass='fs-18'
                  valueClass='fs-18'/>
                <DetailInfo
                  title='商铺数量'
                  value={statisticsInfo.shop}
                  titleClass='fs-18'
                  valueClass='fs-18'/>
                <DetailInfo
                  title='街铺数量'
                  value={statisticsInfo.streetShop}
                  titleClass='fs-18'
                  valueClass='fs-18'/>
                <DetailInfo
                  title='租金范围'
                  value={statisticsInfo.rentScope}
                  titleClass='fs-18'
                  valueClass='fs-18'
                  span={24}/>
                <DetailInfo
                  title='截止日期'
                  value={statisticsInfo.deadline}
                  titleClass='fs-18'
                  valueClass='fs-18'
                  span={24}/>
                <DetailInfo
                  title='责任人'
                  value={statisticsInfo.contact}
                  titleClass='fs-18'
                  valueClass='fs-18'
                  span={24}/>
              </div>
          }
        </div>
        <div className={styles.rightCon}>
          <div className='fs-20 bold'>
            拓店提报数量(近半年)
          </div>
          <div className={cs('mt-30', styles.chartBarCon)}>
            <img
              src='https://staticres.linhuiba.com/project-custom/locationpc/demo/bg_chart_report@2x.png'
              width='100%'
              height='100%'/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsModule;
