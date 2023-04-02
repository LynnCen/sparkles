import React from "react";
import { Slider, InputNumber } from "antd";
const css = require("../../styles/custom.css");

export function SliderInputRow({
  label = "",
  value = 1,
  min = 0,
  max = 100,
  step = 1,
  formatter = (value: number | string) => value + "",
  onChange = (value: number) => null,
  style = {},
  className = ""
}) {
  const commonProps = {
    min,
    max,
    step,
    value: Number(Number(value).toFixed(2)),
    onChange
  };
  return (
    <div className={css["flex-center-left"] + " " + className} style={style}>
      <label className={css["flex-none-label"]}>{label}</label>
      <Slider
        {...commonProps}
        style={{ flex: "auto", margin: "8px 6px" }}
        tipFormatter={formatter}
      />
      <InputNumber
        {...commonProps}
        style={{ flex: 0.6, marginLeft: 10 }}
        size="small"
        formatter={formatter}
      />
    </div>
  );
}
