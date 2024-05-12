import { FC } from 'react';
import V2Table from '@/common/components/Data/V2Table';
import { useMethods } from '@lhb/hook';
import { beautifyThePrice } from '@lhb/func';

// 各区域完成情况
const CompletionTable: FC<any> = ({ mainHeight, statisticData }) => {
  const methods = useMethods({
    loadData() {
      return { dataSource: statisticData || [], count: statisticData?.length || 0 };
    },
  });

  const markRed = (text, isRed) => {
    return isRed ? <div className='c-f23'>{text}</div> : text;
  };

  const thousandsSeparator = (value) => {
    return beautifyThePrice(value, ',', 0);
  };

  const defaultColumns = [
    { title: '开发部', key: 'departmentName', fixed: true, width: 120 },
    {
      title: '落位计划完成率',
      key: 'contractPlanRate',
      width: 80,
      render: (text, record) => markRed(text, record.underPlanRate === 1),
    },
    {
      title: '落位',
      key: 'location',
      children: [
        { title: '总数', key: 'contractAgreeCount', width: 80, render: (text) => thousandsSeparator(text) },
        {
          title: '签约率',
          key: 'contractAgreeRate',
          width: 80,
          render: (text, record) => markRed(text, record.underContractAgreeRate === 1),
        },
      ],
    },
    {
      title: '评估通过',
      key: 'pass',
      children: [
        { title: '总数', key: 'evaluationAgreeCount', width: 80, render: (text) => thousandsSeparator(text) },
        { title: '通过率', key: 'evaluationAgreeRate', width: 80, render: (text, record) => markRed(text, record.underEvaluationAgreeRate === 1) },
      ],
    },
    { title: '评估上报', key: 'evaluationCount', width: 80, render: (text) => thousandsSeparator(text) },
    { title: '新增加盟商', key: 'franchiseeCount', width: 80, render: (text) => thousandsSeparator(text) },
    { title: '新增点位数', key: 'pointAllCount', width: 80, render: (text) => thousandsSeparator(text) },
    { title: '在库点位数', key: 'chancePointCount', width: 80, render: (text) => thousandsSeparator(text) },
    {
      title: '平均落位周期',
      key: 'avgContractAgreePeriod',
      width: 110,
      render: (text, record) => markRed(text, record.overtopContractAgreePeriod === 1),
    },
  ];

  return (
    <V2Table
      onFetch={methods.loadData}
      defaultColumns={defaultColumns}
      rowKey='id'
      pagination={false}
      filters={statisticData}
      scroll={{ y: mainHeight - 64 - 32 }}
    />
  );
};

export default CompletionTable;
