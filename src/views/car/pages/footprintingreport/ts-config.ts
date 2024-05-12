import { DataNode } from 'antd/lib/tree';

export interface MockDemo {
  a: Function;
}


export interface treeDataProps extends DataNode {
  /**
   * @description 表格中是否显示
   */
  showColumn?: boolean;
  children?: treeDataProps[];
}

/**
 * @description 导入分析数据树形结构
 */
export const treeData: treeDataProps[] = [
  {
    title: '过店客流',
    key: 'flow',
    showColumn: false,
    children: [
      {
        title: '过店总数',
        key: 'passbyCount',
        showColumn: false,
      },
      {
        title: '女性',
        key: 'flowFemale',
        showColumn: false,
        children: [
          {
            title: '儿童',
            key: 'passbyFemaleChild',
            showColumn: false,
          },
          {
            title: '青壮年',
            key: 'passbyFemaleTeen',
            showColumn: false,
          },
          {
            title: '老人',
            key: 'passbyFemaleOlder',
            showColumn: false,
          },
          {
            title: '女性总数',
            key: 'passbyFemaleCount',
            showColumn: false,
          },
        ],
      },
      {
        title: '男性',
        key: 'flowMale',
        showColumn: false,
        children: [
          {
            title: '儿童',
            key: 'passbyMaleChild',
            showColumn: false,
          },
          {
            title: '青壮年',
            key: 'passbyMaleTeen',
            showColumn: false,
          },
          {
            title: '老人',
            key: 'passbyMaleOlder',
            showColumn: false,
          },
          {
            title: '男性总数',
            key: 'passbyMaleCount',
            showColumn: false,
          },
        ],
      },
    ],
  },
  {
    title: '进店客流',
    key: 'passenger',
    showColumn: false,
    children: [
      {
        title: '进店总数',
        key: 'indoorCount',
        showColumn: false,
      },
      {
        title: '女性',
        key: 'passengerFemale',
        showColumn: false,
        children: [
          {
            title: '儿童',
            key: 'indoorFemaleChild',
            showColumn: false,
          },
          {
            title: '青壮年',
            key: 'indoorFemaleTeen',
            showColumn: false,
          },
          {
            title: '老人',
            key: 'indoorFemaleOlder',
            showColumn: false,
          },
          {
            title: '女性总数',
            key: 'indoorFemaleCount',
            showColumn: false,
          },
        ],
      },
      {
        title: '男性',
        key: 'passengerMale',
        showColumn: false,
        children: [
          {
            title: '儿童',
            key: 'indoorMaleChild',
            showColumn: false,
          },
          {
            title: '青壮年',
            key: 'indoorMaleTeen',
            showColumn: false,
          },
          {
            title: '老人',
            key: 'indoorMaleOlder',
            showColumn: false,
          },
          {
            title: '男性总数',
            key: 'indoorMaleCount',
            showColumn: false,
          },
        ],
      },
    ],
  },
  {
    title: '进店率',
    key: 'indoorRate',
    showColumn: false,
    children: [],
  },
  {
    title: '提袋客流',
    key: 'shoppingRate',
    showColumn: false,
    children: []
  },
  {
    title: '提袋率',
    key: 'shoppingCount',
    showColumn: false,
    children: []
  },
];


