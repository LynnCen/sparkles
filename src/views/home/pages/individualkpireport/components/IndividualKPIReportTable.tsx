/**
 * 个人绩效报表
 */
import V2Table from '@/common/components/Data/V2Table';
import { FC } from 'react';
import { post } from '@/common/request';

interface IndividualKPIReportTableProps {
  filters:Object;
  mainHeight?:number;
  tableConfig?:Object;
}


const IndividualKPIReportTable:FC<IndividualKPIReportTableProps> = ({
  mainHeight = 360,
  filters = {},
  tableConfig = {}
}) => {


  const loadData = async(params: any) => {
    // https://yapi.lanhanba.com/project/532/interface/api/70447
    const res = await post('/standard/home/employee/performanceReport/page', params);
    const list :any[] = res.meta?.total ? [({
      ...res.meta?.total,
      companyName: '汇总'
    } || { companyName: '汇总' })].concat(res.objectList) : res.objectList;
    return { dataSource: list || [], count: res.totalNum };
  };

  const defaultColumns = [
    {
      title: '开发部',
      key: 'companyName',
      fixed: true,
      width: 50,
    },
    {
      title: '姓名',
      key: 'name',
      fixed: true,
      width: 50,
    },
    // {
    //   title: '落位计划完成率',
    //   key: 'shopApprovalPassRate',
    //   width: 130,
    //   render: (text, record) => (record.shopApprovalPassRate ? <div className='c-f23'>{text}</div> : text),
    // },
    {
      title: '落位',
      key: 'falling',
      children: [
        {
          title: '总数',
          key: 'fallingShopCount',
          width: 80,
        },
        {
          title: '签约率',
          key: 'fallingShopRate',
          width: 80,
          render: (text, record) => (record.fallingShopRate ? <div className='c-f23'>{text}%</div> : text),
        },
      ],
    },
    {
      title: '评估通过',
      key: 'pass',
      children: [
        {
          title: '总数',
          key: 'shopApprovalPassCount',
          width: 80,
        },
        {
          title: '通过率',
          key: 'shopApprovalPassRate',
          width: 80,
          render: (text, record) => (record.shopApprovalPassRate ? <div className='c-f23'>{text}%</div> : text),
        },
      ],
    },
    // {
    //   title: '选定点位',
    //   key: 'chooseSpot',
    //   children: [
    //     {
    //       title: '总数',
    //       key: 'chooseSpotCount',
    //       width: 80,
    //     },
    //     {
    //       title: '转化率',
    //       key: 'conversionRate',
    //       width: 80,
    //       render: (text, record) => (record.conversionRateRed ? <div className='c-f23'>{text}</div> : text),
    //     },
    //   ],
    // },
    {
      title: '评估上报',
      key: 'shopApprovalCount',
      width: 80,
    },
    {
      title: '新增加盟商',
      key: 'franchiseeCount',
      width: 80,
    },
    {
      title: '新增点位数',
      key: 'pointCount',
      width: 80,
    },
    {
      title: '平均落位周期',
      key: 'fallingPeriod',
      width: 110,
      render: (text, record) => (record.fallingPeriod ? <div className='c-f23'>{text}天</div> : text),
    },
  ];

  return (
    <V2Table
      onFetch={loadData}
      filters={filters}
      defaultColumns={defaultColumns}
      rowKey='userId'
      hideColumnPlaceholder
      // scroll={{ x: 'max-content', y: 250 }}
      // 64是分页模块的总大小， 42是table头部
      scroll={{ y: mainHeight - 64 - 42 - 56 }}
      {...tableConfig}
    />
  );
};

export default IndividualKPIReportTable;
