// 数据概览卡片-概览/门店公用
import React, { useEffect, useState } from 'react';
import { Row, Spin } from 'antd';
import Indicator from '@/common/components/business/FlowCard';
import { get } from '@/common/request/index';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import { FlowIProps, Statistic, StoreStatisticsProps } from '../ts-config';
import styles from './index.module.less';
import { dynamicStatistics } from '@/common/api/store';
import { ClientRowShowTitleList } from './ClientRow';

// saas运营后台导入默认图标
const defaultIcon = ['icon-xiaoshou', 'icon-dingdan', 'icon-zhuanhualv', 'icon-kedanjia'];
const defaultShadowColor = ['#B5F3FF', '#C3F1E8', '#D2E9FF', '#B5F3FF'];
const defaultBackgroundColor = ['#E4FAFE', '#F4FFFB', '#ECF6FE', '#E4FAFE'];

const FlowInformation: React.FC<FlowIProps> = ({ filters, hasOrderPermission, showImportData = false, setClientRowCardData }) => {
  const [cardData, setCardData] = useState<Statistic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { start, end, storeIds, strStoredIds } = filters;

  const getDynamicData = async () => {
    const result: any = [];
    if (showImportData) {
      const dynamicData = await dynamicStatistics();
      if (Array.isArray(dynamicData) && dynamicData.length) {
        for (let i = 0; i < dynamicData.length; i++) {
          const current = dynamicData[i];
          if (ClientRowShowTitleList.includes(current.title)) return;
          result.push({
            count: current.data,
            totalCount: '',
            ratio: current.ratio ? current.ratio.replace('%', '') : current.ratio,
            ratioFlag: current.ratioFlag,
            // dayAvg: null,
            title: current.title,
            // label: '每日的平均过店客流',
            importTitle: current.explain,
            // totalLabel: '每天的过店客流的总和',
            icon: defaultIcon[i % 4],
            backgroundColor: defaultBackgroundColor[i % 4],
            shadowColor: defaultShadowColor[i % 4],
            // nullLabel: null,
            showTooltip: false,
          });
        }
      }
    }

    return result;
  };

  useEffect(() => {
    const getStoreList = async () => {
      if (!start || !end || !storeIds) {
        return;
      }
      setLoading(true);

      const params = { start, end, storeIds: strStoredIds };
      try {
        // https://yapi.lanhanba.com/project/297/interface/api/33369
        const data: StoreStatisticsProps = await get('/store/statistics', params, true);
        const statistics: any = Array.isArray(data.statistics) ? data.statistics : [];

        const _clientRowCardData:any[] = [];

        // 从storeStatistics中过滤出需要在数据分析中展示的项
        const filterStatistics = statistics.filter((item) => {
          if (ClientRowShowTitleList.includes(item.title)) {
            _clientRowCardData.push(item);
          }
          return !ClientRowShowTitleList.includes(item.title);
        });

        setClientRowCardData?.(_clientRowCardData);

        const dynamicData: any = await getDynamicData();
        if (hasOrderPermission) {
          setCardData(filterStatistics.concat(dynamicData));
        } else {
          if (filterStatistics.length > 7) { // 不展示订单相关项
            setCardData(filterStatistics.slice(0, 7).concat(dynamicData));
          } else {
            setCardData(filterStatistics.concat(dynamicData));
          }
        }
      } catch (error) {}
      setLoading(false);
    };
    getStoreList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end, start, storeIds, strStoredIds]);

  return (
    <div className={styles.flowInformation}>
      <TitleTips name='数据概览' />

      <Spin spinning={loading}>
        <div className={styles.flexCon}>
          <Row gutter={[12, 12]} style={{ minHeight: '200px' }}>
            {cardData.map((item, idx) => (
              <Indicator
                key={idx}
                {...item}
                countType={['日均平均停留时长', '昨日平均停留时长', '今日平均停留时长'].includes(item.title) ? 'time' : 'default'}
              />
            ))}
          </Row>
        </div>
      </Spin>
    </div>
  );
};

export default FlowInformation;
