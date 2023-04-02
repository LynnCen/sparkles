import { Component } from "react";
import { PageHeader, Input, Button, notification, Cascader, message, Icon, Menu } from "antd";
import Config from "../../config/Config";
import Tools from "../../components/tools/Tools";
import DrawInit from "../../components/tools/DrawInit";
import CustomFun from "../../config/CustomFun";
import moment from "moment";
import AnimateItem from "../animate/AnimateItem";
import GpsAnimateItem from "../animate/GpsAnimateItem";
import AnimationService from "../../services/AnimationService";
import ShowData from "../../components/tools/showData";
import { UpdateBalloon } from "../animate/AnimateData";
import { initialUrl } from "../animate/AnimateData";
import AnimateLine from "../../components/model/Animate/Line";
import PipeLine from "../../components/model/PipeLine";
import Animation from "../../components/model/Animate/Animation";
import GPSAnimation from "../../components/model/GPS/Animation";
import GPSLine from "../../components/model/GPS/Line";
import AnimateModel from "../../components/model/Animate/Model";
import GPSModel from "../../components/model/GPS/Model";
import Mark from "../../components/model/Mark";
import Line from "../../components/model/Line";

const css = require("../../styles/scss/animate.scss");
const { Search } = Input;

interface AnimationModelProps {}

interface AnimationModelStates {
  initialUrl: initialUrl;
  altitude: number;
  speed: number;
  interval: number;
  zIndex: number;
  line: AnimateLine;
  depthTest: boolean;
  title: string;
  isClose: boolean;
  planId: number;
  Alinesource: any[];
  linesource: any[];
  highLight: number;
  checkedIds: any;
  isActive: any;
  updateData: UpdateBalloon;
  gpsData: any[];
  unfold: boolean;
  lineType: string;
  shareOpen: boolean;
  options: any[];
  searchValue: string;
}

