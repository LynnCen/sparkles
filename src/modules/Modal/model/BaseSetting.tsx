import React, { useState, useEffect } from "react";
import { LabelItem } from "../../../components/LabelItem";
import { SliderInput } from "../../../components/SliderInput";
import { Collapse, Switch } from "antd";
import { Consumer, BaseData } from "./ModelModal";
import ColorPicker from "../../../components/ColorPicker";

const Panel = Collapse.Panel;
const color = require("../../../styles/scss/color.scss");
const pCss = require("../../../styles/scss/public.scss");

export const BaseSetting = () => {
  return <Consumer>
    {(props: { baseData: BaseData, open, onChange, switchChange, clearColor }) => (
      <Collapse bordered={false} expandIconPosition={"right"} accordion>
        <Panel header="缩放" key="1">
          <XYZItem label={"X轴"} colorClassName={"red"} value={props.baseData.width} param={"width"}
            onChange={props.onChange} />
          <XYZItem label={"Y轴"} colorClassName={"green"} value={props.baseData.height} param={"height"}
            onChange={props.onChange} />
          <XYZItem label={"Z轴"} colorClassName={"blue"} value={props.baseData.deep} param={"deep"}
            onChange={props.onChange} />
          <LabelItem text={"锁定按钮"}>
            <SwitchItem
              text="X"
              value={props.open.width}
              param={"width"}
              onChange={props.switchChange} />
            <SwitchItem
              text="Y"
              value={props.open.height}
              param={"height"}
              onChange={props.switchChange} />
            <SwitchItem
              text="Z"
              value={props.open.deep}
              param={"deep"}
              onChange={props.switchChange} />
          </LabelItem>
        </Panel>
        <Panel header={"旋转角度"} key="2">
          <RotateItem label={"X轴"} colorClassName={"red"} value={props.baseData.rotateX} param={"rotateX"}
            onChange={props.onChange} />
          <RotateItem label={"Y轴"} colorClassName={"green"} value={props.baseData.rotateY} param={"rotateY"}
            onChange={props.onChange} />
          <RotateItem label={"Z轴"} colorClassName={"blue"} value={props.baseData.rotateZ} param={"rotateZ"}
            onChange={props.onChange} />
        </Panel>
        <Panel header={"样式"} key="3">
          <LabelItem text={"颜色"}>
            <ColorPicker
              currentColor={props.baseData.color}
              colorChange={(value) => props.onChange("color", value)}
              onClear={props.clearColor}
            />
          </LabelItem>
          <LabelItem text={"透明度"}>
            <SliderInput min={0.1}
              max={1}
              step={0.1}
              value={props.baseData.opacity} onChange={(value) => props.onChange("opacity", value)} />
          </LabelItem>
        </Panel>
      </Collapse>
    )
    }
  </Consumer>


}
export const XYZItem = ({ label, colorClassName, value, param, onChange }) => {
  return <LabelItem text={<div style={{ display: "inline-flex", alignItems: "center" }}>
    <span>{label}</span>
    <div style={{ width: 16, height: 16 }} className={`${color['color-circle']} ${color[colorClassName]}`} />
  </div>}>
    <SliderInput min={0.01}
      max={10}
      step={0.01}
      value={value} onChange={(value) => onChange(param, value)} />
  </LabelItem>
}

export const RotateItem = ({ label, colorClassName, value, param, onChange }) => {
  return <LabelItem text={<div style={{ display: "inline-flex", alignItems: "center" }}>
    <span>{label}</span>
    <div style={{ width: 16, height: 16 }} className={`${color['color-circle']} ${color[colorClassName]}`} />
  </div>}>
    <SliderInput min={-180}
      max={180}
      step={1}
      value={value} onChange={(value) => onChange(param, value)} />
  </LabelItem>
}

export const SwitchItem = ({ text, value, param, onChange }) => {
  return <Switch className={pCss['m-r-md']}
    checkedChildren={text}
    unCheckedChildren={text}
    checked={value}
    onChange={(checked) => onChange(param, checked)} />
}
