import React, { Component } from "react";
import {
  Button,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Switch, Tabs, Row, Col
} from "antd";
import VrpModal from "../../../components/VrpModal";
import Coordinate from "../../../components/tools/Coordinate";
import DataService from "../../../services/DataService";
import Resource from "../../Menu/Resource";
import CustomFun from "../../../config/CustomFun";
import { LabelItem } from "../../../components/LabelItem";
import { SliderInput } from "../../../components/SliderInput";
import { BaseSetting } from "./BaseSetting";
import Config from "../../../config/Config";
import Model from "../../../components/model/Model";
import VrpIcon from "../../../components/VrpIcon";

const TabPane = Tabs.TabPane;
const pCss = require("../../../styles/scss/public.scss");
const modalCss = require("../../../styles/scss/modal.scss");

interface ModelModalProps {
  closeModal: () => void;
  model: Model;
  modelTool: any;
}

export interface BaseData {
  title: string;
  lon: number;
  lat: number;
  altitude: number;
  width: number;
  height: number;
  deep: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  color: string;
  opacity: number;
}

export interface ModelModalStates {
  model: any;
  baseData: BaseData
  open: { width: boolean, height: boolean, deep: boolean }
  whethshare: boolean;
}

export const { Provider, Consumer } = React.createContext({});
export default class ModelModal extends Component<ModelModalProps, ModelModalStates> {
  public static ModelSelect: (model) => void;
  COPY_NUM: number = 0;
  copying = 0;
  tempModel;
  constructor(props: ModelModalProps) {
    super(props);
    this.state = {
      model: {},
      baseData: {
        title: "",
        lon: 0,
        lat: 0,
        altitude: 0,
        width: 1,
        height: 1,
        deep: 1,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        opacity: 1,
        color: "#FFFFFF",
      },
      open: { width: false, height: false, deep: false },
      whethshare: false,

    };
    ModelModal.ModelSelect = model => {
      this.setState({ model });
    };
  }

  saveModel = () => {
    const { model } = this.props;
    const { baseData: { title, color } } = this.state;
    model.title = title;
    model.whethshare = this.state.whethshare;
    model.setColor(color);
    model.save(() => {
      message.success("保存成功");
      this.props.closeModal();
      Resource.ReloadList && Resource.ReloadList();
    });
  };

  titleChange = e => {
    const { baseData } = this.state;
    baseData.title = e.target.value;
    this.setState({ baseData }, () => {
      this.props.model.isModify = true;
    });
  };

  /**
   * @description 锁定按钮
   * @param param
   * @param checked
   */
  switchChange = (param, checked) => {
    const { open } = this.state;
    open[param] = checked;
    this.setState({
      open
    })
  };

  /**
   * @description 属性修改
   * @param param
   * @param value
   */
  valueChange = (param, value) => {
    const { model } = this.props;
    const { baseData } = this.state;
    baseData[param] = value;
    const { vrPlanner } = Config;
    this.setState({ baseData }, () => {
      model.isModify = true;
      this.positionChange();
      switch (param) {
        case "width":
        case "height":
        case "deep":
          this.scaleChange();
          break;
        case "altitude":
          this.positionChange();
          break;
        case "rotateX":
          model.rotate({ rotateX: baseData.rotateX, rotateY: value, rotateZ: baseData.rotateZ })
          break;
        case "rotateY":
          model.rotate({ rotateX: value, rotateY: baseData.rotateY, rotateZ: baseData.rotateZ })
          break;
        case "rotateZ":
          model.rotate({ rotateX: baseData.rotateX, rotateY: baseData.rotateY, rotateZ: value })
          break;
        case "opacity":
          model.setOpacity(value);
          break;
        case "color":
          model.setMaterial(value);
          break;
        case "whethshare":
          this.setState({
            whethshare: value
          })
      }
    });
  };

  lonLatChange = (param, e) => {
    const { baseData } = this.state;
    baseData[param] = e.target.value;
    this.setState({ baseData }, () => {
      this.positionChange();
    });
  };

  positionChange = () => {
    const { baseData: { lon, lat, altitude } } = this.state;
    const position = Coordinate.WGS84ToMercator({
      x: lon,
      y: lat,
      z: altitude
    });
    const { model } = this.props;
    model.isModify = true;
    model.setPosition(position.x(), position.y(), position.z());
  };

  scaleChange = () => {
    const { baseData: { width, height, deep } } = this.state;
    const { model } = this.props;
    model.isModify = true;
    model.setScale([width, height, deep]);
  };

