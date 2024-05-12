/* eslint-disable react-hooks/exhaustive-deps */
// 历史预测
import { FC, useEffect, useState } from 'react';
import NoOrder from '../NoOrder';
import Filters from './Filter';
import HistoryPredictTable from './HistoryPredictTable';

import dayjs from 'dayjs';
import { getStorage, setStorage } from '@lhb/cache';
import { TabsProps, FiltersProps } from '../../ts-config';

const DefaultFilter = { storeIds: [], storeType: 1, month: '' };

const HistoryPredict: FC<TabsProps> = ({ haveOrder, showOkBth }) => {
  const [filters, setFilters] = useState<FiltersProps>(getStorage('historyPredictParams') || DefaultFilter);
  const [haveResult, setHaveResult] = useState<boolean>(false);
  const onSearch = (value: any) => {
    if (!value.storeIds && !value.month && !value.storeType) {
      setFilters(value);
      return;
    }
    setFilters({
      ...filters,
      ...value,
      storeIds: value.storeIds.length === 1 && value.storeIds[0] === -1 ? [] : value.storeIds,
      month: value.month && dayjs(value.month).format('YYYY-MM'),
    });
  };

  const changeUploadStatus = () => {
    setHaveResult(true);
  };

  useEffect(() => {
    // 将筛选条件存储到storage中
    setStorage('historyPredictParams', filters);
  }, [filters]);

  return (
    <>
      <Filters filters={filters} onSearch={onSearch} haveResult={haveResult} showOkBth={showOkBth} />
      {haveOrder ? <HistoryPredictTable filters={filters} changeUploadStatus={changeUploadStatus} /> : <NoOrder />}
    </>
  );
};

export default HistoryPredict;
