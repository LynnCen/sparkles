/**
 * @Author Pull
 * @Date 2021-09-14 15:27
 * @project useDataView
 */
import { useCallback, useEffect, useState } from 'react';
import { getPreview, PreviewItem } from './service';
const Types = {
  newAdd: '新增',
};

const Status = {
  '0': 'up',
  '1': 'down',
  '2': 'stable',
};

type CardItem = {
  title: string;
} & PreviewItem;
export const useDataView = () => {
  const [cards, setCards] = useState<CardItem[]>([]);

  const getPreviewCard = useCallback(async () => {
    const list = await getPreview();
    setCards(list.map((item) => ({ ...item, title: Types[item.type] })));
  }, []);
  useEffect(() => {
    getPreviewCard();
  }, []);

  return {
    cards,
  };
};
