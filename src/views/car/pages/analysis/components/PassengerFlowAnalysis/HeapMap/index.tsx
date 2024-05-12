/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Col, Tabs } from 'antd';
import HeatmapContainer from './HeatmapContainer';
import { storeDevices } from '@/common/api/store';
import { HeatData, InitialProps } from '@/views/analysis/pages/index/ts-config';
import styles from '../index.module.less';

const { TabPane } = Tabs;

const Heatmap: React.FC<InitialProps> = ({ filters }) => {
  const { storeIds } = filters;
  const [list, setList] = useState<HeatData[]>([]);

  useEffect(() => {
    getHeadMapList();
  }, [storeIds]);

  // 获取热力图tabs
  const getHeadMapList = async () => {
    if (!storeIds) return;
    const params = { id: storeIds, hasHeatmap: 1 };
    // https://yapi.lanhanba.com/project/297/interface/api/33301
    const result = await storeDevices(params);
    setList(result || []);
  };

  if (!list.length) return null;

  return (
    <>
      <p className={styles.title}>
        <span className={styles.name}>热力核心区域图</span>
      </p>
      <Col span={24}>
        <Tabs destroyInactiveTabPane type='card' className={styles.headMapTabs} tabBarGutter={0}>
          {list.map((item) => (
            <TabPane tab={item.name} key={item.id}>
              <HeatmapContainer deviceId={item.id} filters={filters} />
            </TabPane>
          ))}
        </Tabs>
      </Col>
    </>
  );
};

export default Heatmap;
