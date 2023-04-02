import { Component } from "react";
import { Button, Input, Switch, Radio, Slider, InputNumber } from "antd";
import VrpModal from "../../components/VrpModal";
import Config from "../../config/Config";
import Resource from "../Menu/Resource";
import CustomFun from "../../config/CustomFun";
import ColorPicker from "../../components/ColorPicker";
import PipeLine from "../../components/model/PipeLine";

const css = require("../../styles/custom.css");
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

/**
 * @name OpenLineModal
 * @description 线条属性框
 */
interface LineModalProps {
  isSave: boolean;
  line: PipeLine;
  closeModal: () => void;
}

interface LineModalStates {
  line: PipeLine;
  depthTest: boolean;
  title: string;
  color: string;
  height: number;
  width: number;
  isClose: boolean;
  lineStyle: string;
  planId: number;
  username: string;
  type: string;
  level: boolean;
  whethshare: boolean;
}

class LineModal extends Component<LineModalProps, LineModalStates> {
  constructor(props: LineModalProps) {
    super(props);
    this.state = {
      line: new PipeLine({}),
      depthTest: false,
      title: "线条",
      color: "#FFFFFF",
      width: 1,
      height: 0,
      isClose: false,
      level: false,
      lineStyle: "flat2d",
      planId: 0,
      username: "",
      type: "line",
      whethshare: false
    };
  }

  /**
   * @description 是否穿透
   * @param checked
   */
  depthTestChange = checked => {
    this.setState({ depthTest: checked }, () => {
      this.props.line.setDepthTest(checked);
    });
  };

  /**
   * @description 是否闭合
   * @param checked
   */
  openClose = checked => {
    this.setState({ isClose: checked }, () => {
      const { line } = this.props;
      line.setAttr(this.state.level, this.state.height, checked);
      line.line.isClose = checked;
    });
  };

  /**
   * @description 是否水平
   * @param checked: boolean
   */
  levelChange = checked => {
    this.setState({ level: checked });
    const { line } = this.props;
    line.setAttr(checked, this.state.height, this.state.isClose);
    line.line.level = checked;
  };

  /**
   * @description 抬升高度
   * @param value
   */
  heightChange = value => {
    this.setState({ height: value }, () => {
      const line = this.props.line;
      line.setAttr(this.state.level, value, this.state.isClose);
      line.line.altitude = value;
    });
  };

  /**
   * @description 设置线宽
   * @param value
   */
  widthChange = value => {
    this.setState({ width: value }, () => {
      this.props.line.setWidth(value);
    });
  };

  /**
   * @description 保存线属性
   */
  saveLine = () => {
    const { line } = this.props;
    line.save(this.state, this.props.isSave);
    Resource.ReloadList && Resource.ReloadList();
    this.props.closeModal();
  };

  /**
   * @description 更改模式
   * @param e
   */
  modelChange = e => {
    const value = e.target.value;
    this.setState({ lineStyle: value }, () => {
      this.props.line.setLineStyle(value);
    });
  };

  /**
   * @description 设置线标题
   * @param e
   */
  titleChange = e => {
    this.setState({ title: e.target.value });
  };

  colorChange = value => {
    this.setState({ color: value }, () => {
      this.props.line.setColor(value);
    });
  };

  whethshareChange = (value: boolean) => {
    this.setState({ whethshare: value });
  };

  setLineForm = (line: PipeLine) => {
    if (line) {
      this.setState(
        {
          line,
          depthTest: line.depthTest,
          title: line.title,
          color: line.color,
          height: line.altitude,
          width: line.width,
          isClose: line.isClose,
          lineStyle: line.lineStyle,
          planId: Config.PLANID,
          username: Config.USERNAME,
          type: line.type,
          level: line.level || false,
          whethshare: line.whethshare
        },
        () => {
          const { line, isClose, level, height } = this.state;
          line.edit();
          line.line.isClose = isClose;
          line.line.level = level;
          line.line.altitude = height;
        }
      );
    }
  };

  handleOnKeyDown = e => {
    CustomFun.onKeyDown(e, 13, this.saveLine);
    CustomFun.onKeyDown(e, 27, this.props.closeModal);
  };

  componentWillMount() {
    this.setLineForm(this.props.line);
    window.addEventListener("keydown", this.handleOnKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleOnKeyDown);
  }

