import React from "react";
import { Select } from "antd";
const css = require("../../styles/custom.css");

export function SelectRow({
  label = "",
  value = 14,
  options = [],
  onChange = (value: number) => null,
  style = {}
}) {
  const length = options.reduce(
    (r, c, i) => (r = Math.max(r, String(c).length)),
    0
  );
  return (
    <div className={css["flex-center-left"]} style={{}}>
      <label className={css["flex-none-label"]}>{label}</label>
      <Select
        value={value}
        style={{ width: length * 9 + 2 * 7 + 20 }}
        size={"small"}
        onChange={onChange}
        placeholder={label}
      >
        {options.map((item, i) => (
          <Select.Option value={item} key={i}>
            {item}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
}
