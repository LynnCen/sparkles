import React, { Component, Fragment } from "react";
import {
  Input,
  Button,
  Slider,
  Icon,
  message,
  Popconfirm,
  Select,
  InputNumber,
  Dropdown,
  Menu,
  Switch,
  Popover
} from "antd";
import VrpIcon from "../../components/VrpIcon";
import IconSelector from "../../components/selector/IconSelector";
import Config from "../../config/Config";
import AnimationService from "../../services/AnimationService";
import AnimateModelItem from "./AnimateModelItem";
import ColorPicker from "../../components/ColorPicker";
import BalloonPicker from "../../components/BalloonPicker";
import { UpdateBalloon } from "./AnimateData";
import AnimateProgress from "./AnimateProgress";
import InputRowWithTable from "../../modules/Cad/InputRowWithTable";
import DataService from "../../services/DataService";
import TransCoordinate from "../../components/tools/Coordinate";
import moment from "moment";
import { initialUrl } from "./AnimateData";
import { LabelItem } from "../../components/LabelItem";
import GPSAnimation from "../../components/model/GPS/Animation";
import GPSModel from "../../components/model/GPS/Model";

const Option = Select.Option;

const css = require("../../styles/scss/animate.scss");

interface GpsAnimateItemProps {
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

interface GpsAnimateItemStates {
  updateData: UpdateBalloon;
  initialUrl: initialUrl;
  lineShow: boolean;
  modelShow: boolean;
  unfold: boolean;
  atrUnfold: boolean;
  balloonUnfold: boolean;
  modelUnfold: boolean;
  altitude: number;
  speed: number;
  depthTest: boolean;
  title: string;
  isChange: any;
  lineStyle: string;
  planId: number;
  type: string;
  ModelList: boolean;
  modelSource: any[];
  model: any;
  replacedModel: any;
  modelAngle: number;
  modelListType: string;
  isReverse: boolean;
  lineClose: boolean;
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
  gpsData: any[];
  selectData: any[];
  onRotate: boolean;
  shareIcon: string;
  reVertices: any[];
  loading: string;
  contentsData: any[];
  contentsId: number[];
  contentsTitle: string;
}

class GpsAnimateItem extends Component<GpsAnimateItemProps, GpsAnimateItemStates> {
  isActive = "finish";
  loading;
  newLine;
  a = [
    {
      title: "gps数据源1",
      data: [],
    },
  ];

  constructor(props: GpsAnimateItemProps) {
    super(props);
    this.state = {
      lineShow: true,
      modelShow: true,
      unfold: false,
      atrUnfold: false,
      balloonUnfold: false,
      modelUnfold: false,
      altitude: 0.0,
      speed: 30,
      depthTest: false, //穿透
      title: "线条",
      isChange: false,
      lineStyle: "flat2d",
      planId: 0,
      type: "animateline",
      ModelList: false,
      modelSource: [],
      model: 0,
      reVertices: [],
      replacedModel: null,
      modelAngle: 0,
      isReverse: false,
      lineClose: false,
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
      lineType: "GPSLine",
      gpsData: [],
      selectData: [],
      onRotate: true,
      shareIcon: "",
      contentsTitle: "",
      loading: "loading",
      contentsData: [],
      contentsId: [],
      initialUrl: {
        modelUrl: "animate/boat1.a3x",
        modelImg: "animate/boat1.jpg",
        balloonIcon: "animate/tubiao.png"
      },
      updateData: {
        title: "",
        id: 0,
        color: "white",
        titleVisible: true, //文字
        iconVisible: true, //图标
        imageUrl: "animate/tubiao.png",
        altitude: 0,
        fontSize: 16,
        whethshare: false,
        bottom: 0
      }
    };
  }

  componentWillMount() {
    this.setLineForm(this.props.animation);
    if (this.props.animation.id === this.props.allAnimation[0].id) {
      this.setState(
        {
          unfold: true
        },
        () => {}
      );
    }
    this.getContentsData();
    this.setSelectedData(this.props.animation);
    //    this.setPoint()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.animation != this.props.animation) {
      this.setLineForm(nextProps.animation);

      this.setSelectedData(nextProps.animation);

      if (nextProps.animation.id === nextProps.allAnimation[0].id) {
        this.setState({
          unfold: true
        });
      }
      // if (GPSAnimation.animations[0] && nextProps.lineData.id === GPSAnimation.animations[0].id) {
      //     this.setState({
      //         unfold: true
      //     })
      // }
    }
  }

  /**
   * @description  获取指定船只历史位置信息并添加到地图上
   */

  getShipList = (item, elevation, animation, position) => {
    AnimationService.getShipList({ code: item.code }, (flag, res) => {
      if (flag) {
        const { data } = res;

        let geo = TransCoordinate.WGS84ToMercator({
          x: data[0].lon,
          y: data[0].lat,
          z: position.z()
        });
        let line = animation.setGPSLine(item.code);
        this.setInitialModel(item, geo);
        animation.setGpsBalloon(item, geo, this.state.initialUrl.balloonIcon);

        animation.AddGpsVertices(item.code, elevation, data);
        line.saveAttribute(data);
        // animation.line.saveAttribute(res.data);
      } else {
        console.log(res);
      }
    });
  };
  /**
   * @description  设置已选船只数组
   */
  setSelectedData = animation => {
    const { selectData } = this.state;

    if (animation.models.length != 0) {
      for (var i = 0; i < animation.models.length; i++) {
        let modelCode = animation.models[i].code;
        let item = GPSAnimation.gpsData.find(s => s.code == modelCode);
        if (item) {
          selectData.push(item);
          this.setState(
            {
              selectData
            },
            () => {
              // animation.setGpsBalloon(item, geo);
              //  this.getShipList(modelCode,animation.models[i]);
            }
          );
        }
      }
      this.setState(
        {
          loading: "finish"
        },
        () => {}
      );
    } else {
      this.setState(
        {
          loading: "finish",
          selectData: []
        },
        () => {}
      );
    }
  };

  getContentsData = () => {
    let data = {
      planId: Config.PLANID
    };
    DataService.getContents(data, (flag, res) => {
      if (flag) {
        this.setState(
          {
            contentsData: res.data
          },
          () => {}
        );
      } else {
        console.log(res);
      }
    });
  };

  componentWillUnmount() {
    this.setState({
      unfold: false
    });
  }

