import { Component } from "react";
import { Icon, Pagination, Collapse, message } from "antd";
import { connect } from "dva";
import { Dispatch } from "redux";
import { Panel } from "../../stores/layerModel";
import LayerPanel from "./LayerPanel";
import { warnHandler } from "../../modules/Modal/MarkerModal";
import Config from "../../config/Config";
import LayerService from "../../services/LayerService";
const css = require("../../styles/custom.css");
const scss = require("../../styles/scss/ppttab.scss");
const cadscss = require("../../styles/scss/cad.scss");

interface Props {
  panels: Panel[];
  count: number;
  dispatch: Dispatch<Object>;
  legendSource: { id; title; url }[];
}
interface States {
  activeKey?: Array<string | number> | string | number;
  current: number;
  // total: number;
  warn?: boolean;
}
@connect(({ layerModel }) => ({
  panels: layerModel.panels,
  count: layerModel.count,
  legendSource: layerModel.legendSource
}))
export default class LayerCard extends Component<Props, States> {
  pageSize = process.env.NODE_ENV != "production" ? 3 : 10;
  constructor(props) {
    super(props);
    this.state = {
      activeKey: "",
      current: 1,
      warn: false
    };
  }
  componentWillMount() {
    this.props.dispatch({
      type: "layerModel/getList",
      payload: { page: 1, size: this.pageSize }
    });
    if (!this.props.legendSource.length) {
      LayerService.getSelectionList({ planId: Config.PLANID }, (flag, res) => {
        flag
          ? this.props.dispatch({
            type: "layerModel/setProp",
            payload: { legendSource: res.data.list }
          })
          : message.error(res.message);
      });
    }
  }
  handleAdd = async e => {
    const { panels, dispatch } = this.props;
    if (!panels.filter(e => e.id !== null).every(e => e.id)) warnHandler(this);
    else {
      if (this.state.current != 1) {
        await this.pageChange(1);
      }
      dispatch({ type: "layerModel/addPanel" });
      this.setState({ activeKey: 0 });
    }
  };
  pageChange = (page: number) => {
    if (!this.props.panels.every(e => e.id)) warnHandler(this);
    else {
      this.setState({ current: page, activeKey: "" });
      return this.props.dispatch({
        type: "layerModel/getList",
        payload: { page, size: this.pageSize }
      });
    }
  };
  delCallback = i => {
    const { current } = this.state;
    this.setState({ activeKey: "" });
    this.props.count &&
      this.pageChange(
        i == 0 && this.props.count % this.pageSize == 1
          ? Math.max(1, current - 1)
          : current
      );
  };
  render() {
    const { panels, count } = this.props;
    const { activeKey, current, warn } = this.state;
    return (
      <div className={css["m-sm"] + " " + scss["tabCard"]} role="collapsecard">
        <h3 className={css["p-l-sm"] + " " + css["flex-center-between"]}>
          <span>图层制作</span>
          <span>
            <Icon
              type="plus-circle"
              style={{ fontSize: "17.5px" }}
              onClick={this.handleAdd}
              className={scss["pointer"]}
              title={"添加图层"}
            />
          </span>
        </h3>
        {panels && (
          <Collapse
            accordion
            expandIconPosition="right"
            defaultActiveKey={String(0)}
            activeKey={String(activeKey)}
            onChange={key => this.setState({ activeKey: key })}
            className={scss["right-collapse"]}
          >
            {panels.slice(0, this.pageSize).map((item, i) => (
              <LayerPanel
                key={i}
                i={i}
                onClick={e => this.setState({ activeKey: i })}
                className={!item.id && warn ? cadscss["warn"] : ""}
                page={current}
                pageSize={this.pageSize}
                delCallback={this.delCallback}
              />
            ))}
          </Collapse>
        )}
        <div className={scss["footer"] + " " + css["flex-center"]}>
          <Pagination
            defaultCurrent={1}
            pageSize={this.pageSize}
            current={current}
            total={count}
            size="small"
            onChange={this.pageChange}
          />
        </div>
      </div>
    );
  }
}
