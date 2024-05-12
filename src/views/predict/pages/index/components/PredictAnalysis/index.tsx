// 预测分析
import { FC, useEffect, useState } from 'react';
import { Spin } from 'antd';
import Filters from './Filter';
import NoOrder from '../NoOrder';
import OrderDataError from './Modal/OrderDataError';
import AnaLysisTable from './AnaLysisTable';
import { post } from '@/common/request/index';
import dayjs from 'dayjs';
import { getStorage, setStorage } from '@lhb/cache';
import { TabsProps, FiltersProps } from '../../ts-config';

const DefaultFilter = { storeIds: [-1], storeType: 1, month: '' };

const PredictAnalysis: FC<TabsProps> = ({ haveOrder, showOkBth }) => {
  // 是否正在预测
  const [loading, setLoading] = useState<boolean>(false);
  const [haveResult, setHaveResult] = useState<boolean>(false); // 是否显示下载按钮
  const [isCheckDone, setIsCheckDone] = useState<boolean>(true); // 是否验证通过-验证通过请求历史预测
  const [orderErrorModal, setOrderErrorModal] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });
  // 默认
  const [filters, setFilters] = useState<FiltersProps>(getStorage('predictAnalysisParams') || DefaultFilter);

  const onSearch = (value: any) => {
    if (!value.storeIds && !value.month && !value.storeType) {
      setFilters(value);
      setHaveResult(false);
      return;
    }
    const params = {
      ...filters,
      ...value,
      storeIds: value.storeIds.length === 1 && value.storeIds[0] === -1 ? [] : value.storeIds,
      month: value.month && dayjs(value.month).format('YYYY-MM'),
    };
    setLoading(true);
    predictCreate(params);
  };

  const changeUploadStatus = () => {
    setHaveResult(true);
  };

  // 创建预测
  const predictCreate = async (params: FiltersProps) => {
    // 重置清空数据不创建预测
    if (!params.storeIds || !params.month) {
      setFilters(params);
      setLoading(false);
      return;
    }
    const values = { ...params };
    try {
      const result = await post('/predict/check', values, true);
      const { status, message } = result;
      if (status === 1 || status === 2) {
        setOrderErrorModal({ visible: true, message });
        setLoading(false);
        initData();
        return;
      } else if (status === 0) {
        try {
          await post('/predict/create', values, true);
          setIsCheckDone(true);
          setFilters(values);
        } catch (_error) {
          initData();
        }
      }
    } catch (error) {
      initData();
    }
    setLoading(false);
  };

  // 如果预测失败/未通过校验则重置表格数据
  const initData = () => {
    setHaveResult(false);
    setIsCheckDone(false);
    setFilters({ ...filters });
  };

  const onClose = () => {
    setOrderErrorModal({ ...orderErrorModal, visible: false });
  };

  useEffect(() => {
    setStorage('predictAnalysisParams', filters);
  }, [filters]);

  return (
    <>
      <Filters filters={filters} onSearch={onSearch} haveResult={haveResult} showOkBth={showOkBth} />
      {haveOrder ? (
        <Spin spinning={loading}>
          <AnaLysisTable filters={filters} changeUploadStatus={changeUploadStatus} isCheckDone={isCheckDone} />
        </Spin>
      ) : (
        <NoOrder />
      )}
      <OrderDataError message={orderErrorModal.message} visible={orderErrorModal.visible} onClose={onClose} />
    </>
  );
};

export default PredictAnalysis;
