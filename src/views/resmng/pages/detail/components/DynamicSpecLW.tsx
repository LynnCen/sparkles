import React, { useEffect, useState } from 'react';
import { InputNumber, Space } from 'antd';
import { floorKeep } from '@lhb/func';

const DynamicSpecLW: React.FC<any> = ({ onChange, value = [] }) => {
  const [length, setLength] = useState<number | undefined>();
  const [width, setWidth] = useState<number | undefined>();
  const [total, setTotal] = useState<number | string>('');

  const onLengthChange = (value) => {
    setLength(value);
    onChange?.([{ l: value, w: width }]);
  };

  const onWidthChange = (value) => {
    setWidth(value);
    onChange?.([{ l: length, w: value }]);
  };

  useEffect(() => {
    const { w, l } = value?.[0] || {};
    setWidth(w);
    setLength(l);
  }, [value]);

  useEffect(() => {
    setTotal(floorKeep(length || 0, width || 0, 3, 2));
  }, [length, width]);

  return (
    <>
      <Space style={{ display: 'flex', marginBottom: 8 }} align='baseline'>
        <InputNumber
          placeholder='请输入长'
          style={{ width: '150px' }}
          addonAfter='m'
          value={length}
          onChange={onLengthChange}
          min={0}
          max={999999999.99}
        />

        <InputNumber
          value={width}
          onChange={onWidthChange}
          min={0}
          max={999999.99}
          placeholder='请输入宽'
          style={{ width: '150px' }}
          addonAfter='m' />
      </Space>
      <InputNumber
        style={{ width: 310 }}
        placeholder='通过规格自动计算'
        value={total}
        disabled={true} addonAfter='m²' />
    </>
  );
};
export default DynamicSpecLW;
