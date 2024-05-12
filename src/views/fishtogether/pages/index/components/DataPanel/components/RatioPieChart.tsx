import { FC, useState, useEffect } from 'react';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption,
} from 'echarts/components';
import { PieChart, PieSeriesOption } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import Chart from '@/common/components/EChart';
import { getPieOptions } from './pieCharts-options';
import { get } from '@/common/request';

echarts.use([TitleComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer, LabelLayout]);

export type EChartsOption = echarts.ComposeOption<TooltipComponentOption | LegendComponentOption | PieSeriesOption>;

const RatioPieChart: FC<any> = () => {
  const [options, setOptions] = useState<{ salesOptions: EChartsOption }>({
    salesOptions: {},
  });

  const loadData = async () => {
    // https://yapi.lanhanba.com/project/497/interface/api/51484
    const result: any = await get('/yn/franchisee/home/shop/types', {}, {
      isMock: false,
      mockId: 497,
      mockSuffix: '/api',
      isZeus: true
    });
    if (result && result.data && result.data.length) {
      setOptions({
        salesOptions: getPieOptions({
          data: result.data.map((item) => ({ name: item.name, value: item.count })),
          totalName: '门店总数',
          unit: '',
          totalNum: result.totalCount,
        }),
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <Chart option={options.salesOptions} height={'160px'} isDestroy />
    </div>
  );
};

export default RatioPieChart;
