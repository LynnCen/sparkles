/**
 * @Description
 */
// 数据概览卡片-概览/门店公用
import React, { useEffect, useMemo, useState } from 'react';
import { Row, Spin } from 'antd';
import Indicator from '@/common/components/business/FlowCard';
import { getGroupData } from '@/common/api/flow';
import styles from './index.module.less';
import { isArray } from '@lhb/func';
import CustomerGroupChart from './CustomerGroupChart';
import { ClientRowProps } from '../ts-config';

export const ClientRowShowTitleList:string[] = ['日均顾客数（人数）', '日均客户组（个）'];

const ClientRow: React.FC<ClientRowProps> = ({ filters, clientRowCardData }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const { start, end, storeIds, strStoredIds } = filters;
  const [groupData, setGroupData] = useState<any[]>([]);

  /**
   *是否展示客户组规模这一行
   * 客户组规模与日均顾客数（人数）、日均客户组（个）数据同时存在或没有，所以只要判断一个就可以了
   */
  const showClientRow = useMemo(() => {
    return groupData.every((item) => item.count === null || Number(item.count) === 0);
  }, [groupData]);


  // 客户组规模
  const loadChartData = async () => {
    if (!start || !end || !storeIds) {
      return;
    }
    setLoading(true);
    const params = { start, end, storeIds: isArray(storeIds) && storeIds.length ? storeIds : null };
    // https://yapi.lanhanba.com/project/297/interface/api/33369
    const data = await getGroupData(params);
    setLoading(false);
    setGroupData(isArray(data) ? data : []);
  };

  useEffect(() => {
    loadChartData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end, start, storeIds, strStoredIds]);

  return (
    <>
      {!showClientRow ? <div className={styles.clientRow}>
        <div className={styles.clientRowLeft}>
          <CustomerGroupChart data={groupData}/>
        </div>


        <Spin spinning={loading}>
          <div className={styles.clientRowRight}>
            <Row gutter={[16, 16]} style={{ minHeight: '200px' }}>
              {clientRowCardData.map((item, idx) => (
                <Indicator
                  key={idx}
                  {...item}
                  col={24}
                  resetCardStyle={{
                    height: 200,
                    padding: '32px 33px 32px 48px'
                  }}/>
              ))}
            </Row>
          </div>
        </Spin>
      </div> : <></>}
    </>
  );
};

export default ClientRow;
