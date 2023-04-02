import { Component } from "react";
import {
  Button,
  Input,
  Switch,
  message,
  Icon,
  Collapse,
  Popconfirm
} from "antd";
import VrpModal from "../../components/VrpModal";
import PanelBase from "./PanelBase";
import { connect } from "dva";
import { Panel } from "../../stores/markerModel";
import { Dispatch } from "redux";
import DataService from "../../services/DataService";
import Config from "../../config/Config";
import CustomFun from "../../config/CustomFun";
import { warnHandler } from "./MarkerModal";
const css = require("../../styles/custom.css");
const scss = require("../../styles/scss/markerModal.scss");

type Content = {
  id?: number;
  planId?: number;
  title: string;
  whethshare: boolean;
  multipage: boolean;
  tabs?: Panel[];
};
interface Props {
  data: Content | null;
  closeModal: (e?) => void;
  onSubmit: (content: object, close: boolean) => void;
  panels: Panel[];
  dispatch: Dispatch<Object>;
}
interface States {
  data: Content | null;
  activeKey?: Array<string | number> | string | number;
  warn: boolean;
}
@connect(({ markerModel }) => ({
  panels: markerModel.panels
}))
export default class extends Component<Props, States> {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data
        ? props.data
        : { title: "", whethshare: false, multipage: false },
      activeKey: "0",
      warn: false
    };
  }
  componentDidMount() {
    const { data } = this.state;
    this.props.dispatch({
      type: "markerModel/getContentTabs",
      payload: data.id ? { id: data.id } : {}
    });
    window.addEventListener("keydown", this.handleOnKeyDown);
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleOnKeyDown);
  }
  handleOnKeyDown = e => {
    CustomFun.onKeyDown(e, 13, this.onSubmit);
    CustomFun.onKeyDown(e, 27, this.props.closeModal);
  };
  componentWillReceiveProps(nextProps) {
    const data = nextProps.data;
    const prevData = this.props.data;
    // 编辑另一个 或 点击添加后点编辑
    if ((data && prevData && data.id !== prevData.id) || (data && !prevData)) {
      this.setState({ data });
      this.props.dispatch({
        type: "markerModel/getContentTabs",
        payload: { id: data.id }
      });
    }
  }
  titleChange = e =>
    this.setState({ data: { ...this.state.data, title: e.target.value } });

  whethshareChange = (whethshare: boolean) =>
    this.setState({ data: { ...this.state.data, whethshare } });

  multipageChange = (multipage: boolean) =>
    this.setState({ data: { ...this.state.data, multipage } });

  onSubmit = (close = true) => {
    const { data } = this.state;
    const { panels, onSubmit, dispatch } = this.props;
    if (panels.length > 1 && panels.some(e => e.type == "")) {
      warnHandler(this, "面板类型不能为空哦😅~");
      return;
    }
    const _data = {
      ...data,
      tabs: JSON.stringify(panels)
    };
    _data.planId = Config.PLANID;
    DataService.saveContent(_data, (f, res) => {
      if (f) {
        message.success(res.message);
        onSubmit({ ...data, id: res.data }, close);
        // dispatch({
        //   type: "markerModel/getContentTabs",
        //   payload: { id: data.id || res.data }
        // });
      } else message.error(res.message);
    });
  };
  render() {
    const { data, activeKey, warn } = this.state;
    const { panels, dispatch } = this.props;
    return (
      <VrpModal
        className={""}
        defaultPosition={{ x: 30, y: 95 }}
        title={"信息栏"}
        style={{ width: 514 }}
        // height={629}
        footer={
          <div className={css["text-center"]}>
            <Button type="primary" onClick={e => this.onSubmit()}>
              保存
            </Button>
            <Button className={css["m-l-md"]} onClick={this.props.closeModal}>
              取消
            </Button>
          </div>
        }
        fixed={true}
        // baseBoxStyle={{ top: top, left: this.props.clientWidth }}
        onClose={this.props.closeModal}
      >
        <div className={css["vrp-form"]}>
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>信息栏</label>
            <Input
              value={data.title}
              onChange={this.titleChange}
              placeholder={"请输入标签名"}
            />
          </div>

          <Collapse
            accordion
            expandIconPosition="right"
            defaultActiveKey={String(0)}
            activeKey={String(activeKey)}
            onChange={(key: string) => this.setState({ activeKey: key })}
            style={{
              maxHeight: "375px",
              marginBottom: "12px",
              width: "100%",
              border: "1px solid #F0F0F0"
            }}
          >
            {panels.map((panel, i) => (
              <Collapse.Panel
                header={panel.name || " "}
                key={i}
                className={
                  scss["outer-frame"] +
                  " " +
                  (!panel.id && warn ? scss["warn"] : "")
                }
                onClick={e => this.setState({ activeKey: i })}
                extra={
                  <>
                    <Icon
                      type="save"
                      theme="twoTone"
                      className={scss["btn-icon"]}
                      onClick={e => {
                        data.id
                          ? panel.type == ""
                            ? warnHandler(this, "未选择类别😅~")
                            : dispatch({
                                type: "markerModel/saveContentTab",
                                payload: { i }
                              })
                          : this.onSubmit(false);
                        e.stopPropagation();
                      }}
                      title={"保存"}
                    />
                    {i === panels.length - 1 ? (
                      <Icon
                        type="plus-square"
                        theme="twoTone"
                        twoToneColor="#1890FF"
                        className={scss["btn-icon"]}
                        onClick={e => {
                          if (
                            !panels.filter(e => e.id !== null).every(e => e.id)
                          )
                            warnHandler(this);
                          else {
                            dispatch({ type: "markerModel/addPanel" });
                            this.setState({
                              activeKey: String(panels.length - 1)
                            });
                          }
                          e.stopPropagation();
                        }}
                        title={"添加"}
                      />
                    ) : null}

                    <Popconfirm
                      title="确认是否删除?"
                      onConfirm={(e: any) => {
                        dispatch({
                          type: "markerModel/delContentTab",
                          payload: { i, type: panel.type }
                        });
                        e.stopPropagation();
                      }}
                      onCancel={(e: any) => e.stopPropagation()}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Icon
                        type="minus-square"
                        theme="twoTone"
                        twoToneColor="#D9D9D9"
                        className={scss["btn-icon"]}
                        title={"删除"}
                        onClick={e => e.stopPropagation()}
                      />
                    </Popconfirm>
                  </>
                }
              >
                <PanelBase
                  i={i}
                  name={panel.name}
                  type={panel.type}
                  deleteType={"markerModel/delContentTab"}
                  onKeyDown={this.handleOnKeyDown}
                  submit={this.onSubmit}
                  closeModal={this.props.closeModal}
                />
              </Collapse.Panel>
            ))}
          </Collapse>

          <div
            className={css["flex-center-between"]}
            style={{
              padding: "8px 0",
              border: "1px solid #f0f0f0",
              borderWidth: "1px 0"
            }}
          >
            <label className={css["flex-none-label"]}>出现在分享界面</label>
            <Switch
              checkedChildren="开"
              unCheckedChildren="关"
              checked={data.whethshare}
              onChange={this.whethshareChange}
            />
          </div>
          <div
            className={css["flex-center-between"]}
            style={{
              padding: "8px 0",
              borderBottom: "1px solid #f0f0f0"
              // borderWidth: "1px 0"
            }}
          >
            <label className={css["flex-none-label"]}>多页型显示</label>
            <Switch
              checkedChildren="开"
              unCheckedChildren="关"
              checked={data.multipage}
              onChange={this.multipageChange}
            />
          </div>
        </div>
      </VrpModal>
    );
  }
}
