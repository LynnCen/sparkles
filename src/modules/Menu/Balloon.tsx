import { Component } from "react";
import { notification } from "antd";
import Config from "../../config/Config";
import VrpIcon from "../../components/VrpIcon";
import VrpTips from "../../components/VrpTips";
import BallonModal from "../Modal/BalloonModal";
import DrawInit from "../../components/tools/DrawInit";

const css = require("../../styles/custom.css");

export const balloonTip = (
  <div>
    {/* <p className={css["m-b-sm"]}>1、点击左键可飞到对应位置看周边</p> */}
    <p className={css["m-b-sm"]}>
      1、按住W、S、A、D、Q、E、↑、↓、←、→ 任意键，看看地图有什么变化🎈
    </p>
    <p className={css["m-b-sm"]}>2、按住+(-)键，可以增大（减小）移动速度🚀</p>
    <p className={css["m-b-sm"]}>3、焦点离开地图后记得回来点一下😀</p>
    {/* <p className={css["m-b-sm"]}>3、退出热气球（ESC）</p> */}
  </div>
);

/**
 * @name Balloon
 * @author: ltt
 * @create: 2018/12/27
 * @description: 热气球 -- design by ltt
 */

interface BalloonProps {
  pptShow?: boolean;
}

interface BalloonStates {
  openBalloon: boolean;
}
class Balloon extends Component<BalloonProps, BalloonStates> {
  constructor(props: BalloonProps) {
    super(props);
    this.state = {
      openBalloon: false
    };
  }

  showTips = () => {
    if (this.state.openBalloon) {
      notification.destroy();
    } else {
      VrpTips.showTips("热气球模式", balloonTip, 395);
    }
  };

  Balloon = () => {
    this.showTips();
    const { maps } = Config;
    DrawInit.DrawInit();
    const cam = maps.getCamera();
    this.setState(
      {
        openBalloon: !this.state.openBalloon
      },
      () => {
        cam.setBoundaryRestriction(!this.state.openBalloon);
      }
    );
  };

  closeModal = () => {
    this.setState(
      {
        openBalloon: false
      },
      () => {
        const { maps } = Config;
        const cam = maps.getCamera();
        cam.setBoundaryRestriction(true);
        maps.unbindEvent("click");
        notification.destroy();
      }
    );
  };

  render() {
    const { openBalloon } = this.state;

    return (
      <div>
        <VrpIcon
          className={css["vrp-menu-icon"]}
          iconName={openBalloon ? "icon-mouse" : "icon-fire-balloon"}
          title={"切换到" + (openBalloon ? "鼠标" : "热气球") + "模式"}
          onClick={this.Balloon}
        />

        {openBalloon ? (
          <BallonModal
            closeModal={this.closeModal}
            pptShow={this.props.pptShow}
          />
        ) : null}
      </div>
    );
  }
}

export default Balloon;
