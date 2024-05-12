import { Table } from 'antd';
import { FC } from 'react';
const TableListForStreetShop: FC<any> = () => {
  const data = [
    // 交通情况
    {
      key: '1-1',
      form: '交通情况',
      first: '交通性',
      firstWeight: '5%',
      second: '道路构造',
      secondWeight: '20%',
      rule100: '无栅栏',
      rule80: '复合型道路',
      rule60: '',
      rule40: '',
      rule20: '有栅栏',
    },
    {
      key: '1-2',
      form: '交通情况',
      first: '交通性',
      firstWeight: '5%',
      second: '道路性质',
      secondWeight: '20%',
      rule100: '步行街',
      rule80: '双向四车道/转盘',
      rule60: '双向两车道',
      rule40: '单/双向一车道',
      rule20: '断头路',
    },
    {
      key: '1-3',
      form: '交通情况',
      first: '交通性',
      firstWeight: '5%',
      second: '道路坡度',
      secondWeight: '20%',
      rule100: '平坦道路',
      rule80: '',
      rule60: '上坡途中',
      rule40: '',
      rule20: '下坡途中',
    },
    {
      key: '1-4',
      form: '交通情况',
      first: '交通性',
      firstWeight: '5%',
      second: '道路塞车',
      secondWeight: '20%',
      rule100: '不会发生堵车',
      rule80: '',
      rule60: '暂时性堵车',
      rule40: '',
      rule20: '经常性堵车',
    },
    {
      key: '1-5',
      form: '交通情况',
      first: '交通性',
      firstWeight: '5%',
      second: '道路斑马线',
      secondWeight: '20%',
      rule100: '有',
      rule80: '',
      rule60: '',
      rule40: '',
      rule20: '无',
    },
    {
      key: '1-6',
      form: '交通情况',
      first: '便利性',
      firstWeight: '15%',
      second: '门店台阶数量',
      secondWeight: '20%',
      rule100: '0个',
      rule80: '',
      rule60: '1-3个',
      rule40: '',
      rule20: '4-5个',
    },
    {
      key: '1-7',
      form: '交通情况',
      first: '便利性',
      firstWeight: '15%',
      second: '门前停车条件',
      secondWeight: '20%',
      rule100: '',
      rule80: '可停车',
      rule60: '',
      rule40: '',
      rule20: '不可停车',
    },
    {
      key: '1-8',
      form: '交通情况',
      first: '便利性',
      firstWeight: '15%',
      second: '对面到店便利性',
      secondWeight: '20%',
      rule100: '步行1分钟内',
      rule80: '',
      rule60: '步行1-3分钟',
      rule40: '',
      rule20: '步行3-5分钟内',
    },
    {
      key: '1-9',
      form: '交通情况',
      first: '便利性',
      firstWeight: '15%',
      second: '同侧到店便利性',
      secondWeight: '20%',
      rule100: '无阻隔可直接进店',
      rule80: '',
      rule60: '',
      rule40: '',
      rule20: '有阻隔无法直接进店',
    },
    {
      key: '1-10',
      form: '交通情况',
      first: '便利性',
      firstWeight: '15%',
      second: '有无上下货通道',
      secondWeight: '20%',
      rule100: '有',
      rule80: '',
      rule60: '',
      rule40: '',
      rule20: '无',
    },
    // 周边设施
    {
      key: '2-1',
      form: '周边设施',
      first: '指引性',
      firstWeight: '5%',
      second: '门头侧招',
      secondWeight: '50%',
      rule100: '有',
      rule80: '',
      rule60: '',
      rule40: '',
      rule20: '无',
    },
    {
      key: '2-2',
      form: '周边设施',
      first: '指引性',
      firstWeight: '10%',
      second: '广告位或指引牌',
      secondWeight: '50%',
      rule100: '有',
      rule80: '',
      rule60: '',
      rule40: '',
      rule20: '无',
    },
    {
      key: '2-3',
      form: '周边设施',
      first: '可见行',
      firstWeight: '15%',
      second: '立地条件',
      secondWeight: '25%',
      rule100: '主街',
      rule80: '街区头铺',
      rule60: '街区次铺',
      rule40: '小道',
      rule20: '其他',
    },
    {
      key: '2-4',
      form: '周边设施',
      first: '可见行',
      firstWeight: '15%',
      second: '门前有无电线杆和树木遮蔽',
      secondWeight: '25%',
      rule100: '无',
      rule80: '',
      rule60: '',
      rule40: '',
      rule20: '有',
    },
    {
      key: '2-5',
      form: '周边设施',
      first: '可见行',
      firstWeight: '15%',
      second: '对面可见性',
      secondWeight: '25%',
      rule100: '50米以上可见',
      rule80: '',
      rule60: '31-50米可见',
      rule40: '',
      rule20: '21-30米可见',
    },
    {
      key: '2-6',
      form: '周边设施',
      first: '可见行',
      firstWeight: '15%',
      second: '同侧可见性',
      secondWeight: '25%',
      rule100: '50米以上可见',
      rule80: '',
      rule60: '31-50米可见',
      rule40: '',
      rule20: '21-30米可见',
    },
    // 客流信息
    {
      key: '3-1',
      form: '客流信息',
      first: '客流量',
      firstWeight: '40%',
      second: '学校数量',
      secondWeight: '12%',
      rule100: '≥3',
      rule80: '2',
      rule60: '1',
      rule40: '',
      rule20: '0',
    },
    {
      key: '3-2',
      form: '客流信息',
      first: '客流量',
      firstWeight: '40%',
      second: '写字楼数量',
      secondWeight: '12%',
      rule100: '≥4',
      rule80: '3',
      rule60: '2',
      rule40: '1',
      rule20: '0',
    },
    {
      key: '3-3',
      form: '客流信息',
      first: '客流量',
      firstWeight: '40%',
      second: '小区数量',
      secondWeight: '12%',
      rule100: '≥4',
      rule80: '3',
      rule60: '2',
      rule40: '1',
      rule20: '0',
    },
    {
      key: '3-4',
      form: '客流信息',
      first: '客流量',
      firstWeight: '40%',
      second: '门前人流动线',
      secondWeight: '12%',
      rule100: '人流主动线',
      rule80: '',
      rule60: '人流次动线',
      rule40: '',
      rule20: '人流边角线',
    },
    {
      key: '3-5',
      form: '客流信息',
      first: '客流量',
      firstWeight: '40%',
      second: '距离门口人流动线的距离',
      secondWeight: '12%',
      rule100: '4米-2米',
      rule80: '',
      rule60: '6米-4米',
      rule40: '',
      rule20: '≤2米或>6米',
    },
    {
      key: '3-6',
      form: '客流信息',
      first: '客流量',
      firstWeight: '40%',
      second: '工作日日均客流',
      secondWeight: '18%',
      rule100: '>1500人/天',
      rule80: '1500-950人/天',
      rule60: '950-450人/天',
      rule40: '450-100人/天',
      rule20: '≤100人/天',
    },
    {
      key: '3-7',
      form: '客流信息',
      first: '客流量',
      firstWeight: '40%',
      second: '节假日日均客流',
      secondWeight: '22%',
      rule100: '>2250人/天',
      rule80: '2250-1425人/天',
      rule60: '1425-675人/天',
      rule40: '675-150人/天',
      rule20: '≤150人/天',
    },
    // 店铺信息
    {
      key: '4-1',
      form: '店铺信息',
      first: '店铺结构',
      firstWeight: '5%',
      second: '实用面积',
      secondWeight: '12%',
      rule100: '200-75 ㎡',
      rule80: '75-65㎡',
      rule60: '65-55㎡',
      rule40: '55-45㎡',
      rule20: '＞200㎡或≤45㎡',
    },
    {
      key: '4-2',
      form: '店铺信息',
      first: '店铺结构',
      firstWeight: '5%',
      second: '所属楼层',
      secondWeight: '11%',
      rule100: '1F',
      rule80: '',
      rule60: '2F',
      rule40: '',
      rule20: '>2F',
    },
    {
      key: '4-3',
      form: '店铺信息',
      first: '店铺结构',
      firstWeight: '5%',
      second: '展面数',
      secondWeight: '11%',
      rule100: '5面',
      rule80: '4面',
      rule60: '3面',
      rule40: '2面',
      rule20: '1面',
    },
    {
      key: '4-4',
      form: '店铺信息',
      first: '店铺结构',
      firstWeight: '5%',
      second: '店铺净层高',
      secondWeight: '11%',
      rule100: '9-6米',
      rule80: '',
      rule60: '6米-4米',
      rule40: '>9米',
      rule20: '≤4米',
    },
    {
      key: '4-5',
      form: '店铺信息',
      first: '店铺结构',
      firstWeight: '5%',
      second: '店铺门宽',
      secondWeight: '11%',
      rule100: '5米-3米',
      rule80: '',
      rule60: '3米-2米',
      rule40: '>5米',
      rule20: '≤2米',
    },
    {
      key: '4-6',
      form: '店铺信息',
      first: '店铺结构',
      firstWeight: '5%',
      second: '店铺进深',
      secondWeight: '11%',
      rule100: '8米-12米',
      rule80: '',
      rule60: '4米-8米',
      rule40: '',
      rule20: '<4米',
    },
    {
      key: '4-7',
      form: '店铺信息',
      first: '店铺结构',
      firstWeight: '5%',
      second: '店铺形状',
      secondWeight: '11%',
      rule100: '方正',
      rule80: '',
      rule60: '扇形',
      rule40: '',
      rule20: '不规则',
    },
    {
      key: '4-8',
      form: '店铺信息',
      first: '店铺结构',
      firstWeight: '5%',
      second: '承重墙',
      secondWeight: '11%',
      rule100: '2面及以上',
      rule80: '',
      rule60: '1面',
      rule40: '',
      rule20: '0面',
    },
    {
      key: '4-9',
      form: '店铺信息',
      first: '店铺结构',
      firstWeight: '5%',
      second: '承重柱',
      secondWeight: '11%',
      rule100: '0个',
      rule80: '',
      rule60: '1-2个',
      rule40: '',
      rule20: '3个及以上',
    },
    // 店铺信息
    {
      key: '5-1',
      form: '工程条件',
      first: '工程条件',
      firstWeight: '10%',
      second: '有无外机位置',
      secondWeight: '5%',
      rule100: '有',
      rule80: '',
      rule60: '',
      rule40: '',
      rule20: '无',
    },
    {
      key: '5-2',
      form: '工程条件',
      first: '工程条件',
      firstWeight: '10%',
      second: '有无三相电',
      secondWeight: '20%',
      rule100: '有',
      rule80: '',
      rule60: '',
      rule40: '',
      rule20: '无',
    },
    {
      key: '5-3',
      form: '工程条件',
      first: '工程条件',
      firstWeight: '10%',
      second: '有无上下水',
      secondWeight: '25%',
      rule100: '有',
      rule80: '',
      rule60: '',
      rule40: '',
      rule20: '无',
    },
    {
      key: '5-4',
      form: '工程条件',
      first: '工程条件',
      firstWeight: '10%',
      second: '是否可明火',
      secondWeight: '10%',
      rule100: '有',
      rule80: '',
      rule60: '',
      rule40: '',
      rule20: '无',
    },
    {
      key: '5-5',
      form: '工程条件',
      first: '工程条件',
      firstWeight: '10%',
      second: '有无排污管道',
      secondWeight: '20%',
      rule100: '有',
      rule80: '',
      rule60: '',
      rule40: '',
      rule20: '无',
    },
    {
      key: '5-6',
      form: '工程条件',
      first: '工程条件',
      firstWeight: '10%',
      second: '有无排烟管道',
      secondWeight: '20%',
      rule100: '有',
      rule80: '',
      rule60: '',
      rule40: '',
      rule20: '无',
    },
    // 外卖氛围
    {
      key: '6-1',
      form: '外卖氛围',
      first: '外卖氛围',
      firstWeight: '10%',
      second: '销量过千竞品门店数量（美团）',
      secondWeight: '25%',
      rule100: '＞11',
      rule80: '11-9',
      rule60: '9-7',
      rule40: '7-5',
      rule20: '≤5',
    },
    {
      key: '6-2',
      form: '外卖氛围',
      first: '外卖氛围',
      firstWeight: '10%',
      second: '销量过千重点门店数量（美团）',
      secondWeight: '25%',
      rule100: '＞11',
      rule80: '11-9',
      rule60: '9-7',
      rule40: '7-5',
      rule20: '≤5',
    },
    {
      key: '6-3',
      form: '外卖氛围',
      first: '外卖氛围',
      firstWeight: '10%',
      second: '销量过千竞品门店数量（饿了么）',
      secondWeight: '25%',
      rule100: '＞11',
      rule80: '11-9',
      rule60: '9-7',
      rule40: '7-5',
      rule20: '≤5',
    },
    {
      key: '6-4',
      form: '外卖氛围',
      first: '外卖氛围',
      firstWeight: '10%',
      second: '销量过千重点门店数量（饿了么）',
      secondWeight: '25%',
      rule100: '＞11',
      rule80: '11-9',
      rule60: '9-7',
      rule40: '7-5',
      rule20: '≤5',
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
          return { rowSpan: 10 };
        }
        if (record.key === '2-1') {
          return { rowSpan: 6 };
        }
        if (record.key === '3-1') {
          return { rowSpan: 7 };
        }
        if (record.key === '4-1') {
          return { rowSpan: 9 };
        }
        if (record.key === '5-1') {
          return { rowSpan: 6 };
        }
        if (record.key === '6-1') {
          return { rowSpan: 4 };
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
          return { rowSpan: 5 };
        }
        if (record.key === '1-6') {
          return { rowSpan: 5 };
        }
        if (record.key === '2-1') {
          return { rowSpan: 2 };
        }
        if (record.key === '2-3') {
          return { rowSpan: 4 };
        }
        if (record.key === '3-1') {
          return { rowSpan: 7 };
        }
        if (record.key === '4-1') {
          return { rowSpan: 9 };
        }
        if (record.key === '5-1') {
          return { rowSpan: 6 };
        }
        if (record.key === '6-1') {
          return { rowSpan: 4 };
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
          return { rowSpan: 5 };
        }
        if (record.key === '1-6') {
          return { rowSpan: 5 };
        }
        if (record.key === '2-1') {
          return { rowSpan: 2 };
        }
        if (record.key === '2-3') {
          return { rowSpan: 4 };
        }
        if (record.key === '3-1') {
          return { rowSpan: 7 };
        }
        if (record.key === '4-1') {
          return { rowSpan: 9 };
        }
        if (record.key === '5-1') {
          return { rowSpan: 6 };
        }
        if (record.key === '6-1') {
          return { rowSpan: 4 };
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
export default TableListForStreetShop;
