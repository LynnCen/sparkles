import GPSLine from "./Line";
import GPSModel from "./Model";
import Config from "../../../config/Config";
import Mark from "../Mark";
import AnimateLine from "../Animate/Line";
import moment from "moment";
import TransCoordinate from "../../tools/Coordinate";
import Tools from "../../tools/Tools";
import AnimateModel from "../Animate/Model";
import TrackAnimation from "../Track/Animation";

const { vrPlanner, maps } = Config;

/**
 * @description  GPS轨迹动画
 *
 */
export default class GPSAnimation extends TrackAnimation {
  static animations: GPSAnimation[] = [];
  static gpsData: any[] = ["loading"];
  gpsVerticalLine: any[] = [];
  showBalloon: boolean;
  line: GPSLine;
  models: GPSModel[] = [];
  type: string;
  gpsBalloon: Mark[] = [];
  gpsLine: GPSLine[] = [];
  contentsId: any[] = [];
  trajType: string;

  constructor({
    id = 0,
    line = new GPSLine({}),
    models = [],
    gpsLine = [],
    gpsBalloon = [],
    gpsVerticalLine = [],
    title,
    showVerticalLine = true,
    verticalLineColor = "#ffffff",
    type = "GPSAnimation",
    shareIcon = "/res/image/icon/admin/24971571971028404.png",
    createTime = "",
    showBalloon = true,
    fontSize = 16,
    fontColor = "#fff",
    balloonBottom = 0,
    balloonHeight = 0,
    iconVisible = true,
    titleVisible = true,
    iconUrl = "animate/tubiao.png",
    balloonTitle = "标签",
    contentsId = []
  }) {
    super({
      id,
      title,
      createTime,
      fontSize,
      fontColor,
      shareIcon,
      balloonBottom,
      balloonHeight,
      iconUrl,
      iconVisible,
      titleVisible,
      balloonTitle,
      showVerticalLine,
      verticalLineColor
    });
    this.line = line;
    this.models = models;
    this.gpsBalloon = gpsBalloon;
    this.gpsVerticalLine = gpsVerticalLine;
    this.gpsLine = gpsLine;
    this.type = type;
    this.showBalloon = showBalloon;
    this.contentsId = contentsId;
    this.setBalloon();
  }

  setBalloon() {
    let geo = new vrPlanner.GeoLocation(0, 0, this.line ? this.line.altitude : 0);
    let prototype = new Mark({
      geo,
      whethshare: false,
      height: this.balloonHeight,
      title: this.balloonTitle,
      icon: this.iconUrl,
      iconVisible: this.iconVisible,
      fontSize: this.fontSize,
      fontColor: this.fontColor,
      titleVisible: this.titleVisible
    });

    this.balloon = prototype;
  }

  setGpsBalloon(item, geo, icon?) {
    let balloonGeo = new vrPlanner.GeoLocation(geo.x(), geo.y(), geo.z());
    // let balloonGeo = new vrPlanner.GeoLocation(geo.x(), geo.y(), this.line.altitude);
    let gballoon = new Mark({
      code: item.code,
      geo: balloonGeo,
      whethshare: false,
      title: this.balloonTitle,
      icon: icon ? icon : this.iconUrl,
      iconVisible: this.iconVisible,
      fontSize: this.fontSize,
      fontColor: this.fontColor,
      titleVisible: this.titleVisible
    });
    this.gpsBalloon.unshift(gballoon);
    let balloonLayer =
      maps.getLayerById("balloonLayer") || new vrPlanner.Layer.FeatureLayer("balloonLayer");
    maps.addLayer(balloonLayer);

    gballoon.setAnimationHeight(
      this.balloonBottom + this.line.altitude,
      this.balloonHeight + this.line.altitude
    );
    balloonLayer.addFeature(gballoon.point);
    balloonLayer.addFeature(gballoon.line);
  }

