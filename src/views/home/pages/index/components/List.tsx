// 门店列表
// import { useClientSize } from '@lhb/hook';
import { FC } from 'react';
import Table from '@/common/components/FilterTable';
import styles from '../entry.module.less';

const List: FC<any> = () => {
  const tableList = [
    {
      id: '1',
      name: '天街森谷(南京路店)',
      score: 98,
      predict: 19621,
      pass: 3782,
      into: 2307,
      conversion: '41%',
      CPE: 5.70
    },
    {
      id: '2',
      name: '天街森谷(城隍庙店)',
      score: 96,
      predict: 14716,
      pass: 2993,
      into: 1533,
      conversion: '30%',
      CPE: 5.36
    },
    {
      id: '3',
      name: '天街森谷(亚新广场店)',
      score: 95,
      predict: 11091,
      pass: 2468,
      into: 1429,
      conversion: '29%',
      CPE: 4.48
    },
    {
      id: '4',
      name: '天街森谷(滨江店)',
      score: 94,
      predict: 9858,
      pass: 2403,
      into: 1382,
      conversion: '32%',
      CPE: 4.65
    }
  ];


  const columns: any[] = [
    { key: 'name', title: '门店名称', width: 130, },
    { key: 'score', title: '门店评分', width: 80 },
    { key: 'predict', title: '预计销售额(元/天)', width: 130 },
    { key: 'pass', title: '日均过店客流（人次）', width: 130 },
    { key: 'into', title: '日均进店客流（人次）', width: 130 },
    { key: 'conversion', title: '转化率', width: 80, },
    { key: 'CPE', title: 'CPE', width: 80, },
  ];

  // const scrollHeight = useClientSize().height - 350;

  const loadData = async () => {
    return Promise.resolve({ dataSource: tableList });
  };
  return (
    <div className={styles.listCon}>
      <div className={styles.title}>
        <span className='fs-16 bold pl-8'>
          门店列表
        </span>
      </div>
      {/* table */}
      <div className='pb-20'>
        <Table
          rowKey='id'
          // scroll={{ x: 'max-content', y: scrollHeight }}
          onFetch={loadData}
          filters={null}
          columns={columns}
          pagination={false}
        />
      </div>
    </div>
  );
};
export default List;
