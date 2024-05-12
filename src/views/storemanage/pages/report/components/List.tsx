import { FC } from 'react';

import Tables from '@/common/components/FilterTable';

import { approvalStatusClass, valueFormat } from '@/common/utils/ways';
import { useClientSize } from '@lhb/hook';

const commonRender = { width: 140, render: (value: number | string) => valueFormat(value) };

const List: FC<any> = ({
  loadData,
  params,
  isAsics
  // isBabyCare
}) => {
  // table 头部固定，动态获取剩余可视区的高度，超过这个区域头部固定中间内容滚动
  const scrollHeight = useClientSize().height - 340;

  const renderStatus = (value, record) => {
    return <span className={approvalStatusClass(record.approvalStatus)}>{value}</span>;
  };

  const renderCooperation = (value, record) => {
    const { firstYearRent, guaranteedRent, deductionRate } = record;
    if (value === null) return '-';
    return value === 1
      ? `首年租金 ｜ ${valueFormat(firstYearRent)}元`
      : `保底租金 | ${valueFormat(guaranteedRent)}元${deductionRate ? `，扣点${valueFormat(deductionRate)}%` : ''}`;
  };

  const columns = [
    { title: '店铺名称', key: 'reportName', fixed: 'left', width: 200 },
    { title: '当前阶段', key: 'shopStatusName', ...commonRender, width: 100 },
    {
      title: '审批状态',
      key: 'approvalStatusName',
      ...commonRender,
      render: (value, record) => renderStatus(value, record),
    },
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
    { title: '调研日期', key: 'createdAt', ...commonRender, width: 160 },
    { title: '预计销售额（元/年）', key: 'estimatedSale', ...commonRender, width: 160 },
    { title: `租期总利润（${isAsics ? '万元' : '元'}）`, key: 'totalProfitDuringRent', ...commonRender, width: 160 },
    { title: '成本支出（元/年）', key: 'paymentCost', ...commonRender, width: 160 },
    // { title: isBabyCare ? '预计销售额(元/天)' : '保本销售额(元/天)', key: 'guaranteedSale', ...commonRender, width: '160px' },
    { title: '保本销售额(元/天)', key: 'guaranteedSale', ...commonRender, width: '160px' },
    { title: '工作日日均客流（人次）', key: 'flowWeekday', ...commonRender, width: '200px' },
    { title: '节假日日均客流（人次）', key: 'flowWeekend', ...commonRender, width: '200px' },
    { title: '租金模式', key: 'rentalModelName', ...commonRender, width: 160 },
    {
      title: '租金情况',
      key: 'rentalModel',
      ...commonRender,
      width: 260,
      render: (value, record) => renderCooperation(value, record),
    },
    { title: '预计交房时间', key: 'deliveryDate', ...commonRender, width: 160 },
    { title: '责任人', key: 'responsibleName', ...commonRender, width: 160 },
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
