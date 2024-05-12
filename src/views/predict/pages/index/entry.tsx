import { Tabs } from 'antd';
import PredictAnalysis from './components/PredictAnalysis';
import HistoryPredict from './components/HistoryPredict';
import { useEffect, useMemo, useState } from 'react';
import { post } from '@/common/request/index';
import { usePermissionList } from '@/common/hook/usePermissionList';
import styles from './entry.module.less';

const { TabPane } = Tabs;

export default function Predict() {
  // 该账号下是否有订单信息
  const [haveOrder, setHaveOrder] = useState<boolean>(false);

  const permissionResult: any[] = usePermissionList();

  // 是否有预测按钮
  const showPredictBth = useMemo(() => {
    return !(permissionResult || []).find((item) => item.enCode === 'flow:storePredict:predict');
  }, [permissionResult]);

  // 是否有查询按钮
  const showHistoryBth = useMemo(() => {
    return !(permissionResult || []).find((item) => item.enCode === 'flow:storePredict:query');
  }, [permissionResult]);

  useEffect(() => {
    const orderExist = async () => {
      const result = await post('/order/exist', { storeIds: [] });
      setHaveOrder(result);
    };
    orderExist();
  }, []);

  return (
    <div className={styles.container}>
      <Tabs defaultActiveKey='1' destroyInactiveTabPane tabBarStyle={{ fontWeight: 'bold' }}>
        <TabPane tab='预测分析' key='1'>
          <PredictAnalysis haveOrder={haveOrder} showOkBth={showPredictBth} />
        </TabPane>
        <TabPane tab='历史预测' key='2'>
          <HistoryPredict haveOrder={haveOrder} showOkBth={showHistoryBth} />
        </TabPane>
      </Tabs>
    </div>
  );
}
