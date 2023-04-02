import { Component, Fragment } from "react";
import {
  Input,
  Button,
  Slider,
  Icon,
  message,
  Popconfirm,
  Select,
  Checkbox,
  InputNumber,
  Dropdown,
  Menu,
  Switch,
  Popover
} from "antd";
import IconSelector from "../../components/selector/IconSelector";
import VrpIcon from "../../components/VrpIcon";
import Config from "../../config/Config";
import AnimateModelList from "./AnimateModelList";
import AnimationService from "../../services/AnimationService";
import AnimateModelItem from "./AnimateModelItem";
import ColorPicker from "../../components/ColorPicker";
import BalloonPicker from "../../components/BalloonPicker";
import { UpdateBalloon } from "./AnimateData";
import { LabelItem } from "../../components/LabelItem";

const Option = Select.Option;

const css = require("../../styles/scss/animate.scss");

interface AnimateItemProps {
  allAnimation: any;
  highLight: (id) => void;
  highLightId: any;
  animation: any;
  lineData: any;
  id: number;
  reloadList: (searchValue) => void;
  checkBoxChange: (e, id) => void;
  searchValue: any;
  stopPlay: (value) => void;
  lineCopy: (animation, callback) => void;
}

interface AnimateItemStates {
  updateData: UpdateBalloon;
  lineShow: boolean;
  modelShow: boolean;
  unfold: boolean;
  atrUnfold: boolean;
  modelUnfold: boolean;
  balloonUnfold: boolean;
  altitude: number;
  speed: number;
  interval: number;
  depthTest: boolean;
  title: string;
  isChange: any;
  planId: number;
  type: string;
  ModelList: boolean;
  modelSource: any[];
  model: any;
  modelFirstGeo: any;
  replacedModel: any;
  modelAngle: number;
  modelListType: string;
  isCircle: boolean;
  isReverse: boolean;
  lineClose: boolean;
  isGap: boolean;
  pointClone: any;
  prototypeStyle: any;
  isModelPlay: boolean;
  rotateTime: number;
  modelSize: any;
  onLocation: boolean;
  visualAngle: any;
  showBalloon: boolean;
  color: string;
  isLevel: boolean;
  colorSeparate: boolean;
  showVerticalLine: boolean;
  verticalLineColor: string;
  panels: any[];
  lineWidth: number;
  triggerAtr: string;
  progressBar: boolean;
  minutes: number;
  seconds: number;
  lineType: string;
  lineDataSource: any[];
  shareIcon: string;
}

function formatter(value) {
  const hours = Math.floor(value / 60) < 10 ? "0" + Math.floor(value / 60) : Math.floor(value / 60);
  const minutes =
    Math.floor(value % 60) < 10 ? "0" + Math.floor(value % 60) : Math.floor(value % 60);
  return `${hours}:${minutes} `;
}

class AnimateItem extends Component<AnimateItemProps, AnimateItemStates> {
  isActive = "finish";

  constructor(props: AnimateItemProps) {
    super(props);
    this.state = {
      lineShow: true,
      modelShow: true,
      unfold: false,
      atrUnfold: false,
      modelUnfold: false,
      balloonUnfold: false,
      altitude: 0.0,
      speed: 30,
      interval: 4,
      depthTest: false, //穿透
      title: "线条",
      isChange: false,
      planId: 0,
      type: "animateline",
      ModelList: false,
      modelSource: [],
      model: 0,
      modelFirstGeo: [],
      replacedModel: null,
      modelAngle: 0,
      isCircle: false,
      isReverse: false,
      lineClose: false,
      isGap: false,
      pointClone: [],
      modelListType: "ADD-MODEL",
      prototypeStyle: 0,
      isModelPlay: false,
      rotateTime: 0.5,
      modelSize: 0,
      onLocation: false,
      visualAngle: [],
      showBalloon: true,
      color: "#ffff00",
      isLevel: false,
      colorSeparate: false,
      showVerticalLine: true,
      verticalLineColor: "#ffffff",
      lineWidth: 1,
      triggerAtr: "handle",
      progressBar: false,
      minutes: 0,
      seconds: 0,
      panels: [],
      lineType: "",
      lineDataSource: [],
      shareIcon: "",
      updateData: {
        title: "",
        id: 0,
        color: "white",
        titleVisible: true, //文字
        iconVisible: true, //图标
        imageUrl: "",
        altitude: 0,
        fontSize: 16,
        whethshare: false,
        bottom: 0
      }
    };
  }