  setGPSLine(code) {
    let line = new GPSLine({
      id: this.id,
      title: code,
      altitude: this.line.altitude,
      color: this.line.color,
      width: this.line.width,
      depthTest: this.line.depthTest,
      isClose: this.line.isClose,
      isShow: this.line.isShow
    });
    this.gpsLine.push(line);
    let gpslineLayer =
      maps.getLayerById("gpsLineLayer") || new vrPlanner.Layer.FeatureLayer("gpsLineLayer");
    gpslineLayer.addFeature(line.line);
    return line;
  }

  setGPSVerticalLine = model => {
    let verticalLine = new AnimateLine({
      id: model.id,
      title: model.code,
      altitude: this.line.altitude,
      color: this.verticalLineColor,
      width: 0.5,
      isShow: this.showVerticalLine
    });
    this.gpsVerticalLine.push(verticalLine);
    let gpslineLayer =
      maps.getLayerById("gpsLineLayer") || new vrPlanner.Layer.FeatureLayer("gpsLineLayer");
    maps.addLayer(gpslineLayer);
    gpslineLayer.addFeature(verticalLine.line);
  };

  setVerticalAltitude = altitude => {
    for (var i = 0; i < this.gpsVerticalLine.length; i++) {
      this.gpsVerticalLine[i].line.setVertex(
        0,
        this.models[i].geo.add(new vrPlanner.Math.Double3(0, 0, altitude))
      );
    }
  };

  AddGpsVertices = (code, elevation, geoData) => {
    let Aline = this.gpsLine.find(i => i.title === code);
    let verticalLine = this.gpsVerticalLine.find(i => i.title === code);
    let geo;
    let point: any;
    let aa = 0;

    if (Aline) {
      for (var i = 0; i < geoData.length; i++) {
        let time1 = moment();
        let time2 = moment().subtract(1, "days");
        let dataTime = moment(geoData[i].datatime);
        let value =
          dataTime.isBetween(time2, time1) || dataTime.isSame(time1) || dataTime.isSame(time2);

        if (geoData[i].lon && value) {
          geo = TransCoordinate.WGS84ToMercator({
            x: geoData[i].lon,
            y: geoData[i].lat,
            z: elevation
          });

          if (i == 0) {
            Aline.line.addVertex(
              geo.add(new Config.vrPlanner.Math.Double3(0, 0, this.line.altitude))
            );

            point = geo;
            Aline.vertices.push(point);
          } else {
            let remainder = geo.x() + geo.y() - point.x() - point.y();
            if (remainder > 2 || remainder < -2) {
              point = geo;
              Aline.vertices.push(point);
              Aline.line.addVertex(geo.add(0, 0, this.line.altitude));
            }
          }
        } else if (value === false) {
          break;
        }
      }
    }
    if (verticalLine) {
      let geo = TransCoordinate.WGS84ToMercator({
        x: geoData[0].lon,
        y: geoData[0].lat,
        z: elevation
      });
      let lGeo = new Config.vrPlanner.GeoLocation(geo.x(), geo.y(), geo.z() + this.line.altitude);
      let dGeo = new Config.vrPlanner.GeoLocation(geo.x(), geo.y(), 0);
      //verticalLine.vertices.push(lGeo)
      // verticalLine.vertices.push(dGeo)

      verticalLine.addVertex(lGeo);
      verticalLine.addVertex(dGeo);
    }
    // let vertices: any = [];
  };

  setAltitude() {
    if (this.models) {
      for (let i = 0; i < this.models.length; i++) {
        this.models[i].point.setGeoLocation(
          new Config.vrPlanner.GeoLocation(
            this.models[i].geo.x(),
            this.models[i].geo.y(),
            this.models[i].geo.z() + this.line.altitude
          )
        );
      }
    }
  }

  setAnimateLine() {
    GPSAnimation.animations.unshift(this);
    GPSAnimation.animations.sort(Tools.compare("id"));
    GPSAnimation.animations.reverse();
  }

  setAnimateModel(model) {
    this.models.push(model);
  }

