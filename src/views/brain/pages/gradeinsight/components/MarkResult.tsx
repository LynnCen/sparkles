import React from 'react';
import styles from '../entry.module.less';
import { Table } from 'antd';
import { markResultDatas } from './config';

const columns = [
  {
    title: '评分项',
    children: [
      {
        title: '指标大类',
        dataIndex: 'targetType',
        align: 'center',
        onCell: (record) => {
          console.log(record);
          if (record.key === 2) {
            return { rowSpan: 2 };
          }
          if (record.key === 4) {
            return { rowSpan: 14 };
          }
          if (record.key === 18) {
            return { rowSpan: 7 };
          }
          if (record.key === 25) {
            return { rowSpan: 9 };
          }
          return { rowSpan: 0 };
        },
      },
      {
        title: '一级权重',
        dataIndex: 'weight',
        align: 'center',
        onCell: (record) => {
          console.log(record);
          if (record.key === 2) {
            return { rowSpan: 2 };
          }
          if (record.key === 4) {
            return { rowSpan: 14 };
          }
          if (record.key === 18) {
            return { rowSpan: 7 };
          }
          if (record.key === 25) {
            return { rowSpan: 9 };
          }
          return { rowSpan: 0 };
        },
      },
      {
        title: '指标',
        dataIndex: 'target',
        align: 'center',
      },
      {
        title: '指标权重',
        dataIndex: 'targetWeight',
        align: 'center',
      }
    ]
  },
  {
    title: '评分标准',
    children: [
      {
        title: '100分',
        align: 'center',
        dataIndex: 'rule100',
      },
      {
        title: '80分',
        align: 'center',
        dataIndex: 'rule80',
      },
      {
        title: '60分',
        align: 'center',
        dataIndex: 'rule60',
      },
      {
        title: '40分',
        align: 'center',
        dataIndex: 'rule40',
      },
      {
        title: '20分',
        align: 'center',
        dataIndex: 'rule20',
      },
    ],
  },
];

const MarkResult: React.FC<any> = (props) => {
  console.log(`props = `, props);

  return (
    <div className={styles.container}>
      <div>
        <span className={styles.title}>评分表优化结果</span>
        <span className={styles.label}>依据转化率回归分析结果及相关性系数排名对原评分表进行调优</span>
      </div>
      <Table
        className='mt-20 ct'
        columns={columns}
        dataSource={markResultDatas}
        bordered
        size='small'
        pagination={false}
        sticky />
    </div>
  );
};

export default MarkResult;
