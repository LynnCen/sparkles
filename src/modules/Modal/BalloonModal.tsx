import { Component } from "react";
import { Button, Slider, InputNumber } from "antd";
import VrpModal from "../../components/VrpModal";
import CustomFun from "../../config/CustomFun";
import Config from "../../config/Config";
const css = require("../../styles/custom.css");

interface BalloonModalProps {
  closeModal: () => void;
  pptShow?: boolean;
}

interface BalloonModalStates {
  moveSpeed: number;
  pitchSpeed: number;
  yawSpeed: number;
  altitude: number;
  position: any;
}

export default class BalloonModal extends Component<
  BalloonModalProps,
  BalloonModalStates
> {
  constructor(props: BalloonModalProps) {
    super(props);
    this.state = {
      moveSpeed: Config.moveSpeed,
      pitchSpeed: Config.pitchSpeed,
      yawSpeed: Config.yawSpeed,
      altitude: 0,
      position: Config.maps.getCamera().getGeoLocation()
    };
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = e => {
    CustomFun.onKeyDown(e, 27, this.props.closeModal);
  };

  blur = () => {
    this.refs["altitude"].blur();
    this.refs["moveSpeed"].blur();
    this.refs["pitchSpeed"].blur();
    this.refs["yawSpeed"].blur();
  };

  altitudeChange = value => {
    this.setState({ altitude: value });
    const cam = Config.maps.getCamera();
    cam.setPosition(this.state.position.add(0, 0, value));
  };
  set = (prop, value) => {
    this.setState({ [prop]: value });
    Config[prop] = value;
  };

  render() {
    const btnGroup = (
      <div className={css["text-center"]}>
        <Button onClick={this.props.closeModal}>关闭</Button>
      </div>
    );
    return (
      <VrpModal
        defaultPosition={{ x: 30, y: 95 }}
        title={"热气球设置"}
        style={{ width: 300 }}
        footer={btnGroup}
        fixed={this.props.pptShow}
        onClose={this.props.closeModal}
      >
        <div className={css["vrp-form"]}>
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>抬升高度</label>
            <Slider
              className={css["flex-auto"]}
              min={-500}
              max={500}
              value={this.state.altitude}
              onChange={this.altitudeChange}
              ref={"altitude"}
              onAfterChange={this.blur}
            />
            <InputNumber
              min={-500}
              max={500}
              style={{ marginLeft: 16, width: 60 }}
              size="small"
              value={this.state.altitude}
              onChange={this.altitudeChange}
            />
          </div>
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>移动速度</label>
            <Slider
              className={css["flex-auto"]}
              min={0.01}
              max={2}
              step={0.01}
              value={this.state.moveSpeed}
              onChange={val => this.set("moveSpeed", val)}
              ref={"moveSpeed"}
              onAfterChange={this.blur}
            />
            <InputNumber
              min={0.01}
              max={2}
              step={0.01}
              style={{ marginLeft: 16, width: 60 }}
              size="small"
              formatter={val => Number(val).toFixed(2)}
              value={this.state.moveSpeed}
              onChange={val => this.set("moveSpeed", val)}
            />
          </div>
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>抬升速度</label>
            <Slider
              className={css["flex-auto"]}
              min={1}
              max={100}
              value={this.state.pitchSpeed}
              onChange={val => this.set("pitchSpeed", val)}
              ref={"pitchSpeed"}
              onAfterChange={this.blur}
            />
            <InputNumber
              style={{ marginLeft: 16, width: 60 }}
              size="small"
              min={1}
              max={100}
              value={this.state.pitchSpeed}
              onChange={val => this.set("pitchSpeed", val)}
            />
          </div>
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>旋转速度</label>
            <Slider
              className={css["flex-auto"]}
              min={1}
              max={100}
              value={this.state.yawSpeed}
              onChange={val => this.set("yawSpeed", val)}
              ref={"yawSpeed"}
              onAfterChange={this.blur}
            />
            <InputNumber
              min={1}
              max={100}
              style={{ marginLeft: 16, width: 60 }}
              size="small"
              value={this.state.yawSpeed}
              onChange={val => this.set("yawSpeed", val)}
            />
          </div>
        </div>
      </VrpModal>
    );
  }
}
