import { Component } from "react";
import {
  Input,
  InputNumber,
  Icon,
  Card,
  Checkbox,
  Select,
  Popconfirm
} from "antd";
import { connect } from "dva";
import { Panel } from "../../stores/markerModel";
import { Dispatch } from "redux";
import ColorSelect from "../../components/ColorSelect";
import DragTable from "../Share/Components/DragTable";
import { config } from "../../stores/markerModel";
import Config from "../../config/Config";
import { surveyItems } from "../../config/StrConfig";
const { Option } = Select;

const css = require("../../styles/custom.css");
const newCss = require("../../styles/new.css");
const scss = require("../../styles/scss/markerModal.scss");

interface PanelCardProps {
  i: number;
  index: number;
  panel: Panel;
  dispatch: Dispatch<PanelCard>;
  deleteType: string;
}
interface PanelCardStates {
  min: {
    checked: boolean;
    value: number | undefined;
  };
  max: {
    checked: boolean;
    value: number | undefined;
  };
  modalVisible: boolean;
}

@connect(({ markerModel }, ownProps) => ({
  panel: markerModel.panels[ownProps.i]
}))
export default class PanelCard extends Component<
  PanelCardProps,
  PanelCardStates
> {
  tablePageSize = 10;
  constructor(props) {
    super(props);
    const { i, index, panel } = props;
    const { min, max } = panel.items[index];
    this.state = {
      min: { checked: min == null ? false : true, value: min },
      max: { checked: max == null ? false : true, value: max },
      modalVisible: false
    };
  }
  showModal = (v: boolean) => {
    if (v) {
      this.props.dispatch({
        type: "markerModel/getSurveyList",
        payload: { page: 1, size: this.tablePageSize, planId: Config.PLANID }
      });
    }
    this.setState({ modalVisible: v });
  };
  render() {
    const { i, index, panel, dispatch } = this.props;
    const { min, max, modalVisible } = this.state;
    const item = panel.items[index];
    let source: string | { id?; monitor?; addr?; type?; unit? } = item.source;
    try {
      source = JSON.parse(source);
    } catch (e) {
      console.warn("非表格数据源");
    }
    return (
      <Card
        title={index + 1}
        extra={
          <div>
            {index === panel.items!!.length - 1 ? (
              <Icon
                type="plus"
                className={scss["grey"]}
                onClick={e =>
                  dispatch({
                    type: "markerModel/addCard",
                    payload: { i }
                  })
                }
              />
            ) : null}
            <Popconfirm
              title="确认是否删除?"
              onConfirm={(e: any) => {
                dispatch({
                  // type: "markerModel/delPlanDataTab",
                  type: this.props.deleteType,
                  payload: { i, type: panel.type, index }
                });
              }}
              onCancel={(e: any) => e.stopPropagation()}
              okText="确定"
              cancelText="取消"
            >
              <Icon type="close" className={scss["grey"]} />
            </Popconfirm>
          </div>
        }
      >
        <div className={css["flex-center-left"]}>
          <label className={css["flex-none-label"]}>名称</label>
          <Input
            className={css["m-r-md"]}
            style={{ width: "226px" }}
            value={item.itemName || ""}
            disabled
            onChange={e =>
              dispatch({
                type: "markerModel/setDataProp",
                payload: { i, index, itemName: e.target.value }
              })
            }
            placeholder={"请输入数据名"}
          />
          <label className={css["flex-none-label"]}>底色</label>
          <ColorSelect
            color={item.color}
            coverStyle={{
              top: "-15px",
              left: "-330px",
              right: "-102px",
              height: "600%"
            }}
            colorChange={value =>
              dispatch({
                type: "markerModel/setDataProp",
                payload: { i, index, color: value }
              })
            }
          />

          <Checkbox
            defaultChecked
            value={"showLarge"}
            checked={item.showLarge}
            style={{ marginLeft: ".7rem" }}
            onChange={e =>
              dispatch({
                type: "markerModel/setDataProp",
                payload: { i, index, showLarge: e.target.checked }
              })
            }
          >
            显示大号
          </Checkbox>
        </div>
        <div className={css["flex-center-left"]}>
          <label className={css["flex-none-label"]}>数据源</label>
          <Input
            disabled={true}
            addonAfter={
              <Icon
                type="more"
                style={{ transform: "rotate(90deg)" }}
                onClick={e => this.showModal(true)}
              />
            }
            placeholder={item.source || "请选择数据源"}
          />
          {modalVisible && (
            <DragTable
              title="数据源"
              // placeholder={item.source || "请选择数据源"}
              value={item.source}
              pageSize={this.tablePageSize}
              closeModal={this.showModal.bind(null, false)}
              onChange={val => {
                let { key, type, unit, itemName, value } = JSON.parse(val);
                dispatch({
                  type: "markerModel/setDataProp",
                  payload: {
                    i,
                    index,
                    source: val,
                    itemName: itemName || type || key,
                    unit
                  }
                });
              }}
            />
          )}
          <label className={`${css["flex-none-label"]} ${css["m-l-md"]}`}>
            单位
          </label>
          <Select
            className={scss["placeholder"]}
            style={{ width: 120 }}
            value={item.unit || "--"}
            disabled
            onChange={value =>
              dispatch({
                type: "markerModel/setDataProp",
                payload: { i, index, unit: value }
              })
            }
          >
            {/* {[
              ...new Set(
                Object.keys(config.monitorUnit).map(
                  key => config.monitorUnit[key]
                )
              )
            ].map(unit => (
              <Option value={unit} key={i}>
                {unit}
              </Option>
            ))} */}
          </Select>
        </div>
        <div className={css["flex-center-left"]}>
          <label className={css["flex-none-label"]}>图表形式</label>
          <Select
            defaultValue={item.chart || "请选择图表"}
            className={scss["placeholder"]}
            // style={{ width: 120 }}
            onChange={value =>
              dispatch({
                type: "markerModel/setDataProp",
                payload: { i, index, chart: value }
              })
            }
          >
            {/* {Object.keys(panelTypes).map((key, i) => (
                      <Option value={key}>{panelTypes[key].name}</Option>
                      ))} */}
            <Option value={"折线图"} key={0}>
              {"折线图"}
            </Option>
            <Option value={"柱状图"} key={1}>
              {"柱状图"}
            </Option>
          </Select>
          {/* <Cascader
                options={[]}
                expandTrigger="hover"
                placeholder="请选择图表"
              /> */}
          <Checkbox
            // checked={true}
            defaultChecked
            value={"showAllData"}
            checked={item.showAllData}
            style={{ marginLeft: ".7rem" }}
            onChange={e =>
              dispatch({
                type: "markerModel/setDataProp",
                payload: {
                  i,
                  index,
                  showAllData: e.target.checked
                }
              })
            }
          >
            全部数据
          </Checkbox>
        </div>
        <div
          className={css["flex-center-left"]}
          style={{ marginBottom: "12px" }}
        >
          <Checkbox
            checked={min.checked}
            value={"min"}
            // checked={min.checked}
            // style={{ marginLeft: ".7rem" }}
            className={css["m-r-sm"]}
            onChange={e => {
              this.setState({ min: { checked: e.target.checked } });
              if (!e.target.checked) {
                dispatch({
                  type: "markerModel/setDataProp",
                  payload: { i, index, min: null }
                });
              }
            }}
          >
            数据最小值:
          </Checkbox>
          <InputNumber
            className={css["m-r-md"]}
            min={0}
            max={50000}
            disabled={!min.checked}
            value={min.value}
            onChange={value => {
              this.setState(state => ({ min: { ...state.min, value } }));
              dispatch({
                type: "markerModel/setDataProp",
                payload: { i, index, min: value }
              });
            }}
          />

          <Checkbox
            checked={max.checked}
            value={"max"}
            // checked={max.checked}
            className={css["m-r-sm"]}
            onChange={e => {
              this.setState({ max: { checked: e.target.checked } });
              if (!e.target.checked) {
                dispatch({
                  type: "markerModel/setDataProp",
                  payload: { i, index, max: null }
                });
              }
            }}
          >
            数据最大值:
          </Checkbox>
          <InputNumber
            ref="numMax"
            min={0}
            max={50000}
            disabled={!max.checked}
            value={max.value}
            onChange={value => {
              this.setState(state => ({ max: { ...state.max, value } }));
              dispatch({
                type: "markerModel/setDataProp",
                payload: { i, index, max: value }
              });
            }}
          />
        </div>
      </Card>
    );
  }
}
