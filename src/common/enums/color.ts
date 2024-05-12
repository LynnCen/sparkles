// 默认的颜色
export const color = [
  '#006AFF',
  '#2fc25b',
  '#722ED1',
  '#F5222D',
  '#FA541C',
  '#FA8C16',
  '#FAAD14',
  '#52C41A',
  '#A0D911',
  '#13C2C2',
  '#006AFF',
  '#722ED1',
  '#EB2F96',
];

// 饼图的颜色-渐变色
export const pieChartBackground: any = {
  type: 'radial',
  x: 0.5,
  y: 0.5,
  r: 0.5,
  colorStops: [
    { offset: 0, color: '#F6F7FA' }, // 0% 处的颜色
    { offset: 1, color: '#F2F7FF' }, // 100% 处的颜色
  ],
  global: false, // 缺省为 false
};

const colorDefaultConfig = { type: 'linear', x: 0.5, y: 0.5, r: 0.5, global: false };

export const pieColor = [
  {
    ...colorDefaultConfig,
    colorStops: [
      { offset: 0, color: '#91D5FF' }, // 0% 处的颜色
      { offset: 1, color: '#1890FF' }, // 100% 处的颜色
    ],
  },
  {
    ...colorDefaultConfig,
    colorStops: [
      { offset: 0, color: '#87E8DE' }, // 0% 处的颜色
      { offset: 1, color: '#13C2C2' }, // 100% 处的颜色
    ],
  },
  {
    ...colorDefaultConfig,
    colorStops: [
      { offset: 0, color: '#B7EB8F' }, // 0% 处的颜色
      { offset: 1, color: '#52C41A' }, // 100% 处的颜色
    ],
  },
  {
    ...colorDefaultConfig,
    colorStops: [
      { offset: 0, color: '#FFF566' }, // 0% 处的颜色
      { offset: 1, color: '#FADB14' }, // 100% 处的颜色
    ],
  },
  {
    ...colorDefaultConfig,
    colorStops: [
      { offset: 0, color: '#FF7875' }, // 0% 处的颜色
      { offset: 1, color: '#F5222D' }, // 100% 处的颜色
    ],
  },
  {
    ...colorDefaultConfig,
    colorStops: [
      { offset: 0, color: '#B37FED' }, // 0% 处的颜色
      { offset: 1, color: '#722ED1' }, // 100% 处的颜色
    ],
  },
  {
    ...colorDefaultConfig,
    colorStops: [
      { offset: 0, color: '#FFBB96' }, // 0% 处的颜色
      { offset: 1, color: '#FA541C' }, // 100% 处的颜色
    ],
  },
  {
    ...colorDefaultConfig,
    colorStops: [
      { offset: 0, color: '#FA541C' }, // 0% 处的颜色
      { offset: 1, color: '#FAAD14' }, // 100% 处的颜色
    ],
  },
  {
    ...colorDefaultConfig,
    colorStops: [
      { offset: 0, color: '#D3F261' }, // 0% 处的颜色
      { offset: 1, color: '#A0D911' }, // 100% 处的颜色
    ],
  },
  {
    ...colorDefaultConfig,
    colorStops: [
      { offset: 0, color: '#E0719B' }, // 0% 处的颜色
      { offset: 1, color: '#D43974' }, // 100% 处的颜色
    ],
  },
  {
    ...colorDefaultConfig,
    colorStops: [
      { offset: 0, color: '#ADC6FF' }, // 0% 处的颜色
      { offset: 1, color: '#2F54EB' }, // 100% 处的颜色
    ],
  },
  {
    ...colorDefaultConfig,
    colorStops: [
      { offset: 0, color: '#FFD591' }, // 0% 处的颜色
      { offset: 1, color: '#FA8C16' }, // 100% 处的颜色
    ],
  },
  {
    ...colorDefaultConfig,
    colorStops: [
      { offset: 0, color: '#E27BFF' }, // 0% 处的颜色
      { offset: 1, color: '#CC15FF' }, // 100% 处的颜色
    ],
  },
];
