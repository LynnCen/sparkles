/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import { Col, Tabs } from 'antd';
import HeatmapContainer from './HeatmapContainer';
import { storeDevices } from '@/common/api/store';
import { HeatData, InitialProps } from '@/views/analysis/pages/index/ts-config';
import styles from '../index.module.less';
import V2Title from '@/common/components/Feedback/V2Title';
import IconFont from '@/common/components/IconFont';
import HistoryDrawer from './HistoryDrawer';
import { isArray } from '@lhb/func';

const { TabPane } = Tabs;

const Heatmap: React.FC<InitialProps> = ({ filters }) => {
  const { storeIds } = filters;
  const [list, setList] = useState<HeatData[]>([]);
  const [activeKey, setActiveKey] = useState<string>('');
  const [curDevice, setCurDevice] = useState<any>(null);
  const [historyDrawer, setHistoryDrawer] = useState<any>({
    open: false, // 是否打开历史截图抽屉
    // storeId: storeIds, // 门店id，来源于页面顶部的选择门店
    // deviceId: '' // 设备id，热力核心区域图下的设备类型id
  });
  useEffect(() => {
    getHeadMapList();
    // setHistoryDrawer((state) => ({ ...state, storeId: storeIds }));
  }, [storeIds]);

  // 接口说目前只能通过中文匹配的方式
  const showEntry = useMemo(() => {
    if (!curDevice) return false;
    const { name } = curDevice;
    return name.includes('巡店');
  }, [curDevice]);

  // 获取热力图tabs
  const getHeadMapList = async () => {
    if (!storeIds) return;
    const params = { id: storeIds, hasHeatmap: 1 };
    // https://yapi.lanhanba.com/project/297/interface/api/33301
    const result = await storeDevices(params);
    setActiveKey(isArray(result) ? result[0]?.id?.toString() : '');
    setCurDevice(isArray(result) ? result[0] : null); // 设置默认项
    setList(result || []);
  };

  // tabs切换
  const tabsChange = (activeKey: string) => {
    setActiveKey(activeKey);
    const target = list.find((item: any) => item.id === +activeKey);
    setCurDevice(target || null);
  };

  if (!list.length) return null;

  return (
    <>
      {/* <p className={styles.title}>
        <span className={styles.name}>热力核心区域图</span>
      </p> */}
      <V2Title
        text='热力核心区域图'
        divider
        type='H2'
        className='mt-24 mb-16'
        extra={showEntry
          ? <div className='c-006 fn-14 pointer' onClick={() => setHistoryDrawer({ open: true })}>
            <span>查看历史巡店图</span>
            <IconFont iconHref='iconarrow-right' className='pl-4 fn-16'/>
          </div>
          : null}
      />
      <Col span={24}>
        <Tabs
          activeKey={activeKey}
          destroyInactiveTabPane
          type='card'
          className={styles.headMapTabs}
          tabBarGutter={0}
          onChange={tabsChange}>
          {list.map((item) => (
            <TabPane tab={item.name} key={item.id}>
              <HeatmapContainer deviceId={item.id} filters={filters} />
            </TabPane>
          ))}
        </Tabs>
      </Col>

      <HistoryDrawer
        open={historyDrawer.open}
        storeId={storeIds}
        deviceId={curDevice?.id}
        close={() => setHistoryDrawer({ open: false })}/>
    </>
  );
};

export default Heatmap;
