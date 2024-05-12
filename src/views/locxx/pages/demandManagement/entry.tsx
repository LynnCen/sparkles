import { FC } from 'react';
import DemandManagementIndex from './index';

// 交易平台/需求管理
const DemandManagement: FC<any> = () => {

  return (<>
    <DemandManagementIndex provideFor='demandManagement'/>
  </>);
};

export default DemandManagement;
