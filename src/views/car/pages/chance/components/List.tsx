import { FC } from 'react';

import Tables from '@/common/components/FilterTable';
import { Typography } from 'antd';

import { useClientSize } from '@lhb/hook';
import { valueFormat } from '@/common/utils/ways';

const { Link } = Typography;

const commonRender = { width: 120, render: (value: number | string) => valueFormat(value) };
const costRender = { width: 160, render: (value: number | string) => valueFormat(value, '元') };

interface IProps {
  loadData: Function;
  params: Record<string, any>;
  isBabyCare?: boolean;
}

const List: FC<IProps> = ({
  loadData,
  params
}) => {
  // table 头部固定，动态获取剩余可视区的高度，超过这个区域头部固定中间内容滚动
  const scrollHeight = useClientSize().height - 340;

  // const renderStatus = (value: string, record: Record<string, any>) => {
  //   return <span className={approvalStatusClass(record.approveStatus)}>{value}</span>;
  // };

  const columns = [
    {
      title: '所在城市',
      key: 'cityName',
      fixed: 'left',
      ...commonRender,
      width: 100,
    },
    {
      title: '机会点名称',
      fixed: 'left',
      key: 'chancePointName',
      width: 200,
      render: (value: string, record) => <Link href={`/car/chancedetail?id=${record.id}&code=${record.code}`}>{value}</Link>,
    },
    { title: '门店类型', key: 'shopCategoryName', ...commonRender },
    { title: '日均客流（人次）', key: 'aveFlow', ...commonRender, width: '200px' },
    { title: '租金（元/天）', key: 'aveDayRent', ...commonRender, width: 160 },
    { title: '预计单位过店成本', key: 'passCost', ...costRender },
    { title: '预计单位进店成本', key: 'indoorCost', ...costRender },
    { title: '预计单位留资成本', key: 'stayInfoCost', ...costRender },
    { title: '预计单位试驾成本', key: 'testDriveCost', ...costRender },
    { title: '预计单位大定成本', key: 'orderCost', ...costRender },
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
