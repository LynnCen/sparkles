// 数据概览
import { Col, Row, Select, Tooltip, } from 'antd';
import { FC, useState } from 'react';
import cs from 'classnames';
import styles from '../entry.module.less';
import IconFont from '@/common/components/IconFont';
import { dateFns } from '@lhb/func';

const Overview: FC<any> = () => {
  const cardDataAll = [
    {
      'count': '2,563',
      'totalCount': '276,131',
      'ratio': 2.11,
      'ratioFlag': 1,
      'title': '今日累计过店客流',
      'totalTitle': '单日日均过店客流',
      'unit': '人次'
    },
    {
      'count': '1,138',
      'totalCount': '156,035',
      'ratio': 1.34,
      'ratioFlag': 1,
      'title': '今日累计进店客流',
      'totalTitle': '单日日均进店客流',
      'unit': '人次'
    },
    {
      'count': '4.82',
      'totalCount': '4.61',
      'ratio': 0.71,
      'ratioFlag': 1,
      'title': '单店CPE',
      'totalTitle': '平均CPE',
      'unit': '元/人'
    },
    {
      'count': '312',
      'totalCount': '79,539',
      'ratio': -1.39,
      'ratioFlag': 0,
      'title': '今日累计订单',
      'totalTitle': '单店日均订单',
      'unit': '单'
    },
    {
      'count': '4,821',
      'totalCount': '12,761,392',
      'ratio': 3.11,
      'ratioFlag': 1,
      'title': '今日累计销售额',
      'totalTitle': '单店日均销售额',
      'unit': '元'
    },
    {
      'count': '35.5%',
      'totalCount': '32%',
      'ratio': 0.84,
      'ratioFlag': 0,
      'title': '日均转化率',
      'label': '每日的平均店内订单数',
      'totalTitle': '平均转化率',
      'totalLabel': '每日的店内订单总和',
      'icon': 'icon-dingdan',
      'backgroundColor': '#F4FFFB',
      'shadowColor': '#C3F1E8',
      '0Label': '如需查看数据,请前往导入订单'
    },
  ];
  const cardDataNew = [
    {
      'count': '2,178',
      'totalCount': '176,131',
      'ratio': 1.32,
      'ratioFlag': 1,
      'title': '今日累计过店客流',
      'totalTitle': '单日日均过店客流',
      'unit': '人次'
    },
    {
      'count': '1,416',
      'totalCount': '98,172',
      'ratio': 3.11,
      'ratioFlag': 1,
      'title': '今日累计进店客流',
      'totalTitle': '单日日均进店客流',
      'unit': '人次'
    },
    {
      'count': '4.61',
      'totalCount': '4.33',
      'ratio': 0.42,
      'ratioFlag': 1,
      'title': '单店CPE',
      'totalTitle': '平均CPE',
      'unit': '元/人'
    },
    {
      'count': '268',
      'totalCount': '6,735',
      'ratio': -0.19,
      'ratioFlag': 0,
      'title': '今日累计订单',
      'totalTitle': '单店日均订单',
      'unit': '单'
    },
    {
      'count': '3,109',
      'totalCount': '761,392',
      'ratio': 4.09,
      'ratioFlag': 1,
      'title': '今日累计销售额',
      'totalTitle': '单店日均销售额',
      'unit': '元'
    },
    {
      'count': '32.5%',
      'totalCount': '27%',
      'ratio': -2.11,
      'ratioFlag': 0,
      'title': '日均转化率',
      'label': '每日的平均店内订单数',
      'totalTitle': '平均转化率',
      'totalLabel': '每日的店内订单总和',
      'icon': 'icon-dingdan',
      'backgroundColor': '#F4FFFB',
      'shadowColor': '#C3F1E8',
      '0Label': '如需查看数据,请前往导入订单'
    },
  ];
  const [cardData, setCardData] = useState<any>(cardDataAll);

  const handleChange = (value) => {
    if (value === 'all') {
      setCardData(cardDataAll);
    } else {
      setCardData(cardDataNew);
    }
  };
  return (
    <div className={styles.overviewCon}>

      <div className={styles.title}>
        <span className='fs-16 bold pl-8'>
          门店跟踪
        </span>
        <span className='fs-12 pl-8'>
          更新时间{dateFns.currentTime('-', true)}
        </span>
      </div>

      <Select
        defaultValue='全国'
        style={{ width: 258 }}
        onChange={handleChange}
        options={[
          {
            value: 'all',
            label: '全国',
          },
          {
            value: 'new',
            label: '新开门店'
          }
        ]}
      />
      <Row >
        {cardData.map((item) => (
          <Col span={8} key={item.title} className={styles.card}>
            <div className={styles.cardTitle}>
              <span className='c-656 mb-8 inline-block pr-6'>
                {item.title}
              </span>
              <Tooltip title={item.label} >
                <IconFont iconHref='iconxq_ic_shuoming_normal' />
              </Tooltip>
            </div>

            <div className='mb-10'>
              <span className='fs-26 bold '>
                {item.totalCount}
              </span>
              <span className='pl-8 '>
                {item.unit}
              </span>
            </div>

            <div>
              <span className='c-656 pr-6'>
                较昨日
              </span>
              <span className={cs(item.ratioFlag === 1 ? styles.upStyle : styles.downStyle)}>
                <IconFont iconHref={item.ratioFlag === 1 ? 'icondown' : 'iconup'} />
                <span className='pl-8'>
                  {item.ratio}%
                </span>
              </span>
            </div>

            <div className='mt-8 c-656'>
              <span>
                {item.totalTitle}
              </span>
              <span className='pl-8'>
                {item.count}{item.unit}
              </span>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};
export default Overview;
