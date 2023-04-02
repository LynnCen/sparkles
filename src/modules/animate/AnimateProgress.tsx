import { Component, Fragment } from "react";
import { Slider, InputNumber } from "antd";

const css = require("../../styles/scss/animate.scss");
interface AnimateProgressProps {
  animation: any;
  isActive: any;
}

interface AnimateProgressState {
  title: string;
  seconds: number;
  minutes: number;
  sumTime: number;
}
function formatter(value) {
  const minutes =
    Math.floor(value / 60) < 10
      ? "0" + Math.floor(value / 60)
      : Math.floor(value / 60);
  const seconds =
    Math.floor(value % 60) < 10
      ? "0" + Math.floor(value % 60)
      : Math.floor(value % 60);
  return `${minutes}:${seconds} `;
}

class AnimateProgress extends Component<
  AnimateProgressProps,
  AnimateProgressState
> {
  constructor(props: AnimateProgressProps) {
    super(props);
    this.state = {
      title: "轨迹",
      seconds: 0,
      minutes: 0,
      sumTime: 0
    };
  }
  componentWillMount() {
    this.setData();
  }
  componentWillUpdate() {
    this.checkActive();
  }
  setData() {
    const { animation } = this.props;

    let sumTime = animation.calTime();
    let minutes = sumTime / 60;
    let seconds = sumTime % 60;
    console.log();

    this.setState({
      title: animation.title,

      sumTime
    });
  }

  checkActive = () => {
    const { isActive } = this.props;
    if (isActive === "Splay") {
    }
    console.log(isActive);
  };

  timeChange = value => {
    this.setState({
      minutes: Math.floor(value / 60),
      seconds: value % 60
    });
  };
  render() {
    return (
      <div className={css["vrp-animate-progress"]}>
        <Slider
          className={css["progress-slider"]}
          min={0}
          max={this.state.sumTime}
          step={5}
          value={this.state.minutes * 60 + this.state.seconds}
          //  onChange={this.timeChange}
          tipFormatter={formatter}
        />
        <InputNumber
          min={0}
          max={this.props.isActive}
          step={5}
          style={{ marginLeft: 16, width: 60, marginTop: 30 }}
          size="small"
          value={this.state.minutes * 60 + this.state.seconds}
          // onChange={this.timeChange}
          formatter={formatter}
          // parser={replace}
        />
      </div>
    );
  }
}

export default AnimateProgress;
