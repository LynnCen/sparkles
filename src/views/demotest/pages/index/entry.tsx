import { FC, useState } from 'react';

import TreeTransfer from '@/common/business/TreeTransfer';

const Demotest: FC<any> = () => {
  const [treeDataLeft, setTreeDataLeft] = useState<any>([
    {
      title: '基本信息',
      key: '0-0',
      children: [
        {
          title: '通道描述',
          key: '0-0-0',
          children: [
            { title: '高30m', key: '0-0-0-0', disabled: true },
            { title: '高20m', key: '0-0-0-1' },
            { title: '高10m', key: '0-0-0-2' },
          ],
        },
        {
          title: '尺度描述',
          key: '0-0-1',
          children: [
            { title: '大', key: '0-0-1-0' },
            { title: '中', key: '0-0-1-1' },
            { title: '小', key: '0-0-1-2' },
          ],
        },
        {
          title: '热度描述',
          key: '0-0-2',
        },
      ],
    },
    {
      title: '特殊信息',
      key: '0-2',
    },
  ]);
  const [treeDataRight, setTreeDataRight] = useState<any>([
    {
      title: '基本信息',
      key: '0-0',
      children: [
        {
          title: '通道描述',
          key: '0-0-0',
          children: [
            { title: '高30m', key: '0-0-0-0' },
          ],
        }
      ],
    },
  ]);
  return (
    <TreeTransfer
      treeDataLeft={treeDataLeft}
      treeDataRight={treeDataRight}
      setTreeDataLeft={setTreeDataLeft}
      setTreeDataRight={setTreeDataRight}/>
  );
};

export default Demotest;
