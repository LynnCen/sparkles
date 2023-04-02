import { Component } from "react";
import VrpIcon from "../../components/VrpIcon";
import Config from "../../config/Config";
import Draw from "../../components/tools/DrawInit";
import PushModal from "../Modal/PushModal";
import CustomFun from "../../config/CustomFun";
import VrpTips from "../../components/VrpTips";
import { notification } from "antd";
import Tools from "../../components/tools/Tools";
import Push from "../../components/model/Push";

const css = require("../../styles/custom.css");

/**
 * @name Bulldoze
 * @author: bubble && ltt
 * @create: 2018/12/6
 * @description: 推平地形/塌陷 -- design by ltt
 */

interface IBulldozeProps { }

interface IBulldozeStates {
  push: Push;
  isPush: boolean;
  isPushVisible: boolean;
}

class Bulldoze extends Component<IBulldozeProps, IBulldozeStates> {
  public static openPushLayer: (push) => void;
  public static closePushLayer: () => void;

  constructor(props: IBulldozeProps) {
    super(props);
    this.state = {
      push: new Push({}),
      isPush: false,
      isPushVisible: false
    };
    Bulldoze.openPushLayer = this.OpenPushLayer;
    Bulldoze.closePushLayer = () => {
      this.closePushModal();
    };
  }

  OpenPushLayer = push => {
    this.setState({
      push
    });
    return this.openPushLayer();
  };

  closePushModal = () => {
    this.setState({
      isPushVisible: false
    })
    const { push } = this.state;
    const { maps } = Config;
    if (maps.getLayerById("polygonLayer")) {
      maps.removeLayer("polygonLayer");
    }
    if (
      push.isNew &&
      maps.getLayerById("pushLayer").getFeatureById(push.polygon.getId())
    ) {
      push.remove();
    } else {
      push.init();
      maps.unbindEvent("click");
      maps.unbindEvent("mousemove");
    }
    notification.destroy();
  };

  openPushLayer = () => {
    this.setState({
      isPushVisible: true
    });
  };

  handleKeyDown = e => {
    CustomFun.onKeyDown(e, 27, () => {
      notification.destroy();
      Draw.DrawInit();
      window.removeEventListener("keydown", this.handleKeyDown);
    });
  };

  showTips = () => {
    if (this.state.isPush) {
      notification.destroy();
    } else {
      VrpTips.showTips(
        "塌陷（推平地形）方法",
        <div>
          <p className={css["m-b-sm"]}>1、点击左键在地图中绘制区域</p>
          <p className={css["m-b-sm"]}>2、绘制3个点及以上时，点击右键完成</p>
          <p className={css["m-b-sm"]}>3、设置属性并保存</p>
          <p className={css["m-b-sm"]}>4、退出塌陷（ESC）</p>
        </div>,
        340
      );
    }
  };

  handleClick = () => {
    this.showTips();
    Draw.DrawInit();
    window.addEventListener("keydown", this.handleKeyDown);
    const { maps, vrPlanner } = Config;
    const layer =
      maps.getLayerById("pushLayer") ||
      new vrPlanner.Layer.FeatureLayer("pushLayer");
    // const feature = Push.PolygonInit(push);
    const push = new Push({ isNew: true });
    layer.addFeature(push.polygon);
    push.isNew = true;
    Tools.Draw(push, this.openPushLayer);
    // PushPolygon.Push(push, this.openPushLayer);
    maps.addLayer(layer);
    this.setState({
      push
    });
  };

  render() {
    return (
      <div>
        <VrpIcon
          iconName={"icon-bulldozer"}
          className={
            css["vrp-menu-icon"] +
            " " +
            (this.state.isPush ? css["active"] : "")
          }
          onClick={this.handleClick}
          title={"推平地形"}
        />
        {this.state.isPushVisible ? (
          <PushModal push={this.state.push} closeModal={this.closePushModal} />
        ) : null}
      </div>
    );
  }
}

export default Bulldoze;
