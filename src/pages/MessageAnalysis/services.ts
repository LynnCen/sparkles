export interface PreviewItem {
  key: string;
  count: number;
  percent: number;
  status: number;
  ratio: number;
}
export const getPreview = async (): Promise<PreviewItem[]> => [
  { key: 'yesterdayQuantity', count: 10246, percent: 59.2, status: 1, ratio: 40 },
  { key: 'todayQuantity', count: 1066, percent: 19.2, status: 0, ratio: 42 },
  { key: 'yesterdayMediaMsgCount', count: 10246, percent: 59.2, status: 1, ratio: 44 },
  { key: 'todayMediaMsgCount', count: 10246, percent: 59.2, status: 1, ratio: 48 },
];

export interface IChartItem {
  year: string;
  value: number;
}
export const getChart = async (s: string, e: string, p: string): Promise<any[]> => {
  return [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
    { year: '1997', value: 7 },
    { year: '1998', value: 9 },
    { year: '1999', value: 13 },
  ];
};
