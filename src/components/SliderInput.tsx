import React from "react";
import {Slider, InputNumber} from "antd";


export function SliderInput({
                              value = 0,
                              min = 0,
                              max = 100,
                              step = 1,
                              formatter = (value: number | string) => value + "",
                              onChange,
                              size = "default" as   'large' | 'small' | 'default',
                            }) {
  const commonProps = {
    min,
    max,
    step,
    value: value || 0,
    onChange
  };
  return (
    <>
      <Slider
        {...commonProps}
        style={{flex: "auto", margin: "8px 6px"}}
        tipFormatter={formatter}
      />
      <InputNumber
        {...commonProps}
        style={{flex: 0.6, marginLeft: 10}}
        size={size}
        formatter={formatter}
      />
    </>
  );
}
