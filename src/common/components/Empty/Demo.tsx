import { FC } from 'react';
import Empty from 'src/common/components/Empty/index';

const Component:FC = () => {

  return (<div>
    <h3>基础用法</h3>
    <Empty/>

    <Empty description='页面不见啦~' />


  </div>);
};

export default Component;
