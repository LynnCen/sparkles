// 统计时间options
export const timeOptions = [
  { label: '本月', value: 1, mapVal: 'month' },
  { label: '本季度', value: 2, mapVal: 'quarter' },
  { label: '本年', value: 3, mapVal: 'year' },
  { label: '自定义', value: 4 },
];
// 统计时间默认值
export const defaultTimeType: any = timeOptions[2];
// 时间范围不禁用的状态
export const disabledTimeType: any[] = [
  timeOptions[0], // 自定义
  timeOptions[1], // 自定义
  timeOptions[2], // 自定义
];

