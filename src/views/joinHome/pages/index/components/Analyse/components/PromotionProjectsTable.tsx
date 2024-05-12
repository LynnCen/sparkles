import { FC } from 'react';
import V2Table from '@/common/components/Data/V2Table';
import { useMethods } from '@lhb/hook';
import { PromotionProjectsList } from '../../mock';
import { beautifyThePrice } from '@lhb/func';

// 重点推进项目
const PromotionProjectsTable: FC<any> = ({ mainHeight }) => {

  const methods = useMethods({
    loadData() {
      return { dataSource: PromotionProjectsList, count: PromotionProjectsList.length };
    }
  });

  const markRed = (text, isRed) => {
    return isRed ? <div className='c-f23'>{text}</div> : text;
  };

  const thousandsSeparator = (value) => {
    return beautifyThePrice(value, ',', 0);
  };

  const defaultColumns = [
    { title: '加盟商编号', key: 'joinCode', fixed: true, width: 130, render: (text) => <div className='color-primary'>{text}</div> },
    { title: '所在城市', key: 'joinCity', width: 50, },
    { title: '加盟商姓名', key: 'joinName', width: 130 },
    { title: '当前状态', key: 'currentStatus', width: 130 },
    { title: '匹配点位', key: 'matchSpotNum', width: 220 },
    { title: '店铺类型', key: 'storeType', width: 80, },
    { title: '预计日销', key: 'dailySales', width: 80, render: (text) => (thousandsSeparator(text) + '元') },
    { title: '日保本点', key: 'dailyCost', width: 80, render: (text) => (thousandsSeparator(text) + '元') },
    { title: '预计利润率', key: 'profitRate', width: 80, },
    { title: '加盟日期', key: 'joinDate', width: 130, },
    { title: '落位日期', key: 'locationDaysStr', width: 80, render: (text, record) => markRed(text, record.locationDaysStrRed) },
  ];

  return (
    <V2Table
      onFetch={methods.loadData}
      defaultColumns={defaultColumns}
      rowKey='id'
      scroll={{ y: mainHeight - 64 + 8 }}
      pagination={false}
    />
  );
};

export default PromotionProjectsTable;
