import { Table } from 'antd';
import { FC } from 'react';
const TableListForBizShop: FC<any> = () => {
  const data = [
    // 交通情况
    {
      key: '1-1',
      form: '店铺信息',
      first: '项目方案',
      firstWeight: '30%',
      second: '楼层方案',
      secondWeight: '25%',
      rule100: '1F且有对外独立入口',
      rule80: '1F无对外独立入口',
      rule60: '2F或B1F连通地铁',
      rule40: '3F或B1F',
      rule20: '其他',
    },
    {
      key: '1-2',
      form: '店铺信息',
      first: '项目方案',
      firstWeight: '30%',
      second: '可见性',
      secondWeight: '25%',
      rule100: '完全可见',
      rule80: '一半立面以上可见',
      rule60: '',
      rule40: '一半立面以下可见',
      rule20: '完全不可见',
    },
    {
      key: '1-3',
      form: '店铺信息',
      first: '项目方案',
      firstWeight: '30%',
      second: '距离入口或扶梯',
      secondWeight: '25%',
      rule100: '0-10',
      rule80: '10-20',
      rule60: '',
      rule40: '20-30',
      rule20: '>=30',
    },
    {
      key: '1-4',
      form: '店铺信息',
      first: '项目方案',
      firstWeight: '30%',
      second: '得房率',
      secondWeight: '25%',
      rule100: '>70%',
      rule80: '60%-70%',
      rule60: '',
      rule40: '50%-60%',
      rule20: '＜50%',
    },
    // 商场信息
    {
      key: '2-1',
      form: '商场信息',
      first: '商场信息（二选一）',
      firstWeight: '30%',
      second: '距离附近核心企业',
      secondWeight: '10%',
      rule100: '0-150',
      rule80: '150-300',
      rule60: '',
      rule40: '300-500',
      rule20: '>=500',
    },
    {
      key: '2-2',
      form: '商场信息',
      first: '商场信息（二选一）',
      firstWeight: '30%',
      second: '商业体量排名',
      secondWeight: '10%',
      rule100: '最大',
      rule80: '第二',
      rule60: '',
      rule40: '第三',
      rule20: '第四',
    },
    {
      key: '2-3',
      form: '商场信息',
      first: '商场信息（二选一）',
      firstWeight: '30%',
      second: '运营商等级',
      secondWeight: '10%',
      rule100: 'A级',
      rule80: 'B级',
      rule60: '',
      rule40: 'C级',
      rule20: '其他',
    },
    {
      key: '2-4',
      form: '商场信息',
      first: '商场信息（二选一）',
      firstWeight: '30%',
      second: '运营年限',
      secondWeight: '6.66%',
      rule100: '>=3',
      rule80: '2-3',
      rule60: '',
      rule40: '1-2',
      rule20: '0-1',
    },
    {
      key: '2-5',
      form: '商场信息',
      first: '商场信息（二选一）',
      firstWeight: '30%',
      second: '快消品牌数',
      secondWeight: '6.66%',
      rule100: '轻奢及以上品牌≥2个',
      rule80: 'A级品牌≥2个',
      rule60: 'B级品牌≥3个',
      rule40: 'C级品牌≥4个',
      rule20: '其他',
    },
    {
      key: '2-6',
      form: '商场信息',
      first: '商场信息（二选一）',
      firstWeight: '30%',
      second: '商场年销售额',
      secondWeight: '6.66%',
      rule100: '>=8000',
      rule80: '5000-8000',
      rule60: '',
      rule40: '3000-5000',
      rule20: '0-3000',
    },
    {
      key: '2-7',
      form: '商场信息',
      first: '商场信息（二选一）',
      firstWeight: '30%',
      second: '满铺率',
      secondWeight: '6.66%',
      rule100: '>95%',
      rule80: '90%-95%',
      rule60: '',
      rule40: '85%-90%',
      rule20: '＜85%',
    },
    {
      key: '2-8',
      form: '商场信息',
      first: '商场信息（二选一）',
      firstWeight: '30%',
      second: '停车位',
      secondWeight: '10%',
      rule100: '>=3000',
      rule80: '2000-3000',
      rule60: '1000-2000',
      rule40: '500-1000',
      rule20: '0-500',
    },
    {
      key: '2-9',
      form: '商场信息',
      first: '商场信息（二选一）',
      firstWeight: '30%',
      second: '餐饮门店数量',
      secondWeight: '6.66%',
      rule100: '>=100',
      rule80: '80-100',
      rule60: '60-80',
      rule40: '40-60',
      rule20: '0-40',
    },
    {
      key: '2-10',
      form: '商场信息',
      first: '商场信息（二选一）',
      firstWeight: '30%',
      second: '娱乐门店数量',
      secondWeight: '6.66%',
      rule100: '>=15个',
      rule80: '10-15',
      rule60: '5-10',
      rule40: '3-5',
      rule20: '0-3个',
    },
    {
      key: '2-11',
      form: '商场信息',
      first: '商场信息（二选一）',
      firstWeight: '30%',
      second: '消费档次',
      secondWeight: '10%',
      rule100: '高档',
      rule80: '',
      rule60: '中档',
      rule40: '',
      rule20: '低档',
    },
    {
      key: '2-12',
      form: '商场信息',
      first: '商场信息（二选一）',
      firstWeight: '30%',
      second: '小区数量',
      secondWeight: '10%',
      rule100: '>=10',
      rule80: '7-10',
      rule60: '4-7',
      rule40: '2-4',
      rule20: '0-2',
    },
    // 客流信息
    {
      key: '3-1',
      form: '商场信息',
      first: '商场信息（二选一）',
      firstWeight: '30%',
      second: '距离附近核心企业',
      secondWeight: '10%',
      rule100: '0-150',
      rule80: '150-300',
      rule60: '',
      rule40: '300-500',
      rule20: '>=500',
    },
    {
      key: '3-2',
      form: '商场信息',
      first: '商场信息（二选一）',
      firstWeight: '30%',
      second: '商业体量排名',
      secondWeight: '10%',
      rule100: '最大',
      rule80: '第二',
      rule60: '',
      rule40: '第三',
      rule20: '第四',
    },
    {
      key: '3-3',
      form: '商场信息',
      first: '商场信息（二选一）',
      firstWeight: '30%',
      second: '运营商等级',
      secondWeight: '10%',
      rule100: 'A级',
      rule80: 'B级',
      rule60: '',
      rule40: 'C级',
      rule20: '其他',
    },
    {
      key: '3-4',
      form: '商场信息',
      first: '商场信息（二选一）',
      firstWeight: '30%',
      second: '预计开业时间',
      secondWeight: '10%',
      rule100: '0-1',
      rule80: '1-2',
      rule60: '',
      rule40: '2-3',
      rule20: '>=3',
    },
    {
      key: '3-5',
      form: '商场信息',
      first: '商场信息（二选一）',
      firstWeight: '30%',
      second: '招商完成率',
      secondWeight: '10%',
      rule100: '>80%',
      rule80: '65%-80%',
      rule60: '50%-65%',
      rule40: '40%-50%',
      rule20: '＜40%',
    },
    {
      key: '3-6',
      form: '商场信息',
      first: '商场信息（二选一）',
      firstWeight: '30%',
      second: '已签快消/奢侈品牌',
      secondWeight: '10%',
      rule100: '轻奢及以上品牌≥1个',
      rule80: 'A级品牌≥1个',
      rule60: 'B级品牌≥1个',
      rule40: 'C级品牌≥2个',
      rule20: '其他',
    },
    {
      key: '3-7',
      form: '商场信息',
      first: '商场信息（二选一）',
      firstWeight: '30%',
      second: '已签超市品牌',
      secondWeight: '10%',
      rule100: 'A级',
      rule80: 'B级',
      rule60: '',
      rule40: 'C级',
      rule20: '其他',
    },
    {
      key: '3-8',
      form: '商场信息',
      first: '商场信息（二选一）',
      firstWeight: '30%',
      second: '停车位',
      secondWeight: '10%',
      rule100: '>=3000',
      rule80: '2000-3000',
      rule60: '1000-2000',
      rule40: '500-1000',
      rule20: '0-500',
    },
    {
      key: '3-9',
      form: '商场信息',
      first: '商场信息（二选一）',
      firstWeight: '30%',
      second: '消费档次',
      secondWeight: '10%',
      rule100: '高档',
      rule80: '',
      rule60: '中档',
      rule40: '',
      rule20: '低档',
    },
    {
      key: '3-10',
      form: '商场信息',
      first: '商场信息（二选一）',
      firstWeight: '30%',
      second: '小区数量',
      secondWeight: '10%',
      rule100: '>=10',
      rule80: '7-10',
      rule60: '4-7',
      rule40: '2-4',
      rule20: '0-2',
    },
    // 交通情况
    {
      key: '4-1',
      form: '交通情况',
      first: '可达性',
      firstWeight: '20%',
      second: '道路性质',
      secondWeight: '20%',
      rule100: '步行街',
      rule80: '双向四车道',
      rule60: '双向两车道',
      rule40: '单/双向一车道',
      rule20: '断头路',
    },
    {
      key: '4-2',
      form: '交通情况',
      first: '可达性',
      firstWeight: '20%',
      second: '地铁线路',
      secondWeight: '20%',
      rule100: '>=2',
      rule80: '2',
      rule60: '1',
      rule40: '',
      rule20: '无',
    },
    {
      key: '4-3',
      form: '交通情况',
      first: '可达性',
      firstWeight: '20%',
      second: '距离地铁站',
      secondWeight: '20%',
      rule100: '0-50',
      rule80: '50-100',
      rule60: '100-200',
      rule40: '200-300',
      rule20: '>=300',
    },
    {
      key: '4-4',
      form: '交通情况',
      first: '可达性',
      firstWeight: '20%',
      second: '公交线路',
      secondWeight: '20%',
      rule100: '>=10',
      rule80: '5-10',
      rule60: '',
      rule40: '3-5',
      rule20: '0-3',
    },
    {
      key: '4-5',
      form: '交通情况',
      first: '可达性',
      firstWeight: '20%',
      second: '距离公交站',
      secondWeight: '20%',
      rule100: '0-50',
      rule80: '50-100',
      rule60: '',
      rule40: '100-150',
      rule20: '>=150',
    },
    // 客流信息
    {
      key: '5-1',
      form: '客流信息',
      first: '客流信息',
      firstWeight: '15%',
      second: '门前人流动线',
      secondWeight: '33.33%',
      rule100: '人流主动线',
      rule80: '',
      rule60: '人流次动线',
      rule40: '',
      rule20: '流边角线',
    },
    {
      key: '5-2',
      form: '客流信息',
      first: '客流信息',
      firstWeight: '15%',
      second: '工作日日均过店客流',
      secondWeight: '33.33%',
      rule100: '>=8000',
      rule80: '6000-8000',
      rule60: '',
      rule40: '4000-6000',
      rule20: '0-4000',
    },
    {
      key: '5-3',
      form: '客流信息',
      first: '客流信息',
      firstWeight: '15%',
      second: '节假日日均过店客流',
      secondWeight: '33.33%',
      rule100: '>=10000',
      rule80: '8000-10000',
      rule60: '',
      rule40: '6000-8000',
      rule20: '0-6000',
    },
    // 竞品信息
    {
      key: '6-1',
      form: '竞品信息',
      first: '竞品信息',
      firstWeight: '5%',
      second: '竞品数量',
      secondWeight: '100%',
      rule100: '无',
      rule80: '1家',
      rule60: '2家',
      rule40: '3家',
      rule20: '≥4家',
    },
  ];

  // const mergedForm = ['2', '3', '4'];

  const columns = [
    {
      title: '所属表单',
      dataIndex: 'form',
      width: '150px',
      onCell: (record) => {
        if (record.key === '1-1') {
          return { rowSpan: 4 };
        }
        if (record.key === '2-1') {
          return { rowSpan: 12 };
        }
        if (record.key === '3-1') {
          return { rowSpan: 10 };
        }
        if (record.key === '4-1') {
          return { rowSpan: 5 };
        }
        if (record.key === '5-1') {
          return { rowSpan: 3 };
        }
        if (record.key === '6-1') {
          return { rowSpan: 1 };
        }
        return { rowSpan: 0 };
      },
    },
    {
      title: '一级指标',
      dataIndex: 'first',
      width: '150px',
      onCell: (record) => {
        if (record.key === '1-1') {
          return { rowSpan: 4 };
        }
        if (record.key === '2-1') {
          return { rowSpan: 12 };
        }
        if (record.key === '3-1') {
          return { rowSpan: 10 };
        }
        if (record.key === '4-1') {
          return { rowSpan: 5 };
        }
        if (record.key === '5-1') {
          return { rowSpan: 3 };
        }
        if (record.key === '6-1') {
          return { rowSpan: 1 };
        }
        return { rowSpan: 0 };
      },
    },
    {
      title: '权重',
      dataIndex: 'firstWeight',
      width: '100px',
      onCell: (record) => {
        if (record.key === '1-1') {
          return { rowSpan: 4 };
        }
        if (record.key === '2-1') {
          return { rowSpan: 12 };
        }
        if (record.key === '3-1') {
          return { rowSpan: 10 };
        }
        if (record.key === '4-1') {
          return { rowSpan: 5 };
        }
        if (record.key === '5-1') {
          return { rowSpan: 3 };
        }
        if (record.key === '6-1') {
          return { rowSpan: 1 };
        }
        return { rowSpan: 0 };
      },
    },
    { title: '二级指标', dataIndex: 'second', width: '150px' },
    { title: '权重', dataIndex: 'secondWeight', width: '100px' },
    {
      title: '评分标准',
      children: [
        {
          title: '100分',
          dataIndex: 'rule100',
        },
        {
          title: '80分',
          dataIndex: 'rule80',
        },
        {
          title: '60分',
          dataIndex: 'rule60',
        },
        {
          title: '40分',
          dataIndex: 'rule40',
        },
        {
          title: '20分',
          dataIndex: 'rule20',
        },
      ],
    },
  ];
  return (
    <>
      <Table columns={columns} dataSource={data} bordered size='small' pagination={false} sticky />
    </>
  );
};
export default TableListForBizShop;
