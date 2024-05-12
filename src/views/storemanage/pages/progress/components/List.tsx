import { FC } from 'react';

import Tables from '@/common/components/FilterTable';

import { valueFormat } from '@/common/utils/ways';
import { useClientSize } from '@lhb/hook';

const commonRender = { width: 140, render: (value: number | string) => valueFormat(value) };

const List: FC<any> = ({ loadData, params }) => {
  // table 头部固定，动态获取剩余可视区的高度，超过这个区域头部固定中间内容滚动
  const scrollHeight = useClientSize().height - 340;

  const columns = [
    {
      title: '所在城市',
      key: 'cityName',
      ...commonRender,
      width: 100,
    },
    { title: '店铺类型', key: 'shopCategoryName', ...commonRender, width: 100 },
    { title: '调研数量', key: 'expandNum', ...commonRender },
    { title: '评估通过数量', key: 'passNum', ...commonRender },
    { title: '签约数量', key: 'signingNum', ...commonRender },
    { title: '交房数量', key: 'deliveredNum', ...commonRender },
    { title: '开业数量', key: 'openingNum', ...commonRender },
  ];

  return (
    <Tables
      rowKey='id'
      className='mt-20'
      columns={columns}
      onFetch={loadData}
      filters={params}
      scroll={{ x: 'max-content', y: scrollHeight }}
    />
  );
};

export default List;
