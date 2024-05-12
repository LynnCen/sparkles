import { FC } from 'react';

import Tables from '@/common/components/FilterTable';
import { Typography } from 'antd';
import { valueFormat } from '@/common/utils/ways';
import { useClientSize } from '@lhb/hook';
import { floorKeep, isNotEmpty } from '@lhb/func';

const { Link } = Typography;

const commonRender = { width: 140, render: (value: number | string) => valueFormat(value) };

const List: FC<any> = ({
  loadData,
  params,
  isAsics
  // isBabyCare
}) => {
  // table 头部固定，动态获取剩余可视区的高度，超过这个区域头部固定中间内容滚动
  const scrollHeight = useClientSize().height - 340;

  const columns = [
    {
      title: '店铺名称',
      key: 'reportName',
      fixed: 'left',
      width: 200,
      render: (value: string, record) => <Link href={`/storemanage/reservedetail?id=${record.id}&code=${record.code}`}>{value}</Link>,
    },
    { title: '当前阶段', key: 'shopStatusName', ...commonRender, width: 100 },
    { title: '店铺评分', key: 'shopScore', ...commonRender },
    {
      title: '所在城市',
      key: 'cityName',
      ...commonRender,
      width: 100
    },
    { title: '店铺类型', key: 'shopCategoryName', ...commonRender },
    { title: '店铺地址', key: 'shopAddress', ...commonRender, width: 200 },
    { title: '合同面积（m²）', key: 'contractArea', ...commonRender },
    { title: '实际使用面积（m²）', key: 'usableArea', ...commonRender, width: 160 },
    { title: '预计销售额（元/年）', key: 'estimatedSale', ...commonRender, width: 160 },
    {
      title: `租期总利润（${isAsics ? '万元' : '元'}）`,
      key: 'totalProfitDuringRent',
      ...commonRender,
      width: 160,
      render: (value: string, row) => isNotEmpty(value) ? (!isAsics && row.code !== 'other' ? floorKeep(value, 10000, 3) : value) : '-'
    },
    { title: '成本支出（元/年）', key: 'paymentCost', ...commonRender, width: 160 },
    // { title: isBabyCare ? '预计销售额(元/天)' : '保本销售额(元/天)', key: 'guaranteedSale', ...commonRender, width: 150 },
    { title: '保本销售额(元/天)', key: 'guaranteedSale', ...commonRender, width: 150 },
    { title: '工作日日均客流（人次）', key: 'flowWeekday', ...commonRender, width: 150 },
    { title: '节假日日均客流（人次）', key: 'flowWeekend', ...commonRender, width: 150 },
    { title: '预计交房时间', key: 'deliveryDate', ...commonRender },
    { title: '预计开业时间', key: 'openDate', ...commonRender },
    { title: '责任人', key: 'responsibleName', ...commonRender },
  ];

  return (
    <Tables
      className='mt-20'
      columns={columns}
      onFetch={loadData}
      filters={params}
      scroll={{ x: 'max-content', y: scrollHeight }}
      rowKey='id'
    />
  );
};

export default List;
