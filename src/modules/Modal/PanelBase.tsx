import { Component, lazy, Suspense } from "react";
import { Input, Select, message, Spin } from "antd";
import { connect } from "dva";
import ImgSelector from "../../components/selector/ImgSelector";
import IconSelector from "../../components/selector/IconSelector";
import { ControlType } from "braft-editor";
import "braft-editor/dist/index.css";
import { Panel } from "../../stores/markerModel";
import { Dispatch } from "redux";
import PanelCard from "./PanelCard";
import CustomFun from "../../config/CustomFun";
import Config from "../../config/Config";
import { config } from "../../stores/markerModel";
import DataService from "../../services/DataService";
const { Option } = Select;

const css = require("../../styles/custom.css");
const newCss = require("../../styles/new.css");
const scss = require("../../styles/scss/markerModal.scss");

const control: ControlType[] = [
  // "undo",
  // "redo",
  // "font-size",
  // "line-height",
  // "letter-spacing",
  // "text-color"
  "undo",
  "redo",
  "separator",
  "font-size",
  "line-height",
  "letter-spacing",
  "text-color",
  "bold",
  "italic",
  "underline",
  "strike-through",
  // "superscript",
  // "subscript",
  "remove-styles",
  "clear",
  "separator",
  "text-indent",
  "text-align",
  "headings",
  "list-ul",
  "list-ol",
  "blockquote",
  // "code",
  "separator",
  "link",
  "emoji",
  // "hr",
  "media"
];
const BraftEditor = lazy(() => import(/* webpackChunkName: "braft-editor" */ "braft-editor"));

interface PanelBaseProps {
  i: number;
  name: string;
  type: string;
  panel: Panel;
  dispatch: Dispatch<Object>;
  onKeyDown: (e) => void;
  submit: (close?: boolean) => void;
  closeModal: () => void;
  deleteType: string;
  append?: boolean;
}
interface PanelBaseStates {
  editorState: any;
  showColorPicker: boolean;
  color: string;
}

