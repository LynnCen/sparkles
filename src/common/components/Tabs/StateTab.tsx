import { Tabs } from 'antd';
import React from 'react';

const StateTab: React.FC<any> = ({ options, ...props }) => {
  return (
    <Tabs {...props} type='card' items={options} />
  );
};

export default StateTab;