  componentWillReceiveProps(nextProps) {
    this.state.line.init();
    this.setLineForm(nextProps.line);
  }

  living = () => {
    const { line } = this.props;
    line.living();
  };

  bezier = () => {
    const { line } = this.props;
    // line.bezier(2);
    line.catmullRom();
  };

  render() {
    const btnGroup = (
      <div className={css["text-center"]}>
        {/* <Button type="primary" onClick={this.living}>
          移动
        </Button> */}
        {/* <Button
          className={css["m-l-md"]}
          type="primary"
          onClick={this.bezier}
        >
          曲化
        </Button> */}
        <Button
          className={css["m-l-md"]}
          type="primary"
          onClick={this.saveLine}
        >
          保存
        </Button>
        <Button className={css["m-l-md"]} onClick={this.props.closeModal}>
          取消
        </Button>
      </div>
    );

    return (
      <VrpModal
        defaultPosition={{ x: 30, y: 95 }}
        title={this.state.title}
        style={{ width: 300 }}
        footer={btnGroup}
        fixed={true}
        onClose={this.props.closeModal}
      >
        <div className={css["vrp-form"]}>
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>线条名称</label>
            <Input value={this.state.title} onChange={this.titleChange} />
          </div>
          <div className={css["flex-center-between"]}>
            <div className={css["flex-center-left"]}>
              <label className={css["flex-none-label"]}>线条穿透</label>
              <Switch
                checkedChildren="开"
                unCheckedChildren="关"
                checked={this.state.depthTest}
                onChange={this.depthTestChange}
              />
            </div>
            <div className={css["flex-center-left"]}>
              <label className={css["flex-none-label"]}>线条闭合</label>
              <Switch
                checkedChildren="开"
                unCheckedChildren="关"
                checked={this.state.isClose}
                onChange={this.openClose}
              />
            </div>
          </div>
          <div className={css["flex-center-between"]}>
            <div className={css["flex-center-left"]}>
              <label className={css["flex-none-label"]}>线条水平</label>
              <Switch
                checkedChildren="开"
                unCheckedChildren="关"
                checked={this.state.level}
                onChange={this.levelChange}
                disabled={this.state.lineStyle === "default"}
              />
            </div>
            <div className={css["flex-center-left"]}>
              <label className={css["flex-none-label"]}>分享界面</label>
              <Switch
                checkedChildren="开"
                unCheckedChildren="关"
                checked={this.state.whethshare}
                onChange={this.whethshareChange}
              />
            </div>
          </div>
          {/* <div className={css["flex-center-between"]}>

          </div> */}
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>线条模式</label>
            <RadioGroup
              value={this.state.lineStyle}
              onChange={this.modelChange}
            >
              <RadioButton value="cylinder">管道</RadioButton>
              <RadioButton value="flat2d">平面</RadioButton>
              <RadioButton value="default">投影</RadioButton>
            </RadioGroup>
          </div>
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>线条宽度</label>
            <Slider
              className={css["flex-auto"]}
              min={1}
              max={50}
              value={
                typeof this.state.width === "number" ? this.state.width : 0
              }
              onChange={this.widthChange}
            />
            <InputNumber
              min={1}
              max={50}
              style={{ marginLeft: 16, width: 60 }}
              size="small"
              value={
                typeof this.state.width === "number" ? this.state.width : 0
              }
              onChange={this.widthChange}
            />
          </div>
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>抬升高度</label>
            <Slider
              className={css["flex-auto"]}
              min={-100}
              max={500}
              value={
                typeof this.state.height === "number" ? this.state.height : 0
              }
              onChange={this.heightChange}
              disabled={this.state.lineStyle === "default"}
            />
            <InputNumber
              min={-100}
              max={500}
              style={{ marginLeft: 16, width: 60 }}
              size="small"
              value={
                typeof this.state.height === "number" ? this.state.height : 0
              }
              onChange={this.heightChange}
              disabled={this.state.lineStyle === "default"}
            />
          </div>
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>线条颜色</label>
            <ColorPicker
              currentColor={this.state.color}
              colorChange={this.colorChange}
            />
          </div>
        </div>
      </VrpModal>
    );
  }
}

export default LineModal;
