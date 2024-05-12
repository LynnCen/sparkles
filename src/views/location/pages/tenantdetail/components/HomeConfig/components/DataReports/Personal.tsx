/**
 * @Description 数据报表-个人绩效
 */
import React from 'react';
import V2Table from '@/common/components/Data/V2Table';
import { personalList } from './data';

const Personal: React.FC<any> = ({
  filters,
  className = '',
}) => {
  const defaultColumns = [
    { title: '开发部', key: 'departmentName', width: 100, dragChecked: true },
    { title: '姓名', key: 'userName', width: 100, dragChecked: true },
    { title: '落位计划完成率', key: 'contractPlanRate', width: 130, dragChecked: true },
    { title: '落位', key: 'contractAgree',
      children: [
        { title: '总数', key: 'contractAgreeCount', width: 100, dragChecked: true },
        { title: '签约率', key: 'contractAgreeRate', width: 100, dragChecked: true },
      ],
    },
    {
      title: '评估通过',
      key: 'evaluationAgree',
      children: [
        { title: '总数', key: 'evaluationAgreeCount', width: 100, dragChecked: true },
        { title: '通过率', key: 'evaluationAgreeRate', width: 100, dragChecked: true },
      ],
    },
    { title: '评估上报', key: 'evaluationCount', width: 100, dragChecked: true },
    { title: '新增加盟商', key: 'franchiseeCount', width: 100, dragChecked: true },
    { title: '新增点位数', key: 'pointAllCount', width: 100, dragChecked: true },
    { title: '在库点位数', key: 'chancePointCount', width: 100, dragChecked: true },
    { title: '平均落位周期', key: 'avgContractAgreePeriod', width: 110, dragChecked: true },
  ];

  const loadData = () => {
    const dataSource = personalList.map((itm, idx) => ({
      ...itm,
      idx,
    }));
    return {
      dataSource,
      count: dataSource.length,
    };
  };

  return (<div className={className}>
    <V2Table
      filters={filters}
      rowKey='idx'
      defaultColumns={defaultColumns}
      onFetch={loadData}
      hideColumnPlaceholder
      scroll={{ y: 400 }}
    />
  </div>);
};

export default Personal;
