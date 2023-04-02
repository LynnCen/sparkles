import { Component, createRef, ReactNode } from "react";
import { findDOMNode } from "react-dom";
import {
  Input,
  Switch,
  Button,
  Collapse,
  Icon,
  Select,
  Radio,
  Popconfirm
} from "antd";
import { connect } from "dva";
import { Dispatch } from "redux";
import { Panel } from "../../stores/layerModel";
import IconSelector from "../../components/selector/IconSelector";
import { CollapsePanelProps } from "antd/lib/collapse";
import InputRowWithTable, { withSelectedTable } from "../Cad/InputRowWithTable";
import { SliderInputRow } from "../Cad/SliderInputRow";
import VrpIcon from "../../components/VrpIcon";
import StrConfig from "../../config/StrConfig";
import { warnHandler } from "../Modal/MarkerModal";
import { CadSourceDto } from "../../stores/cadModel";
import { SwitchRow } from "../Cad/SwitchRow";
import GPSAnimation from "../../components/model/GPS/Animation";
import Terrain from "../../components/model/Terrain";
import Geometry from "../../components/model/Geometry";
import PipeLine from "../../components/model/PipeLine";
import Model from "../../components/model/Model";
const css = require("../../styles/custom.css");
const scss = require("../../styles/scss/ppttab.scss");

interface Props extends CollapsePanelProps {
  i: number;
  className?: string;
  onClick: (e) => void;
  panel: Panel;
  cadSource: CadSourceDto[];
  legendSource: { id; title; url }[];
  terrainList: any[];
  dispatch: Dispatch<Object>;
  page: number;
  pageSize: number;
  count: number;
  delCallback: Function;
}
interface States {
  isChange?: boolean;
  // onLocation?: boolean;
  // unfold?: boolean;
  checked: boolean;
}
@connect(({ layerModel, cadModel }, ownProps) => ({
  panel: layerModel.panels[ownProps.i],
  legendSource: layerModel.legendSource,
  cadSource: cadModel.cadSource,
  count: layerModel.count
}))
export default class LayerPanel extends Component<Props, States> {
  dom: ReactNode;
  tableRef = createRef();
  dataSource: { id: number; title: string; children?}[];
  constructor(props, context) {
    super(props);
    this.state = {
      checked: true,
      isChange: props.panel ? (props.panel.id ? false : true) : true
    };
    this.dataSource = {
      terrain: Terrain.terrains,
      cad: props.cadSource.map(e => ({
        ...e,
        children: e.cadFileVoList.map(e => ({
          ...e,
          title: e.fileName
        }))
      })),
      gps: GPSAnimation.animations,
      area: Geometry.geometrys,
      line: PipeLine.pipes,
      build: Model.models
    };
  }
  componentWillMount() { }
  componentDidMount() {
    this.dom = findDOMNode(this);
  }
  setChange = (isChange = true) => {
    this.setState({ isChange });
  };
  dispatch = ({ type, payload }) =>
    new Promise((resolve, reject) =>
      this.props
        .dispatch({ type, payload: { i: this.props.i, ...payload } })
        .then(() => (this.setChange(), resolve()))
    );
  dispatchProp = ({ ...payload }) =>
    this.dispatch({ type: "layerModel/setPanelProp", payload });
  dispatchLegendProp = ({ ...payload }) =>
    this.dispatch({ type: "layerModel/setLegendProp", payload });

