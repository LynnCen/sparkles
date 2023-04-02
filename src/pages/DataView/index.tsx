/**
 * @Author Pull
 * @Date 2021-09-14 15:27
 * @project index
 */
import React from 'react';
import { Card, DatePicker } from 'antd';
import styles from './index.less';
import classNames from 'classnames';
import ReportCard from '../../components/AnalysisCard';
import { useDataView } from './useDataView';
import LineChart from './components/LineChart';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const DataView = () => {
  const { cards } = useDataView();

  const handleQuery = (action: string) => {};

  console.log(cards);
  return (
    <PageHeaderWrapper>
      <section className={classNames(styles.t, styles.bg)}>
        <Card>
          <section className={styles.cards}>
            {cards.map((item, i) => (
              <ReportCard
                title="新用户次日留存率(7日平均)"
                percent={6.07}
                ratio={-47.5}
                isUp={item.status === 1}
                isDown={item.status === 2}
                key={i}
                wrapStyle={{ width: '20%', padding: '0 12px' }}
              />
            ))}
          </section>
        </Card>
        <Card title="图表1">
          <DatePicker.RangePicker />

          <section className={styles.queryType}>
            {[
              { title: '新增用户', action: 'new' },
              { title: '活跃用户', action: 'active' },
              { title: '累计用户', action: 'accumulate' },
            ].map(({ title, action }) => (
              <span key={action} className={styles.queryItem} onClick={() => handleQuery(action)}>
                {title}
              </span>
            ))}

            <LineChart />
          </section>
        </Card>
      </section>
    </PageHeaderWrapper>
  );
};

export default DataView;
