export interface MockDemo {
  a: Function;
}

export const rankStatus = {
  rank20: 'rank20',
  rank50: 'rank50',
  rank100: 'rank100'
};
export const rankOptions = [
  { key: rankStatus.rank20, name: '前20名', value: 20 },
  { key: rankStatus.rank50, name: '前50名', value: 50 },
  { key: rankStatus.rank100, name: '前100名', value: 100 },
];