  changeType = (type, option) => {
    console.log(type);
    this.dispatchProp({
      type,
      dataId: [],
      icon: StrConfig.pptLayerOptions.find(e => e.value == type)!.icon
    });
  };
  changeSource = selections => {
    console.log(selections, this.tableRef);
    const { panel } = this.props;
    let dataId = selections;
    if (panel.type == "cad") {
      dataId = selections.map(e => {
        let children = e.children.map(e => ({
          id: e.id,
          fileName: e.fileName
        }));
        return {
          id: e.id,
          title: children.map(e => e.fileName),
          children
        };
      });
    } else {
      dataId = selections.map(e => ({ id: e.id, title: e.title }));
      panel.type == "terrain" && this.opacityChange(this.props.panel.opacity);
    }
    this.dispatchProp({ dataId });
  };
  opacityChange = (opacity: number) => {
    this.dispatchProp({ opacity });
  };
  dotChange = (e, index) => {
    this.dispatchLegendProp({ index, dot: e.target.value });
  };
  changeLegendSource = (index, selections) => {
    console.log(selections);
    this.dispatchLegendProp({
      index,
      dataId: selections.map(e => {
        let children = e.children.map(e => ({
          id: e.id,
          fileName: e.fileName
        }));
        return {
          id: e.id,
          title: children.map(e => e.fileName),
          children
        };
      })
    });
  };
  onSave = (e?) => {
    const { panel, i, dispatch } = this.props;
    if (!!panel.dataId.length && panel.legends.every(l => !!l.dataId)) {
      dispatch({
        type: `layerModel/save`,
        payload: { i }
      });
      this.setChange(false);
    } else {
      warnHandler(this, "图层或图例源不得为空😅~");
    }
  };
  render() {
    const {
      i,
      panel,
      dispatch,
      legendSource,
      page,
      pageSize,
      count,
      isActive
    } = this.props;
    const { isChange } = this.state;
    console.log(legendSource, panel.dataId);
    return (
      <Collapse.Panel
        {...this.props}
        header={<span>{"图层" + (count - (page - 1) * pageSize - i)}</span>}
        extra={
          <Switch
            // disabled={!isActive}
            title={`${panel.isOpen ? "开启" : "关闭"}图层`}
            checkedChildren="开"
            unCheckedChildren="关"
            checked={panel.isOpen}
            onChange={(isOpen, e) => {
              this.dispatchProp({ isOpen }).then(this.onSave);
              e.stopPropagation();
            }}
          />
        }
      >
        <main>
          <div className={css["flex"]}>
            <IconSelector
              onSelect={icon => this.dispatchProp({ icon })}
              classType={"2"}
              type="square"
              color="#999999"
              value={panel.icon}
            />
            <InputWithTable
              title={"数据源"}
              tableRef={ref => (this.tableRef.current = ref)}
              addonBefore={
                <Select
                  value={panel.type}
                  onChange={this.changeType}
                  size={"small"}
                >
                  {StrConfig.pptLayerOptions.map((e, i) => (
                    <Select.Option {...e} key={i}>
                      {e.title}
                    </Select.Option>
                  ))}
                </Select>
              }
              selections={panel.dataId || []}
              dataSource={[...this.dataSource[panel.type]]}
              onChange={this.changeSource}
            />
          </div>
          {panel.type == "terrain" && (
            <SliderInputRow
              label="不透明度"
              min={0.01}
              max={1}
              step={0.01}
              formatter={val => (val * 100).toFixed(0) + "%"}
              value={panel.opacity}
              onChange={this.opacityChange}
            />
          )}
          <SwitchRow
            label={"出现在分享界面"}
            checked={panel.whethshare}
            onChange={whethshare => this.dispatchProp({ whethshare })}
          />
          {panel.legends.map((item, index) => (
            <div key={item.id || index} className={scss["legend-card"]}>
              <div
                className={css["flex-center-between"]}
                style={{ lineHeight: "18px" }}
              >
                <span className={css["flex"]}>
                  <span style={{ fontSize: 12, marginRight: 8 }}>
                    {panel.type !== "particle" ? "图例" + (index + 1) : "端点"}
                  </span>
                  {panel.type !== "particle" ? (
                    <Switch
                      disabled={!panel.isOpen && !panel.whethshare}
                      checked={item.isOpen}
                      size="small"
                      onChange={(isOpen, e) =>
                        this.dispatchLegendProp({ index, isOpen })
                      }
                    />
                  ) : (
                      <Radio.Group
                        onChange={e => this.dotChange(e, index)}
                        value={item.dot || "arrow"}
                      >
                        <Radio value={"arrow"}>箭头</Radio>
                        <Radio value={"circle"}>圆形</Radio>
                      </Radio.Group>
                    )}
                </span>
                <span className={css["flex"]}>
                  {index == panel.legends.length - 1 && (
                    <Icon
                      type="plus"
                      style={{ fontSize: "14px" }}
                      onClick={e => {
                        dispatch({
                          type: "layerModel/addLegend",
                          payload: { i }
                        });
                        this.setChange();
                      }}
                      className={css["pointer"]}
                      title={"添加图例"}
                    />
                  )}
                  <Popconfirm
                    title={"确定删除？"}
                    okText={"确定"}
                    cancelText={"取消"}
                    onConfirm={() =>
                      dispatch({
                        type: "layerModel/delLegend",
                        payload: { i, index }
                      })
                    }
                  >
                    <VrpIcon
                      iconName={[
                        "icon-lajitong",
                        css["m-l-sm"],
                        css["pointer"]
                      ].join(" ")}
                      title={"删除图例"}
                      onClick={e => e}
                    />
                  </Popconfirm>
                </span>
              </div>
              <InputRow
                label={"名称"}
                value={item.name}
                onChange={e =>
                  this.dispatchLegendProp({ index, name: e.target.value })
                }
                labelStyle={{ marginRight: 5 }}
                labelClassName={css["flex-none"]}
              />
              <InputRowWithTable
                label={"数值/颜色"}
                // placeholder={"请选择excel"}
                title={"数据源"}
                selections={item.dataId || []}
                dataSource={legendSource.map(e => ({
                  ...e,
                  children: e.signlegendFiles.map(e => ({
                    ...e,
                    title: e.fileName
                  }))
                }))}
                onChange={row => this.changeLegendSource(index, row)}
                mode="single"
                labelStyle={{ marginRight: 5 }}
                labelClassName={css["flex-none"]}
              />
            </div>
          ))}
        </main>
        <div className={css["flex"] + " " + scss["panel-footer"]}>
          {/* <Switch
            title={`默认${panel.whethshare ? "" : "不"}渲染`}
            checkedChildren="显"
            unCheckedChildren="隐"
            checked={panel.whethshare}
            onChange={(whethshare, e) => this.dispatchProp({ whethshare })}
          /> */}
          <Button
            type="primary"
            size="small"
            disabled={!isChange}
            onClick={this.onSave}
          >
            保存
          </Button>
          <Popconfirm
            title={"确定要删除吗？"}
            okText={"确定"}
            cancelText={"取消"}
            onConfirm={() =>
              dispatch({ type: `layerModel/del`, payload: { i } }).then(() =>
                this.props.delCallback(i)
              )
            }
          >
            <Button size="small" style={{ color: "#F5222DFF" }}>
              删除
            </Button>
          </Popconfirm>
        </div>
      </Collapse.Panel>
    );
  }
}

export const InputAddOn = ({
  placeholder,
  size = "small",
  onClick,
  addonBefore = null
}) => (
    <Input
      disabled={true}
      addonBefore={addonBefore}
      addonAfter={
        <Icon
          type="more"
          style={{ transform: "rotate(90deg)" }}
          onClick={onClick}
        />
      }
      placeholder={placeholder}
      size={size}
    />
  );
const InputWithTable = withSelectedTable(InputAddOn);

const InputRow = ({
  label = "",
  size = "small",
  value = "",
  placeholder = "请输入",
  onChange,
  labelClassName = css["flex-none-label"],
  labelStyle = {}
}) => (
    <div className={css["flex-center-left"]} style={{}}>
      <label className={labelClassName} style={labelStyle}>
        {label}
      </label>
      <Input
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        size={size}
      />
    </div>
  );
