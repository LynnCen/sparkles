// 数据概览卡片-概览/门店公用
import React, { useEffect, useState } from 'react';
import { Row, Spin } from 'antd';
import Indicator from '@/common/components/business/FlowCard';
import { get } from '@/common/request/index';
import { FlowIProps, Statistic } from '../ts-config';
import styles from './index.module.less';

const FlowInformation: React.FC<FlowIProps> = ({ filters }) => {
  const [cardData, setCardData] = useState<Statistic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // const { start, end, storeIds, strStoredIds } = filters;
  const statisticBasic = [
    {
      title: '单店日均过店客流(人次)',
      totalTitle: '单位过店客流成本',
      label: '统计周期内平均每日过店人数',
      icon: 'iconic_guoke',
      backgroundColor: '#F2F7FF'
    },
    {
      title: '单店日均进店客流(人次)',
      totalTitle: '单位成本',
      label: '统计周期内平均每日进店人数',
      icon: 'iconic_jindian',
      backgroundColor: '#E9FBFF'
    },
    {
      title: '平均停留时长(S)',
      label: '统计周期内进店客流的平均停留时长',
      icon: 'iconic_tingliu',
      backgroundColor: '#F1FDF8'
    },
    {
      title: '单店日均留资(人次)',
      totalTitle: '单位成本',
      label: '统计周期内平均每日留资人数',
      icon: 'iconic_liuzi',
      backgroundColor: '#FBF6FE'
    },
    {
      title: '单店日均试驾(人次)',
      totalTitle: '单位成本',
      label: '统计周期内平均每日试驾人数',
      icon: 'iconic_shijia',
      backgroundColor: '#FFFAF6'
    },
    {
      title: '单店日均大定(人次)',
      totalTitle: '单位成本',
      label: '统计周期内平均每日大定人数',
      icon: 'iconic_dading',
      backgroundColor: '#FFF5FB'
    },
  ];

  useEffect(() => {
    if (filters.start && filters.end) {
      getStoreList();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // 获取客流信息
  const getStoreList = async () => {
    // if (!start || !end || !storeIds) {
    //   return;
    // }
    setLoading(true);
    // const params = { start, end, storeIds: strStoredIds };
    try {
      // https://yapi.lanhanba.com/project/455/interface/api/44344
      console.log(filters, 'filters');
      const response: any = await get('/carStore/carStatistics', filters, true);
      const data = response.map((item: any, index: number) => {
        return {
          ...item,
          ...statisticBasic[index],
          totalCount: `${item.cost}元/人`,
          ratioFlag: item.ratio > 0 ? 1 : 0,
        };
      });
      setCardData(Array.isArray(data) ? data : []);
    } catch (error) {}
    setLoading(false);
  };

  return (
    <div className={styles.flowInformation}>
      <Spin spinning={loading}>
        <Row gutter={[12, 12]} style={{ minHeight: '200px' }}>
          {cardData.map((item) => (
            <Indicator key={item.title} {...item} col={8} countType={['日均平均停留时长', '昨日平均停留时长', '今日平均停留时长'].includes(item.title) ? 'time' : 'default'}/>
          ))}
        </Row>
      </Spin>
    </div>
  );
};

export default FlowInformation;