  setLineForm = animation => {
    const p = animation.models;
    const lineData = animation.line;
    const balloon = animation.balloon;
    // const panels = app._store.getState().cadModal.panels;
    if (lineData) {
      this.setState(
        {
          depthTest: JSON.parse(lineData.depthTest),
          title: animation.title,
          altitude: lineData.altitude,
          lineClose: lineData.isClose,
          lineStyle: lineData.lineStyle,
          planId: Config.PLANID,
          type: lineData.type,
          ModelList: false,
          showBalloon: lineData.showBalloon,
          lineShow: lineData.isShow,
          visualAngle: lineData.visualAngle,
          lineWidth: lineData.width,
          contentsId: animation.contentsId,
          shareIcon: animation.shareIcon,
          showVerticalLine: animation.showVerticalLine
          //   lineType: lineData.type,
        },
        () => {}
      );
      if (balloon) {
        this.setState(
          {
            updateData: {
              title: balloon.title,
              id: balloon.id,
              color: balloon.fontColor,
              titleVisible: balloon.titleVisible,
              iconVisible: balloon.iconVisible,
              imageUrl: balloon.icon,
              altitude: balloon.height,
              fontSize: balloon.fontSize,
              whethshare: false,
              bottom: animation.balloonBottom
            }
          },
          () => {}
        );
      }

      if (p[0]) {
        this.setState(
          {
            model: p[0],
            speed: p[0].speed,
            modelShow: p[0].isShow,
            rotateTime: p[0].rotateTime,
            modelSource: animation.models,
            modelAngle: p[0].rotate,
            modelSize: p[0].scale[0] - 1,
            initialUrl: {
              modelUrl: p[0].url,
              modelImg: p[0].imgurl,
              balloonIcon: balloon.icon
            }
          },
          () => {}
        );
        //   console.log(p[0]);
      } else {
        this.setState(
          {
            model: [],
            speed: 0,
            modelShow: true,
            rotateTime: 0.5,
            modelSource: [],
            modelAngle: 0,
            modelSize: 0,
            initialUrl: {
              modelUrl: "animate/boat1.a3x",
              modelImg: "animate/boat1.jpg",
              balloonIcon: "animate/tubiao.png"
            }
          },
          () => {}
        );
        // this.setState({
        //     selectData:[]
        // })
      }
    }
  };
  /**
   * @description  保存gpsline
   */
  saveGPSLine = animation => {
    const gpsLine = animation.line;
    const visualAngle: any = [];

    let gpsData: any = {};
    let balloonData: any = {};

    if (gpsLine.visualAngle && gpsLine.visualAngle.length > 0) {
      gpsLine.visualAngle.forEach(vertex => {
        visualAngle.push({ x: vertex.x(), y: vertex.y(), z: vertex.z() });
      });
    }
    if (visualAngle.length) {
      // gpsData.visualAngle = visualAngle;
      gpsData.visualAngle = JSON.stringify(visualAngle);
    } else {
      gpsData.visualAngle = "null";
    }

    gpsData.title = animation.title;
    gpsData.altitude = this.state.altitude.toString();
    gpsData.depthTest = gpsLine.depthTest;
    gpsData.isShow = gpsLine.isShow;
    gpsData.width = gpsLine.width.toString();
    gpsData.color = gpsLine.color;
    gpsData.planId = Config.PLANID;
    gpsData.verticalLineColor = animation.verticalLineColor;
    gpsData.showVerticalLine = animation.showVerticalLine;
    gpsData.isReverse = animation.isReverse;
    gpsData.trajType = "GPSLine";
    if (animation.contentsId) {
      gpsData.contentsId = animation.contentsId.toString();
    }
    gpsData.isLevel = gpsLine.isLevel;
    gpsData.shareUrl = animation.shareIcon;
    gpsData.createTime = animation.createTime;

    balloonData.balloonTitle = animation.balloonTitle;
    balloonData.fontSize = animation.fontSize;
    balloonData.fontColor = animation.fontColor;
    balloonData.iconUrl = animation.iconUrl;
    balloonData.balloonHeight = animation.balloonHeight;
    balloonData.balloonBottom = animation.balloonBottom;
    balloonData.titleVisible = animation.titleVisible;
    balloonData.iconVisible = animation.iconVisible;
    //const ddata = Object.assign({ visualAngle: position }, gpsData);
    let a = {
      id: animation.id,
      str: JSON.stringify(gpsData),
      gpsBalloon: JSON.stringify(balloonData)
    };

    AnimationService.modGPSLine(a, (flag, res) => {
      if (flag) {
        // message.success("修改成功");
        if (animation.models.length) {
          this.saveModelAttribute(animation);
        } else {
          message.success("保存成功");
        }
        // line.id = res.data;
      } else {
        message.error(res.message);
        console.log(res);
      }
    });
    this.props.reloadList(this.props.searchValue);
  };
  setInitialUrl = (modelUrl, imgUrl) => {
    const { initialUrl } = this.state;
    initialUrl.modelUrl = modelUrl;
    initialUrl.modelImg = imgUrl;
    this.setState(
      {
        initialUrl
      },
      () => {
        // console.log(this.state.initialUrl)
      }
    );
  };

  saveModelAttribute = animation => {
    const modelSource = animation.models;
    for (var i = 0; i < modelSource.length; i++) {
      let mdata: any = {};
      let geo: string =
        modelSource[i].geo.x() + "," + modelSource[i].geo.y() + "," + modelSource[i].geo.z();

      mdata.title = modelSource[i].title;
      mdata.rotate = modelSource[i].rotateZ.toString();
      mdata.imgUrl = modelSource[i].imgurl;
      mdata.url = modelSource[i].url;
      mdata.geo = geo;
      mdata.lat = modelSource[i].lat.toString();
      mdata.lon = modelSource[i].lon.toString();
      mdata.gpsId = animation.id;
      mdata.modelSize = modelSource[i].scale[0].toString();
      mdata.planId = Config.PLANID;
      mdata.isShow = modelSource[i].isShow;
      mdata.code = modelSource[i].code;

      let a = { id: modelSource[i].id, str: JSON.stringify(mdata) };
      AnimationService.modGPSModel(a, (flag, res) => {
        if (flag) {
          //         message.success("保存成功")
        } else {
          message.error("保存失败");
        }
      });

      //mdata.id = model.id;
    }
  };

  titleChange = e => {
    this.setState(
      {
        title: e.target.value,
        isChange: true
      },
      () => {
        this.props.lineData.title = this.state.title;
        this.props.animation.title = this.state.title;
      }
    );
  };

