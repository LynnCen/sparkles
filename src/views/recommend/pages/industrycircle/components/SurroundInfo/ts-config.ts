/**
 * @Description
 */

/** antd tab项参数 */
export interface SuroundTabProps {
  label: string;
  key: string;
}

/** 接口 tab参数 */
export interface SurroundTabType {
  /** 类型id	 */
  id: number;
  /** 类目名称 */
  name: string;
  /** 类目编码 */
  code: string;
}

export const DemoTabs = [
  {
    label: '周边人群',
    key: '1',
    children: `Content of tab ${1}`,
  },
  {
    label: '城市信息',
    key: '2',
    children: `Content of tab ${2}`,
  },
  {
    label: 'tab-3',
    key: '3',
    children: `Content of tab ${3}`,
  },
  {
    label: 'tab-4',
    key: '4',
    children: `Content of tab ${4}`,
  },
  {
    label: 'tab-5',
    key: '5',
    children: `Content of tab ${5}`,
  },
];

export const DemoCityInfo = [
  {
    label: '城市名称',
    value: '杭州市',
    unit: '',
  },
  {
    label: '城市级别',
    value: '副省级城市',
    unit: '',
  }, {
    label: '城市类别',
    value: '新一线城市',
    unit: '',
  },
  {
    label: '城市类别',
    value: '新一线城市',
    unit: '',
  }, {
    label: '常住人口数',
    value: '1193.6',
    unit: '亿元',
  }, {
    label: '户籍人口数',
    value: '1193.6',
    unit: '亿元',
  },
];
