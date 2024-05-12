/**
 * @Description 拓店任务路由页面（根据后台配置判断走哪个版本的拓店）
 */
// import { tenantCheck } from '@/common/api/common';
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ExpansionFranchiseeTask from '../expansionfranchiseetask/entry';
import ExpansionCircleTask from '../expansioncircletask/entry';


const ExpansionTask: FC<any> = ({ location }) => {
  const [taskTemplateCode, setTaskTemplateCode] = useState<string>('');
  const tenantCheckData = useSelector((state: any) => state.common.tenantCheck);


  // const getTaskConfig = async () => {
  //   const taskConfig = await tenantCheck();
  //   setTaskTemplateCode(taskConfig?.taskTemplateCode);
  // };

  // useEffect(() => {
  //   getTaskConfig();
  // }, []);
  useEffect(() => {
    const { taskTemplateCode } = tenantCheckData;
    taskTemplateCode && setTaskTemplateCode(taskTemplateCode);
  }, [tenantCheckData]);


  return (
    <div>
      {taskTemplateCode === 'standardA' && <ExpansionFranchiseeTask location={location} />}
      {taskTemplateCode === 'clusterA' && <ExpansionCircleTask location={location} />}
    </div>
  );
};

export default ExpansionTask;