  altitudeChange = value => {
    this.setState(
      {
        altitude: value,
        isChange: true
      },
      () => {
        const { lineData, animation } = this.props;
        const { model, updateData } = this.state;
        lineData.altitude = value;

        for (var i = 0; i < animation.gpsLine.length; i++) {
          animation.gpsLine[i].setAttribute(this.state.altitude, this.state.lineClose);

          animation.gpsBalloon[i].setAnimationHeight(
            updateData.bottom ? updateData.bottom + this.state.altitude : this.state.altitude,
            updateData.altitude + this.state.altitude
          );
        }

        if (model) {
          animation.setModelAlititude(this.state.altitude);
        }
        animation.setVerticalAltitude(value);
      }
    );
  };

  lineWidthChange = value => {
    this.setState(
      {
        lineWidth: value,
        isChange: true
      },
      () => {
        const { animation } = this.props;
        for (var i = 0; i < animation.gpsLine.length; i++) {
          animation.gpsLine[i].setWidth(value);
        }
        // lineData.setWidth(value);
      }
    );
  };
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

  speedChange = value => {
    this.setState({
      speed: value,
      isChange: true
    });
  };

  rotateChange = value => {
    if (this.state.onRotate) {
      if (this.state.model) {
        this.setState(
          {
            modelAngle: value,
            isChange: "rotateChange"
          },
          () => {
            if (this.state.onRotate) {
              this.state.model.setModelRotation(this.state.modelAngle);
            }
          }
        );
      } else {
        message.error("请先添加船只");
      }
    }
  };
  rotateTypeChange = value => {
    const { animation } = this.props;
    this.setState({
      onRotate: value
    });
    animation.setGPSModelRotate(value);
  };

