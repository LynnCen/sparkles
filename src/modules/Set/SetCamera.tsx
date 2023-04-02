import React, { Component } from "react";
import { Button, Slider, Radio, Switch, Divider } from "antd";
import Config from "../../config/Config";
import StrConfig from "../../config/StrConfig";

const RadioGroup = Radio.Group;
const css = require("../../styles/scss/custom.scss");

/**
 * @name SetCamera
 * @create: 2019/1/29
 * @description: 相机设置
 */

interface SetCameraProps { }




interface SetCameraStates {
  minZoom: number;
  maxZoom: number;
  near: number;
  far: number;
  fovY: number;
  isCustom: boolean;
  isDisabled: boolean;
  isNearCustom: boolean;
  isFarCustom: boolean;
  isMinZoomCustom: boolean;
  isMaxZoomCustom: boolean;
  isFovYCustom: boolean;
}

const defaultValue = {
  near: 0,
  far: 0,
  minZoom: 25,
  maxZoom: StrConfig.defaultMaxZoom,
  fovY: 50
};
const defaultCustom = {
  isNearCustom: false,
  isFarCustom: false,
  isMinZoomCustom: false,
  isMaxZoomCustom: false,
  isFovYCustom: false
};

class SetCamera extends Component<SetCameraProps, SetCameraStates> {
  constructor(props: SetCameraProps) {
    super(props);
    this.state = {
      ...defaultValue,
      isCustom: true,
      isDisabled: true,
      ...defaultCustom
    };
  }

  componentDidMount() {
    this.setStateData();
  }

  save = () => {
    this.setState(
      {
        isDisabled: true
      },
      () => {
        const { minZoom, maxZoom, near, far } = this.state;
        const setData = { minZoom, maxZoom, near, far };
        Config.CameraSetData = JSON.stringify(setData);
      }
    );
  };

  reset = () => {
    this.setState(
      {
        ...defaultValue,
        ...defaultCustom
      },
      () => {
        this.setCamera();
      }
    );
  };

  changeDisabled = () => {
    this.setState({
      isDisabled: false
    });
  };

  setCamera = () => {
    console.log(this.state);
    const { maps } = Config;
    const camera = maps.getCamera();
    camera.setMaxZoom(this.state.maxZoom);
    camera.setMinZoom(this.state.minZoom);
    camera.setNear(this.state.near);
    camera.setFar(this.state.far);
    camera.setFovY(this.state.fovY);
    this.changeDisabled();
  };

  setStateData = () => {
    if (Config.CameraSetData.length > 0) {
      const { minZoom, maxZoom, near, far } = JSON.parse(Config.CameraSetData);
      this.setState({
        far: parseInt(far),
        near: parseInt(near),
        minZoom: parseInt(minZoom),
        maxZoom: parseInt(maxZoom),
        isNearCustom: parseInt(near) !== 0,
        isFarCustom: parseInt(far) !== 0,
        isMinZoomCustom: parseInt(minZoom) !== 25,
        isMaxZoomCustom: parseInt(maxZoom) !== StrConfig.defaultMaxZoom
      });
    }
  };

  renderFormItem = (
    title,
    value,
    isCustom,
    valueChange,
    typeChange,
    min,
    max,
    step
  ) => {
    return (
      <React.Fragment>
        <div className={css["m-y-sm"]}>
          <div className={css["flex-center-between"] + " " + css["m-y-sm"]}>
            <label className={css["set-label"]}>{title}</label>
            <RadioGroup size="small" value={isCustom} onChange={typeChange}>
              <Radio value={false}>默认</Radio>
              <Radio value={true}>自定义</Radio>
            </RadioGroup>
          </div>
          <Slider
            className={css["set-slider"]}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={valueChange}
            disabled={!isCustom}
          />
        </div>
        <Divider />
      </React.Fragment>
    );
  };

  valueChange(value) {
    this.setState({
      ...value,
      isDisabled: false
    }, () => {
      this.setCamera();
    });
  }

  typeChange = (type, param) => {
    const isDefault = type[Object.keys(type)[0]];
    const obj = { [param]: defaultValue[param] };
    const data = isDefault ? type : { ...type, ...obj };
    this.setState({ ...data }, () => {
      this.setCamera();
    });
  };

  render() {
    const {
      minZoom,
      maxZoom,
      near,
      far,
      fovY,
      isNearCustom,
      isFarCustom,
      isMinZoomCustom,
      isMaxZoomCustom,
      isFovYCustom,
      isDisabled
    } = this.state;
    return (
      <div>
        {this.renderFormItem(
          "镜头距离",
          near,
          isNearCustom,
          value => this.valueChange({ near: value }),
          value =>
            this.typeChange({ isNearCustom: value.target.value }, "near"),
          0.1,
          25,
          0.1
        )}
        {this.renderFormItem(
          "幕布距离",
          far,
          isFarCustom,
          value => this.valueChange({ far: value }),
          value => this.typeChange({ isFarCustom: value.target.value }, "far"),
          1000,
          10000,
          1
        )}
        {this.renderFormItem(
          "离地最近距离",
          minZoom,
          isMinZoomCustom,
          value => this.valueChange({ minZoom: value }),
          value =>
            this.typeChange({ isMinZoomCustom: value.target.value }, "minZoom"),
          0.1,
          25,
          0.1
        )}
        {this.renderFormItem(
          "离地最远距离",
          maxZoom,
          isMaxZoomCustom,
          value => this.valueChange({ maxZoom: value }),
          value =>
            this.typeChange({ isMaxZoomCustom: value.target.value }, "maxZoom"),
          500,
          StrConfig.defaultMaxZoom,
          100
        )}
        <div className={css["text-center"] + " " + css["m-t-lg"]}>
          <Button
            className={css["m-l-md"]}
            type="primary"
            disabled={isDisabled}
            onClick={this.save}
          >
            保存
          </Button>
          <Button className={css["m-l-md"]} onClick={this.reset}>
            恢复默认设置
          </Button>
        </div>
      </div>
    );
  }
}

export default SetCamera;
