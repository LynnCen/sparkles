import { FC } from 'react';
import DemandManagementIndex from 'src/views/locxx/pages/demandManagement/index';

// 交易平台/需求审核
const DemandManagement: FC<any> = () => {

  return (<>
    <DemandManagementIndex provideFor='demandExamine'/>
  </>);
};

export default DemandManagement;