  modelSizeChange = value => {
    let va = value * 0.2;
    this.setState(
      {
        modelSize: va,
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

  saveAttribute = () => {
    const { animation } = this.props;
    this.saveGPSLine(animation);

    this.props.animation.speed = this.state.speed;
    this.setState({
      isChange: false
    });
    this.props.stopPlay("finish");
  };

  lineDelete = () => {
    const { lineData, animation } = this.props;
    const { maps, vrPlanner } = Config;
    const { modelSource } = this.state;
    this.setState({ unfold: false });
    let len = modelSource.length;
    const gpsLineLayer = maps.getLayerById("gpsLineLayer");
    let balloonLayer =
      maps.getLayerById("balloonLayer") || new vrPlanner.Layer.FeatureLayer("balloonLayer");

    AnimationService.delGPSLine({ id: lineData.id }, (flag, _) => {
      if (flag) {
        //    lineData.remove();
        animation.remove();
        if (modelSource.length != 0) {
          for (var i = 0; i < len; i++) {
            // a.push(modelSource[i].id)
            modelSource[i].remove(lineData.id);
            this.delGPSModel(modelSource[i].id);
            balloonLayer.removeFeature(animation.gpsBalloon[i].point);
            gpsLineLayer.removeFeature(animation.gpsLine[i].line);
            gpsLineLayer.removeFeature(animation.gpsVerticalLine[i].line);
            balloonLayer.removeFeature(animation.gpsBalloon[i].line);
          }
        }
        //animation.removeGPSItem();
        this.props.reloadList(this.props.searchValue);
      } else {
        message.error("删除失败");
      }
    });
  };

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
    if (this.isActive != "finish") {
      this.setAnimation("finish");
    }
  };

  flyToLine = () => {
    const { lineData, animation } = this.props;
    const { maps } = Config;
    if (lineData.visualAngle.length > 0) {
      Config.maps.getCamera().setPosition(lineData.visualAngle[0], lineData.visualAngle[1]);
      this.changeOnLocation();
    } else {
      if (animation.models.length) {
        // lineData.focus();
        let lookAt = new Config.vrPlanner.GeoLocation(
          animation.models[0].geo.x(),
          animation.models[0].geo.y(),
          0
        );
        let position = new Config.vrPlanner.GeoLocation(
          animation.models[0].geo.x(),
          animation.models[0].geo.y(),
          100
        );
        maps.getCamera().setPosition(position, lookAt);
        this.changeOnLocation();
      } else {
        message.error("请先添加船只");
      }
    }
  };
  changeOnLocation = () => {
    const { maps } = Config;
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

  lineCloseChange = () => {
    this.setState(
      {
        lineClose: !this.state.lineClose,
        isChange: true
      },
      () => {
        const { lineData, animation } = this.props;

        if (animation)
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

  lineDepthTest = () => {
    const { animation } = this.props;
    this.setState(
      {
        depthTest: !this.state.depthTest,
        isChange: true
      },
      () => {
        for (var i = 0; i < animation.gpsLine.length; i++) {
          animation.gpsLine[i].setDepthTest(this.state.depthTest);
        }
      }
    );
  };

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

  getModelElements = () => {
    const { modelSource } = this.state;
    if (!modelSource[0]) {
      return null;
    } else {
      return modelSource.map((value, index) => {
        if (index === 0) {
          return (
            <AnimateModelItem
              animation={this.props.animation}
              model={value}
              lineData={this.props.lineData}
              reloadList={this.props.reloadList}
              searchValue={this.props.searchValue}
              closeModelFrame={this.closeModelFrame}
              key={index}
              setInitialUrl={this.setInitialUrl}
            />
          );
        }
      });
    }
  };

  setAnimation = value => {
    // if (this.state.isChange === true && value === "Splay") {
    //     this.saveAttribute();
    // }
    // this.props.animation.setAnimation(value);
    // this.isActive = value;
    // console.log(lineData.vertices[0])
    // this.setPoint(lineData.vertices[0]);
    // lineData.line.addVertex(lineData.vertices[0]);
    // lineData.line.addVertex(lineData.vertices[1]);
    // lineData.line.addVertex(lineData.vertices[2]);
  };

  allAttributeShow = () => {
    let value = this.state.modelShow || this.state.lineShow;
    // this.setState({
    //     //   lineShow: !this.state.lineShow,
    //     modelShow: !this.state.modelShow

    // }, () => {
    //     const { lineData, animation } = this.props;
    //     if (animation.models) {
    //         const model = animation.models;
    //         for (var i = 0; i < model.length; i++) {
    //             model[i].setVisible(this.state.modelShow);

    //         }
    //         this.saveModelAttribute(lineData);
    //     }
    // })

    this.onlyModelShow(!value);
    this.onlyLineShow(!value);
    this.BalloonSwitch(!value);
    this.verticalLineChange(!value);
  };
  onlyLineShow = value => {
    this.setState(
      {
        lineShow: typeof value === "boolean" ? value : !this.state.lineShow,
        isChange: true
      },
      () => {
        const { animation } = this.props;
        for (var i = 0; i < animation.gpsLine.length; i++) {
          animation.gpsLine[i].setVisible(this.state.lineShow);
          animation.gpsLine[i].isShow = this.state.lineShow;
          animation.line.isShow = this.state.lineShow;
        }
        //lineData.setVisible(this.state.lineShow);
      }
    );
  };

  onlyModelShow = value => {
    this.setState(
      {
        modelShow: typeof value === "boolean" ? value : !this.state.modelShow,
        isChange: true
      },
      () => {
        const { animation } = this.props;
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

  // checkChange = () => {
  //   if (this.state.isChange === true) {
  //     this.setAnimation("finish");
  //   }
  // };

  colorChange = (value) => {
    const { animation } = this.props;
    this.setState({ color: value, isChange: true }, () => {
      /// this.props.lineData.setColor(value);value
      for (var i = 0; i < animation.gpsLine.length; i++) {
        animation.gpsLine[i].setColor(value);
      }
    });
  };

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
  verticalLineChange = value => {
    this.setState(
      {
        showVerticalLine: value,
        isChange: true
      },
      () => {
        const { animation } = this.props;
        animation.showVerticalLine = value;
        animation.gpsVerticalLine.forEach(verline => {
          verline.line.setVisible(value);
        });
      }
    );
  };
  verticalLineColorChange = value => {
    const { animation } = this.props;
    this.setState({ verticalLineColor: value }, () => {
      animation.verticalLineColor = value;
      for (var i = 0; i < animation.gpsVerticalLine.length; i++) {
        animation.setGPSVerticalLineAttr(animation.gpsVerticalLine[i].line);
        animation.gpsVerticalLine[i].color = value;
      }
      // this.props.animation.setVerticalLineColor(value);
      this.props.animation.verticalLineColor = value;
    });
  };

  // BalloonSwitch = value => {
  //     this.setState({ showBalloon: !this.state.showBalloon }, () => {
  //         this.props.animation.balloon.setVisible(this.state.showBalloon);
  //         this.props.animation.showBalloon = this.state.showBalloon;
  //     })
  // }

  BalloonSwitch = value => {
    const { updateData } = this.state;
    const { animation } = this.props;
    let a = typeof value === "boolean" ? !value : updateData.titleVisible || updateData.iconVisible;
    if (a) {
      updateData.titleVisible = false;
      updateData.iconVisible = false;
    } else {
      updateData.titleVisible = true;
      updateData.iconVisible = true;
    }
    this.setState(
      {
        updateData
      },
      () => {
        // animation.balloon.setVisible(false);
        animation.titleVisible = this.state.updateData.titleVisible;
        animation.iconVisible = this.state.updateData.iconVisible;
        this.setIcon();
        if (animation.gpsBalloon.length) {
          for (var i = 0; i < animation.gpsBalloon.length; i++) {
            animation.gpsBalloon[i].setVisible(this.state.updateData.titleVisible);
          }
        } else {
          //   message.error("请先添加船只");
        }
      }
    );
  };

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
        if (animation.gpsBalloon.length) {
          for (var i = 0; i < animation.gpsBalloon.length; i++) {
            animation.gpsBalloon[i].setAnimationHeight(
              value[0] + animation.line.altitude,
              value[1] + animation.line.altitude
            );
          }
        } else {
          //     message.error("请先添加船只");
        }
      }
    );
  };

  fontSizeChange = value => {
    const { updateData } = this.state;
    updateData.fontSize = Number(value);
    this.setState({ updateData, isChange: true }, () => {
      this.props.animation.fontSize = this.state.updateData.fontSize;
      this.setIcon();
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
      titleVisible: titleVisible,
      iconVisible: iconVisible
    } = updateData;
    if (animation.gpsBalloon.length) {
      for (var i = 0; i < animation.gpsBalloon.length; i++) {
        animation.gpsBalloon[i].setIcon({
          fontColor,
          title,
          fontSize,
          icon,
          titleVisible,
          iconVisible
        });
      }
    } else {
      message.error("请先添加船只");
    }
  };

  titleColorChange = color => {
    const { updateData } = this.state;
    const { animation } = this.props;
    if (animation.balloon) {
      updateData.color = color;
      this.setState({ updateData, isChange: true }, () => {
        this.props.animation.fontColor = color;
        this.setIcon();
      });
    }
  };
  BalloonTitleSwitch = value => {
    const { updateData } = this.state;
    const { animation } = this.props;

    updateData.titleVisible = value;
    animation.titleVisible = value;

    this.setState(
      {
        updateData,
        isChange: true
      },
      () => {
        if (!value && !updateData.iconVisible) {
          animation.gpsBalloon.forEach(balloon => {
            balloon.setVisible(false);
          });
        } else {
          animation.gpsBalloon.forEach(balloon => {
            balloon.setVisible(true);
          });
        }
        this.setIcon();
      }
    );
  };
  BalloonIconSwitch = value => {
    const { updateData } = this.state;
    const { animation } = this.props;
    animation.iconVisible = value;
    updateData.iconVisible = value;

    this.setState(
      {
        updateData,
        isChange: true
      },
      () => {
        if (!value && !updateData.titleVisible) {
          animation.gpsBalloon.forEach(balloon => {
            balloon.setVisible(false);
          });
        } else {
          animation.gpsBalloon.forEach(balloon => {
            balloon.setVisible(true);
          });
        }
        this.setIcon();
      }
    );
  };

  balloonTitleChange = e => {
    const title = e.target.value;
    let { updateData } = this.state;
    updateData.title = title;
    this.setState({ updateData, isChange: true }, () => {
      this.props.animation.balloonTitle = this.state.updateData.title;
      this.setIcon();
    });
  };

  progressTimeChange = value => {
    this.setState({
      minutes: value,
      seconds: value % 60
    });
  };

  progressSwitch = value => {
    //const {minutes, seconds} =this.state;
    // let minutes = sumTime / 60;
    // let seconds = sumTime % 60;
    this.setState({ progressBar: value });
  };
  selectSource = item => {
    const { selectData } = this.state;
    const { animation } = this.props;
    let p = selectData.find(i => i.code === item.code);
    let a = selectData.indexOf(p);

    if (a === -1) {
      if (item.lon === null) {
        message.error("该船只无坐标信息");
      } else {
        this.setState(
          {
            selectData: this.state.selectData.concat(item)
          },
          () => {
            if (item.lon) {
              this.showGPS(item);
            }
          }
        );
      }
    } else {
      let model = animation.models.find(s => s.code == item.code);

      this.delGPSModel(model.id);
      selectData.splice(a, 1);
      animation.removeGPSItem(item);
    }
  };

  getElevationPre = item => {
    const { maps } = Config;
    maps
      .getElevationPrecise(item.x(), item.y())
      .done(elevation => {
        return elevation;
      })
      .fail(err => {
        console.log(err.getMessage);
      });
  };

  delGPSModel = id => {
    AnimationService.delGPSModel({ id: id }, (flag, res) => {
      if (flag) {
        console.log("删除模型成功");
      } else {
        console.log("删除模型失败");
      }
    });
  };

  /**
   * @description  设置初始模型
   */
  setInitialModel = (item, lineGeo) => {
    const { maps, vrPlanner } = Config;
    const { animation } = this.props;
    let data = this.props.lineData;
    //    let linegeo = data.vertices[0];

    let linerotate = 0; // data.calLineAngleZ(0) + 180;
    let modelLayer = maps.getLayerById("animateModelLayer");
    if (!modelLayer) {
      modelLayer = new vrPlanner.Layer.FeatureLayer("animateModelLayer");
      maps.addLayer(modelLayer);
    }
    const initialModel = new GPSModel({
      geo: lineGeo,
      // url: initialValue.source,
      url: this.state.initialUrl.modelUrl,
      //  imgurl: initialValue.img,
      imgurl: this.state.initialUrl.modelImg,
      rotateZ: linerotate,
      title: "船01",
      code: item.code,
      lineId: data.id,
      speed: this.state.speed,
      isShow: true,
      course: item.angle,
      scale: [1, 1, 1]
    });
    // initialModel.setModel(url);
    const { point } = initialModel;
    modelLayer.addFeature(point);
    point.setGeoLocation(lineGeo.add(0, 0, this.state.altitude));
    let mdata: any = {};
    let geo: string =
      initialModel.geo.x() + "," + initialModel.geo.y() + "," + initialModel.geo.z();

    mdata.title = initialModel.title;
    mdata.rotate = initialModel.rotateZ.toString();
    mdata.imgUrl = initialModel.imgurl;
    mdata.url = initialModel.url;
    mdata.geo = geo;
    mdata.lat = item.lat.toString();
    mdata.lon = item.lon.toString();
    mdata.gpsId = data.id;
    mdata.modelSize = initialModel.scale[0].toString();
    mdata.planId = Config.PLANID;
    mdata.isShow = initialModel.isShow;
    mdata.code = item.code;

    let a = { str: JSON.stringify(mdata) };

    AnimationService.addGPSModel(a, (flag, res) => {
      if (flag) {
        console.log("add initialModel");
        initialModel.id = res.data;
      } else {
        console.log("fair add initialModel");
      }
    });

    animation.setAmodel(initialModel);
    this.setLineForm(this.props.animation);
    animation.setGPSVerticalLine(initialModel);
  };
  showGPS = async item => {
    const { maps } = Config;
    const { animation } = this.props;
    let lon = item.lon;
    let lat = item.lat;
    const _geo = TransCoordinate.WGS84ToMercator({
      x: item.lon,
      y: item.lat,
      z: 0
    });
    let ele = maps.getElevation(_geo.x(), _geo.y());

    let elevation;

    elevation = await this.getElevationPre(_geo);

    if (!elevation) {
      elevation = ele;
    }
    let geo = TransCoordinate.WGS84ToMercator({
      x: lon,
      y: lat,
      z: 400
    });
    let lookAt = new Config.vrPlanner.GeoLocation(geo.x(), geo.y(), 0);
    let position = new Config.vrPlanner.GeoLocation(geo.x(), geo.y(), elevation + 0.1 || 0);
    maps.getCamera().setPosition(geo, lookAt);
    //         //   this.setInitialModel(item, position);
    this.getShipList(item, elevation + 0.1, animation, position);
    //   this.setPoint(geo);
    // animation.setGpsBalloon(item, lookAt.add(0, 0, elevation + 0.1), this.state.initialUrl.balloonIcon);
    //animation.setGPSVerticalLine()
  };

  setDataSource = () => {
    if (GPSAnimation.gpsData) {
      this.a[0].data = [].concat(GPSAnimation.gpsData);
    }
  };

  iconSelector = url => {
    const { animation } = this.props;
    this.setState(
      {
        shareIcon: url,
        isChange: true
      },
      () => {
        animation.shareIcon = url;
      }
    );
  };
  setNewGPSLine = () => {
    const { reVertices } = this.state;
    const { maps, vrPlanner } = Config;
    const _this = this;
    this.newLine = new vrPlanner.Feature.Line();
    let lineLayer = maps.getLayerById("animateLineLayer");
    const lineStyle = new vrPlanner.Style.LineStyle();
    lineStyle.setWidth(1);
    lineStyle.setColor(new vrPlanner.Color("#ff0000"));
    this.newLine.setStyle(lineStyle);
    lineLayer.addFeature(this.newLine);

    for (var i = 0; i < this.state.selectData.length; i++) {
      let time = _this.state.selectData[0].time;

      AnimationService.getShipList({ code: this.state.selectData[i].code }, (flag, res) => {
        if (flag) {
          let geoData = res.data;

          let pro = res.data.find(i => i.time == time);

          if (pro) {
            _this.state.selectData[0].time = pro.time;

            let a = res.data.indexOf(pro);
            for (var j = 0; j < a; j++) {
              let geo = TransCoordinate.WGS84ToMercator({
                x: geoData[j].lon,
                y: geoData[j].lat,
                z: 4
              });
              reVertices.push(geo);
              this.setState(
                {
                  reVertices
                },
                () => {
                  this.newLine.addVertex(geo);
                }
              );

              // Aline.vertices.push(geo);
              // Aline.line.addVertex(
              //     geo.add(new Config.vrPlanner.Math.Double3(0, 0, this.line.altitude))
              // );
            }
          } else {
            message.error("暂时没有更新信息");
          }
        }
      });
    }
  };
  reGetPoiList = async () => {
    const { maps, vrPlanner } = Config;
    const { animation } = this.props;

    let newVertices: any = [];
    this.newLine = new vrPlanner.Feature.Line();
    let textLayer = new vrPlanner.Layer.FeatureLayer("textLayer");
    const lineStyle = new vrPlanner.Style.LineStyle();
    lineStyle.setWidth(this.state.lineWidth);
    lineStyle.setColor(new vrPlanner.Color("#ff0000"));
    this.newLine.setStyle(lineStyle);
    maps.addLayer(textLayer);
    let itemData = GPSAnimation.gpsData.find(item => item.code == animation.models[0].code);
    let time = moment(itemData.datatime);

    textLayer.addFeature(this.newLine);

    await new Promise((resolve, reject) => {
      AnimationService.getShipList({ code: "text" }, (flag, res) => {
        if (flag) {
          newVertices = res.data.filter(item => moment(item.datatime).isAfter(time));
          newVertices.unshift(itemData);

          resolve();
        } else {
          reject();
        }
      });
    });

    if (newVertices.length == 1) {
      message.info("当前无可更新数据");
      newVertices = [];
    } else {
      this.setState(
        {
          reVertices: newVertices
        },
        () => {}
      );
      for (let i = 0; i < newVertices.length; i++) {
        let geo = TransCoordinate.WGS84ToMercator({
          x: newVertices[i].lon,
          y: newVertices[i].lat,
          z: this.props.animation.line.altitude + animation.models[0].geo.z()
        });

        this.newLine.addVertex(geo);
      }
    }
    animation.getGPSVisible();
    //  this.setPoint()
    this.calPointLine();

    // if (reVertices.length === 0) {
    //     this.setNewGPSLine();

    // } else {

    // }
    // this.props.animation.AddGpsVertices(modelSource[0], reVertices);
    // reVertices.splice(0, reVertices.length);
    // lineLayer.removeFeature(this.newLine);
    // this.setNewGPSLine();

    // //TODO  以下为测试内容

    // let geoData = {
    //     lat: 31.233791,
    //     lon: 121.29096,
    // };
    // let geoData2 = {
    //     lat: 31.233991,
    //     lon: 121.29106,
    // }
    // let geo1 = TransCoordinate.WGS84ToMercator({
    //     x: geoData.lon,
    //     y: geoData.lat,
    //     z: 10
    // });
    // let geo2 = TransCoordinate.WGS84ToMercator({
    //     x: geoData2.lon,
    //     y: geoData2.lat,
    //     z: 10
    // })
    // this.setPoint(geo1, geo2);
    // this.setPoint(geo2)
  };

  calPointLine = () => {
    const { vrPlanner } = Config;
    let a1 = new vrPlanner.Math.Double3.create(13502181.486536752, 3663617.4110302906, 10);

    let a2 = new vrPlanner.Math.Double3.create(13502226.014333062, 3663773.645150592, 10);
    let a3 = new vrPlanner.Math.Double3.create(13502214.882383985, 3663734.586434455, 10);
    // this.setPoint(a1, "#f0ffff")
    // this.setPoint(a2, "#ffff00");

    let vec1 = a2.sub(a1);
    let vec3 = a3.sub(a2);
    let angle = Config.vrPlanner.Math.Vecmath.angleBetween(vec3, vec1);
  };

  setPoint = () => {
    const { maps, vrPlanner } = Config;
    let a = new vrPlanner.GeoLocation(13515239.262805417, 3709518.6110029984, 15);

    console.log(a);
    let point = new vrPlanner.Feature.Point();
    point.setGeoLocation(a);

    let style = new vrPlanner.Style.PointStyle();
    style.setRadius(5);
    style.setColor(new vrPlanner.Color("#000000"));
    style.setDepthTest(false);
    point.setStyle(style);
    let layer = new vrPlanner.Layer.FeatureLayer("textLayer") || maps.getLayerById("textLayer");
    maps.addLayer(layer);
    layer.addFeature(point);
    maps.getCamera().flyTo(a);
    //
    //     let a2 = new Config.vrPlanner.GeoLocation(
    //         13502226.014333062,
    //         3663773.645150592,
    //         10
    //     )

    //     let point1 = new vrPlanner.Feature.Point(
    //         a2
    //     );

    //     // let point2 = new vrPlanner.Feature.Point(geo[1]);
    //     // let point3 = new vrPlanner.Feature.Point(geo[2]);

    //     let pointStyle = new vrPlanner.Style.PointStyle();
    //     pointStyle.setRadius(5);
    //     pointStyle.setColor(new vrPlanner.Color('blue'));
    //     point1.setStyle(pointStyle);
    //     // point2.setStyle(pointStyle);
    //   //  maps.getCamera().flyTo(new vrPlanner.GeoLocation(geo[1]),
    //         new vrPlanner.GeoLocation(geo[0]))
    //     // point3.setStyle(pointStyle);

    //     let layer = new vrPlanner.Layer.FeatureLayer("textLayer") ||
    //         maps.getLayerById(`textLayer`);
    //     maps.addLayer(layer);
    //     layer.addFeature(point1);
    // layer.addFeature(point2);

    // layer.addFeature(point3);

    // let line = new vrPlanner.Feature.Line();
    // let lineStyle = new vrPlanner.Style.LineStyle();
    // lineStyle.setWidth(2);
    // lineStyle.setColor(new vrPlanner.Color("#ffff00"));
    // line.setStyle(lineStyle);

    // line.addVertex(geo);
    // line.addVertex(geo2)
    // layer.addFeature(line);
  };

  selectContentModal = key => {
    //  console.log(key);
    key &&
      DataService.getContents({ planId: Config.PLANID, key }, (f, res) => {
        if (f) {
          this.setState({ contentsData: res.data });
        } else message.error(res.message);
      });
  };

  contentChange = (value, options) => {
    const { animation } = this.props;
    if (value) {
      this.setState(
        {
          contentsId: value,
          isChange: true
        },
        () => {
          animation.contentsId = value;
        }
      );

      //    this.props.geometry.contentId = value;
    }
  };
  animationCopy = animation => {
    const { models } = animation;
    const { maps, vrPlanner } = Config;
    let data = {};

    let modelLayer =
      maps.getLayerById("animateModelLayer") ||
      new vrPlanner.Layer.FeatureLayer("animateModelLayer");
    let gpsLineLayer =
      maps.getLayerById("gpsLineLayer") || new vrPlanner.Layer.FeatureLayer("gpsLineLayer");
    let balloonLayer =
      maps.getLayerById("balloonLayer") || new vrPlanner.Layer.FeatureLayer("balloonLayer");
    for (let i = 0; i < animation.models.length; i++) {
      gpsLineLayer.addFeature(animation.gpsLine[i].line);
      balloonLayer.addFeature(animation.gpsBalloon[i].point);
      gpsLineLayer.addFeature(animation.gpsVerticalLine[i].line);
      let geo: string = models[i].geo.x() + "," + models[i].geo.y() + "," + models[i].geo.z();

      // this.setInitialModel(item, animation.models[i].geo)

      modelLayer.addFeature(models[i].point);
      models[i].point.setGeoLocation(models[i].geo.add(0, 0, this.state.altitude));

      data = {
        title: models[i].title,
        rotate: models[i].rotate.toString(),
        imgUrl: models[i].imgurl,
        url: models[i].url,
        geo: geo,
        lat: models[i].lat.toString(),
        lon: models[i].lon.toString(),
        gpsId: animation.id,
        modelSize: models[i].scale[0].toString(),
        planId: Config.PLANID,
        isShow: models[i].isShow,
        code: models[i].code
      };
      //console.log(data)

      AnimationService.addGPSModel({ str: JSON.stringify(data) }, (flag, res) => {
        if (flag) {
          models[i].id = res.data;
        } else {
          console.log(res);
        }
      });
      //    animation.setGpsBalloon(item, models[i].geo, this.state.initialUrl.balloonIcon);
      //  animation.setGPSVerticalLine(models[i])
    }
    //
  };

  render() {
    const { animation } = this.props;
    const { updateData } = this.state;
    const fontSize_Num = 22;
    const list: Number[] = [];
    for (let i = 0; i < fontSize_Num; i++) {
      list.push(12 + i * 2);
    }
    // this.checkChange();
    this.setDataSource();
    let styleName = "vrp-animate-infor-item";

    if (this.props.highLightId === this.props.animation.id) {
      styleName = "vrp-animate-infor-item-highlight";
    }

    const { unfold, atrUnfold, balloonUnfold, modelUnfold } = this.state;
    //  const [Atrunfold, setUnfold] = useState(false)
    const smenu = (
      <Menu>
        <Menu.Item onClick={this.allAttributeShow} style={{ cursor: "pointer" }}>
          <VrpIcon
            iconName={"icon-visible"}
            title={this.state.modelShow || this.state.lineShow ? "整体隐藏" : "整体显示"}
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
          onClick={this.props.highLight.bind(this, this.props.animation.id)}
        >
          <div className={css["vrp-animate-infor-header"]}>
            <div className={css["header-img-share"]}>
              <IconSelector
                classType={"2"}
                onSelect={this.iconSelector}
                value={this.state.shareIcon}
                type="square22"
                style={{ width: "22px" }}
              />
            </div>
            <div className={css["header-lineType"]}>
              {this.state.lineType === "GPSLine" ? "GPS" : null}
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
              <div
                className={css["flex-center-left"]}
                style={{
                  marginBottom: "8px"
                }}
              >
                <InputRowWithTable
                  label={"数据源"}
                  placeholder={
                    this.state.loading == "finish"
                      ? this.state.selectData.length
                        ? this.state.selectData.map(f => f.code).join(",")
                        : "请选择数据源"
                      : "数据加载中"
                  }
                  title={"gps数据源"}
                  selections={this.state.selectData}
                  dataSource={this.a}
                  // className = {css['animate-']}
                  onSelect={this.selectSource}
                />
              </div>

              <div className={css["vrp-animate-frame-attribute"]}>
                <div className={css["frame-attribute-header"]}>
                  <span className={css["vrp-animate-edit-header"]}>属性</span>
                  <VrpIcon
                    iconName={"icon-visible"}
                    style={{
                      color: this.state.lineShow ? "#1890ff" : "",
                      fontSize: 20
                    }}
                    className={css["vrp-animate-attribute-icon"]}
                    title={this.state.lineShow ? "轨迹隐藏" : "轨迹显示"}
                    onClick={this.onlyLineShow}
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

                  <VrpIcon
                    iconName={"icon-level"}
                    title={this.state.isLevel ? "还原轨迹" : "水平轨迹"}
                    style={{
                      color: this.state.isLevel ? "#1890ff" : "",
                      fontSize: 20
                    }}
                    className={css["vrp-animate-attribute-icon"]}
                    onClick={this.isLevelChange}
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
                </div>
                {this.state.atrUnfold ? (
                  <Fragment>
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

                    <div className={css["vrp-animate-slider-frame"]}>
                      <span className={css["vrp-animate-slider-span"]}> 轨迹高度：</span>

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
                      <span className={css["vrp-animate-slider-span"]}>轨迹颜色：</span>
                      <div style={{ paddingTop: 4 }}>
                        <ColorPicker
                          currentColor={this.state.color}
                          colorChange={this.colorChange}
                          // pickerClassName={"gps-colorplus"}
                        />
                      </div>
                    </div>
                  </Fragment>
                ) : null}
              </div>

              <div className={css["vrp-animate-frame-attribute"]}>
                <div className={css["frame-attribute-header"]}>
                  <span className={css["vrp-animate-edit-header"]}>标签</span>
                  <VrpIcon
                    iconName={"icon-visible"}
                    className={css["vrp-animate-attribute-icon"]}
                    title={
                      updateData.iconVisible || updateData.titleVisible ? "标签隐藏" : "标签显示"
                    }
                    style={{
                      color: updateData.titleVisible || updateData.iconVisible ? "#1890ff" : ""
                    }}
                    onClick={this.BalloonSwitch}
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
                                size={"small"}
                                onChange={this.fontSizeChange}
                                placeholder="字号"
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
                            </LabelItem>
                            {/*<ul className={colorCss["vrp-color-select"]}>*/}
                            {/*    {StrConfig.BalloonColorSelect.map(*/}
                            {/*        (item, index) => {*/}
                            {/*            return (*/}
                            {/*                <li*/}
                            {/*                    key={index}*/}
                            {/*                    style={{*/}
                            {/*                        backgroundColor: item.color,*/}
                            {/*                        width: "16px",*/}
                            {/*                        height: "16px",*/}
                            {/*                        ...(item.color == "white" ||*/}
                            {/*                            item.color == "#fff"*/}
                            {/*                            ? {*/}
                            {/*                                border:*/}
                            {/*                                    "1px solid rgba(0, 0, 0, 0.15)"*/}
                            {/*                            }*/}
                            {/*                            : null)*/}
                            {/*                    }}*/}
                            {/*                    className={*/}
                            {/*                        colorCss["color-circle"] +*/}
                            {/*                        " " +*/}
                            {/*                        (this.state.updateData.color ===*/}
                            {/*                            item.color*/}
                            {/*                            ? css["active"]*/}
                            {/*                            : "")*/}
                            {/*                    }*/}
                            {/*                    onClick={() =>*/}
                            {/*                        this.titleColorChange(item.color)*/}
                            {/*                    }*/}
                            {/*                />*/}
                            {/*            );*/}
                            {/*        }*/}
                            {/*    )}*/}
                            {/*</ul>*/}
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
                    <div
                      className={css["vrp-animate-slider-frame"]}
                      style={{ marginBottom: "8px", marginRight: "8px" }}
                    >
                      <span className={css["vrp-animate-slider-span"]}>下拉信息栏：</span>

                      <Select
                        allowClear
                        showSearch
                        value={this.state.contentsId}
                        placeholder={"搜索信息模板(可选)"}
                        filterOption={false}
                        style={{ width: "196px" }}
                        //    onSearch={debounce(this.selectContentModal, 500)}
                        onSearch={this.selectContentModal}
                        onChange={this.contentChange}
                        mode="multiple"
                        size="small"
                        notFoundContent={null}
                        getPopupContainer={triggerNode => triggerNode}
                        // optionFilterProp={"children"}
                      >
                        {this.state.contentsData.map(e => (
                          <Select.Option key={e.id} value={e.id}>
                            <div
                              className={css["select-item-tip"] + " " + css["flex-center-between"]}
                            >
                              {e.title}
                            </div>
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </Fragment>
                ) : null}
              </div>

              <div
                className={css["vrp-animate-frame-attribute"]}
                style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.05)" }}
              >
                <div className={css["frame-attribute-header"]}>
                  <span className={css["vrp-animate-edit-header"]}>模型</span>
                  <VrpIcon
                    iconName={"icon-visible"}
                    className={css["vrp-animate-attribute-icon"]}
                    title={this.state.modelShow ? "模型隐藏" : "模型显示"}
                    style={{ color: this.state.modelShow ? "#1890ff" : "" }}
                    onClick={this.onlyModelShow}
                  />
                  <Icon
                    type={`right`}
                    style={{
                      transition: "all 0.25s",
                      transform: modelUnfold ? "rotate(90deg)" : "none",
                      color: modelUnfold ? "#1890ff" : ""
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
                                    /> */}

                {/* <VrpIcon
                                        iconName={'icon-repeat'}
                                        title={this.state.isCircle ? "关闭循环" : "开启循环"}
                                        style={{ color: this.state.isCircle ? '#1890ff' : '' }}
                                        className={css['vrp-animate-icon-xunhuan']}
                                        onClick={this.setmodelCycle}
                                    /> */}

                {this.state.modelUnfold ? (
                  <Fragment>
                    <ul className={css["vrp-animate-model"]}>
                      {this.getModelElements()}

                      {!animation.models ? (
                        <li className={css["vrp-animate-model-li"]}>
                          <Icon
                            className={css["vrp-animate-model-add"]}
                            type={"plus"}
                            // onClick={this.addModel}
                          />
                        </li>
                      ) : animation.models.length >= 1 ? null : (
                        <li className={css["vrp-animate-model-li"]}>
                          <Icon
                            className={css["vrp-animate-model-add"]}
                            type={"plus"}
                            //onClick={this.addModel}
                          />
                        </li>
                      )}
                    </ul>

                    <LabelItem text={"模型大小"}>
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
                    </LabelItem>
                    <LabelItem text={"水平角度"}>
                      <Slider
                        min={-180}
                        max={180}
                        step={0.1}
                        onChange={this.rotateChange}
                        style={{ width: "95px" }}
                        className={css["vrp-animate-slider"]}
                        value={
                          typeof this.state.modelAngle === "number" ? this.state.modelAngle : 0
                        }
                      />
                      <InputNumber
                        min={-180}
                        max={180}
                        step={0.1}
                        onChange={this.rotateChange}
                        size="small"
                        value={this.state.modelAngle}
                        className={css["vrp-animate-slider-input"]}
                      />
                      <Switch
                        checked={this.state.onRotate}
                        className={css["model-rotate-switch"]}
                        checkedChildren="开"
                        unCheckedChildren="关"
                        onChange={this.rotateTypeChange}
                      />
                    </LabelItem>

                    <LabelItem text={"垂线轨迹"}>
                      <Switch
                        checked={this.state.showVerticalLine}
                        checkedChildren="开"
                        unCheckedChildren="关"
                        onChange={this.verticalLineChange}
                      />
                    </LabelItem>
                    <LabelItem text={"垂线颜色"}>
                      <ColorPicker
                        currentColor={this.state.verticalLineColor}
                        colorChange={this.verticalLineColorChange}
                        // pickerClassName={"gps-colorplus"}
                      />
                    </LabelItem>
                  </Fragment>
                ) : null}
              </div>

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
                        // onClick={this.setAnimation.bind(this, "play")}
                      />
                    ) : (
                      <Icon
                        type="pause"
                        style={{ color: "#1890ff" }}
                        className={css["vrp-animate-play-icon"]}
                        // onClick={this.setAnimation.bind(this, "stop")}
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

                {/* <Button type="primary" onClick={this.reGetPoiList}>
                                    测试
                </Button> */}
                <Popconfirm
                  title={"确定要复制吗？"}
                  okText={"确定"}
                  cancelText={"取消"}
                  onConfirm={this.props.lineCopy.bind(
                    this,
                    this.props.animation,
                    this.animationCopy
                  )}
                >
                  <Button type="primary">复制</Button>
                </Popconfirm>
              </div>
            </div>
          )}
        </div>

        {this.state.progressBar ? (
          <AnimateProgress animation={this.props.animation} isActive={this.isActive} />
        ) : null}
      </Fragment>
    );
  }
}

export default GpsAnimateItem;