  setModelAlititude(altitude) {
    //   Config.maps.refreshLayer("animateModelLayer")

    // this.models[0].point.update();
    for (let i = 0; i < this.models.length; i++) {
      this.models[i].point.setVertex(
        this.models[i].geo.x(),
        this.models[i].geo.y(),
        this.models[i].geo.z() + altitude
      );
    }
    // this.models[0].point.setVertex(this.models[0].geo.x(), this.models[0].geo.y(), this.models[0].geo.z() + altitude);
  }

  removeModel(model) {
    const layer = Config.maps.getLayerById("animateModelLayer");
    for (var i = 0; i < this.models.length; i++) {
      if (this.models[i].id === model.id) {
        layer.removeFeature(this.models[i].point);
        this.models.splice(i, 1);
      }
    }
  }

  removeGPSItem(item) {
    const { vrPlanner, maps } = Config;
    const modellayer = maps.getLayerById("animateModelLayer");
    const gpsLinelayer = maps.getLayerById("gpsLineLayer");
    let balloonLayer =
      maps.getLayerById("balloonLayer") || new vrPlanner.Layer.FeatureLayer("balloonLayer");
    let model = this.models.find(s => s.code == item.code);
    if (model) {
      modellayer.removeFeature(model.point);
      let p = this.models.indexOf(model);
      this.models.splice(p, 1);
    }

    let line = this.gpsLine.find(i => i.title == item.code);
    if (line) {
      gpsLinelayer.removeFeature(line.line);
      let p = this.gpsLine.indexOf(line);
      this.gpsLine.splice(p, 1);
    }

    let balloon = this.gpsBalloon.find(i => i.code == item.code);
    if (balloon) {
      balloonLayer.removeFeature(balloon.point);
      balloonLayer.removeFeature(balloon.line);
      let p = this.gpsBalloon.indexOf(balloon);
      this.gpsBalloon.splice(p, 1);
    }
    let verticalLine = this.gpsVerticalLine.find(i => i.title == item.code);
    if (verticalLine) {
      gpsLinelayer.removeFeature(verticalLine.line);
      let p = this.gpsVerticalLine.indexOf(verticalLine);
      this.gpsVerticalLine.splice(p, 1);
    }
  }

  remove() {
    const layer = Config.maps.getLayerById("animateLineLayer");
    layer.removeFeature(this.line.line);
    let a = GPSAnimation.animations.find(i => i.id === this.id);

    if (a) {
      let p = GPSAnimation.animations.indexOf(a);
      GPSAnimation.animations.splice(p, 1);
      this.removeBalloon();
    }
  }

  replaceModel(model, replacedModel) {
    let modelLayer = Config.maps.getLayerById("animateModelLayer");
    for (let i = 0; i < this.models.length; i++) {
      if (this.models[i].id === replacedModel.id) {
        this.models[i] = model;
        modelLayer.addFeature(this.models[i].point);
        this.models[i].point.setGeoLocation(this.models[i].geo.add(0, 0, this.line.altitude));
      }
    }
  }

  setAmodel(model) {
    if (this.models[0] === undefined) {
      this.models = [model];
    } else {
      this.models.push(model);
    }
  }

  setGPSModelRotate(value) {
    if (value) {
      for (var i = 0; i < this.models.length; i++) {
        this.models[i].setModelRotation(this.models[i].rotateZ);
      }
    } else {
      for (var i = 0; i < this.models.length; i++) {
        this.models[i].setModelRotation(this.models[i].course, "course");
      }
    }
  }

  setVisible(visible: boolean) {
    this.models.forEach(model => {
      model.setVisible(visible);
    });
    this.line.setVisible(visible);
  }

  // calTime() {
  //     let sumTime;
  //     if (this.models[0]) {
  //         let rotateTime = this.models[0].rotateTime;
  //         let turnTime = (this.line.vertices.length - 2) * rotateTime;
  //         let sumDistance = this.line.calLineDistance();
  //         let lineTime = sumDistance / this.speed;
  //         sumTime = turnTime + lineTime;
  //         // for(let i = 0;i<this.line.vertices.length-1;i++){

