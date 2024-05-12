const legendColor = '#132144';
const lineColor = '#E5E9F2';
const labelColor = '#B8BDC4';

export const lineAxisLabel = {
  // x/y轴文字样式
  color: labelColor,
  fontSize: 12,
  margin: 10,
};

export const ySplitLine = {
  lineStyle: { color: lineColor, width: 1, type: 'dashed' },
};

export const lineOption = {
  legend: {
    top: 10,
    itemWidth: 12,
    itemHeight: 12,
    textStyle: {
      padding: [3, 0, 0, 0],
      color: legendColor,
    },
  },
  grid: {
    left: 120,
    right: 120,
  },
  tooltip: {
    trigger: 'axis',
    // textStyle: { color: '#B8BDC4' },
    // textStyle: { color: '#132144' },
  },
  xAxis: {
    axisLine: {
      // x坐标轴样式
      lineStyle: {
        color: lineColor,
      },
    },
    axisLabel: {
      // x轴文字样式
      ...lineAxisLabel,
    },
    axisTick: {
      // 刻度相关
      show: true,
      lineStyle: {
        color: lineColor,
      },
    },
  },
  yAxis: {
    splitLine: {
      // y轴区域中的分隔线
      show: true,
      lineStyle: {
        color: lineColor,
        width: 1,
        type: 'dashed',
      },
    },
  },
};
