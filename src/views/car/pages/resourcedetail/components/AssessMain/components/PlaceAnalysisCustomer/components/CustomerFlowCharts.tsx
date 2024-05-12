import GaugeCharts from '@/common/components/business/ECharts/components/GaugeCharts';
import BoardCard from '../../BoardCard';
import { Empty } from 'antd';
import React, { useMemo } from 'react';
import styles from './index.module.less';
import { isNotEmptyAny } from '@lhb/func';


const CustomerFlowCharts: React.FC<any> = ({
  data = {},
  className
}) => {

  // const data = {
  //   dailyFlow: 4000,
  //   workdayFlow: 400,
  //   holidayFlow: 5900
  // };

  // 客流指数图表配置
  const chartConfig = useMemo(() => {
    return {
      data: data,
      seriesConfig: {
        name: '活动行业分布',
        max: +data.workdayFlow >= +data.holidayFlow ? +data.workdayFlow : +data.holidayFlow,
      },
    };
  }, [data]);

  return (
    <BoardCard title='客流指数'>
      {/* data.dayFlow是number类型才显示图表 */}
      { isNotEmptyAny(data) && !isNaN(+data?.dailyFlow) ? <div className={styles['customer-flow-charts']}>
        <GaugeCharts
          config={chartConfig}
          className={className}
        />
        <div className={styles['right-box']}>
          <div className={styles['explain-con']}>
            <div className={styles.value}>
              {data.workdayFlow}
            </div>
            <div className={styles.label}>
              工作日日均
            </div>
          </div>
          <div className={(styles['explain-con'])}>
            <div className={styles.value}>
              {data.holidayFlow}
            </div>
            <div className={styles.label}>
              节假日日均
            </div>
          </div>
        </div>
      </div>
        : <Empty style={{ marginTop: 80 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </BoardCard>
  );
};


export default CustomerFlowCharts;
