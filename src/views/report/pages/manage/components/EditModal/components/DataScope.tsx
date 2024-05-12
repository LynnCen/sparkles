/* 数据粒度 */
import React from 'react';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';

const options = [
  { label: '小时', value: 1 },
  { label: '天', value: 2 },
  { label: '月', value: 3 },
];

const DateScope: React.FC = () => {
  return (
    <V2FormRadio
      label='数据粒度'
      name='dataScope'
      options={options}
      required
    />
  );
};

export default DateScope;
