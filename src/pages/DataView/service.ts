export interface PreviewItem {
  type: string;
  percent: number;
  ratio: number;
  status: number;
}
export const getPreview = async () => {
  return [
    { type: 'newAdd', percent: 50.2, ratio: 20.01, status: 0 },
    { type: 'newAdd', percent: 50.2, ratio: 20.01, status: 2 },
    { type: 'newAdd', percent: 50.2, ratio: 20.01, status: 1 },
    { type: 'newAdd', percent: 50.2, ratio: 20.01, status: 2 },
    { type: 'newAdd', percent: 50.2, ratio: 20.01, status: 1 },
    { type: 'newAdd', percent: 50.2, ratio: 20.01, status: 2 },
    { type: 'newAdd', percent: 50.2, ratio: 20.01, status: 1 },
  ];
};
