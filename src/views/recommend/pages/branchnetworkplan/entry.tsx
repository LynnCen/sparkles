import { FC, useState } from 'react';
import styles from './entry.module.less';
import V2Container from '@/common/components/Data/V2Container';
import PlanningManageSimpleTable from './components/NetworkPlanMain/components/PlanningManageSimpleTable';
import V2Title from '@/common/components/Feedback/V2Title';
import { Divider } from 'antd';



const BranchNetworkPlan: FC<any> = () => {
  const [mainHeight, setMainHeight] = useState<number>(0);

  return (
    <>
      <V2Container
        className={styles.container}
        emitMainHeight={(h) => setMainHeight(h)}
        style={{ height: 'calc(100vh - 88px)' }}
        extraContent={{
          top: <>
            <V2Title type='H1' text='分公司规划管理' style={{ marginTop: 20, color: '#222', }}/>
            <Divider />
          </>
        }}>
        <PlanningManageSimpleTable
          mainHeight={mainHeight}
        />
      </V2Container>
    </>
  );
};

export default BranchNetworkPlan;
