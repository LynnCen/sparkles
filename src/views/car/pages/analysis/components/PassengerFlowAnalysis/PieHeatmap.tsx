/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口

import { get } from '@/common/request/index';

import PieCharts from '@/common/components/EChart/PieChart';
import { Card, Col, Row } from 'antd';
import { InitialProps, CarStoreAnalysisProps } from '@/views/car/pages/analysis/ts-config';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import styles from './index.module.less';

const PieHeatmap: React.FC<InitialProps> = ({ filters }) => {
  const [data, setData] = useState<CarStoreAnalysisProps>({
    flowUrl: [],
    genderRate: [],
    ageRate: [],
  });
  const { start, end, storeIds, dateScope, strStoredIds } = filters;
  useEffect(() => {
    if (start && end && storeIds) {
      getFlowStoresStatistics();
    }
  }, [start, end, storeIds]);

  // 获取数据
  const getFlowStoresStatistics = async () => {
    const params = { start, end, dateScope, storeId: storeIds };
    // https://yapi.lanhanba.com/project/455/interface/api/44365
    const result: CarStoreAnalysisProps = await get(`/carStore/carDetail/${strStoredIds}`, params);
    setData(result);
  };

  return (
    <>
      <TitleTips name='进店客群数据' showTips={false} />
      <Row gutter={[24, 0]}>
        <Col span={12}>
          <Card>
            <PieCharts data={data?.genderRate || []} title='进店客群男女比例' unit='' />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <PieCharts data={data?.ageRate || []} title='进店客群年龄比例' />
          </Card>
        </Col>
      </Row>
      {
        !!data.flowUrl.length && (
          <>
            <TitleTips name='核心区域热力图' showTips={false} />
            <Row gutter={[24, 0]}>
              <Col span={12}>
                <Card style={{ position: 'relative' }}>
                  <img className={styles.heapImage} src={data?.flowUrl[0]} alt='' />
                  <div className={styles.heapImageWrap}>
                    <img className={styles.heapImage} src={data?.flowUrl[1]} alt='' />
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <img className={styles.heapImage} src={data?.flowUrl[0]} alt='' />
                </Card>
              </Col>
            </Row>
          </>
        )
      }
    </>
  );
};

export default PieHeatmap;
