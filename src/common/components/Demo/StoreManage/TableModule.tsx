import { FC } from 'react';
import cs from 'classnames';
import styles from './index.module.less';
import Tables from '@/common/components/FilterTable';

const TableModule: FC = () => {
  const mockData = [
    {
      id: 1,
      name: '天街森谷(滨江店)',
      typeName: '商铺',
      rentScope: '10,000-13,000',
      targetProvince: '浙江省',
      targetCity: '杭州市',
      deadline: '2022-12-31',
      contacts: '杨乐'
    },
    {
      id: 2,
      name: '天街森谷(余杭店)',
      typeName: '街铺',
      rentScope: '7,000-12,000',
      targetProvince: '浙江省',
      targetCity: '杭州市',
      deadline: '2022-12-31',
      contacts: '杨乐'
    },
    {
      id: 3,
      name: '天街森谷(西湖店)',
      typeName: '商铺',
      rentScope: '8,000-15,000',
      targetProvince: '浙江省',
      targetCity: '杭州市',
      deadline: '2022-12-31',
      contacts: '杨乐'
    },
    {
      id: 4,
      name: '天街森谷(拱墅店)',
      typeName: '街铺',
      rentScope: '5,000-14,000',
      targetProvince: '浙江省',
      targetCity: '杭州市',
      deadline: '2022-12-31',
      contacts: '杨乐'
    },
  ];
  const columns = [
    { title: '任务名称', key: 'name' },
    { title: '开店类型', key: 'typeName' },
    { title: '租金范围(元)', key: 'rentScope' },
    { title: '目标省份', key: 'targetProvince' },
    { title: '目标城市', key: 'targetCity' },
    { title: '任务截止时间', key: 'deadline' },
    { title: '责任人', key: 'contacts' },
  ];

  const loadData = () => {
    return { dataSource: mockData, count: 4 };
  };

  return (
    <div className={cs(styles.tableCon, 'mt-16')}>
      <div className='fs-20 bold'>
        华东区域
      </div>
      <Tables
        className='mt-20'
        columns={columns}
        onFetch={loadData}
        rowKey='id'
        pagination={false}
      />
    </div>
  );
};

export default TableModule;
