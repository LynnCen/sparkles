// 机会点管理-列表组件
import { FC } from 'react';
import V2Table from '@/common/components/Data/V2Table';
import { Typography } from 'antd';
import { isNotEmptyAny } from '@lhb/func';
const { Link } = Typography;

interface IProps {
  loadData: Function;
  params: Record<string, any>;
  openDetail: Function; // 打开详情
  mainHeight?: any;
}

const List: FC<IProps> = ({
  loadData,
  params,
  openDetail,
  mainHeight, // 从V2Container透传过来的，必须挂到scroll上
}) => {
  const columns = [
    {
      title: '机会点名称',
      key: 'chancePointName',
      dragChecked: true,
      dragDisabled: true,
      fixed: 'left',
      render: (text, record) => <Link onClick={() => openDetail(record)}>{text}</Link>,
    },
    {
      title: '对应开发经理',
      key: 'accountName',
      dragChecked: true,
      render: (value) => isNotEmptyAny(value) ? value : '-',
    },
    { title: '当前阶段', key: 'processName', dragChecked: true, },
    { title: '店铺类型', key: 'shopCategoryName', dragChecked: true, },
    {
      title: '详情地址',
      key: 'shopAddress',
      dragChecked: true,
    },
    {
      title: '选址23不要',
      key: 'site23ForbidCount',
      dragChecked: true,
      render: (_, item) =>
        +item.site23ForbidCount > 0 ? <span style={{ color: 'red' }}>{`${+item.site23ForbidCount}条不符合选址要求`}</span> : ''
    },
    { title: '预估日销售额（元）', key: 'checkBizEstimatedDailySales', dragChecked: true, },
    { title: '日外卖销售额（元）', key: 'checkBizDailyTakeawaySales', dragChecked: true, },
    { title: '日保本销售额（元）', key: 'checkBizDailyGuaranteedSalesRevenue', dragChecked: true, },
    { title: '投资回报周期（个月）', key: 'finCalcInvstInvestmentReturnCycle', dragChecked: true, },
  ];

  return (
    <V2Table
      onFetch={loadData}
      filters={params}
      rowKey='id'
      // 勿删! 64：分页模块总大小、52:分页模块减去paddingBottom的值、42:table头部
      scroll={{ y: mainHeight - 64 - 42 }}
      defaultColumns={columns}
      tableSortModule='consoleFishTogetherChancepoint1000'
    />
  );
};

export default List;
