import React from 'react';
import FilterTable from '@/common/components/FilterTable';
import styles from './index.module.less';
import { urlParams } from '@lhb/func';

const DetailTable: React.FC<any> = ({ detail }) => {
  const columns = [
    { key: 'name', title: '参数名称' },
    {
      key: 'value',
      title: '参数值',
      render: (value: any, record: any) => {
        console.log('record', record);
        if (record.id === 'address') {
          return addresses;
        }
        if (record.id === 'category') {
          return categories;
        }
        if (record.id === 'brand') {
          return brands;
        }
        return null;
      },
    },
  ];

  const addresses = Array.isArray(detail.addresses) ? detail.addresses.map((itm) => itm.name).join('、') : '-';

  const categories = Array.isArray(detail.categories)
    ? detail.categories.map((itm) => itm.categoryName).join('、')
    : '-';
  const brands = Array.isArray(detail.brands)
    ? detail.brands.map((itm) => itm.brandName).join('、')
    : '-';

  const onFetch = () => {
    let dataSource:any = [];
    const taskType = urlParams(location.search)?.taskType;
    // console.log('taskTypeName', taskType);
    if (taskType === 'CATEGORY_TASK') {
      dataSource = [
        { id: 'address', name: '地址' },
        { id: 'category', name: 'POI类别' },
      ];
    } else {
      dataSource = [
        { id: 'address', name: '地址' },
        { id: 'brand', name: '品牌列表' },
      ];
    }
    return {
      dataSource,
    };
  };

  return (
    <div className={styles.sectionTable}>
      <div className={styles.sectionTitle}>任务参数</div>
      <FilterTable rowKey='id' scroll={{ x: false }} onFetch={onFetch} columns={columns} pagination={false} />
    </div>
  );
};

export default DetailTable;
