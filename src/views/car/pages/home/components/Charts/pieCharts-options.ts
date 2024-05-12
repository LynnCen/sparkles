import merge from 'lodash.merge';
import { pieColor, pieChartBackground } from '@/common/enums/color';
import { EChartsOption } from './RatioPieChart';

export const getPieOptions = ({ title, data, totalName, totalNum, unit = '' }): EChartsOption => {
  if (!data) return {};

  const option: EChartsOption = {
    title: { text: title, textStyle: { fontSize: 16 } },
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
      right: '4%',
      top: 'middle',
      bottom: '20%',
      type: 'scroll',
      data: data,
      formatter: (name) => {
        const list = option.series && option.series[0].data;
        const target = list.find((item) => item.name === name);
        const percent = totalNum === 0 ? 0 : ((target.value || 0) / totalNum) * 100;
        return `{name|${name.length > 6 ? name.substring(0, 6) + '...' : name}}{line||}{percent|${percent.toFixed(
          2
        )}%}{name|${target?.value}}`;
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
        radius: ['48%', '70%'],
        center: ['26%', '56%'],
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
        center: ['26%', '56%'],
        silent: true, // 默认不响应鼠标事件
        zlevel: 2,
        showEmptyCircle: false,
        itemStyle: { color: pieChartBackground, borderColor: '#E9E9E9' },
        label: {
          show: true,
          position: 'center',
          fontSize: 10,
          lineHeight: 20,
          color: '#4c4a4a',
          formatter: `{val|${unit}${totalNum}}\n{name|${totalName}}`,
          rich: {
            val: { fontSize: 20, color: '#242525' },
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
