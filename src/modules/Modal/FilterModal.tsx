import { Component } from "react";
import VrpModal from "../../components/VrpModal";
import ColorPicker from "../../components/ColorPicker";
import { Button, Slider } from "antd";
import Config from "../../config/Config";
import TerrainService from "../../services/TerrainService";

const css = require("../../styles/custom.css");

/**
 * @name FilterModal
 * @create: 2019/2/25
 * @description: 滤镜属性窗
 */

interface FilterModalProps {
  closeModal: () => void;
}

interface FilterModalStates {
  minColor: string;
  maxColor: string;
  minHeight: number;
  maxHeight: number;
}

class FilterModal extends Component<FilterModalProps, FilterModalStates> {
  constructor(props: FilterModalProps) {
    super(props);
    this.state = {
      minColor: "#010727",
      maxColor: "#00ffff",
      minHeight: 10,
      maxHeight: 15
    };
  }

  minColorChange = value => {
    this.setState({ minColor: value }, () => {
      this.FilterChange();
    });
  };

  maxColorChange = value => {
    this.setState({ maxColor: value }, () => {
      this.FilterChange();
    });
  };

  HeightChange = value => {
    this.setState({ minHeight: value[0], maxHeight: value[1] }, () => {
      this.FilterChange();
    });
  };

  componentWillMount() {
    const { maps } = Config;
    const list = maps.getLayerList();
    let min = 0;
    let max = 0;
    list.map((item, index) => {
      if (item.includes("terrain") > 0) {
        const terrain = maps.getLayerById(item);
        const url = terrain.getUrl();
        TerrainService.getData(url + "/layer_settings.json", (flag, res) => {
          if (flag) {
            const { center, halfLengths } = res.innerBounds;
            min =
              min > center[2] - halfLengths[2] + terrain.altitude
                ? center[2] - halfLengths[2] + terrain.altitude
                : min;
            max =
              max > center[2] + halfLengths[2] + terrain.altitude
                ? max
                : center[2] + halfLengths[2] + terrain.altitude;
            if (index === list.length - 1) {
              this.setState({ minHeight: min, maxHeight: max });
            }
          }
        });
      }
    });
    this.FilterChange();
  }

  componentWillUnmount() {
    this.removeStyle();
  }

  FilterChange = () => {
    const { maps, vrPlanner } = Config;
    const list = maps.getLayerList();
    const elevStyle = new vrPlanner.Style.ElevationStyle();
    const { minHeight, maxHeight } = this.state;
    const minColor = new vrPlanner.Color(this.state.minColor);
    const maxColor = new vrPlanner.Color(this.state.maxColor);
    const colRamp = new vrPlanner.LinearColorRamp(minColor, maxColor);
    elevStyle.setColorRamp(colRamp);
    elevStyle.setMin(minHeight); // minHeight海拔以下使用minColor
    elevStyle.setMax(maxHeight); // maxHeight海拔以上使用maxColor
    elevStyle.setInterpolationFunction(
      vrPlanner.Interpolation.CubicBezier.EASE_IN
    );
    list.map(item => {
      if (item.includes("terrain") > 0) {
        const terrain = maps.getLayerById(item);
        terrain.setStyle(elevStyle);
      }
    });
  };

  removeStyle = () => {
    const { maps, vrPlanner } = Config;
    const list = maps.getLayerList();
    list.map(item => {
      if (item.includes("terrain") > 0) {
        const style = new vrPlanner.Style.Style();
        maps.getLayerById(item).setStyle(style);
      }
    });
  };

  componentDidCatch(error, info) {
  }

  render() {
    const btnGroup = (
      <div className={css["text-center"]}>
        <Button type="primary" onClick={this.FilterChange}>
          确定
        </Button>
        <Button className={css["m-l-md"]} onClick={this.removeStyle}>
          重置
        </Button>
      </div>
    );
    return (
      <VrpModal
        defaultPosition={{ x: 30, y: 95 }}
        title={"滤镜参数设置"}
        style={{ width: 330 }}
        footer={btnGroup}
        onClose={this.props.closeModal}
      >
        <div className={css["vrp-form"]}>
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>底层颜色</label>
            <ColorPicker
              currentColor={this.state.minColor}
              colorChange={this.minColorChange}
            />
          </div>
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>高层颜色</label>
            <ColorPicker
              currentColor={this.state.maxColor}
              colorChange={this.maxColorChange}
            />
          </div>
          <div className={css["flex-center-left"]}>
            <label className={css["flex-none-label"]}>渐变层海拔区间</label>
            <Slider
              className={css["flex-auto"]}
              min={-50}
              max={200}
              range
              value={[this.state.minHeight, this.state.maxHeight]}
              onChange={this.HeightChange}
            />
          </div>
        </div>
      </VrpModal>
    );
  }
}

export default FilterModal;
