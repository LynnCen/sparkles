import React from "react";
import ColorPicker from "../../components/ColorPicker";
const css = require("../../styles/custom.css");

export function ColorRow({
  color = "#fff",
  onChange = (value: string) => null
}) {
  return (
    <div className={css["flex-center-left"]} style={{ margin: 0 }}>
      <label className={css["flex-none-label"]}>颜色</label>
      <ColorPicker currentColor={color} colorChange={onChange} />
    </div>
  );
}
