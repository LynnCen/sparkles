/**
 * @Author Pull
 * @Date 2021-09-15 16:15
 * @project index
 */
import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card } from 'antd';
import { useMsgAnalysis } from './useMsgAnalysis';
import AnalysisCard from '../../components/AnalysisCard';
import styles from './styles.less';
import { useIntl } from 'umi';
import RangePicker from './component/RangePicker';
import { Line } from '@ant-design/charts';
import { IChartItem } from './services';

const MessageAnalysis = () => {
  const { tabs, chartData, handleQuery } = useMsgAnalysis();
  const { formatMessage } = useIntl();

  const config = {
    data: chartData,
    height: 400,
    xField: 'year',
    yField: 'value',
    point: {
      size: 5,
      shape: 'diamond',
    },
    tooltip: {
      formatter: (datum: IChartItem) => {
        return { name: datum.year, value: datum.value + '条' };
      },
    },
  };
  return (
    <PageHeaderWrapper>
      <Card title="消息概览">
        <section className={styles.cards}>
          {tabs.map((item) => (
            <AnalysisCard
              key={item.title}
              title={item.title}
              percent={item.percent}
              ratio={item.ratio}
              isUp={item.status === 1}
              wrapStyle={{ width: '20%', padding: '0 12px' }}
            />
          ))}
        </section>
      </Card>

      <Card title="消息趋势" style={{ marginTop: 24 }}>
        <RangePicker handleQuery={handleQuery} />

        <section className={styles.chart}>
          <Line {...config} />
        </section>
      </Card>
    </PageHeaderWrapper>
  );
};

export default MessageAnalysis;
