import { Component } from "react";
import LineModal from "../Modal/LineModal";
import BlockModal from "../Modal/BlockModal";
import VrpIcon from "../../components/VrpIcon";
import Config from "../../config/Config";
import DrawInit from "../../components/tools/DrawInit";
import CustomFun from "../../config/CustomFun";
import { notification } from "antd";
import VrpTips from "../../components/VrpTips";
import Tools from "../../components/tools/Tools";
import PipeLine from "../../components/model/PipeLine";
import Geometry from "../../components/model/Geometry";
const { maps } = Config;
const css = require("../../styles/custom.css");

/**
 * @name Draw
 * @author: bubble
 * @create: 2018/12/6
 * @description: 绘制
 */

interface IDrawProps {
  isSave: boolean;
}

interface IDrawStates {
  line: PipeLine;
  lineVisible: boolean;
  geometry: Geometry;
  blockVisible: boolean;
}

class Draw extends Component<IDrawProps, IDrawStates> {
  public static openLineLayer: (feature) => void;
  public static openBlockLayer: (geometry) => void;
  public static closeLineLayer: () => void;
  public static closeBlockLayer: () => void;

  constructor(props: IDrawProps) {
    super(props);
    this.state = {
      line: new PipeLine({}),
      lineVisible: false,
      geometry: new Geometry({}),
      blockVisible: false
    };

    Draw.openLineLayer = this.openLineLayer;
    Draw.openBlockLayer = this.openBlockLayer;
    Draw.closeBlockLayer = () => {
      this.closeBlockModal();
    };
    Draw.closeLineLayer = () => {
      this.closeLineModal();
    };
  }

  closeLineModal = () => {
    this.setState({ lineVisible: false });
    const { line } = this.state;
    if (
      line.isNew &&
      maps.getLayerById("lineLayer").getFeatureById(line.line.getId())
    ) {
      line.quitEdit();
      line.remove();
      // maps.getLayerById("lineLayer").removeFeature(this.state.line);
    } else {
      line.init();
      maps.unbindEvent("click");
      maps.unbindEvent("mousemove");
    }
  };

  closeBlockModal = () => {
    this.setState({ blockVisible: false });
    const { geometry } = this.state;
    if (
      geometry.isNew &&
      maps.getLayerById("areaLayer").getFeatureById(geometry.getId())
    ) {
      geometry.remove();
      // maps.getLayerById("areaLayer").removeFeature(geometry);
    } else {
      geometry.init();
      maps.unbindEvent("click");
      maps.unbindEvent("mousemove");
      this.setState({ geometry });
    }
  };

  /**
   * @description 打开线属性窗口
   */
  openLineLayer = feature => {
    this.setState({ lineVisible: true, line: feature });
  };

  openBlockLayer = geometry => {
    this.setState({ blockVisible: true, geometry });
  };

  handleKeyDown = e => {
    CustomFun.onKeyDown(e, 27, () => {
      notification.destroy();
      this.closeLineModal();
      this.closeBlockModal();
      DrawInit.DrawInit();
      window.removeEventListener("keydown", this.handleKeyDown);
    });
  };

  DrawLine = () => {
    if (this.state.blockVisible) {
      this.closeBlockModal();
    }
    if (this.state.lineVisible) {
      this.closeLineModal();
    }
    VrpTips.showTips(
      "画线方法",
      <div>
        <p className={css["m-b-sm"]}>1、点击左键在地图中画线</p>
        <p className={css["m-b-sm"]}>2、点击右键完成本次画线</p>
        <p className={css["m-b-sm"]}>3、设置线条属性并保存</p>
        <p className={css["m-b-sm"]}>4、退出画线（ESC）</p>
      </div>,
      275
    );
    window.addEventListener("keydown", this.handleKeyDown);
    const { maps, vrPlanner } = Config;
    DrawInit.DrawInit();
    const lineLayer =
      maps.getLayerById("lineLayer") ||
      new vrPlanner.Layer.FeatureLayer("lineLayer");
    maps.addLayer(lineLayer);
    const pipeLine = new PipeLine({});
    pipeLine.isNew = true;
    lineLayer.addFeature(pipeLine.line);

    Tools.Draw(pipeLine, this.openLineLayer);
    this.setState({
      line: pipeLine
    });
  };

  DrawBlock = () => {
    if (this.state.blockVisible) {
      this.closeBlockModal();
    }
    if (this.state.lineVisible) {
      this.closeLineModal();
    }
    VrpTips.showTips(
      "画体块方法",
      <div>
        <p className={css["m-b-sm"]}>1、点击左键在地图中绘制体块</p>
        <p className={css["m-b-sm"]}>2、点击右键完成本次绘制</p>
        <p className={css["m-b-sm"]}>3、在弹窗中设置体块属性并保存</p>
        <p className={css["m-b-sm"]}>4、退出画体块（ESC）</p>
      </div>,
      305
    );
    window.addEventListener("keydown", this.handleKeyDown);
    const { maps, vrPlanner } = Config;
    DrawInit.DrawInit();
    const areaLayer =
      maps.getLayerById("areaLayer") ||
      new vrPlanner.Layer.FeatureLayer("areaLayer");
    maps.addLayer(areaLayer);
    const geometry = new Geometry({});
    geometry.isNew = true;
    areaLayer.addFeature(geometry.polygon);
    Tools.Draw(geometry, this.openBlockLayer);
    geometry.polygon.bindEvent("click", e => {
      e.isRightClick() && this.openBlockLayer(geometry);
    });
    this.setState({ geometry });
  };

  render() {
    return (
      <div>
        <div className={css["vrp-header-menu"]}>
          <VrpIcon
            className={css["vrp-menu-icon"]}
            iconName={"icon-pencil"}
            title="绘制"
          />
          <ul className={css["vrp-second-menu"]}>
            <li className={css["vrp-second-li"]} onClick={this.DrawLine}>
              <VrpIcon
                className={css["vrp-menu-icon"]}
                iconName={"icon-line4"}
                title={"画线"}
              />
            </li>
            <li className={css["vrp-second-li"]} onClick={this.DrawBlock}>
              <VrpIcon
                className={css["vrp-menu-icon"]}
                iconName={"icon-block"}
                title={"画体块"}
              />
            </li>
          </ul>
        </div>
        {this.state.lineVisible ? (
          <LineModal
            line={this.state.line}
            closeModal={this.closeLineModal}
            isSave={this.props.isSave}
          />
        ) : null}
        {this.state.blockVisible ? (
          <BlockModal
            geometry={this.state.geometry}
            closeModal={this.closeBlockModal}
            isSave={this.props.isSave}
          />
        ) : null}
      </div>
    );
  }
}

export default Draw;