  handleEvent = e => {
    CustomFun.onKeyDown(e, 27, this.props.closeModal);
    CustomFun.onKeyDown(e, 13, this.saveModel);
  };

  // whethshareChange = (value: boolean) => {
  //   this.setState({whethshare: value});
  // };

  /**
   * @description 模型的编辑事件
   */
  updateModel = (model: Model) => {
    const { modelTool } = this.props;
    const style = model.style;
    if (style) {
      let scale = style.getScaleAsVector();
      modelTool.bindEvent("rotateHandleUp", () => {
        model.isModify = true;
        const euler = model.getRotation();
        const { baseData } = this.state;
        baseData.rotateX = parseFloat(euler.getX());
        baseData.rotateY = parseFloat(euler.getY());
        baseData.rotateZ = parseFloat(euler.getZ());
        this.setState({
          baseData
        });
      });

      /**
       * @description 单边缩放
       */
      modelTool.bindEvent("stretchHandleUp", () => {
        scale = style.getScaleAsVector();
        if (scale != null) {
          const { baseData } = this.state;
          baseData.width = Number(scale.x().toFixed(2));
          baseData.height = Number(scale.y().toFixed(2));
          baseData.deep = Number(scale.z().toFixed(2));
          this.setState({
            baseData
          });
        }
      });
      /**
       * @description 等比缩放
       */
      modelTool.bindEvent("scaleHandleUp", () => {
        model.isModify = true;
        scale = style.getScaleAsVector();
        if (scale != null) {
          const { baseData } = this.state;
          baseData.width = Number(scale.x().toFixed(2));
          baseData.height = Number(scale.y().toFixed(2));
          baseData.deep = Number(scale.z().toFixed(2));
          this.setState({
            baseData
          });
        }
      });
      /**
       * @description X、Y、Z轴移动
       */
      modelTool.bindEvent("arrowHandleDrag", () => {
        model.isModify = true;
        const position = model.point.getGeoLocation();
        const { lon, lat } = Coordinate.MercatorToWGS84(position);
        if (scale != null) {
          const { baseData } = this.state;
          baseData.altitude = position.z();
          baseData.lon = lon;
          baseData.lat = lat;
          this.setState({ baseData });
        }
      });
      /**
       * @description 旋转
       */
      modelTool.bindEvent("rotateHandleDrag", () => {
        model.isModify = true;
        if (scale != null) {
          const euler = model.getRotation();
          const { baseData } = this.state;
          baseData.rotateX = parseFloat(euler.getX());
          baseData.rotateY = parseFloat(euler.getY());
          baseData.rotateZ = parseFloat(euler.getZ());
          this.setState({ baseData });
        }
      });


      /**
       * @description 模型拖动
       */
      modelTool.bindEvent("objectDrag", (event) => {
        if (event.isCtrlKey()) {
          if (this.copying === 1) {
            this.copying = 0;
          }
        }
        model.isModify = true;
        const position = model.point.getGeoLocation();
        if (scale != null) {
          const { lon, lat } = Coordinate.MercatorToWGS84(position);
          const { baseData } = this.state;
          baseData.lon = lon;
          baseData.lat = lat;
          this.setState({ baseData });
        }
      });
      modelTool.bindEvent("objectDown", (event) => {
        if (event.isCtrlKey()) {
          this.copying = 1;
          if (model.isModify) {
            model.save(() => {
              message.success("模型存在编辑，已自动保存");
              model.copy();
              Resource.ReloadList && Resource.ReloadList();
            });
          } else {
            model.copy();
            Resource.ReloadList && Resource.ReloadList();
          }
        }
      })
      modelTool.select(model.point);
      Model.models.forEach(item => {
        if (item.isModify) {
          item.save(message.success("未保存的模型已自动保存"));
        }
      });
      modelTool.select(model.point);
    }
  };