  //         // }
  //     } else {
  //         sumTime = 0;
  //     }
  //     return sumTime;
  // }

  setGPSVerticalLineAttr = line => {
    const { maps, vrPlanner } = Config;
    let modelLayer =
      maps.getLayerById("gpsLineLayer") || new vrPlanner.Layer.FeatureLayer("gpsLineLayer");

    let lineStyle = new vrPlanner.Style.LineStyle();

    lineStyle.setColor(new vrPlanner.Color(this.verticalLineColor));

    lineStyle.setWidth(0.1);
    line.setStyle(lineStyle);

    modelLayer.addFeature(line);
  };

  setVerticalLine = () => {
    const { vrPlanner, maps } = Config;

    let modelLayer =
      maps.getLayerById("animateLineLayer") || new vrPlanner.Layer.FeatureLayer("animateLineLayer");

    if (this.showVerticalLine && this.models.length) {
      let lineStyle = new vrPlanner.Style.LineStyle();
      let loc = this.models[0].geo;

      lineStyle.setColor(new vrPlanner.Color("ffffff"));

      lineStyle.setWidth(0.1);
      this.verticalLine.setStyle(lineStyle);
      let pointNum = this.verticalLine.getNumVertices();
      if (pointNum === 0) {
        this.verticalLine.addVertex(loc.x(), loc.y(), loc.z());
        this.verticalLine.addVertex(loc.x(), loc.y(), 0);
      }

      modelLayer.addFeature(this.verticalLine);
    } else {
      modelLayer.removeFeature(this.verticalLine);
    }
  };

  moveVerticalLine = () => {
    let a = setInterval(() => {
      let b = this.models[0].point.getGeoLocation();

      this.verticalLine.setVertex(0, b);
      this.verticalLine.setVertex(1, b.x(), b.y(), 0);
    }, 10);
  };

  //筛选时间进行显示
  getTimeDisplay(timeS, timeE) {
    let select = new Array();

    for (let i = 0; i < this.gpsLine.length; i++) {
      select[i] = new Array();
      this.gpsLine[i].line.clearVertices();
      this.gpsLine[i].historicalData.forEach(item => {
        let result = moment(item.datatime).isBetween(timeS, timeE);
        if (result) {
          select[i].push(item);
          let geo = TransCoordinate.WGS84ToMercator({
            x: item.lon,
            y: item.lat,
            z: this.line.altitude
          });
          this.gpsLine[i].line.addVertex(geo);
        }
      });
    }

    return select;
  }

  getGPSVisible() {
    let isVisible = false;
    let modelShow, gpsLineShow, verLineShow, balloonShow;
    if (this.models.length > 0) {
      modelShow = this.models[0].point.isVisible();
      gpsLineShow = this.gpsLine[0].line.isVisible();
      verLineShow = this.gpsVerticalLine[0].line.isVisible();
      balloonShow = this.gpsBalloon[0].point.isVisible();
    }
    // verLineShow = this.showVerticalLine;
    // balloonTitleShow = this.titleVisible;
    // balloonIconShow = this.iconVisible;
    if (modelShow || gpsLineShow || verLineShow || balloonShow) {
      isVisible = true;
    }
    return isVisible;
  }

  setAllVisible(visible) {
    if (visible) {
      this.models.forEach(model => {
        model.setVisible(model.isShow);
      });
      this.gpsLine.forEach(gpsline => {
        gpsline.setVisible(gpsline.isShow);
      });
      this.gpsBalloon.forEach(balloon => {
        balloon.setVisible(visible);
      });
      this.gpsVerticalLine.forEach(verline => {
        verline.line.setVisible(verline.isShow);
      });
    } else {
      this.models.forEach(model => {
        model.setVisible(visible);
      });
      this.gpsLine.forEach(gpsline => {
        gpsline.setVisible(visible);
      });
      this.gpsBalloon.forEach(balloon => {
        balloon.setVisible(visible);
      });
      this.gpsVerticalLine.forEach(verline => {
        verline.line.setVisible(visible);
      });
    }
  }
}
