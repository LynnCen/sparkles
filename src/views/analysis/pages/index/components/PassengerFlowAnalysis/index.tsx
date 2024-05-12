import { FC } from 'react';
import Charts from './Charts/index';
import AreaModule from './AreaModule';
import Heatmap from './HeapMap';
import { PassengerFlowAnalysisProps } from '@/views/analysis/pages/index/ts-config';

const PassengerFlowAnalysis: FC<PassengerFlowAnalysisProps> = ({
  filters,
  store
}) => {
  return (
    <>
      <Charts filters={filters} />
      {/* 热力核心区域 */}
      <Heatmap filters={filters} />
      <AreaModule filters={filters} store={store}/>
    </>
  );
};

export default PassengerFlowAnalysis;
