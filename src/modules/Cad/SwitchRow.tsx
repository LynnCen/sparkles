import React from "react";
import { Switch } from "antd";
const css = require("../../styles/custom.css");

export function SwitchRow({ label = "", style = {}, className = "", ...rest }) {
  return (
    <div
      className={className ? className : css["flex-center-between"]}
      style={style}
    >
      <label className={css["flex-none-label"]}>{label}</label>
      <Switch
        checkedChildren="开"
        unCheckedChildren="关"
        {...rest}
        // checked={Boolean(checked)}
        // onChange={onChange}
      />
    </div>
  );
}
