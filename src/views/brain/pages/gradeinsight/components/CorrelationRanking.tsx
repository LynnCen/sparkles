import React from 'react';
import styles from '../entry.module.less';
import Table from '@/common/components/FilterTable';
import { useMethods } from '@lhb/hook';
import cs from 'classnames';
import { rankingDatas } from './config';


const rankingColumns = [
  {
    title: '指标大类',
    key: 'name',
    align: 'center',
  },
  {
    title: '指标',
    align: 'center',
    key: 'code'
  },
  {
    title: '相关性系数',
    align: 'center',
    key: 'categoryName'
  },
  {
    title: '好店数量占比',
    align: 'center',
    key: 'industryList',
    render: text => <pre>{text}</pre>
  },
  {
    title: '评分表建议',
    align: 'center',
    key: 'description',
    render: text => <div className={text === '保留该指标' ? 'c-009' : (text === '增加该指标' ? 'c-ff8' : 'c-f23')}>{text}</div>
  }
];

const CorrelationRanking: React.FC<any> = (props) => {
  console.log(`props = `, props);
  const methods = useMethods({
    async fetchData() {
      return {
        dataSource: rankingDatas
      };
    }
  });

  return (
    <div className={styles.container}>
      <div>
        <span className={styles.title}>相关性系数排名</span>
        <span className={styles.label}>根据指标的转化率相关性系数进行排序，辅以评估指标在评分表中的重要性</span>
      </div>
      <Table
        pagination={false}
        columns={rankingColumns}
        onFetch={methods.fetchData}
        className={cs(styles.tableList, 'mt-20')}
        rowKey='industryList' />
    </div>
  );
};

export default CorrelationRanking;
