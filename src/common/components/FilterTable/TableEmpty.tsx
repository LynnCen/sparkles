import { FC } from 'react';
import { Empty } from 'antd';
const TableEmpty: FC<any> = ({ children }) => {
  return <>
    <Empty image={require('@/assets/images/empty.png')} description={null} imageStyle={{ height: '205px' }}/>
    {children}
  </>;
};

export default TableEmpty;