  componentWillMount() {
    this.setLineForm(this.props.animation);
    if (this.props.lineData.id === this.props.allAnimation[0].id) {
      this.setState(
        {
          unfold: true
        },
        () => {}
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    //实时刷新各类数据
    if (nextProps.lineData != this.props.lineData) {
      this.setLineForm(nextProps.animation);
      // if (nextProps.lineData.id === Animation.animations[0].id) {
      //   this.setState({
      //     unfold: true
      //   })
      // }
      if (nextProps.lineData.id === nextProps.allAnimation[0].id) {
        this.setState({
          unfold: true
        });
      }
    }
  }

  componentWillUnmount() {
    this.setState({
      unfold: false
    });
  }
  //设置各类数据
  setLineForm = animation => {
    const p = animation.models;
    const lineData = animation.line;
    const balloon = animation.balloon;
    let width = lineData.line.getStyle().getWidth();

    // const panels = app._store.getState().cadModal.panels;

    if (lineData) {
      this.setState(
        {
          depthTest: JSON.parse(lineData.depthTest),
          title: lineData.title,
          altitude: lineData.altitude,
          interval: lineData.interval,
          lineClose: lineData.isClose,
          planId: Config.PLANID,
          type: lineData.type,
          ModelList: false,
          showBalloon: lineData.showBalloon,
          isGap: animation.isGap,
          isCircle: animation.isCircle,
          lineShow: lineData.isShow,
          visualAngle: lineData.visualAngle,
          lineWidth: width,
          color: lineData.color,
          lineType: lineData.lineType,
          shareIcon: animation.shareIcon
        },
        () => {
          //     console.log(this.state.lineWidth)
        }
      );
      if (balloon) {
        this.setState({
          updateData: {
            title: animation.balloonTitle,
            id: balloon.id,
            color: animation.fontColor,
            titleVisible: animation.titleVisible,
            iconVisible: animation.iconVisible,
            imageUrl: animation.iconUrl,
            altitude: animation.balloonHeight,
            fontSize: animation.fontSize,
            whethshare: false,
            bottom: animation.balloonBottom
          }
        });
      }

      if (p[0]) {
        this.setState({
          model: p[0],
          speed: p[0].speed,
          modelShow: p[0].isShow,
          rotateTime: p[0].rotateTime,
          modelSource: animation.models,
          modelAngle: p[0].rotate,
          modelSize: p[0].scale[0] - 1
        });
      }
    }
  };

  saveLine = line => {
    const { updateData } = this.state;
    const { animation } = this.props;
    const position: any = [];
    line.vertices.forEach(vertex => {
      position.push({ x: vertex.x(), y: vertex.y(), z: vertex.z() });
    });
    const visualAngle: any = [];
    if (line.visualAngle.length > 0) {
      line.visualAngle.forEach(vertex => {
        visualAngle.push({ x: vertex.x(), y: vertex.y(), z: vertex.z() });
      });
    }

    line.isLevel = this.state.isLevel;
    line.interval = this.state.interval;
    line.title = this.state.title;
    line.colorSeparate = this.state.colorSeparate;
    line.isClose = this.state.lineClose;

    line.showBalloon = this.state.showBalloon;

    const cdata: any = {};
    const balloonData: any = {};
    cdata.altitude = this.state.altitude.toString();
    cdata.interval = this.state.interval;
    cdata.title = this.state.title;
    //  cdata.vertices = { position: JSON.stringify(position) };
    cdata.depthTest = this.state.depthTest;
    cdata.isClose = this.state.lineClose;
    cdata.isCircle = this.state.isCircle;
    cdata.isActive = this.isActive;
    cdata.isGap = this.state.isGap;
    cdata.isShow = this.state.lineShow;
    cdata.planId = Config.PLANID;
    cdata.visualAngle = visualAngle;
    cdata.showBalloon = this.state.showBalloon;
    cdata.verticalLineColor = animation.verticalLineColor;
    cdata.showVerticalLine = animation.showVerticalLine;
    cdata.createTime = animation.createTime;
    cdata.shareUrl = animation.shareIcon;
    cdata.color = this.state.color;
    cdata.width = this.state.lineWidth;

    balloonData.balloonTitle = updateData.title;
    balloonData.fontSize = updateData.fontSize;
    balloonData.fontColor = updateData.color;
    balloonData.iconUrl = updateData.imageUrl;
    balloonData.balloonHeight = updateData.altitude;

    balloonData.titleVisible = updateData.titleVisible;
    balloonData.iconVisible = updateData.iconVisible;

    const ddata = Object.assign({ position: position }, cdata);
    let a = {
      id: line.id,
      str: JSON.stringify(ddata),
      animateBalloon: JSON.stringify(balloonData)
    };
    AnimationService.modALine(a, (flag, res) => {
      if (flag) {
        //  message.success("保存成功");
        // line.id = res.data;
        this.saveModelAttribute(line);
      } else {
        message.error(res.message);
        console.log(res);
      }
    });
    this.props.reloadList(this.props.searchValue);
  };
  //保存模型数据
  saveModelAttribute = data => {
    const { modelSource } = this.state;
    let mdata: any = [];

    for (var i = 0; i < modelSource.length; i++) {
      modelSource[i].speed = this.state.speed;

      let geo: string =
        modelSource[i].geo.x() + "," + modelSource[i].geo.y() + "," + modelSource[i].geo.z();
      mdata.id = modelSource[i].id;
      mdata.imgurl = modelSource[i].imgurl;
      mdata.title = modelSource[i].title;
      mdata.rotateX = modelSource[i].rotateX;
      mdata.rotateY = modelSource[i].rotateY;
      mdata.rotateZ = modelSource[i].rotateZ;
      mdata.url = modelSource[i].url;
      mdata.geo = geo;
      mdata.rotatetime = modelSource[i].rotateTime;
      mdata.lineid = data.id;
      mdata.modelsize = modelSource[i].scale[0];
      mdata.speed = this.state.speed;
      mdata.planId = Config.PLANID;
      mdata.isshow = modelSource[i].isShow;

      AnimationService.modAModel(mdata, (flag, res) => {
        if (flag) {
          message.success("修改成功");
        } else {
          message.error("修改失败");
          console.log(res);
        }
      });
    }
  };
  //修改轨迹标题
  titleChange = e => {
    const { lineData } = this.props;
    this.setState(
      {
        title: e.target.value,
        isChange: true
      },
      () => {}
    );
  };
  //修改轨迹高度
  altitudeChange = value => {
    this.setState(
      {
        altitude: value,
        isChange: true
      },
      () => {
        const { lineData, animation } = this.props;
        const { model, updateData } = this.state;
        lineData.setAttribute(this.state.altitude);
        if (model) {
          animation.setModelAltitude(this.state.altitude);
          animation.balloon.setAnimationHeight(
            updateData.bottom ? updateData.bottom + this.state.altitude : this.state.altitude,
            updateData.altitude + this.state.altitude
          );
        }
      }
    );
  };

  //修改轨迹线条宽度
  lineWidthChange = value => {
    this.setState(
      {
        lineWidth: value,
        isChange: true
      },
      () => {
        const { lineData } = this.props;
        lineData.setWidth(value);
        lineData.width = this.state.lineWidth;
      }
    );
  };

  //修改模型旋转时间
  rotateTimeChange = value => {
    this.setState(
      {
        rotateTime: value,
        isChange: true
      },
      () => {
        const { model } = this.state;
        if (model) {
          model.setRotateTime(this.state.rotateTime);
        }
      }
    );
  };
  //修改间隔模式模型间距
  intervalChange = value => {
    this.setState({
      interval: value,
      isChange: true
    });
  };
  //修改模型运行速度
  speedChange = value => {
    this.setState({
      speed: value,
      isChange: true
    });
  };
  //修改模型旋转角度
  //!这个旋转和后续setplay（）中角度计算的部分还需要优化
  rotateChange = value => {
    this.setState(
      {
        modelAngle: value,
        isChange: "rotateChange"
      },
      () => {
        if (this.state.model) {
          this.state.model.setModelRotation(this.state.modelAngle);
        }
      }
    );
  };
  //修改模型大小
  modelSizeChange = value => {
    let _value = value * 0.2;
    this.setState(
      {
        modelSize: _value,
        isChange: true
      },
      () => {
        const { model, modelSource } = this.state;
        if (model) {
          for (var i = 0; i < modelSource.length; i++) {
            modelSource[i].setModelScale(this.state.modelSize);
          }
        }
      }
    );
  };

  //保存轨迹数据
  saveAttribute = () => {
    const { lineData } = this.props;
    this.saveLine(lineData);

    this.props.animation.speed = this.state.speed;
    this.setState({
      isChange: false
    });
    this.props.stopPlay("finish");
  };
  //删除轨迹
  lineDelete = () => {
    const { lineData, animation } = this.props;
    const { modelSource } = this.state;
    this.setState({ unfold: false });
    let a: any = [];
    let len = modelSource.length;

    AnimationService.delData({ id: lineData.id }, (flag, _) => {
      if (flag) {
        animation.remove();
        if (modelSource.length != 0) {
          for (var i = 0; i < len; i++) {
            a.push(modelSource[i].id);

            modelSource[i].remove(lineData.id);
          }
          for (var i = 0; i < a.length; i++) {
            AnimationService.delAModel({ id: a[i] }, (flag, _) => {
              if (flag) {
                console.log("成功删除该轨迹对应的所有模型");
              } else {
                console.log("删除该轨迹对应的所有模型失败");
              }
            });
          }
        }
        //重加载
        this.props.reloadList(this.props.searchValue);
      } else {
        message.error("删除失败");
      }
    });
  };
  //增加模型
  addModel = () => {
    const { lineData, animation } = this.props;
    const { model } = this.state;
    this.setState({
      ModelList: true
    });
    lineData.setAttribute(lineData.altitude);
    if (model) {
      animation.setModelAlititude(lineData.altitude);
    }
    //结束运行
    if (this.isActive != "finish") {
      this.setAnimationPlay("finish");
    }
  };

  //camera飞行至轨迹上空
  flyToLine = () => {
    const { lineData } = this.props;
    const { maps } = Config;
    lineData.focus();
    const _this = this;
    this.setState(
      {
        onLocation: true
      },
      () => {
        maps.getCamera().bindEvent("stop", () => {
          maps.getCamera().bindEvent("move", () => {
            _this.setState({
              onLocation: false
            });
            maps.getCamera().unbindEvent("stop");
            maps.getCamera().unbindEvent("move");
          });
        });
      }
    );
  };

  //设置轨迹视角
  setLineVisual = () => {
    const { maps } = Config;
    const { lineData } = this.props;
    const camera = maps.getCamera();
    let lookat = camera.getLookAt();
    let position = camera.getGeoLocation();

    lineData.setVisualAngle(position, lookat);
    message.success("设定视角成功");
    this.setState({
      visualAngle: 1,
      isChange: true
    });
  };

  closeModelFrame = () => {
    this.setLineForm(this.props.animation);
  };
  //轨迹isClose切换
  lineCloseChange = () => {
    this.setState(
      {
        lineClose: !this.state.lineClose,
        isChange: true
      },
      () => {
        const { lineData } = this.props;

        if (this.state.lineClose) {
          lineData.setAttribute(this.state.altitude, this.state.lineClose);
          lineData.vertices.push(lineData.vertices[0]);
        } else {
          lineData.vertices.pop();
          lineData.setAttribute(this.state.altitude, this.state.lineClose);
        }
      }
    );
  };
  //轨迹线条depthTest参数修改
  lineDepthTest = () => {
    this.setState(
      {
        depthTest: !this.state.depthTest,
        isChange: true
      },
      () => {
        const { lineData } = this.props;

        lineData.setDepthTest(this.state.depthTest);
      }
    );
  };
  //轨迹isLevel是否水平属性修改
  isLevelChange = () => {
    this.setState(
      {
        isLevel: !this.state.isLevel,
        isChange: true
      },
      () => {
        const { lineData } = this.props;
        lineData.setLevel(this.state.isLevel);
      }
    );
  };

  //轨迹运行是否分色，功能尚未实现
  colorSeparateChange = () => {
    this.setState(
      {
        colorSeparate: !this.state.colorSeparate,
        isChange: true
      },
      () => {
        const { lineData } = this.props;

        lineData.setColorSeparate(this.state.colorSeparate);
      }
    );
  };

  //标签显示开关
  showBalloonChange = () => {
    const { updateData } = this.state;
    const { animation, lineData } = this.props;
    let a = this.state.showBalloon;
    if (a) {
      updateData.titleVisible = false;
      updateData.iconVisible = false;
    } else {
      updateData.titleVisible = true;
      updateData.iconVisible = true;
    }
    this.setState(
      {
        updateData,
        showBalloon: !this.state.showBalloon,
        isChange: true
      },
      () => {
        this.setIcon();
        lineData.showBalloon = this.state.showBalloon;
        animation.titleVisible = this.state.showBalloon;
        animation.balloonTitle = this.state.updateData.iconVisible = this.state.showBalloon;
        animation.balloon.setVisible(this.state.showBalloon);
      }
    );
  };

  //模型循环模式开关
  //!循环模式与间隔模式只可选择其一，间隔模式下不可以开启循环模式
  setmodelCycle = () => {
    if (this.state.isGap === false) {
      this.setState(
        {
          isCircle: !this.state.isCircle,
          isChange: true
        },
        () => {
          this.props.animation.isCircle = this.state.isCircle;
        }
      );
    }
  };

  //模型间隔模式开关
  //!循环模式与间隔模式只可选择其一，开启间隔模式将自动关闭循环模式
  setIntervalStatus = e => {
    this.setState(
      {
        isGap: e.target.checked,
        isChange: true
      },
      () => {
        clearInterval(this.props.animation.timeInterval);
        this.props.animation.isGap = this.state.isGap;
      }
    );
    if (e.target.checked === true) {
      this.setState(
        {
          isCircle: false
        },
        () => {
          this.props.animation.isCircle = false;
        }
      );
    }
  };

  //显示已有模型列表
  //?目前默认只可添加一个模型，后期有优化需求
  getModelElements = () => {
    const { modelSource } = this.state;
    if (!modelSource[0]) {
      return null;
    } else {
      return modelSource.map((value, index) => {
        return (
          <AnimateModelItem
            animation={this.props.animation}
            model={value}
            lineData={this.props.lineData}
            reloadList={this.props.reloadList}
            searchValue={this.props.searchValue}
            closeModelFrame={this.closeModelFrame}
            key={index}
          />
        );
      });
    }
  };

  //判断轨迹数据是否被修改
  judgeChange = value => {
    const { isChange } = this.state;

    const _this = this;
    if (value === "finish") {
      this.props.animation.animation.finish();

      this.isActive = value;
    } else {
      if (isChange) {
        this.saveLine(_this.props.lineData);

        _this.props.animation.setPlay();
        this.isActive = value;
        this.setState({ isChange: false });
      } else {
        _this.props.animation.setPlay();
        this.isActive = value;
      }
    }
  };
  //轨迹运行
  setAnimationPlay = value => {
    if (this.state.isChange === true && value === "Splay") {
      this.saveAttribute();
    }
    this.props.animation.setAnimation(value);
    this.isActive = value;
  };

  //模型基于欧拉坐标系的转动
  setEulerRotation = () => {
    let anglex = this.props.animation.calLineAngleX(0);
    let angley = this.props.animation.calLineAngleZ(0);
    const { vrPlanner } = Config;
    const euler = vrPlanner.Math.Euler(anglex, 0, angley + 180);

    let style = this.state.modelSource[0].point.getStyle();

    style.setEulerRotation(euler);
    this.setXYZLine();
  };

  setXYZLine = () => {
    const { vrPlanner, maps } = Config;
    let geo1 = new vrPlanner.GeoLocation(
      13499126.505007165,
      3666218.258908055,
      13.814923619546242
    );
    let geo2 = new Config.vrPlanner.GeoLocation(
      13499126.505007165,
      3666280.258908055,
      13.814923619546242
    );
    let geo3 = new Config.vrPlanner.GeoLocation(
      13499126.505007165,
      3666280.258908055,
      33.824923619546242
    );
    let line = new vrPlanner.Feature.Line();
    let style = new Config.vrPlanner.Style.LineStyle({
      width: 1,
      color: "#ffff00",
      depthTest: false
    });
    line.setStyle(style);
    let layer = new vrPlanner.Layer.FeatureLayer("textLayer");
    Config.maps.addLayer(layer);
    line.addVertices([geo1, geo2, geo3]);
    layer.addFeature(line);
  };

  //控制轨迹标题处显示隐藏开关 同时控制轨迹线条与模型的显示隐藏参数
  allLineShow = () => {
    const { lineShow, modelShow, showBalloon, updateData } = this.state;
    let allVisible = true;
    this.setAnimationPlay("finish");
    if (lineShow || modelShow || showBalloon) {
      allVisible = false;
    }

    updateData.iconVisible = allVisible;
    updateData.titleVisible = allVisible;
    this.setState(
      {
        lineShow: allVisible,
        modelShow: allVisible,
        showBalloon: allVisible,
        isChange: true,
        updateData
      },
      () => {
        const { lineData, animation } = this.props;
        lineData.isShow = this.state.lineShow;
        lineData.setVisible(allVisible);

        if (animation.models) {
          const model = animation.models;
          for (var i = 0; i < model.length; i++) {
            model[i].setVisible(allVisible);
          }
          animation.balloon.setVisible(this.state.showBalloon);
          this.setIcon();
          this.saveModelAttribute(lineData);
        }
      }
    );
  };

  //只控制线条部分的显示与隐藏
  onlyLineShow = () => {
    this.setAnimationPlay("finish");
    this.setState(
      {
        lineShow: !this.state.lineShow,
        isChange: true
      },
      () => {
        const { lineData } = this.props;
        lineData.setVisible(this.state.lineShow);
      }
    );
  };

  //只控制模型部分的显示与隐藏
  onlyModelShow = () => {
    this.setAnimationPlay("finish");
    this.setState(
      {
        modelShow: !this.state.modelShow,
        isChange: true
      },
      () => {
        const { lineData, animation } = this.props;
        if (animation.models) {
          const model = animation.models;
          for (var i = 0; i < model.length; i++) {
            model[i].setVisible(this.state.modelShow);
            model[i].isShow = this.state.modelShow;
          }
        }
      }
    );
  };

  //设置轨迹反转运行参数
  setReverseAnimation = () => {
    this.setState(
      {
        isReverse: !this.state.isReverse,
        isChange: true
      },
      () => {
        this.props.animation.setReverse(this.state.isReverse);
      }
    );
  };

  //修改轨迹参数页面重渲染时判断参数是否发生变化，若变化，则停止轨迹运行
  checkChange = () => {
    if (this.state.isChange === true) {
      this.setAnimationPlay("finish");
    }
  };

  //修改线条颜色样式
  colorChange = value => {
    this.setState(
      {
        color: value,
        isChange: true
      },
      () => {
        const { lineData } = this.props;
        lineData.setColor(value);
        lineData.color = this.state.color;
      }
    );
  };

  //控制垂线显示隐藏开关
  // verticalLineChange = value => {
  //   this.setState(
  //     {
  //       showVerticalLine: value,
  //       isChange: true
  //     },
  //     () => {
  //       const { animation } = this.props;
  //       animation.showVertical = this.state.showVerticalLine;
  //       animation.setVerticalLine();
  //     }
  //   );
  // };

  //垂线颜色样式
  // verticalLineColorChange = value => {
  //   this.setState(
  //     {
  //       verticalLineColor: value,
  //       isChange: true
  //     },
  //     () => {
  //       this.props.animation.setVerticalLineColor(value);
  //       this.props.animation.verticalLineColor = value;
  //     }
  //   );
  // };

  //标签图片url修改
  balloonChange = url => {
    const { updateData } = this.state;

    updateData.imageUrl = url;
    this.setState(
      {
        updateData,
        isChange: true
      },
      () => {
        this.props.animation.iconUrl = this.state.updateData.imageUrl;
        this.setIcon();
      }
    );
  };

  // balloonHeightChange = value => {
  //     const { updateData } = this.state;
  //     updateData.altitude = value;
  //     this.setState(
  //         {
  //             updateData
  //             // isChange: true,
  //         },
  //         () => {
  //             const { animation } = this.props;
  //             animation.balloon.setHeight(value);
  //         }
  //     );
  // };

  //标签高度修改
  balloonHeightChange = value => {
    const { updateData } = this.state;
    updateData.bottom = value[0];

    updateData.altitude = value[1];

    this.setState(
      {
        updateData,
        isChange: true
      },
      () => {
        const { animation } = this.props;
        // animation.balloon.setHeight(value);
        animation.balloonBottom = value[0];
        animation.balloonHeight = value[1];
        animation.balloon.setAnimationHeight(
          value[0] + this.state.altitude,
          value[1] + this.state.altitude
        );
      }
    );
  };
  //标签文字大小控制
  fontSizeChange = value => {
    const { updateData } = this.state;
    updateData.fontSize = Number(value);
    this.setState({ updateData }, () => {
      this.setIcon();
      this.props.animation.fontSize = Number(value);
    });
  };
  setIcon = () => {
    let { updateData } = this.state;
    const { animation } = this.props;
    const {
      color: fontColor,
      title,
      fontSize,
      imageUrl: icon,
      titleVisible,
      iconVisible
    } = updateData;
    animation.balloon.setIcon({
      fontColor,
      title,
      fontSize,
      icon,
      titleVisible,
      iconVisible
    });
    animation.balloon.icon = icon;
    animation.balloon.title = title;
    animation.balloon.iconVisible = iconVisible;
    animation.balloon.titleVisible = titleVisible;
    animation.balloon.fontSize = fontSize;
    animation.balloon.color = fontColor;
  };

  //标签文字颜色样式
  titleColorChange = color => {
    const { updateData } = this.state;
    const { animation } = this.props;
    if (animation.balloon) {
      updateData.color = color;
      this.setState({ updateData }, () => {
        this.setIcon();
        animation.fontColor = color;
      });
    }
  };

  //标签文字显示与隐藏开关
  BalloonTitleSwitch = value => {
    const { updateData } = this.state;

    const { animation, lineData } = this.props;
    // this.setState({ updateData }, () => {
    //     this.setIcon();
    // });
    updateData.titleVisible = value;
    if (value === updateData.iconVisible || (value === true && this.state.showBalloon === false)) {
      this.setState(
        {
          updateData,
          showBalloon: value,
          isChange: true
        },
        () => {
          lineData.showBalloon = value;
          animation.balloon.setVisible(value);
          this.setIcon();
        }
      );
    } else {
      this.setState(
        {
          updateData,
          isChange: true
        },
        () => {
          this.setIcon();
        }
      );
    }
  };

  //标签图片显示与隐藏开关
  BalloonIconSwitch = value => {
    const { updateData } = this.state;
    const { animation, lineData } = this.props;
    updateData.iconVisible = value;
    if (value === updateData.titleVisible || (value === true && this.state.showBalloon === false)) {
      this.setState(
        {
          updateData,
          showBalloon: value,
          isChange: true
        },
        () => {
          lineData.showBalloon = value;
          animation.balloon.setVisible(value);
          this.setIcon();
        }
      );
    } else {
      this.setState(
        {
          updateData,
          isChange: true
        },
        () => {
          this.setIcon();
        }
      );
    }
  };

  //标签文字内容
  balloonTitleChange = e => {
    const title = e.target.value;
    let { updateData } = this.state;
    updateData.title = title;
    this.setState(
      {
        updateData,
        isChange: true
      },
      () => {
        this.setIcon();
        this.props.animation.balloonTitle = title;
      }
    );
  };

  // triggerChange = e => {
  //   this.setState({
  //     triggerAtr: e.target.value
  //   });
  //   if (e.target.value === "auto") {
  //     this.setAnimationPlay("Splay");
  //   }
  // };
  // progressTimeChange = value => {
  //   this.setState({
  //     minutes: value,
  //     seconds: value % 60
  //   });
  // };
  //
  // progressSwitch = value => {
  //   //const {minutes, seconds} =this.state;
  //   const { animation } = this.props;
  //   let sumTime = animation.calTime();
  //   // let minutes = sumTime / 60;
  //   // let seconds = sumTime % 60;
  //   this.setState({ progressBar: value });
  // };

  //分享图片url
  iconSelector = url => {
    const { animation } = this.props;

    this.setState(
      {
        shareIcon: url,
        isChange: true
      },
      () => {
        animation.shareIcon = url;

        //this.handleChange();
      }
    );
  };

  render() {
    const { lineData, animation } = this.props;
    const { updateData, ModelList } = this.state;
    const fontSize_Num = 22;
    const list: Number[] = [];
    for (let i = 0; i < fontSize_Num; i++) {
      list.push(12 + i * 2);
    }
    this.checkChange();

    let styleName = "vrp-animate-infor-item";

    if (this.props.highLightId === this.props.animation.id) {
      styleName = "vrp-animate-infor-item-highlight";
    }

    const { unfold, atrUnfold, modelUnfold, balloonUnfold } = this.state;

    const smenu = (
      <Menu>
        <Menu.Item onClick={this.allLineShow} style={{ cursor: "pointer" }}>
          <VrpIcon
            iconName={"icon-visible"}
            title={
              this.state.modelShow || this.state.lineShow || this.state.showBalloon
                ? "整体隐藏"
                : "整体显示"
            }
            style={{
              cursor: "pointer",
              color: this.state.modelShow || this.state.lineShow ? "#1890ff" : ""
            }}
          />
          {this.state.modelShow || this.state.lineShow ? (
            <span style={{ color: "#1890ff" }}>隐藏此条</span>
          ) : (
            <span>显示此条</span>
          )}
        </Menu.Item>
        <Menu.Item style={{ cursor: "pointer" }} onClick={this.setLineVisual}>
          <VrpIcon
            iconName={"icon-angle-of-view"}
            title={"设定视角"}
            style={{
              cursor: "pointer",
              color: this.state.visualAngle.length === 0 ? "" : "#1890ff",
              margin: 2
            }}
          />
          {this.state.visualAngle.length === 0 ? (
            <span>设定视角</span>
          ) : (
            <span style={{ color: "#1890ff" }}>更新视角</span>
          )}
        </Menu.Item>
      </Menu>
    );

    return (
      <Fragment>
        <div
          className={css[styleName]}
          onClick={this.props.highLight.bind(this, this.props.lineData.id)}
        >
          <div className={css["vrp-animate-infor-header"]}>
            {/* <Checkbox className={css['vrp-animation-infor-checkbox']}
                            checked={this.props.checkedIds[lineData.id]}
                            onChange={(e) => this.checkBoxChange(e.target.checked)}
                        //    onChange={(e) => this.props.checkBoxChange(e.target.checked, animation.id)}
                        /> */}
            <div className={css["header-img-share"]}>
              <IconSelector
                classType={"2"}
                width={"22px"}
                onSelect={this.iconSelector}
                value={this.state.shareIcon}
                type="square22"
                style={{ width: "22px" }}
              />
            </div>
            <div className={css["header-lineType"]}>
              {this.state.lineType == "draw" ? "手绘" : "线条"}
            </div>
            <Input
              placeholder="轨迹名称"
              value={this.state.title}
              onChange={this.titleChange}
              className={css["animate-infor-header-title"]}
            />
            <div className={css["vrp-animation-infor-header-icon"]}>
              <VrpIcon
                iconName={"icon-position"}
                onClick={this.flyToLine}
                style={{
                  cursor: "pointer",
                  color: this.state.onLocation ? "" : "#1890ff"
                }}
              />

              <Dropdown overlay={smenu} placement="bottomRight">
                <div className={css["vrp-animate-header-dropmenu"]}>
                  <VrpIcon iconName={"icon-more"} style={{ cursor: "pointer" }} />
                </div>
              </Dropdown>

              <Icon
                type={`right`}
                style={{
                  transition: "all 0.25s",
                  transform: unfold ? "rotate(90deg)" : "none",
                  color: this.state.unfold ? "#1890ff" : ""
                }}
                className={css["m-l-sm"]}
                onClick={() => {
                  this.setState({ unfold: !unfold });
                }}
              />
            </div>
          </div>
          {!unfold ? null : (
            <div
              className={css["vrp-animate-infor-frame"]}
              style={{
                transition: "all 0.25s",
                height: unfold ? "auto" : 0
              }}
            >
              <div className={css["vrp-animate-frame-attribute"]} style={{ marginTop: "6px" }}>
                <div className={css["frame-attribute-header"]}>
                  <span className={css["vrp-animate-edit-header"]}>属性</span>
                  <VrpIcon
                    iconName={"icon-visible"}
                    className={css["vrp-animate-attribute-icon"]}
                    style={{
                      color: this.state.lineShow ? "#1890ff" : "",
                      fontSize: 20
                    }}
                    title={this.state.lineShow ? "轨迹隐藏" : "轨迹显示"}
                    onClick={this.onlyLineShow}
                  />

                  <VrpIcon
                    iconName={"icon-connect"}
                    title={this.state.lineClose ? "线条断开" : "线条闭合"}
                    style={{
                      color: this.state.lineClose ? "" : "#1890ff",
                      fontSize: 20
                    }}
                    className={css["vrp-animate-attribute-icon"]}
                    onClick={this.lineCloseChange}
                  />
                  <VrpIcon
                    iconName={"icon-penetrate"}
                    title={this.state.depthTest ? "呈现轨迹" : "融入地图"}
                    style={{
                      color: this.state.depthTest ? "#1890ff" : "",
                      fontSize: 20
                    }}
                    className={css["vrp-animate-attribute-icon"]}
                    onClick={this.lineDepthTest}
                  />
                  <Icon
                    type={`right`}
                    style={{
                      transition: "all 0.25s",
                      transform: atrUnfold ? "rotate(90deg)" : "none",
                      color: atrUnfold ? "#1890ff" : ""
                    }}
                    className={css["animate-icon-fold"]}
                    onClick={() => {
                      this.setState({ atrUnfold: !atrUnfold });
                    }}
                  />
                  {/* <VrpIcon
                                        iconName={'icon-level'}
                                        title={this.state.isLevel ? "还原轨迹" : "水平轨迹"}
                                        style={{ color: this.state.isLevel ? '#1890ff' : '', fontSize: 20 }}
                                        className={css['vrp-animate-icon-xunhuan']}
                                        onClick={
                                            this.isLevelChange
                                        }
                                    /> */}
                  {/* <VrpIcon
                                        iconName={'icon-colourseparation-1'}
                                        title={this.state.colorSeparate ? "切单色轨迹" : "切多色轨迹"}
                                        style={{ color: this.state.colorSeparate ? '#1890ff' : '', fontSize: 20 }}
                                        className={css['vrp-animate-icon-xunhuan']}
                                        onClick={
                                            this.colorSeparateChange
                                        }
                                    /> */}
                </div>
                {/* <div className={css['vrp-animate-slider-frame']}>
                                        <span className={css['vrp-animate-slider-span']}> 轨迹宽度：</span>

                                        <Slider
                                            min={0}
                                            max={10}
                                            step={0.1}
                                            onChange={this.lineWidthChange}
                                            className={css['vrp-animate-slider']}
                                            value={typeof (this.state.lineWidth) === 'number' ? this.state.lineWidth : 0}
                                        />
                                        <InputNumber
                                            min={0}
                                            max={10}
                                            step={0.1}
                                            size="small"
                                            value={this.state.lineWidth}
                                            onChange={this.lineWidthChange}
                                            className={css['vrp-animate-slider-input']}
                                        />

                                    </div> */}
                {this.state.atrUnfold ? (
                  <Fragment>
                    <div className={css["vrp-animate-slider-frame"]}>
                      <span className={css["vrp-animate-slider-span"]}>轨迹高度：</span>

                      <Slider
                        min={-20}
                        max={100}
                        step={0.1}
                        onChange={this.altitudeChange}
                        className={css["vrp-animate-slider"]}
                        value={typeof this.state.altitude === "number" ? this.state.altitude : 0}
                      />
                      <InputNumber
                        min={-20}
                        max={100}
                        step={0.1}
                        size="small"
                        value={this.state.altitude}
                        onChange={this.altitudeChange}
                        className={css["vrp-animate-slider-input"]}
                      />
                    </div>

                    <div
                      className={css["vrp-animate-slider-frame"]}
                      style={{ marginBottom: "8px" }}
                    >
                      <span className={css["vrp-animate-slider-span"]}>拐点停顿：</span>
                      <Slider
                        min={0}
                        max={30}
                        step={0.1}
                        onChange={this.rotateTimeChange}
                        className={css["vrp-animate-slider"]}
                        value={this.state.rotateTime}
                      />
                      <InputNumber
                        min={0}
                        max={30}
                        step={0.1}
                        size="small"
                        onChange={this.rotateTimeChange}
                        value={this.state.rotateTime}
                        className={css["vrp-animate-slider-input"]}
                      />
                    </div>
                    <div className={css["vrp-animate-slider-frame"]}>
                      <span className={css["vrp-animate-slider-span"]}>轨迹宽度：</span>

                      <Slider
                        min={0}
                        max={10}
                        step={0.1}
                        onChange={this.lineWidthChange}
                        className={css["vrp-animate-slider"]}
                        value={typeof this.state.lineWidth === "number" ? this.state.lineWidth : 0}
                      />
                      <InputNumber
                        min={0}
                        max={10}
                        step={0.1}
                        size="small"
                        value={this.state.lineWidth}
                        onChange={this.lineWidthChange}
                        className={css["vrp-animate-slider-input"]}
                      />
                    </div>

                    <div
                      className={css["vrp-animate-slider-frame"]}
                      style={{ marginBottom: "8px" }}
                    >
                      <span className={css["vrp-animate-slider-span"]}>轨迹颜色：</span>
                      <div style={{ paddingTop: 4 }}>
                        <ColorPicker
                          currentColor={this.state.color}
                          colorChange={this.colorChange}
                        />
                      </div>
                    </div>

                    {/* <div className={css['vrp-animate-slider-frame']}>
                                        <span className={css['vrp-animate-slider-span']}> 垂线轨迹：</span>
                                        <Switch checked={this.state.showVerticalLine}
                                            checkedChildren="开" unCheckedChildren="关"
                                            onChange={this.verticalLineChange}
                                        ></Switch>
                                        <span className={css['vrp-animate-slider-span']}> 垂线颜色：</span>
                                        <div style={{ paddingTop: 4 }}>
                                            <ColorPicker
                                                currentColor={this.state.verticalLineColor}
                                                colorChange={this.verticalLineColorChange}
                                                colorNum={2}
                                            />
                                        </div>


                                    </div> */}
                  </Fragment>
                ) : null}
              </div>
              <div className={css["vrp-animate-frame-attribute"]}>
                <div className={css["frame-attribute-header"]}>
                  <span className={css["vrp-animate-edit-header"]}>标签</span>

                  <VrpIcon
                    iconName={"icon-visible"}
                    title={this.state.showBalloon ? "隐藏标签" : "显示标签"}
                    style={{
                      color: this.state.showBalloon ? "#1890ff" : "",
                      fontSize: 20
                    }}
                    className={css["vrp-animate-attribute-icon"]}
                    onClick={this.showBalloonChange}
                  />
                  <Icon
                    type={`right`}
                    style={{
                      transition: "all 0.25s",
                      transform: balloonUnfold ? "rotate(90deg)" : "none",
                      color: balloonUnfold ? "#1890ff" : ""
                    }}
                    className={css["animate-icon-fold"]}
                    onClick={() => {
                      this.setState({ balloonUnfold: !balloonUnfold });
                    }}
                  />
                </div>
                {this.state.balloonUnfold ? (
                  <Fragment>
                    <div className={css["vrp-animate-slider-frame"]}>
                      <span
                        className={css["vrp-animate-slider-span"]}
                        style={{ marginRight: "4px" }}
                      >
                        图标：
                      </span>

                      <BalloonPicker
                        currentBalloon={this.state.updateData.imageUrl}
                        balloonChange={this.balloonChange}
                        balloonNum={4}
                      />
                      <Switch
                        checked={this.state.updateData.iconVisible}
                        checkedChildren="开"
                        unCheckedChildren="关"
                        style={{ marginRight: "8px", marginLeft: "auto" }}
                        onChange={this.BalloonIconSwitch}
                      />
                    </div>
                    <div className={css["vrp-animate-slider-frame"]}>
                      <span className={css["vrp-animate-slider-span"]}>文字：</span>
                      <Input
                        placeholder="请输入标签名"
                        value={this.state.updateData.title}
                        onChange={this.balloonTitleChange}
                        className={css["vrp-animate-balloon-input"]}
                      />
                      <Popover
                        placement="bottomRight"
                        content={
                          <>
                            <LabelItem text={"字号"}>
                              <Select
                                value={this.state.updateData.fontSize}
                                // style={{ width: 60 }}
                                size={"small"}
                                onChange={this.fontSizeChange}
                                placeholder="字号"
                                // disabled={!updateData.balloonVisible}
                              >
                                {list.map((item, i) => {
                                  return (
                                    <Option value={item.toString()} key={i}>
                                      {item}
                                    </Option>
                                  );
                                })}
                              </Select>
                            </LabelItem>
                            <LabelItem text={"颜色"}>
                              <ColorPicker
                                colorChange={this.titleColorChange}
                                currentColor={this.state.updateData.color}
                              />
                              {/*<ul className={colorCss["vrp-color-select"]}>*/}
                              {/*  {StrConfig.BalloonColorSelect.map(*/}
                              {/*    (item, index) => {*/}
                              {/*      return (*/}
                              {/*        <li*/}
                              {/*          key={index}*/}
                              {/*          style={{*/}
                              {/*            backgroundColor: item.color,*/}
                              {/*            width: "16px",*/}
                              {/*            height: "16px",*/}
                              {/*            ...(item.color == "white" ||*/}
                              {/*            item.color == "#fff"*/}
                              {/*              ? {*/}
                              {/*                  border:*/}
                              {/*                    "1px solid rgba(0, 0, 0, 0.15)"*/}
                              {/*                }*/}
                              {/*              : null)*/}
                              {/*          }}*/}
                              {/*          className={*/}
                              {/*            colorCss["color-circle"] +*/}
                              {/*           " " +*/}
                              {/*            (this.state.updateData.color ===*/}
                              {/*            item.color*/}
                              {/*              ? css["active"]*/}
                              {/*              : "")*/}
                              {/*          }*/}
                              {/*          onClick={() =>*/}
                              {/*            this.titleColorChange(item.color)*/}
                              {/*          }*/}
                              {/*        />*/}
                              {/*      );*/}
                              {/*    }*/}
                              {/*  )}*/}
                              {/*</ul>*/}
                            </LabelItem>
                          </>
                        }
                        trigger="hover"
                      >
                        <Button
                          style={{ padding: "0 4px" }}
                          className={css["vrp-animation-balloonBtu"]}
                        >
                          <VrpIcon
                            iconName={"icon-font-edit"}
                            title={"字体"}
                            style={{ fontSize: "15px", color: "#000" }}
                          />
                        </Button>
                      </Popover>

                      <Switch
                        checked={this.state.updateData.titleVisible}
                        checkedChildren="开"
                        unCheckedChildren="关"
                        style={{ marginRight: "8px", marginLeft: "auto" }}
                        onChange={this.BalloonTitleSwitch}
                      />
                    </div>
                    <div className={css["vrp-animate-slider-frame"]}>
                      <span className={css["vrp-animate-slider-span"]}>标签高度：</span>
                      <Slider
                        range
                        min={-20}
                        max={70}
                        className={css["vrp-animate-slider"]}
                        style={{ width: "195px" }}
                        value={[updateData.bottom ? updateData.bottom : 0, updateData.altitude]}
                        onChange={this.balloonHeightChange}
                      />
                    </div>
                  </Fragment>
                ) : null}
              </div>

              <div
                className={css["vrp-animate-frame-attribute"]}
                style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.05)" }}
              >
                <div className={css["frame-attribute-header"]}>
                  <span className={css["vrp-animate-edit-header"]}>模型-主</span>
                  <VrpIcon
                    iconName={"icon-visible"}
                    title={this.state.modelShow ? "模型隐藏" : "模型显示"}
                    className={css["vrp-animate-attribute-icon"]}
                    style={{
                      color: this.state.modelShow ? "#1890ff" : ""
                    }}
                    onClick={this.onlyModelShow}
                  />
                  <VrpIcon
                    iconName={"icon-repeat"}
                    title={this.state.isCircle ? "关闭循环" : "开启循环"}
                    style={{ color: this.state.isCircle ? "#1890ff" : "" }}
                    className={css["vrp-animate-attribute-icon"]}
                    onClick={this.setmodelCycle}
                  />

                  <Icon
                    type={`right`}
                    style={{
                      transition: "all 0.25s",
                      transform: modelUnfold ? "rotate(90deg)" : "none",
                      color: this.state.modelUnfold ? "#1890ff" : ""
                    }}
                    className={css["animate-icon-fold"]}
                    onClick={() => {
                      this.setState({ modelUnfold: !modelUnfold });
                    }}
                  />
                </div>

                {/* <VrpIcon
                                        iconName={'iconreverse-1'}
                                        title={this.state.isReverse ? "变原始路径" : "变反向路径"}
                                        style={{ color: this.state.isReverse ? '#1890ff' : '' }}
                                        className={css['vrp-animate-icon-xunhuan']}
                                        onClick={this.setReverseAnimation}
                                    />

                                    <VrpIcon
                                        iconName={'icon-repeat'}
                                        title={this.state.isCircle ? "关闭循环" : "开启循环"}
                                        style={{ color: this.state.isCircle ? '#1890ff' : '' }}
                                        className={css['vrp-animate-icon-xunhuan']}
                                        onClick={this.setmodelCycle}
                                    /> */}
                {this.state.modelUnfold ? (
                  <Fragment>
                    <ul className={css["vrp-animate-model"]}>
                      {/* {this.getModelElements()} */}

                      {/* {!animation.models ? (
                        <li className={css["vrp-animate-model-li"]}>
                          <Icon
                            className={css["vrp-animate-model-add"]}
                            type={"plus"}
                            onClick={this.addModel}
                          />
                        </li>
                      ) : animation.models.length >= 1 ? null : (
                        <li className={css["vrp-animate-model-li"]}>
                          <Icon
                            className={css["vrp-animate-model-add"]}
                            type={"plus"}
                            onClick={this.addModel}
                          />
                        </li>
                      )} */}

                      {animation.models[0] ? (
                        <AnimateModelItem
                          animation={this.props.animation}
                          model={animation.models[0]}
                          lineData={this.props.lineData}
                          reloadList={this.props.reloadList}
                          searchValue={this.props.searchValue}
                          closeModelFrame={this.closeModelFrame}
                        />
                      ) : (
                        <li className={css["vrp-animate-model-li"]}>
                          <Icon
                            className={css["vrp-animate-model-add"]}
                            type={"plus"}
                            onClick={this.addModel}
                          />
                          {this.state.ModelList ? (
                            <AnimateModelList
                              animation={animation}
                              closeModal={this.closeModelFrame}
                              lineData={lineData}
                              type={this.state.modelListType}
                              key={lineData.id}
                              replacedModel={this.state.replacedModel}
                              reloadList={this.props.reloadList}
                            />
                          ) : null}
                        </li>
                      )}
                    </ul>
                    {/* <div className={css['vrp-animate-model-ahead']}>
                                        <Icon
                                            className={css["vrp-animate-model-add"]}
                                            type={"plus"}
                                            onClick={this.addModel}
                                        />
                                    </div> */}
                    <div className={css["vrp-animate-slider-frame"]}>
                      <span className={css["vrp-animate-slider-span"]}>模型大小：</span>
                      <Slider
                        min={-6}
                        max={20}
                        onChange={this.modelSizeChange}
                        className={css["vrp-animate-slider"]}
                        value={
                          typeof Math.round(this.state.modelSize * 5) === "number"
                            ? this.state.modelSize * 5
                            : 0
                        }
                      />
                      <InputNumber
                        min={-6}
                        max={20}
                        onChange={this.modelSizeChange}
                        size="small"
                        value={Math.round(this.state.modelSize * 5)}
                        className={css["vrp-animate-slider-input"]}
                      />
                    </div>
                    <div className={css["vrp-animate-slider-frame"]}>
                      <span className={css["vrp-animate-slider-span"]}>模型速度：</span>

                      <Slider
                        min={1}
                        max={3000}
                        step={0.1}
                        onChange={this.speedChange}
                        className={css["vrp-animate-slider"]}
                        value={typeof this.state.speed === "number" ? this.state.speed : 0}
                      />
                      <InputNumber
                        min={1}
                        max={3000}
                        step={0.1}
                        onChange={this.speedChange}
                        size="small"
                        value={this.state.speed}
                        className={css["vrp-animate-slider-input"]}
                      />
                    </div>
                    <div
                      className={css["vrp-animate-slider-frame"]}
                      style={{ marginBottom: "8px" }}
                    >
                      <Checkbox
                        checked={this.state.isGap}
                        className={css["vrp-animate-interval-checkbox"]}
                        onChange={this.setIntervalStatus}
                      />
                      <span className={css["vrp-animate-slider-span-interval"]}>间隔：</span>

                      <Slider
                        min={-20}
                        max={600}
                        onChange={this.intervalChange}
                        className={css["vrp-animate-slider"]}
                        value={typeof this.state.interval === "number" ? this.state.interval : 0}
                      />
                      <InputNumber
                        value={this.state.interval}
                        min={-20}
                        max={600}
                        size="small"
                        onChange={this.intervalChange}
                        className={css["vrp-animate-slider-input"]}
                      />
                    </div>
                  </Fragment>
                ) : null}
                {/* <div className={css['vrp-animate-slider-frame']}>
                                        <span className={css['vrp-animate-slider-span']}> 间隔频率：</span>
                                        <Slider
                                            min={-6}
                                            max={20}
                                            onChange={this.modelSizeChange}
                                            className={css['vrp-animate-slider']}
                                            value={typeof (Math.round(this.state.modelSize * 5)) === 'number' ? this.state.modelSize * 5 : 0}
                                        />
                                        <InputNumber
                                            min={-6}
                                            max={20}
                                            onChange={this.modelSizeChange}
                                            size="small"
                                            value={Math.round(this.state.modelSize * 5)}
                                            className={css['vrp-animate-slider-input']}
                                        />
                                    </div>
                                    <div className={css['vrp-animate-slider-frame']}>
                                        <span className={css['vrp-animate-slider-span']}> 水平角度：</span>
                                        <Slider
                                            min={-180}
                                            max={180}
                                            step={0.1}
                                            onChange={this.rotateChange}
                                            className={css['vrp-animate-slider']}
                                            value={typeof (this.state.modelAngle) === 'number' ? this.state.modelAngle : 0}
                                        />
                                        <InputNumber
                                            min={-180}
                                            max={180}
                                            step={0.1}
                                            onChange={this.rotateChange}
                                            size="small"
                                            value={this.state.modelAngle}
                                            className={css['vrp-animate-slider-input']}
                                        />
                                    </div> */}
              </div>

              {/* <div className={css['vrp-animate-frame-attribute']}>
                                    <span className={css['vrp-animate-attribute-header']}>模型属性-尾</span>
                                    <VrpIcon
                                        iconName={'icon-visible'}
                                        title={this.state.modelShow ? "模型隐藏" : "模型显示"}
                                        style={{ color: this.state.modelShow ? '#1890ff' : '', cursor: "pointer", marginLeft: 5 }}
                                        onClick={
                                            this.onlyModelShow
                                        } />
                                    <VrpIcon
                                        iconName={'icon-repeat'}
                                        title={this.state.isCircle ? "关闭循环" : "开启循环"}
                                        style={{ color: this.state.isCircle ? '#1890ff' : '' }}
                                        className={css['vrp-animate-icon-xunhuan']}
                                        onClick={this.setmodelCycle}
                                    />
                                    <ul className={css['vrp-animate-model']}
                                    >

                                        {this.getModelElements()}

                                        {!AnimateModel.linemodels[lineData.id] ?
                                            <li className={css['vrp-animate-model-li']}>
                                                <Icon
                                                    className={css["vrp-animate-model-add"]}
                                                    type={"plus"}
                                                    onClick={this.addModel}
                                                />
                                            </li> : AnimateModel.linemodels[lineData.id].length >= 4 ? null :
                                                <li className={css['vrp-animate-model-li']}>
                                                    <Icon
                                                        className={css["vrp-animate-model-add"]}
                                                        type={"plus"}
                                                        onClick={this.addModel}
                                                    />
                                                </li>
                                        }

                                    </ul>
                                    <div className={css['vrp-animate-slider-frame']}>
                                        <span className={css['vrp-animate-slider-span']}> 尾迹大小：</span>
                                        <Slider
                                            min={-6}
                                            max={20}
                                            onChange={this.modelSizeChange}
                                            className={css['vrp-animate-slider']}
                                            value={typeof (Math.round(this.state.modelSize * 5)) === 'number' ? this.state.modelSize * 5 : 0}
                                        />
                                        <InputNumber
                                            min={-6}
                                            max={20}
                                            onChange={this.modelSizeChange}
                                            size="small"
                                            value={Math.round(this.state.modelSize * 5)}
                                            className={css['vrp-animate-slider-input']}
                                        />
                                    </div>

                                    <div className={css['vrp-animate-slider-frame']}>
                                        <span className={css['vrp-animate-slider-span']}>尾迹穿透：</span>
                                        <Slider
                                            min={1}
                                            max={300}
                                            step={0.1}
                                            onChange={this.speedChange}
                                            className={css['vrp-animate-slider']}
                                            value={typeof (this.state.speed) === 'number' ? this.state.speed : 0}
                                        />
                                        <InputNumber
                                            min={1}
                                            max={300}
                                            step={0.1}
                                            onChange={this.speedChange}
                                            size="small"
                                            value={this.state.speed}
                                            className={css['vrp-animate-slider-input']}
                                        />
                                    </div>



                                    <div className={css['vrp-animate-slider-frame']}>
                                        <span className={css['vrp-animate-slider-span']}> 水平角度：</span>
                                        <Slider
                                            min={-180}
                                            max={180}
                                            onChange={this.rotateChange}
                                            className={css['vrp-animate-slider']}
                                            value={typeof (this.state.modelAngle) === 'number' ? this.state.modelAngle : 0}
                                        />
                                        <InputNumber
                                            min={1}
                                            max={300}
                                            step={0.1}
                                            onChange={this.speedChange}
                                            size="small"
                                            value={this.state.speed}
                                            className={css['vrp-animate-slider-input']}
                                        />


                                    </div>

                                    <div className={css['vrp-animate-slider-frame']}>

                                        <span className={css['vrp-animate-slider-span']}> 跟随间距：</span>
                                        <Slider
                                            min={-20}
                                            max={600}
                                            onChange={this.intervalChange}
                                            className={css['vrp-animate-slider']}
                                            value={typeof (this.state.interval) === 'number' ? this.state.interval : 0}
                                        />
                                        <InputNumber
                                            value={this.state.interval}
                                            min={-20}
                                            max={600}
                                            size="small"
                                            onChange={this.intervalChange}
                                            className={css['vrp-animate-slider-input']}
                                        />
                                    </div>

                                    <div className={css['vrp-animate-slider-frame']}>
                                        <span className={css['vrp-animate-slider-span']}> 透明度：</span>
                                        <Slider
                                            min={-180}
                                            max={180}
                                            onChange={this.rotateChange}
                                            className={css['vrp-animate-slider']}
                                            value={typeof (this.state.modelAngle) === 'number' ? this.state.modelAngle : 0}
                                        />
                                        <InputNumber
                                            min={1}
                                            max={300}
                                            step={0.1}
                                            onChange={this.speedChange}
                                            size="small"
                                            value={this.state.speed}
                                            className={css['vrp-animate-slider-input']}
                                        />
                                    </div>
                                </div> */}

              {/* <div className={css['vrp-animate-frame-attribute']}>
                                    <span className={css['vrp-animate-attribute-header']}>启动设置</span>
                                    <div className={css['vrp-animate-slider-frame']}>

                                        <Radio.Group onChange={this.triggerChange} value={this.state.triggerAtr}>
                                            <span className={css['vrp-animate-Radio-span']}>手动触发：</span>
                                            <Radio value={"handle"} />
                                            <span className={css['vrp-animate-Radio-span']}>自动触发：</span>
                                            <Radio value={"auto"} />

                                        </Radio.Group>
                                        <span className={css['vrp-animate-Radio-span']}
                                            style={{ marginTop: 2 }}> 进度条：</span>
                                        <Switch defaultChecked={this.state.progressBar}
                                            checkedChildren="显示" unCheckedChildren="关闭"
                                            style={{ marginLeft: 3 }}
                                            onChange={this.progressSwitch}></Switch>
                                    </div>

                                    <div className={css['vrp-animate-slider-frame']}>
                                        <span className={css['vrp-animate-slider-span']}> 跟随触发：</span>
                                        <span className={css['vrp-animate-slider-span']}> 触发延迟：</span>
                                        <InputNumber
                                            min={1}
                                            max={300}
                                            step={0.1}
                                            onChange={this.speedChange}
                                            size="small"
                                            value={this.state.speed}
                                            className={css['vrp-animate-slider-input']}
                                        />
                                    </div>
                                </div> */}

              <div className={css["vrp-animate-frame-footer"]}>
                {this.isActive === "finish" ? (
                  ""
                ) : (
                  <div className={css["vrp-animate-play"]}>
                    <Icon type="step-backward" className={css["vrp-animate-play-icon"]} />
                    {this.isActive === "stop" ? (
                      <Icon
                        type="caret-right"
                        style={{ color: "#1890ff" }}
                        className={css["vrp-animate-play-icon"]}
                        onClick={this.setAnimationPlay.bind(this, "play")}
                      />
                    ) : (
                      <Icon
                        type="pause"
                        style={{ color: "#1890ff" }}
                        className={css["vrp-animate-play-icon"]}
                        onClick={this.setAnimationPlay.bind(this, "stop")}
                      />
                    )}
                    <Icon type="step-forward" className={css["vrp-animate-play-icon"]} />
                  </div>
                )}

                <Popconfirm
                  title={"确定要删除吗？"}
                  okText={"确定"}
                  cancelText={"取消"}
                  onConfirm={this.lineDelete.bind(this)}
                >
                  <Button>删除</Button>
                </Popconfirm>
                {this.state.isChange != false ? (
                  <Button type="primary" onClick={this.saveAttribute}>
                    保存
                  </Button>
                ) : (
                  <Button disabled className={css["vrp-animate-save-but"]}>
                    保存
                  </Button>
                )}
                {this.isActive === "finish" ? (
                  <Button type="primary" onClick={this.setAnimationPlay.bind(this, "Splay")}>
                    测试
                  </Button>
                ) : (
                  <Button onClick={this.setAnimationPlay.bind(this, "finish")}>停止</Button>
                )}
                {/* <Button
                                    type="primary"
                                    onClick={this.setEulerRotation.bind(this)}
                                >
                                    测试2
                                    </Button> */}
                {/* <Popconfirm title={'确定要复制吗？'}
                                    okText={'确定'}
                                    cancelText={'取消'}
                                    onConfirm={this.props.lineCopy.bind(this, this.props.animation, this.animationCopy)}>
                                    <Button type="primary">复制</Button>
                                </Popconfirm> */}

                {/* <Switch defaultChecked={this.state.showVerticalLine}
                                        checkedChildren="开" unCheckedChildren="关"
                                        onChange={this.verticalLineChange}
                                    ></Switch> */}
              </div>
            </div>
          )}
        </div>

        {/* {this.state.progressBar ?
                    <AnimateProgress
                        animation={this.props.animation}
                        isActive={this.isActive}
                    /> : null
                } */}
      </Fragment>
    );
  }
}

export default AnimateItem;
