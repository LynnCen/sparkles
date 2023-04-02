import { Component } from "react";
import VrpIcon from "../../components/VrpIcon";
import Config from "../../config/Config";
import SunModal from "../Modal/SunModal";
import Trans from "../../components/tools/Coordinate";
import DrawInit from "../../components/tools/DrawInit";
import VrpTips from "../../components/VrpTips";
import CustomFun from "../../config/CustomFun";
import { notification } from "antd";
import Tools from "../../components/tools/Tools";
const { maps, vrPlanner } = Config;

const css = require("../../styles/custom.css");

/**
 * @name Sunshine
 * @author: bubble
 * @create: 2018/12/6
 * @description: 日照
 */

interface ISunshineProps {
  pptShow?: boolean;
}

interface ISunshineStates {
  isSun: boolean;
  sun: any;
}

class Sunshine extends Component<ISunshineProps, ISunshineStates> {
  constructor(props: ISunshineProps) {
    super(props);
    this.state = {
      isSun: false,
      sun: {}
    };
  }

  closeSunModal = () => {
    Tools.setPipeline();
    this.setState({ isSun: false });
    notification.destroy();
    window.removeEventListener("keydown", this.handleEvent);
  };

  showSun = () => {
    DrawInit.DrawInit();
    this.setState({ isSun: true, sun: Tools.getSun() });
    Tools.setPipeline({
      type: "DeferredPipeline",
      quality: vrPlanner.Pipeline.QUALITY_HIGH
    });
    Tools.setNight(false);
    window.addEventListener("keydown", this.handleEvent);
  };

  handleEvent = e => {
    CustomFun.onKeyDown(e, 27, () => {
      this.closeSunModal();
    });
  };

  toggle = () => {
    if (this.state.isSun) {
      this.closeSunModal();
    } else {
      VrpTips.showTips(
        "日照",
        <div>
          <p className={css["m-b-sm"]}>调整时间、月份查看日照情况</p>
          <p className={css["m-b-sm"]}>退出日照（ESC）</p>
        </div>,
        280
      );
      this.showSun();
    }
  };

  render() {
    return (
      <div>
        <VrpIcon
          iconName={"icon-sunlight"}
          className={
            css["vrp-menu-icon"] + " " + (this.state.isSun ? css["active"] : "")
          }
          title={"日照"}
          onClick={this.toggle}
        />
        {this.state.isSun ? (
          <SunModal
            sun={this.state.sun}
            closeModal={this.closeSunModal}
            pptShow={this.props.pptShow}
          />
        ) : null}
      </div>
    );
  }
}

export default Sunshine;
