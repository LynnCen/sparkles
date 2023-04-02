import { Component } from "react";
import VrpIcon from "../../components/VrpIcon";
import DimensionTool from "../../components/tools/Dimension";
import VrpTips from "../../components/VrpTips";
import { notification } from "antd";
import CustomFun from "../../config/CustomFun";

const css = require("../../styles/custom.css");

/**
 * @name Dimension
 * @author: bubble
 * @create: 2018/12/20
 * @description: 2D、3D转换
 */

interface DimensionProps {}

interface DimensionStates {
  title: string;
  isToggleTo2D: boolean; // 是否点击切换到2D
}

class Dimension extends Component<DimensionProps, DimensionStates> {
  constructor(props: DimensionProps) {
    super(props);
    this.state = {
      title: "切换到2D",
      isToggleTo2D: false
    };
  }

  showTips = () => {
    if (this.state.isToggleTo2D) {
      VrpTips.showTips(
        "2D模式",
        <div>
          <p className={css["m-b-sm"]}>您已进入2D模式</p>
          <p className={css["m-b-sm"]}>退出2D（ESC）</p>
        </div>,
        230
      );
      window.addEventListener("keydown", this.handleKeyDown);
    } else {
      notification.destroy();
    }
  };

  toggle = () => {
    this.setState(
      {
        isToggleTo2D: !this.state.isToggleTo2D,
        title: this.state.isToggleTo2D ? "切换到3D" : "切换到2D"
      },
      () => {
        this.showTips();
        DimensionTool.Dimension(this.state.isToggleTo2D);
      }
    );
  };

  handleKeyDown = e => {
    CustomFun.onKeyDown(e, 27, () => {
      this.toggle();
      notification.destroy();
      window.removeEventListener("keydown", this.handleKeyDown);
    });
  };

  render() {
    return (
      <div>
        <VrpIcon
          iconName={`icon-${this.state.isToggleTo2D ? "3d" : "2d"}`}
          className={css["vrp-menu-icon"]}
          title={this.state.title}
          onClick={this.toggle}
        />
      </div>
    );
  }
}

export default Dimension;
