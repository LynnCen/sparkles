// 基本信息
import { useState, FC } from 'react';
import { Button } from 'antd';

const Component:FC = () => {
  const [count, setCount] = useState(0);

  return (<div>
    <div className='mb-10 fs-18'>组件文档-主页</div>

    <div className='fn-16 lh-22 font-weight-500'>测试</div>

    <span className='mr-10'>{count}</span>
    <Button size='small' onClick={() => setCount(count + 1)}>点我</Button>

  </div>);
};

export default Component;
