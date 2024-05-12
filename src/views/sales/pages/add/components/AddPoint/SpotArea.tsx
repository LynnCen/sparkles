import { InputNumber, InputNumberProps, Space } from 'antd';
import { FC, useEffect, useState } from 'react';

interface SpotAreaProps {
  onChange?: (value: any) => void;
  value?: any;
  options?: InputNumberProps;
}

const SpotArea: FC<SpotAreaProps> = ({ value, onChange, options }) => {

  const config = {
    max: 9999,
    addonAfter: 'm',
    precision: 0,
    placeholder: '长度',
    ...options
  };

  const [width, setWidth] = useState<number | undefined>();
  const [height, setHeight] = useState<number | undefined>();
  const [length, setLength] = useState<number | undefined>();

  const onWidthChange = (value: any) => {
    setWidth(value);
    onChange?.({ width: value, height, length });
  };

  const onHeightChange = (value: any) => {
    setHeight(value);
    onChange?.({ width, height: value, length });
  };
  const onLengthChange = (value: any) => {
    setLength(value);
    onChange?.({ width, height, length: value, });
  };

  useEffect(() => {
    const { width, height, length } = value || {};
    setWidth(width);
    setHeight(height);
    setLength(length);
  }, [value]);

  return (
    <>
      <Space split='X'>
        <InputNumber {...config} placeholder='长度' value={length} onChange={onLengthChange}/>
        <InputNumber {...config} placeholder='宽度' value={width} onChange={onWidthChange}/>
        <InputNumber {...config} placeholder='高度' value={height} onChange={onHeightChange}/>
      </Space>
    </>
  );
};


export default SpotArea;