  componentDidMount() {
    window.addEventListener("keydown", this.handleEvent);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleEvent);
    this.props.modelTool.unselect();
    const { model } = this.props;
    model.init();
  }

  clearColor = () => {
    const { model } = this.props;
    model.setMaterial("");
    const { baseData } = this.state;
    baseData.color = ""
    this.setState({ baseData });
  };

  componentWillMount() {
    const { model } = this.props;
    this.updateModel(model);
    this.setModelData(model);
  }

  setModelData(model) {
    const { rotateX, rotateY, rotateZ, title, scale, color, opacity, whethshare } = model;
    const position = model.geo;
    const { lon, lat } = Coordinate.MercatorToWGS84(position);
    const altitude = position.z().toFixed(2);


    this.setState({
      baseData: {
        altitude: Number(altitude),
        deep: scale[2],
        height: scale[1],
        rotateX,
        rotateY,
        rotateZ,
        title,
        width: scale[0],
        lat,
        lon,
        color,
        opacity,
      },
      whethshare
    });
  }

  componentWillReceiveProps(val) {
    const { model } = val;
    this.updateModel(model);
    this.setModelData(model);
  }

  delModel = () => {
    const { model, modelTool } = this.props;
    DataService.delData({ id: model.id }, (flag, res) => {
      if (flag) {
        model.remove();
        if (Resource.ReloadList) Resource.ReloadList();
        modelTool.unselect();
        this.props.closeModal();
      }
    });
  };

  focusModel = () => {
    const { model } = this.props;
    model.focus();
  };



  // /**
  //  * @description 颜色选择事件
  //  * @param value 16进制
  //  */
  // colorChange = value => {
  //   this.setState({color: value}, () => {
  //     const {model} = this.props;
  //     model.setMaterial(value);
  //   });
  // };

  // toggleTab = (key) => {
  //   console.log("key", key)
  // }

  render() {
    const { baseData, baseData: { title, lon, lat, altitude }, open, whethshare } = this.state;
    const btnGroup = (
      <div className={pCss["text-center"]}>
        {/* <Button type="primary" onClick={this.copySetting}>
          复制
        </Button> */}
        <Button
          className={pCss["m-l-md"]}
          type="primary"
          onClick={this.saveModel}
        >
          保存
        </Button>
        <Popconfirm
          title={"确定要删除吗？"}
          okText={"确定"}
          cancelText={"取消"}
          onConfirm={this.delModel}
        >
          <Button type="primary" ghost className={pCss["m-l-md"]}>
            删除
          </Button>
        </Popconfirm>
        <Button className={pCss["m-l-md"]} onClick={this.props.closeModal}>
          取消
        </Button>
      </div>
    );

    return (
      <VrpModal
        className={modalCss["no-padding"]}
        defaultPosition={{ x: 30, y: 95 }}
        title={`${title}-模型编辑`}
        style={{ width: 330 }}
        footer={btnGroup}
        onClose={this.props.closeModal}
      >
        <Tabs>
          <TabPane key={"1"} tab={"基础属性"}>
            <div className={`${pCss["p-x-md"]} ${pCss['p-t-md']}`} style={{ borderBottom: "1px solid #d9d9d9" }}>
              <LabelItem text={"标题"}>
                <Input
                  placeholder="请输入标题"
                  value={title}
                  onChange={this.titleChange}
                />
              </LabelItem>
              <Row gutter={4}>
                <Col span={11}>
                  <LabelItem text={"经度"}>
                    <InputNumber
                      style={{ width: 88 }}
                      placeholder="请输入经度"
                      value={lon}
                      min={-180}
                      max={180}
                      step={0.00001}
                      onChange={(value) => this.lonLatChange("lon", value)}
                    />
                  </LabelItem>
                </Col>
                <Col span={11}>
                  <LabelItem text={"纬度"}>
                    <InputNumber
                      style={{ width: 88 }}
                      placeholder="请输入纬度"
                      value={lat}
                      min={-180}
                      max={180}
                      step={0.00001}
                      onChange={(value) => this.lonLatChange("lat", value)}
                    />
                  </LabelItem>
                </Col>
                <Col span={2}>
                  <VrpIcon iconName={"icondingwei"} title={"定位"} onClick={this.focusModel} />
                </Col>
              </Row>
              <LabelItem text={"海拔高度"}>
                <SliderInput min={-300}
                  max={300}
                  step={0.01}
                  value={altitude} onChange={(value) => this.valueChange("altitude", value)} />
              </LabelItem>
            </div>
            <Provider value={{
              baseData: baseData,
              open: open,
              onChange: this.valueChange,
              switchChange: this.switchChange,
              clearColor: this.clearColor
            }}><BaseSetting /></Provider>
          </TabPane>
          {/*<TabPane key={"2"} tab={"动画属性"}>*/}

          {/*</TabPane>*/}
        </Tabs>
        <div className={pCss["p-md"]}>
          <LabelItem text={"出现在分享界面"}>
            <Switch
              checkedChildren="开"
              unCheckedChildren="关"
              checked={whethshare}
              onChange={(checked) => this.setState({whethshare:checked})} />
          </LabelItem>
        </div>

      </VrpModal>
    );
  }
}
