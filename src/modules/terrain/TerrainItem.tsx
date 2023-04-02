import { Component } from "react";
import { Slider, Icon, Popconfirm, message } from "antd";
import { TerrainModel } from "../../models/PlanModel";
import VrpIcon from "../../components/VrpIcon";
import Config from "../../config/Config";
import TerrainService from "../../services/TerrainService";
import Terrain from "../../components/model/Terrain";

const css = require("../../styles/scss/terrainmodal.scss");

/**
 * @name TerrainItem
 * @author: bubble
 * @create: 2018/12/27
 * @description: 地块列表 单项
 */

interface TerrainItemProps {
  terrain: Terrain;
  delTerrain: (terrain: Terrain) => void;
}

interface TerrainItemStates {
  transparencyVisible: boolean;
  altitudeVisible: boolean;
  altitude: number;
  opacity: number;
  isShow: boolean;
}

class TerrainItem extends Component<TerrainItemProps, TerrainItemStates> {
  static formatter(value) {
    return `${value}%`;
  }

  constructor(props: TerrainItemProps) {
    super(props);
    this.state = {
      transparencyVisible: false,
      altitudeVisible: false,
      altitude: 0,
      opacity: 100,
      isShow: true
    };
  }

  /**
   * @description 显示隐藏透明度输入条
   */
  showTransparency = () => {
    this.setState({ transparencyVisible: !this.state.transparencyVisible });
  };

  /**
   * @description 显示隐藏海拔输入条
   */
  showAltitude = () => {
    this.setState({ altitudeVisible: !this.state.altitudeVisible });
  };

  /**
   * @description 修改透明度
   */
  opacityChange = value => {
    this.setState({ opacity: value });
    const { terrain } = this.props;
    terrain.setOpacity(value / 100);
  };

  /**
   * @description 修改海拔高度
   */
  altitudeChange = value => {
    this.setState({ altitude: value });
    const { terrain } = this.props;
    if (terrain != null) {
      terrain.setAltitude(Number(value));
    }
  };

  toggleTerrain = () => {
    const { terrain } = this.props;
    this.setState({ isShow: !this.state.isShow }, () => {
      terrain.setVisible(this.state.isShow);
    });
  };

  rightIcons = (terrain: Terrain) => {
    return (
      <div className={css["item-icons"]}>
        <VrpIcon
          iconName={"icon-clarity"}
          title={"透明度"}
          onClick={this.showTransparency}
        />
        <VrpIcon
          iconName={this.state.isShow ? "icon-visible" : "icon-invisible"}
          title={"可见"}
          onClick={this.toggleTerrain}
        />
        <VrpIcon
          iconName={"icon-altitude"}
          title={"海拔"}
          onClick={this.showAltitude}
        />
        <Popconfirm
          title={"确定要删除吗？"}
          okText={"确定"}
          cancelText={"取消"}
          onConfirm={() => this.props.delTerrain(terrain)}
        >
          <VrpIcon iconName={"icon-delete"} title={"删除"} />
        </Popconfirm>
      </div>
    );
  };

  /**
   * @description 保存海拔设置
   */
  saveAltitude = () => {
    const { terrain } = this.props;
    TerrainService.setTerrainAltitude(
      {
        planId: Config.PLANID,
        terrainId: terrain.id,
        altitude: this.state.altitude
      },
      (flag, res) => {
        if (flag) {
          terrain.altitude = this.state.altitude;
          message.success("保存成功");
        } else {
          message.error("保存失败");
        }
      }
    );
  };
  /**
   * @description 保存透明度设置
   */
  saveOpacity = () => {
    const { terrain } = this.props;
    TerrainService.setTerrainOpacity(
      {
        planId: Config.PLANID,
        terrainId: terrain.id,
        opacity: this.state.opacity / 100
      },
      (flag, res) => {
        if (flag) {
          terrain.opacity = this.state.opacity / 100;
          message.success("保存成功");
        } else {
          message.error("保存失败");
        }
      }
    );
  };

  componentWillMount() {
    const { terrain } = this.props;
    this.setState({
      altitude: terrain.altitude,
      isShow: terrain.isVisible(),
      opacity: terrain.opacity * 100
    });
  }

  render() {
    const { terrain } = this.props;
    return (
      <li className={css["vrp-terrain-item"]}>
        <div className={css["flex-center-between"]}>
          <div
            className={css["item-title"]}
            onClick={() => {
              terrain.focus();
            }}
          >
            {terrain.title}
          </div>
          {this.rightIcons(terrain)}
        </div>
        {this.state.transparencyVisible ? (
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none"]}>透明度：</label>
            <Slider
              className={css["flex-auto"]}
              onChange={this.opacityChange}
              value={this.state.opacity}
              tipFormatter={TerrainItem.formatter}
            />
            <Icon
              type="save"
              style={{ marginLeft: "6px", cursor: "pointer" }}
              title={"保存"}
              onClick={this.saveOpacity}
            />
          </div>
        ) : null}
        {this.state.altitudeVisible ? (
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none"]}>海拔：</label>
            <Slider
              className={css["flex-auto"]}
              onChange={this.altitudeChange}
              value={this.state.altitude}
              min={-2000}
              max={2000}
            />
            <Icon
              type="save"
              style={{ marginLeft: "6px", cursor: "pointer" }}
              title={"保存"}
              onClick={this.saveAltitude}
            />
          </div>
        ) : null}
      </li>
    );
  }
}

export default TerrainItem;
