import { Component } from "react";
import { Button, Slider, InputNumber, Switch } from "antd";
import VrpModal from "../../components/VrpModal";
import CustomFun from "../../config/CustomFun";
import Tools from "../../components/tools/Tools";

const css = require("../../styles/custom.css");

interface SunModalProps {
  sun: any;
  closeModal: () => void;
  pptShow?: boolean;
}

interface SunModalStates {
  year: number;
  months: number;
  date: number;
  minutes: number;
  hours: number;
  shadow: number;
  isNight: boolean;
}

class SunModal extends Component<SunModalProps, SunModalStates> {
  constructor(props: SunModalProps) {
    super(props);
    const now = new Date();
    this.state = {
      year: now.getFullYear(),
      months: now.getMonth() + 1,
      date: now.getDate(),
      hours: now.getHours(),
      minutes: now.getMinutes(),
      shadow: 0.5,
      isNight: false
    };
    this.sunChange();
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

  timeFormatter = value => {
    const { hours, minutes } = this.state;
    value = parseInt(value || 0);
    value = value > 1440 ? hours * 60 + minutes : value;
    const h = (Math.floor(value / 60) + "").padStart(2, "0");
    const m = (Math.floor(value % 60) + "").padStart(2, "0");
    return `${h}:${m}`;
  };

  timeChange = value => {
    const { hours, minutes } = this.state;
    value = parseInt(value) || 0;
    value = value > 1440 ? hours * 60 + minutes : value;
    this.setState(
      { hours: Math.floor(value / 60), minutes: value % 60 },
      this.sunChange
    );
  };

  monthsChange = value => {
    value = parseInt(value) || new Date().getMonth() + 1;
    this.setState({ months: value }, this.sunChange);
  };

  sunChange = () => {
    const { sun } = this.props;
    const { year, months, date, hours, minutes } = this.state;
    sun.setDateTime(year, months, date, hours, minutes, 0);
  };

  shadowChange = shadow => {
    this.setState({ shadow: parseFloat(shadow) });
    Tools.setShadowOpacity(parseFloat(shadow) || 0);
  };

  setNightMood = () => {
    const { year, months, date, hours, minutes } = this.state;
    let isNight = !this.state.isNight;
    let callback = isNight
      ? sun => sun.setDateTime(year, months, date, hours, minutes, 0)
      : undefined;
    this.setState({ isNight });
    Tools.setNight(isNight, callback);
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
        title="日照"
        style={{ width: 300 }}
        footer={btnGroup}
        fixed={this.props.pptShow}
        onClose={this.props.closeModal}
      >
        <div className={css["vrp-form"]}>
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>时间</label>
            <Slider
              className={css["flex-auto"]}
              min={0}
              max={1440}
              step={1}
              value={this.state.hours * 60 + this.state.minutes}
              onChange={this.timeChange}
              tipFormatter={this.timeFormatter}
            />
            <InputNumber
              min={0}
              max={1440}
              step={1}
              style={{ marginLeft: 16, width: 66 }}
              size="small"
              value={this.state.hours * 60 + this.state.minutes}
              onChange={this.timeChange}
              formatter={this.timeFormatter}
            />
          </div>
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>月份</label>
            <Slider
              className={css["flex-auto"]}
              min={1}
              max={12}
              step={1}
              value={this.state.months || 0}
              onChange={this.monthsChange}
            />
            <InputNumber
              min={1}
              max={12}
              step={1}
              style={{ marginLeft: 16, width: 66 }}
              size="small"
              value={this.state.months || 0}
              onChange={this.monthsChange}
              parser={parseInt}
            />
          </div>
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>阴影</label>
            <Slider
              className={css["flex-auto"]}
              min={0}
              max={1}
              step={0.1}
              value={this.state.shadow}
              onChange={this.shadowChange}
            />
            <InputNumber
              min={0}
              max={1}
              step={0.1}
              style={{ marginLeft: 16, width: 66 }}
              size="small"
              value={this.state.shadow}
              onChange={this.shadowChange}
            />
          </div>
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>夜晚模式</label>
            <Switch
              checked={this.state.isNight}
              style={{ marginLeft: "8px" }}
              checkedChildren="开"
              unCheckedChildren="关"
              onChange={this.setNightMood}
            />
          </div>
        </div>
      </VrpModal>
    );
  }
}

export default SunModal;
