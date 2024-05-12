import { FC } from 'react';
import Charts from '@/views/car/pages/home/components/Charts/index';

import { InitialProps } from '@/views/analysis/pages/index/ts-config';
import PieHeatmap from './PieHeatmap';

const ManegeAnalysis: FC<InitialProps> = ({ filters }) => {
  return (
    <>
      <Charts filters={filters} />
      <PieHeatmap filters={filters} />
    </>
  );
};

export default ManegeAnalysis;
