/**
 * @Description 系统配置-配置审批流
 */

import { FC } from 'react';
// import cs from 'classnames';
import styles from './entry.module.less';
import V2Container from '@/common/components/Data/V2Container';
import Table from './components/Table';

const ApprovalFlowList: FC<any> = () => {

  return (
    <V2Container
      style={{ height: 'calc(100vh - 80px)' }}
      className={styles.container}
    >
      <Table/>
    </V2Container>
  );
};

export default ApprovalFlowList;
