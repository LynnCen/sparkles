// 门店分析
import { useState } from 'react';
import FlowInfo from '@/views/car/pages/home/components/FlowInformation';
import DateBar from '@/common/components/business/DateBar';
import NotFound from '@/common/components/NotFound';
import HeadAlert from '@/common/components/business/HeadAlert';

import Filters from './components/Filters';
import PassengerFlowAnalysis from './components/PassengerFlowAnalysis';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';

import { isEqual, urlParams } from '@lhb/func';
import { FiltersProps } from './ts-config';
import styles from './entry.module.less';

const StoreAnalysis = () => {
  const id: string = urlParams(location.search)?.id;
  const [filters, setFilters] = useState<FiltersProps>({
    storeIds: id ? [parseInt(id)] : [],
    strStoredIds: id || '',
    start: '',
    end: '',
    dateScope: 0,
    checkTab: '',
  });

  // 改变时间
  const handleChangeTime = (start: string, end: string, dateScope: number, checkTab?: string) => {
    setFilters({ ...filters, start, end, dateScope, checkTab: checkTab || filters.checkTab });
  };

  const getCheckIndustry = async (storeId: number, date) => {
    setFilters({
      ...filters,
      storeIds: [storeId],
      strStoredIds: storeId,
      ...(date && filters.checkTab === 'customer' ? { start: date.start, end: date.end } : {}),
    });
  };

  const onSearch = (value: any) => {
    if (
      !isEqual(value.storeIds, filters.storeIds) ||
      (value?.date && (value.date.start !== filters.start || value.date.end !== filters.end))
    ) {
      getCheckIndustry(value.storeIds, value?.date);
    }
  };

  return (
    <>
      <HeadAlert/>
      <div className={styles.container}>
        <DateBar
          handleChangeTime={handleChangeTime}
          defaultTab='oneyear'
          checkDate={{ start: filters.start, end: filters.end, dateScope: filters.dateScope }}
        >
          <Filters onSearch={onSearch} handleChangeTime={handleChangeTime} filters={filters} />
          {filters.strStoredIds ? (
            <>
              <FlowInfo filters={filters} />
              <TitleTips name='客流分析' showTips={false} />
              <PassengerFlowAnalysis filters={filters} />
            </>
          ) : (
            <NotFound text='暂无门店' />
          )}
        </DateBar>
      </div>
    </>

  );
};

export default StoreAnalysis;
