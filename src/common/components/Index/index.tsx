// 基本信息
import { useState, FC, useRef } from 'react';
import { Button } from 'antd';

import Workbench from '@/views/locxx/pages/simulatedResponse/components/Workbench/index';

const Component:FC = () => {
  const [count, setCount] = useState(0);

  const workbenchRef = useRef<any>(null);

  const showWorkbench = () => {
    workbenchRef.current?.init();
  };

  return (<div>
    <div className='mb-10 fs-18'>组件文档-主页</div>

    <div className='fn-16 lh-22 font-weight-500'>测试</div>

    <span className='mr-10'>{count}</span>
    <Button size='small' onClick={() => setCount(count + 1)}>点我</Button>

    <Button size='small' onClick={showWorkbench}>打开工作台</Button>

    {/* 调试数据 */}
    <Workbench ref={workbenchRef} fromIMId='1732015001052303360' toIMId='1747516280346890240'/>

  </div>);
};

export default Component;
