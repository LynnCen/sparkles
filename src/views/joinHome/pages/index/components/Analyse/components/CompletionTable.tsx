import { FC } from 'react';
import V2Table from '@/common/components/Data/V2Table';
import { useMethods } from '@lhb/hook';
import { completionList } from '../../mock';
import { beautifyThePrice } from '@lhb/func';

// 各区域完成情况
const CompletionTable: FC<any> = ({ mainHeight }) => {

  const methods = useMethods({
    loadData() {
      return { dataSource: completionList, count: completionList.length };
    }
  });

  const markRed = (text, isRed) => {
    return isRed ? <div className='c-f23'>{text}</div> : text;
  };

  const thousandsSeparator = (value) => {
    return beautifyThePrice(value, ',', 0);
  };

  const defaultColumns = [
    { title: '开发部', key: 'devDpt', fixed: true, width: 50, },
    { title: '在营业门店总数', key: 'inOperationStoresCount', width: 130, render: (text, record) =>
      markRed(thousandsSeparator(text), record.inOperationStoresCountRed)
    },
    { title: '新开门店总数', key: 'newStoresCount', width: 130, render: (text, record) =>
      markRed(thousandsSeparator(text), record.newStoresCountRed)
    },
    { title: '落位计划完成率', key: 'locationPlanRate', width: 130, render: (text, record) => markRed(text, record.locationPlanRateRed) },
    { title: '点位上报完成率', key: 'spotReportRate', width: 130, render: (text, record) => markRed(text, record.spotReportRateRed) },
    { title: '落位', key: 'location', children: [
      { title: '总数', key: 'locationCount', width: 80, render: (text) => thousandsSeparator(text) },
      { title: '签约率', key: 'locationRate', width: 80, render: (text, record) => markRed(text, record.locationRateRed) },
    ], },
    { title: '评估通过', key: 'pass', children: [
      { title: '总数', key: 'passCount', width: 80, render: (text) => thousandsSeparator(text) },
      { title: '通过率', key: 'passRate', width: 80, render: (text, record) => markRed(text, record.passRateRed) },
    ], },
    { title: '选定点位', key: 'chooseSpot', children: [
      { title: '总数', key: 'chooseSpotCount', width: 80, render: (text) => thousandsSeparator(text) },
      { title: '转化率', key: 'conversionRate', width: 80, render: (text, record) => markRed(text, record.conversionRateRed) },
    ], },
    { title: '新增加盟商', key: 'newJoinCount', width: 80, render: (text) => thousandsSeparator(text) },
    { title: '新增点位数', key: 'newSpotCount', width: 80, render: (text) => thousandsSeparator(text) },
    { title: '在库点位数', key: 'storeSpotCount', width: 80, render: (text) => thousandsSeparator(text) },
    { title: '平均落位周期', key: 'aveLocationDays', width: 110, render: (text, record) => markRed(text, record.aveLocationDaysRed) },
  ];

  return (
    <V2Table
      onFetch={methods.loadData}
      defaultColumns={defaultColumns}
      rowKey='id'
      pagination={false}
      scroll={{ y: mainHeight - 64 - 32 }}
    />
  );
};

export default CompletionTable;