class AnimationModel extends Component<AnimationModelProps, AnimationModelStates> {
  constructor(props: AnimationModelProps) {
    super(props);
    this.state = {
      line: new AnimateLine({}),
      altitude: 0,
      speed: 30,
      interval: 0,
      zIndex: 0,
      depthTest: false,
      title: "轨迹",
      isClose: false,
      planId: 0,
      Alinesource: [],
      linesource: [],
      highLight: 0,
      checkedIds: {},
      isActive: "finish",
      gpsData: [],
      unfold: false,
      lineType: "",
      shareOpen: true,
      options: [
        {
          value: "CAD",
          label: "CAD",
          children: null,

          disabled: true
        },
        {
          value: "GPS",
          label: "GPS",
          children: null
        },
        {
          value: "线条",
          label: "线条",
          children: []
        }
      ],

      searchValue: "",
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
        imageUrl: "",
        altitude: 0,
        fontSize: 16,
        whethshare: false,
        bottom: 0
      }
    };
  }
  componentWillMount() {
    this.getDatas();
    this.getPipeData();
  }

  //获取已有线条数据
  getPipeData = () => {
    const { options } = this.state;

    let lineValue;
    options[2].children = [];
    for (var ii = 0; ii < PipeLine.pipes.length; ii++) {
      lineValue = {
        value: PipeLine.pipes[ii].title,
        label: PipeLine.pipes[ii].title
      };
      options[2].children.push(lineValue);
    }
    // a[2].children.push(b)

    this.setState({
      options
    });
  };
  //获取已有轨迹数据
  getDatas = (value = "") => {
    let cdata = Animation.animations.filter(item => String(item.title).indexOf(value) > -1);
    let ddata = GPSAnimation.animations.filter(item => String(item.title).indexOf(value) > -1);
    let source: any = [];
    let i = 0;
    let j = 0;
    let k = 0;

    while (i < cdata.length && j < ddata.length) {
      let value = moment(cdata[i].createTime).isSameOrAfter(ddata[j].createTime);
      if (value) {
        source[k++] = cdata[i++];
      } else {
        source[k++] = ddata[j++];
      }
    }
    if (i == cdata.length) {
      while (j < ddata.length) source[k++] = ddata[j++];
    } else if (j == ddata.length) {
      while (i < cdata.length) source[k++] = cdata[i++];
    }

    this.setState(
      {
        Alinesource: source,
        linesource: PipeLine.pipes
      },
      () => {
        console.log(this.state.linesource);
        //            console.log(this.state.Alinesource, GPSAnimation.animations);
      }
    );
    // options = [].concat(a)
  };

  //添加gpsline数据项
  gpsToALine = () => {
    let line = new GPSLine({
      lineType: "GPSLine",
      id: 1000
    });
    //this.getHighLightItemId(line.id);
    //      let animationP = ShowData.renderGPSAnimation(line, null);
    const animationP = new GPSAnimation({
      id: line.id,
      title: line.title,
      line: line
    });

    this.saveGPSLines(line, animationP);
  };

  //选取线条加入轨迹
  lineToAline = id => {
    const { maps, vrPlanner } = Config;
    var prototypeLine = PipeLine.pipes;
    // var d = Line.travels.filter(item => {
    //   return item.id === value;
    // });
    var line = new Line({ width: 10, depthTest: false });
    var lineLayer = maps.getLayerById("animateLineLayer");

    //循环查找匹配pipeline
    for (var i = 0; i < prototypeLine.length; i++) {
      if (id === prototypeLine[i].id) {
        const animateLine = new AnimateLine({
          lineType: "pipeLine"
        });
        line = animateLine.line;
        if (!lineLayer) {
          lineLayer = new vrPlanner.Layer.FeatureLayer("animateLineLayer");
          maps.addLayer(lineLayer);
        }
        //设置轨迹新增线条样式
        animateLine.line = prototypeLine[i].line.clone();
        let style = new vrPlanner.Style.LineStyle();
        style.setColor(new vrPlanner.Color("FFFF00"));
        style.setWidth(1);
        animateLine.line.setStyle(style);
        lineLayer.addFeature(animateLine.line);

        animateLine.lineStyle = prototypeLine[i].lineStyle;
        animateLine.altitude = prototypeLine[i].altitude;
        animateLine.id = 0;
        // animateLine.id = prototypeLine[i].id;
        animateLine.title = prototypeLine[i].title;
        animateLine.depthTest = prototypeLine[i].depthTest;
        animateLine.vertices = prototypeLine[i].vertices;
        animateLine.type = "line";

        //新增轨迹命名
        const d = Animation.animations.filter(
          item => String(item.title).indexOf(animateLine.title) > -1
        );

        let title = animateLine.title + "(";
        const dd = Animation.animations.filter(item => String(item.title).indexOf(title) > -1);
        if (d.length > 0) {
          animateLine.title = prototypeLine[i].title + "(" + (dd.length + 1) + ")";
        }

        this.saveLine(animateLine);
      }
    }
  };
  //drawline的callback
  openLineLayer = feature => {
    this.setState({
      line: feature
    });

    if (feature.getNumVertices() >= 3) this.saveLine(feature);
    document.body.style.cursor = "auto";
  };

  handleKeyDown = e => {
    CustomFun.onKeyDown(e, 27, () => {
      notification.destroy();
      DrawInit.DrawInit();
      window.removeEventListener("keydown", this.handleKeyDown);
      document.body.style.cursor = "auto";
    });
  };
  //保存gps轨迹数据
  saveGPSLines(gpsLine, animation) {
    const visualAngle: any = [];
    if (gpsLine.visualAngle.length > 0) {
      gpsLine.visualAngle.forEach(vertex => {
        visualAngle.push({ x: vertex.x(), y: vertex.y(), z: vertex.z() });
      });
    }
    animation.createTime = moment().format("YYYY-MM-DD HH:mm:ss");

    let gpsData: any = {};
    let balloonData: any = {};
    gpsData.title = animation.title;

    gpsData.altitude = gpsLine.altitude.toString();
    gpsData.depthTest = gpsLine.depthTest;
    gpsData.isShow = gpsLine.isShow;

    if (visualAngle.length) {
      gpsData.visualAngle = visualAngle;
    } else {
      gpsData.visualAngle = "null";
    }

    gpsData.width = gpsLine.width.toString();
    gpsData.color = gpsLine.color;
    gpsData.planId = Config.PLANID;
    gpsData.verticalLineColor = animation.verticalLineColor;
    gpsData.showVerticalLine = animation.showVerticalLine;
    gpsData.isReverse = animation.isReverse;
    gpsData.trajType = "GPSLine";
    gpsData.isLevel = gpsLine.isLevel;
    gpsData.shareUrl = animation.shareIcon;
    gpsData.createTime = moment().format("YYYY-MM-DD HH:mm:ss");

    balloonData.balloonTitle = animation.balloonTitle;
    balloonData.fontSize = animation.fontSize;
    balloonData.fontColor = animation.fontColor;
    balloonData.iconUrl = animation.iconUrl;
    balloonData.balloonHeight = animation.balloonHeight;
    balloonData.balloonBottom = animation.balloonBottom;
    balloonData.titleVisible = animation.titleVisible;
    balloonData.iconVisible = animation.iconVisible;
    balloonData.balloonBottom = animation.balloonBottom;

    let a = {
      str: JSON.stringify(gpsData),
      gpsBalloon: JSON.stringify(balloonData)
    };

    return new Promise((resolve, reject) => {
      AnimationService.addGPSLine(a, (flag, res) => {
        if (flag) {
          message.success("添加成功");
          animation.id = res.data;
          animation.line.id = res.data;
          animation.setAnimateLine();
          this.getDatas(this.state.searchValue);
          this.getHighLightItemId(animation.id);
          resolve();
        } else {
          message.error(res.message);
          console.log(res);
          reject();
        }
      });
    });
    //this.props.reloadList();
  }
  //保存轨迹数据
  saveLine = (line, animation?) => {
    const { updateData } = this.state;
    const position: any = [];
    line.vertices.forEach(vertex => {
      position.push({ x: vertex.x(), y: vertex.y(), z: vertex.z() });
    });
    let createTime = moment().format("YYYY-MM-DD HH:mm:ss");
    const visualAngle: any = [];
    if (line.visualAngle.length > 0) {
      line.visualAngle.forEach(vertex => {
        visualAngle.push({ x: vertex.x(), y: vertex.y(), z: vertex.z() });
      });
    }
    const lineData: any = {};
    const balloonData: any = {};
    lineData.isCircle = line.isCircle;
    lineData.isGap = line.isGap;
    lineData.isActive = "false";
    lineData.isShow = line.isShow;
    lineData.altitude = line.altitude.toString();
    lineData.interval = line.interval;
    lineData.title = line.title;
    lineData.depthTest = line.depthTest;
    lineData.isClose = line.isClose;
    lineData.planId = Config.PLANID;
    lineData.visualAngle = visualAngle;
    lineData.isChecked = line.isChecked;
    lineData.showBalloon = line.showBalloon;
    lineData.trajType = "animation";
    lineData.createTime = createTime;
    lineData.color = line.color;
    lineData.width = line.width;
    lineData.trajType = "drawLine";
    //  lineData.color = line.

    balloonData.balloonTitle = updateData.title;
    balloonData.fontSize = updateData.fontSize;
    balloonData.fontColor = updateData.color;
    balloonData.iconUrl = updateData.imageUrl;
    balloonData.balloonHeight = updateData.altitude;
    balloonData.titleVisible = updateData.titleVisible;
    balloonData.iconVisible = updateData.iconVisible;
    const linedata = Object.assign({ position: position }, lineData);
    let data = {
      str: JSON.stringify(linedata),
      animateBalloon: JSON.stringify(balloonData)
    };
    let value = 3;
    return new Promise((resolve, reject) => {
      AnimationService.addALine(data, (flag, res) => {
        if (flag) {
          //    message.success("保存成功");
          line.id = res.data;
          this.getHighLightItemId(line.id);
          let animationP = ShowData.renderAnimation(line, null, createTime);

          this.setInitialModel(line, value, animationP);
          resolve();
        } else {
          console.log(res);
          reject();
        }
      });
    });
    //  });
  };
  //查找功能
  searchLine = value => {
    this.setState(
      {
        searchValue: value
      },
      () => {
        this.getDatas(value);
      }
    );
  };
  //绘制轨迹
  drawLine = () => {
    document.body.style.cursor = `url(${require("../../../public/icon/huizhi.ico")}),auto`;
    window.addEventListener("keydown", this.handleKeyDown);

    DrawInit.DrawInit();
    const animateLine = new AnimateLine({});
    const feature = animateLine.line;

    Tools.Draw(animateLine, this.openLineLayer);
    this.setState({
      line: feature
    });
  };
  //设置初始模型
  setInitialModel = (lineData, value, animation) => {
    const { maps, vrPlanner } = Config;

    let linegeo = lineData.vertices[0];
    let linerotate = animation.calLineAngleZ(0) + 180; //计算模型初始角度
    let modelLayer = maps.getLayerById("animateModelLayer");
    if (!modelLayer) {
      modelLayer = new vrPlanner.Layer.FeatureLayer("animateModelLayer");
      maps.addLayer(modelLayer);
    }

    const initialModel = new AnimateModel({
      geo: linegeo,
      url: this.state.initialUrl.modelUrl,
      imgurl: this.state.initialUrl.modelImg,
      rotateZ: linerotate,
      title: "船01",
      lineId: lineData.id,
      speed: this.state.speed,
      isShow: true
    });
    const { point } = initialModel;
    modelLayer.addFeature(point);
    initialModel.calModelSize();
    let mdata: any = [];
    let geo: string =
      initialModel.geo.x() + "," + initialModel.geo.y() + "," + initialModel.geo.z();

    mdata.title = initialModel.title;
    mdata.rotateZ = initialModel.rotateZ;
    mdata.rotateY = initialModel.rotateY;
    mdata.rotateX = initialModel.rotateX;
    mdata.imgurl = initialModel.imgurl;
    mdata.url = initialModel.url;
    mdata.geo = geo;
    mdata.rotatetime = initialModel.rotateTime;
    mdata.lineid = lineData.id;
    mdata.speed = initialModel.speed;
    mdata.modelsize = initialModel.scale[0];
    mdata.planId = Config.PLANID;
    mdata.isShow = initialModel.isShow;
    //保存模型数据至数据库
    AnimationService.addAModel(mdata, async (flag, res) => {
      if (flag) {
        console.log("add initialModel");
        initialModel.id = res.data;
      } else {
        console.log("fair add initialModel");
      }
    });

    initialModel.setAnimationModel(lineData.id);
    AnimateModel.setAnimationLineModel(lineData.id);
    animation.setAmodel(initialModel);
    this.getDatas();
  };
  //获取需要高亮的item
  getHighLightItemId = id => {
    this.setState({
      highLight: id
    });
  };
  //遍历显示轨迹列表
  getElements = values => {
    if (!values) {
      return null;
    } else {
      return values.map((value, index) => {
        if (value.type === "GPSAnimation") {
          return (
            <GpsAnimateItem
              highLight={this.getHighLightItemId}
              highLightId={this.state.highLight}
              animation={value}
              key={index}
              lineData={value.line}
              id={value.id}
              reloadList={this.getDatas}
              checkBoxChange={this.checkBoxChange}
              searchValue={this.state.searchValue}
              stopPlay={this.setAnimation}
              allAnimation={this.state.Alinesource}
              lineCopy={this.lineCopy}
            />
          );
        } else {
          return (
            <AnimateItem
              highLight={this.getHighLightItemId}
              highLightId={this.state.highLight}
              animation={value}
              key={index}
              lineData={value.line}
              id={value.id}
              reloadList={this.getDatas}
              checkBoxChange={this.checkBoxChange}
              searchValue={this.state.searchValue}
              stopPlay={this.setAnimation}
              allAnimation={this.state.Alinesource}
              lineCopy={this.lineCopy}
            />
          );
        }
      });
    }
  };
  //多选框  暂时保留
  checkBoxChange = (value, id) => {
    const { checkedIds } = this.state;
    checkedIds[id] = value;
    this.setState({
      checkedIds
    });
  };

  /**
   * @description 全选
   */
  checkAll = isCheck => {
    const { checkedIds, Alinesource } = this.state;
    if (isCheck === true) {
      for (let i = 0; i < Alinesource.length; i++) {
        let id = Alinesource[i].id;
        checkedIds[id] = isCheck;
      }
    } else {
      for (let i = 0; i < Alinesource.length; i++) {
        let id = Alinesource[i].id;
        checkedIds[id] = !checkedIds[id];
      }
    }
    this.setState(
      {
        checkedIds
      },
      () => {
        for (var i = 0; i < Animation.animations.length; i++) {
          let isChecked = checkedIds[Animation.animations[i].id];
          Animation.animations[i].setChecked(isChecked);
          //this.saveLine(Animation.animations[i].line);
        }
      }
    );
  };
  //轨迹运行控制
  setAnimation = value => {
    const { checkedIds } = this.state;
    for (let i = 0; i < Animation.animations.length; i++) {
      let id = Animation.animations[i].id;
      if (checkedIds[id] === true) {
        Animation.animations[i].setAnimation(value);
      }
    }
    this.setState({
      isActive: value
    });
  };
  //轨迹复制
  lineCopy = async (animation, callback) => {
    let animationCopy;
    let lineCopy;
    let gpsLineCopy: any = [];
    let gpsModelCopy: any = [];
    let gpsBalloonCopy: any = [];
    let gpsVerticalLineCopy: any = [];

    let modelsCopy: any = [];
    switch (animation.type) {
      case "animation":
        // animationCopy = new Animation({
        //     title: `${animation.title}` + "（1）",
        //     line: animation.line,
        // })
        // animationCopy.line.title = "aa";
        lineCopy = new AnimateLine(Object.assign({}, animation.line));
        for (let i = 0; i < animation.models.length; i++) {
          modelsCopy[i] = new AnimateModel(Object.assign({}, animation.models[i]));
        }
        animationCopy = new Animation({
          title: `${animation.title}` + "（1）",
          line: lineCopy,
          models: modelsCopy
        });
        await this.saveLine(animationCopy.line, animationCopy);
        callback(animationCopy);
        break;
      case "GPSAnimation":
        lineCopy = new GPSLine(Object.assign({}, animation.line));

        for (let i = 0; i < animation.gpsLine.length; i++) {
          gpsLineCopy[i] = new GPSLine(Object.assign({}, animation.gpsLine[i]));
          gpsModelCopy[i] = new GPSModel(Object.assign({}, animation.models[i]));
          gpsBalloonCopy[i] = new Mark(Object.assign({}, animation.gpsBalloon[i]));
          gpsVerticalLineCopy[i] = new AnimateLine(Object.assign({}, animation.gpsVerticalLine[i]));
        }

        animationCopy = new GPSAnimation({
          title: `${animation.title}` + "（1）",
          line: lineCopy,
          gpsLine: gpsLineCopy,
          models: gpsModelCopy,
          gpsBalloon: gpsBalloonCopy,
          gpsVerticalLine: gpsVerticalLineCopy
        });
        await this.saveGPSLines(animationCopy.line, animationCopy);
        callback(animationCopy);
        //     console.log(animation)

        break;
    }
  };
  //分享开关
  shareSwitch = value => {
    this.setState({
      shareOpen: value
    });
  };

  handleVisibleChange = value => {
    this.setState({ unfold: value });
  };

  //选取线条
  selectTravels = (value, selectedOptions) => {
    this.getPipeData();
    if (value[0] == "GPS") {
      this.gpsToALine();
    } else if (value[0] == "线条") {
      this.checkLine(value);
    }
    console.log("11111111");
  };
  //确认选取线条
  checkLine = value => {
    let pipeline = PipeLine.pipes.find(i => i.title == value[1]);

    if (pipeline) {
      this.lineToAline(pipeline.id);
    }
  };

  render() {
    return (
      <div className={css["vrp-animate-container"]}>
        <div className={css["vrp-animation-header"]}>
          {/* <span className={css["vrp-animation-pageheader"]}>轨迹</span> */}
          <PageHeader title="轨迹" className={css["vrp-animation-pageheader"]} />
        </div>
        <div className={css["vrp-animate-operate"]}>
          <Search
            placeholder="请输入查询内容"
            onChange={e => this.searchLine(e.target.value)}
            className={css["vrp-animate-search"]}
          />

          <Cascader
            options={this.state.options ? this.state.options : []}
            placeholder="选取"
            className={css["vrp-animate-selectline"]}
            //  style={{ width: '77px' }}
            changeOnSelect
            onChange={this.selectTravels}
          />
          {/* <Dropdown
                        overlay={selectMenu}
                        trigger={["click"]}
                        placement="bottomCenter"
                        onVisibleChange={this.handleVisibleChange}
                        visible={this.state.unfold}
                    //  className={css['vrp-animate-selectline']}
                    >
                        <Button
                            className={css["vrp-animate-selectLine"]}
                            onClick={this.chooseLine}
                        >
                            选取
              <Icon
                                type={`right`}
                                style={{
                                    color: this.state.unfold ? "#1890ff" : ""
                                }}
                                className={css["m-l-sm"]}
                                onClick={() => {
                                    this.setState({ unfold: !unfold });
                                }}
                            />
                        </Button>
                    </Dropdown> */}
          <Button
            type="primary"
            className={css["vrp-animate-operate-button"]}
            onClick={this.drawLine}
          >
            绘制
          </Button>
        </div>
        <div className={css["vrp-animate-header-hr"]} />
        <div className={css["vrp-animate-infor"]}>{this.getElements(this.state.Alinesource)}</div>

        <div
          className={css["flex-center"]}
          style={{
            width: "300px",
            height: "50px",
            bottom: 0,
            position: "absolute",
            zIndex: 1
            //  boxShadow: "0px 0px 3px 0px rgba(0, 0, 0, 0.2)",
          }}
        >
          {/* {this.state.shareOpen ?
                        <a
                            href={`${process.env.publicPath}#/shareanimation/${this.state.shareUrl}`}
                            target="_blank"
                            className={css["m-r-md"]}
                        >
                            <Button type="primary" ghost>
                                预览
            </Button>
                        </a> : <Button type="primary" ghost
                        // onClick={() => { message.error("预览功能已关闭") }}
                        >
                            预览
            </Button>}
                    <Switch
                        title={this.state.shareOpen ? "分享关闭" : "分享开启"}
                        checkedChildren="开启"
                        unCheckedChildren="关闭"
                        checked={this.state.shareOpen ? true : false}
                        onChange={this.shareSwitch}
                    /> */}
        </div>

        {/* <Button type={"primary"} onClick={this.checkAll.bind(this, false)}>
            反选
          </Button>
          {this.state.isActive === "finish" ? (
            <Button
              type="primary"
              onClick={this.setAnimation.bind(this, "Splay")}
            >
              启动
            </Button>
          ) : (
            <Button onClick={this.setAnimation.bind(this, "finish")}>
              停止
            </Button>
          )}*/}

        {this.state.isActive === "finish" ? (
          ""
        ) : (
          <div className={css["vrp-animate-bottom-play"]}>
            <Icon type="step-backward" className={css["vrp-animate-play-icon"]} />
            {this.state.isActive === "stop" ? (
              <Icon
                type="caret-right"
                style={{ color: "#1890ff" }}
                className={css["vrp-animate-play-icon"]}
                onClick={this.setAnimation.bind(this, "play")}
              />
            ) : (
              <Icon
                type="pause"
                style={{ color: "#1890ff" }}
                className={css["vrp-animate-play-icon"]}
                onClick={this.setAnimation.bind(this, "stop")}
              />
            )}
            <Icon type="step-forward" className={css["vrp-animate-play-icon"]} />
          </div>
        )}
      </div>
    );
  }
}

export default AnimationModel;
