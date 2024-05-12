import { FC } from 'react';
import { Typography } from 'antd';
import { valueFormat } from '@/common/utils/ways';
import { floorKeep, isNotEmpty } from '@lhb/func';
import V2Table from '@/common/components/Data/V2Table';

const { Link } = Typography;

const commonRender = { width: 120, render: (value: number | string) => valueFormat(value) };

interface IProps {
  loadData: Function;
  params: Record<string, any>;
  // isBabyCare?: boolean;
  isAsics?: boolean;
  mainHeight: number;
}

const List: FC<IProps> = ({
  loadData,
  params,
  isAsics,
  // isBabyCare
  mainHeight
}) => {
  // const renderStatus = (value: string, record: Record<string, any>) => {
  //   return <span className={approvalStatusClass(record.approveStatus)}>{value}</span>;
  // };

  const columns = [
    {
      title: '店铺名称',
      key: 'chancePointName',
      fixed: 'left',
      width: 200,
      render: (value: string, record) =>
        record.reportId ? (
          <Link href={`/storemanage/alternativedetail?id=${record.reportId}&code=${record.code}`}>{record.reportName}</Link>
        ) : (
          <Link href={`/storemanage/tapdetail?id=${record.id}&code=${record.code}`}>{value}</Link>
        ),
    },
    // {
    //   title: '拓店调研报告',
    //   key: 'reportName',
    //   ...commonRender,
    //   width: 200,
    //   render: (value: string, record) =>
    //     record.reportId ? <Link href={`/storemanage/alternativedetail?id=${record.reportId}`}>{value}</Link> : '-',
    // },
    { title: '店铺评分', key: 'shopScore', ...commonRender },
    {
      title: '所在城市',
      key: 'cityName',
      ...commonRender,
      width: 100,
    },
    { title: '店铺类型', key: 'shopCategoryName', ...commonRender },
    {
      title: '店铺地址',
      key: 'shopAddress',
      width: 300,
      render: (value: string) => valueFormat(value),
    },
    { title: '合同面积（m²）', key: 'contractArea', ...commonRender, width: 150 },
    { title: '实际使用面积（m²）', key: 'usableArea', ...commonRender, width: 160 },
    { title: '预计销售额（元/年）', key: 'estimatedSale', ...commonRender, width: 160 },
    {
      title: `租期总利润（${isAsics ? '万元' : '元'}）`,
      key: 'totalProfitDuringRent',
      ...commonRender, width: 160,
      render: (value: string, row) => isNotEmpty(value) ? (!isAsics && row.code !== 'other' ? floorKeep(value, 10000, 3) : value) : '-'
    },
    { title: '成本支出（元/年）', key: 'paymentCost', ...commonRender, width: 160 },
    // { title: isBabyCare ? '预计销售额(元/天)' : '保本销售额(元/天)', key: 'guaranteedSale', ...commonRender, width: '160px' },
    { title: '保本销售额(元/天)', key: 'guaranteedSale', ...commonRender, width: '160px' },
    { title: '工作日日均客流（人次）', key: 'flowWeekday', ...commonRender, width: '200px' },
    { title: '节假日日均客流（人次）', key: 'flowWeekend', ...commonRender, width: '200px' },
    { title: '创建日期', key: 'createdAt', ...commonRender },
    { title: '责任人', key: 'responsibleName', ...commonRender },
  ];

  return (
    <V2Table
      defaultColumns={columns}
      onFetch={loadData}
      filters={params}
      scroll={{ y: mainHeight - 80 }}
      rowKey='id'
    />
  );
};

export default List;
