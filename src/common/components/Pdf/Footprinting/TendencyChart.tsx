import { FC, useMemo } from 'react';
import styles from './entry.module.less';
import LineEcharts from './LineEcharts';
const TendencyChart: FC<any> = ({ lineChartTitle, lineDatas }) => {

  const data = useMemo(() => {
    const dataVal:any = {
      verticalAxis: [],
      horizontalAxis: []
    };
    lineDatas?.map((item) => {
      dataVal.verticalAxis.push(item.verticalAxis);
      dataVal.horizontalAxis.push(item.horizontalAxis);
    });
    return dataVal;
  }, [lineDatas]);

  return (
    <div className={styles.tendencyChartCon}>
      <div className={styles.title}>
        {lineChartTitle}
      </div>
      <div className={styles.charts}>
        <LineEcharts
          config={{
            data: data.verticalAxis,
            xData: data.horizontalAxis
          }}
          width='110%'
          height='450px'/>
      </div>
    </div>
  );
};

export default TendencyChart;

