/**
 * @Description 年龄分布
 */
import V2BarChart from '@/common/components/Charts/V2BarChart';
import { FC, useMemo, memo } from 'react';
import styles from './index.module.less';
import cs from 'classnames';
import { isArray } from '@lhb/func';
import SexRate from './SexRate';



const AgeDistribution: FC<any> = ({
  detail,
  sexInfo,
}) => {

  const xAxisData = useMemo(() => {
    const arr = isArray(detail) && detail.length ? detail.map((item) => item.name) : [];
    return arr;
  }, [detail]);

  const seriesData = useMemo(() => {
    const arr = isArray(detail) && detail.length ? detail.map((item) => item.rate) : [];
    return arr;
  }, [detail]);


  // const rate = useMemo(() => {
  //   const arr = isArray(detail) && detail.length ? detail.map((item) => item.value) : [];
  //   return arr;
  // }, [detail]);

  // 在这里编写组件的逻辑和渲染
  return (
    <div className={cs(styles.chartWrapper, styles.barChart)}>
      <div className='mt-16 ml-16 fs-14 c-222 bold'>人口客群</div>
      <SexRate data={sexInfo} />
      <div className={styles.ageBarChart}>
        <V2BarChart
          title=''
          theme='purple'
          direction='horizontal'
          xAxisData={xAxisData}
          seriesData={[{
            data: seriesData,
            center: ['50%', '30%'],
            animation: false,
          }]}
          height={190}
          config={{
            legend: {
              show: false
            },
            grid: {
              top: 10,
              left: 80,
              right: 16,
            },
            yAxis: {
              axisLabel: {
                formatter: '{value}%'
              },
            },
            tooltip: {
              // formatter: (params) => {
              //   console.log(`params`, params);
              //   return `${params[0].marker}${params[0].axisValueLabel}  ${rate?.[params[0].dataIndex]}`;
              // }
              formatter: '{b}: {c}%'
            }
          }}
        />
      </div>
    </div>
  );
};

export default memo(AgeDistribution);
