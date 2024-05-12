import merge from 'lodash.merge';
import { pieColor } from '@/common/enums/color';
import { EChartsOption } from './RatioPieChart';

export const getPieOptions = ({ data, totalName, totalNum, unit = '' }): EChartsOption => {
  if (!data) return {};

  const option: EChartsOption = {
    title: { show: false },
    color: pieColor,
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      icon: 'circle',
      orient: 'vertical',
      right: 5,
      top: 'middle',
      bottom: 0,
      data: data,
      height: 80,
      formatter: (name) => {
        const list = option.series && option.series[0].data;
        const target = list.find((item) => item.name === name);
        return name + ':' + target?.value;
      },
      textStyle: {
        color: '#132144',
        rich: {
          name: { color: '#132144' },
          line: { padding: [0, 0, 0, 10], color: '#d9d9d9' },
          percent: { padding: [0, 10, 0, 10], color: '#949CAE' },
          value: { color: '#132144' },
        },
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['90%', '60%'],
        center: ['21%', '50%'],
        zlevel: 1,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 4,
        },
        emptyCircleStyle: { color: '#fcfcfc' },
        label: { show: false },
        labelLine: { show: false },
        data: data,
      },
      {
        // 里面的圆，添加背景色和中间显示
        type: 'pie',
        radius: ['0%', '45%'],
        center: ['21%', '50%'],
        silent: true, // 默认不响应鼠标事件
        zlevel: 2,
        showEmptyCircle: false,
        itemStyle: { color: 'transparent', borderColor: 'transparent' },
        label: {
          show: true,
          position: 'center',
          fontSize: 10,
          lineHeight: 20,
          color: '#4c4a4a',
          formatter: `{val|${unit}${totalName}}\n{name|${totalNum}}`,
          rich: {
            val: { fontSize: 14, color: '#242525' },
            name: { fontSize: 14, color: '#898B8E', padding: [20, 0] },
          },
          // overflow: 'breakAll',
          // width: 100,
        },
        data: [{ name: 'demo', value: 111 }],
      },
    ],
  };

  return merge({}, option);
};