@connect(({ markerModel }, ownProps) => ({
  panel: markerModel.panels[ownProps.i]
}))
export default class PanelBase extends Component<PanelBaseProps, PanelBaseStates> {
  constructor(props) {
    super(props);
    this.state = {
      editorState: null,
      showColorPicker: false,
      color: ""
    };
  }
  async componentDidMount() {
    const { panel } = this.props;
    const BraftEditor = await this.BraftEditor;
    this.setState({
      editorState: BraftEditor.createEditorState(panel.type == "text" ? panel.str : null)
    });
  }
  async componentWillReceiveProps(nextProps) {
    const prev = this.props.panel;
    const next = nextProps.panel;
    if (
      (prev.planDataId && prev.planDataId != next.planDataId) ||
      (prev.id && prev.id != next.id) ||
      prev.type != next.type
    ) {
      if (prev.str != next.str) {
        console.log(next.str);
        const BraftEditor = await this.BraftEditor;
        this.setState({
          editorState: BraftEditor.createEditorState(next.type == "text" ? next.str : null)
        });
      }
    }
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.props.onKeyDown);
  }

  get BraftEditor() {
    return import(/* webpackChunkName: "braft-editor" */ "braft-editor")
      .then(r => r.default)
      .catch(message.error);
  }

  setPanelType = (i, value) => {
    this.props.dispatch({
      type: "markerModel/setPanelType",
      payload: { i, value }
    });
  };

  handleClose = () => {
    this.setState({ showColorPicker: false });
  };

  // handleChange = color => {
  // this.setState({ color: color.hex, showColor: color.rgb });
  // this.props.colorChange(color.hex);
  // };

  imgSelect = (i, prop, url: string | Array<string>) => {
    this.props.dispatch({
      type: "markerModel/setPanelProp",
      payload: { i, [prop]: Array.isArray(url) ? url.toString() : url }
    });
  };
  uploadFn = param => {
    if (/image|video/.test(param.file.type)) {
      const fd = new FormData();
      fd.append("type", "plan");
      fd.append("file", param.file);
      DataService.upload(fd, "/Open/UploadImg", (flag: boolean, res) => {
        flag
          ? param.success({ url: Config.apiHost + res.data })
          : param.error({ msg: res.message });
      });
    }
  };
  handleEditorChange = (i: number, editorState) => {
    this.setState({ editorState });
    this.props.dispatch({
      type: "markerModel/setPanelProp",
      payload: { i, str: editorState.toHTML() }
    });
  };

  handleEditorFocus = () => {
    console.log("focus");
    window.removeEventListener("keydown", this.props.onKeyDown);
  };
  handleEditorBlur = () => {
    console.log("blur");
    window.addEventListener("keydown", this.props.onKeyDown);
  };

  render() {
    const { i, panel, dispatch } = this.props;
    const { editorState } = this.state;
    const panelTypes = config.panelTypes;
    return (
      <>
        <div className={css["flex-center-left"]} style={{ margin: "0 0 6px" }}>
          <label className={css["flex-none-label"]}>类别</label>
          <Select
            defaultValue={panel.type || "请选择类别"}
            value={panel.type || "请选择类别"}
            className={`${css["m-r-md"]} ${scss["placeholder"]}`}
            style={{ width: 120 }}
            onChange={val => this.setPanelType(i, val)}
          >
            {Object.keys(panelTypes).map((key, i) => (
              <Option value={key} key={i}>
                {panelTypes[key].name}
              </Option>
            ))}
          </Select>
          <label className={css["flex-none-label"]}>名称</label>
          <Input
            // style={{ width: "226px" }}
            value={panel.name}
            placeholder={panel.name || "请命名"}
            onChange={e => {
              dispatch({
                type: "markerModel/setPanelProp",
                payload: { i, name: e.target.value }
              });
            }}
          />
        </div>
        <div className={css["flex-center-left"]} style={{ margin: "0 0 6px" }}>
          <label className={css["flex-none-label"]}>图标</label>

          <IconSelector
            onSelect={url => this.imgSelect(i, "icon", url)}
            classType={"1"}
            value={panel.icon || "请选择图标"}
            width={"82.5%"}
          />
          <div
            className={`${scss["select-icon"]} ${css["m-l-sm"]}`}
            style={{
              backgroundImage: `${panel.icon ? `url(${Config.apiHost + panel.icon})` : "none"}`,
              backgroundColor: `${panel.icon ? "none" : "#f0f2f5"}`
            }}
          />
        </div>

        {(() => {
          switch (panel.type) {
            case "monitorData":
              return (
                <div className={scss["card-wrapper"]}>
                  {panel.items!!.map((item, index) => (
                    <PanelCard
                      i={i}
                      index={index}
                      key={item.id ? item.id : Math.random()}
                      deleteType={this.props.deleteType}
                    />
                  ))}
                </div>
              );
            case "photo":
              return (
                <>
                  <div className={css["flex-center-left"]} style={{ marginBottom: "8px" }}>
                    <label className={css["flex-none-label"]}>
                      {panelTypes[panel.type].item.name}
                    </label>
                    <ImgSelector
                      onSelect={url => this.imgSelect(i, "str", url)}
                      // video={false}
                      value={panel.str || "请选择图片"}
                      width={"100%"}
                      multi={true}
                    />
                  </div>
                  <div className={css["flex-center-left"]} style={{ marginBottom: "4px" }}>
                    <label className={css["flex-none-label"]} style={{ color: "transparent" }}>
                      空的
                    </label>
                    <div className={scss["grid-3"]}>
                      {(panel.str || "").split(",").map((url, index) => (
                        <div
                          className={scss["background-center"]}
                          key={index}
                          style={{
                            // backgroundImage: `url(${require("../../assets/selectedPhoto.png")})`
                            backgroundImage: `url(${Config.apiHost + url})`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </>
              );
            case "text":
              return (
                <div className={css["flex-top-left"]}>
                  <label className={css["flex-none-label"]}>
                    {panelTypes[panel.type].item.name}
                  </label>
                  <Suspense fallback={<Spin />}>
                    <BraftEditor
                      controls={control}
                      className={css["flex-auto"]}
                      placeholder={"请输入文字内容"}
                      value={editorState}
                      onChange={val => this.handleEditorChange(i, val)}
                      onFocus={this.handleEditorFocus}
                      onBlur={this.handleEditorBlur}
                      media={{ uploadFn: this.uploadFn }}
                      // onSave={async () => {
                      //   dispatch({
                      //     type: "markerModel/setPanelProp",
                      //     payload: { i, str: editorState.toHTML() }
                      //   });
                      // }}
                      style={{ border: "1px solid #d1d1d1" }}
                      contentStyle={{
                        height: 150,
                        boxShadow: "inset 0 1px 3px rgba(0,0,0,.1)"
                      }}
                    />
                  </Suspense>
                </div>
              );
            case "monitor":
              return (
                <div className={css["flex-center-left"]}>
                  <label className={css["flex-none-label"]}>
                    {panelTypes[panel.type].item.name}
                  </label>
                  <Input
                    value={panel.str || ""}
                    placeholder={panel.str || "请输入监控url"}
                    onChange={e => {
                      dispatch({
                        type: "markerModel/setPanelProp",
                        payload: { i, str: e.target.value }
                      });
                    }}
                  />
                </div>
                // <div className={css["flex-center-left"]}>
                //   <label className={css["flex-none-label"]}>
                //     {panelTypes[type].item.name}
                //   </label>
                //   <ImgSelector
                //     onSelect={url => this.imgSelect(i, "str", url)}
                //     video={true}
                //     value={panel.str || "请选择视频"}
                //     width={"100%"}
                //   />
                // </div>
              );
            case "video":
              return (
                <>
                  <div className={css["flex-center-left"]}>
                    <label className={css["flex-none-label"]}>
                      {panelTypes[panel.type].item.name}
                    </label>
                    <ImgSelector
                      onSelect={(url, thumbnail) => {
                        this.imgSelect(i, "str", [url, thumbnail]);
                      }}
                      video={true}
                      value={panel.str ? panel.str!!.split(",")[0] : "请选择文件"}
                      width={"100%"}
                    />
                  </div>
                  <div className={css["flex-center-left"]} style={{ marginBottom: "4px" }}>
                    <label className={css["flex-none-label"]} style={{ color: "transparent" }}>
                      空的
                    </label>
                    <div
                      style={{
                        width: "100%",
                        height: `${panel.str ? "210px" : ""}`,
                        backgroundImage: `${
                          panel.str ? `url(${Config.apiHost + panel.str!!.split(",")[1]})` : "none"
                        }`
                      }}
                      className={scss["background-center"]}
                    >
                      {/* <img src={require("../../assets/selectedPhoto.png")} alt="" /> */}
                    </div>
                  </div>
                </>
              );
            case "externalLink":
              return (
                <div className={css["flex-center-left"]}>
                  <label className={css["flex-none-label"]}>
                    {panelTypes[panel.type].item.name}
                  </label>
                  <Input
                    // style={{ width: "226px" }}
                    value={panel.str || ""}
                    placeholder={panel.str || "请输入网址"}
                    onChange={e => {
                      dispatch({
                        type: "markerModel/setPanelProp",
                        payload: { i, str: e.target.value }
                      });
                    }}
                  />
                </div>
              );
            default:
              return null;
          }
        })()}
      </>
    );
  }
}
