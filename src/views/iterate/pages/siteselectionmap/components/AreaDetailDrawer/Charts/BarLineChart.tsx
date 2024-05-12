/**
 * @Description 柱形图/折线图结合
 */
import { FC, useMemo } from 'react';
import styles from './index.module.less';
import cs from 'classnames';
import V2BarLineChart from '@/common/components/Charts/V2BarLineChart';
import { isArray, isNotEmptyAny } from '@lhb/func';


const BarLineChart: FC<any> = ({
  title,
  type = '商业',
  districtName,
  series,
  onlyBar, // 是否只显示柱状图
}) => {
  // 在这里编写组件的逻辑和渲染

  const xAxisData = useMemo(() => {
    const arr = isArray(series) && series.length ? series.map((item) => item.name) : [];
    return arr;
  }, [series]);

  const seriesData = useMemo(() => {
    const y1 = isArray(series) && series.length ? series.map((item) => item.num) : [];
    const y2 = isArray(series) && series.length ? series.map((item) => item.rate) : [];

    const bar = [{
      name: `${type}区类型数量`,
      type: 'bar',
      yAxisIndex: 0,
      data: y1,
    }];

    return onlyBar ? [...bar] : [...bar, {
      name: `相对于【${districtName || '-'}】占比`,
      type: 'line',
      yAxisIndex: 1,
      unit: '%',
      data: y2,
    }];

  }, [series]);


  return (
    <div>
      {isNotEmptyAny(series) ? <div className={cs(styles.chartWrapper, styles.barChart)}>
        <div className='mt-16 ml-16 fs-14 c-222 bold'>{ title || `${type}区数量分布`}</div>
        <div className={styles.ageBarChart}>
          <V2BarLineChart
            title=''
            xAxisData={xAxisData}
            seriesData={seriesData}
            yAxisData={[
              {},
              { axisLabel: { formatter: '{value}%' } }
            ]}

            config={{
              legend: {
                left: 15,
              },
              // grid: {
              //   left: 30,
              //   bottom: 36,
              //   right: 12,
              // }
            }}
          />
        </div>
      </div> : <></> }
    </div>
  );
};

export default BarLineChart;
