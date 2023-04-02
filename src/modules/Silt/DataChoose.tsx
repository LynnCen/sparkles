import React from "react";
import { Icon, Select, Checkbox, Input, Slider, InputNumber, Cascader } from "antd";

const pStyles = require("../../styles/scss/public.scss");
const styles = require("../../styles/scss/silt.scss");
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

interface Props {
  index: number;
  labelA: string;
  labelB: string;
  cascader: boolean;// 是否为级联选择
  optionList: any[];//select option  数据列表
  selectedData: any;//已选中资源
  checkedData: string[];//已选中设置
  onSelectChange: (checkedValue) => void;
  onCheckboxChange: (checkedValue) => void;
  haveDel: boolean;
  haveAdd: boolean;
  del: () => void;
  add: () => void;

}

const DataChoose = ({
  index, labelA, labelB, cascader, optionList, selectedData, checkedData, onSelectChange, onCheckboxChange
  , haveDel, haveAdd, del, add
}: Props) => {
  return (<div className={styles['param-item']}>
    <div className={pStyles['flex-center-between'] + " " + styles['top']}>
      {index + 1}
      <span>
        {haveDel ? <Icon type="delete" theme="filled" onClick={del} /> : null}
        {haveAdd ? <Icon type={"plus"} className={pStyles['m-l-sm']} onClick={add} /> : null}
      </span>

    </div>
    <div className={pStyles['p-sm']}>
      <div className={pStyles["flex-center-left"] + " " + pStyles['m-b-sm']}>
        <label className={pStyles["flex-none"]}>{labelA}：</label>
        {cascader ? <Cascader size="small" options={optionList} value={selectedData} onChange={onSelectChange} placeholder="请选取" /> :
          <Select showSearch onChange={onSelectChange} value={selectedData} size={"small"}
            className={styles['small-input-search']}
            placeholder={"请选取"}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }>
            {optionList.map((item, i) => {
              return <Option value={item.id} key={i}>{item.title}</Option>
            })}
          </Select>}
      </div>
      <div className={pStyles["flex-center-left"]}>
        <label className={pStyles["flex-none"]}>{labelB}：</label>
        <CheckboxGroup style={{ fontSize: 12 }}
          options={["基准", "设计", "超挖"]}
          value={checkedData}
          onChange={onCheckboxChange}
        />
      </div>
    </div>
  </div>)
};

export default DataChoose

export const CenterLine = ({ optionList, value, onChange }) => {
  return <div className={styles['param-item'] + " " + pStyles['p-sm']}>
    <div className={pStyles["flex-center-left"] + " " + pStyles['m-b-sm']}>
      <label className={pStyles["flex-none"]}>航道中心线：</label>
      <Cascader size="small" options={optionList} value={value} onChange={onChange} placeholder="请选取" />
    </div>
  </div>
};

export const ConfigData = (props: {
  widthDeep: { width, onWidthChange, deep, onDeepChange }, highInfo: { list: { name, height }[], fun: { del, add, onNameChange, onHeightChange } }
}) => {
  return (<div className={styles['param-item'] + " " + pStyles['p-sm']}>
    {WidthDeepInput("计算超宽", props.widthDeep.width, props.widthDeep.onWidthChange)}
    {WidthDeepInput("计算超深", props.widthDeep.deep, props.widthDeep.onDeepChange)}
    {props.highInfo.list.map((item, i) => {
      return <HighInfoInput key={i} value={item} fun={props.highInfo.fun} length={props.highInfo.list.length}
        index={i} />
    })}

  </div>)
};

function WidthDeepInput(label, value, onChange) {
  return <div className={pStyles["flex-center-left"] + " " + pStyles['m-b-sm']}>
    <label className={pStyles["flex-none"]}>{label}：</label>
    <InputNumber size="small" className={styles['small-input-search']} value={value} onChange={onChange} />
  </div>
}

export function HighInfoInput(props: { value: { name, height }, fun: { del, add, onNameChange, onHeightChange }, length, index }) {
  return <div className={pStyles["flex-center-left"] + " " + pStyles['m-b-sm']}>
    <label className={pStyles["flex-none"]}>高程信息：</label>
    <Input size="small" placeholder={"名称"} style={{ width: 80, fontSize: 12 }} value={props.value.name}
      onChange={(e) => props.fun.onNameChange(e.target.value, props.index)} />
    <div className={pStyles['m-l-sm']}>
      <InputNumber size="small" style={{ width: 40, fontSize: 12 }} className={"hide-handler"} value={props.value.height}
        onChange={(value) => props.fun.onHeightChange(value, props.index)} /> m
    </div>
    <span>
      {props.index !== 0 ? <Icon type="delete" theme="filled" className={pStyles['m-l-sm']}
        onClick={() => props.fun.del(props.index)} /> :
        null}
      {props.index === props.length - 1 ?
        <Icon type={"plus"} className={pStyles['m-l-sm']} onClick={() => props.fun.add()} /> : null}
    </span>
  </div>

}
