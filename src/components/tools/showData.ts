import Config from "../../config/Config";
import Draw from "../../modules/Menu/Draw";
import TransCoordinate from "./Coordinate";
import Mark from "../../components/model/Mark";
import Model from "../../components/model/Model";
import Geometry from "../../components/model/Geometry";
import Push from "../../components/model/Push";
import PipeLine from "../../components/model/PipeLine";
import GPSLine from "../model/GPS/Line";
import GPSAnimation from "../model/GPS/Animation";
import GPSModel from "../model/GPS/Model";
import AnimateLine from "../model/Animate/Line";
import Animation from "../model/Animate/Animation";
import AnimateModel from "../model/Animate/Model";
const { vrPlanner, maps } = Config;
/**
 * @name ShowData
 * @author: ltt
 * @create: 2018/12/27
 * @description: show layer data -- design by ltt
 */

export default class ShowData {
  static renderLine({ data }) {
    // let feature: any = null;
    const vertices: any = [];
    const { id, color, title, height, position, settings, whethshare } = data;
    const _settings = JSON.parse(settings);

    if (position) {
      for (let { x, y, z } of JSON.parse(position)) {
        vertices.push(new vrPlanner.GeoLocation(x, y, z));
      }
    }
    const line = new PipeLine({
      vertices,
      altitude: Number(height || 0),
      color: color || "FFFFFF",
      width: Number(_settings.width || 1),
      lineStyle: _settings.lineStyle || "flat2d",
      depthTest: _settings.depthTest || false,
      isClose: _settings.closeOpen || false,
      id,
      title,
      level: JSON.parse(_settings.level || false),
      whethshare
    });
    PipeLine.set(line);
    return line;
  }

  static renderAnimateLine({ data }) {
    const lineVertices: any = [];
    const visualangle: any = [];
    const {
      id,
      isNew,
      altitude,
      speed,
      interval,
      title,
      visualAngle,
      depthTest,
      isClose,
      vertices,
      models,
      isCircle,
      isGap,
      isShow,
      showBalloon,
      color,
      width
    } = data;
    if (vertices) {
      for (let { x, y, z } of JSON.parse(vertices)) {
        lineVertices.push(new vrPlanner.GeoLocation(x, y, z));
      }
    }
    if (visualAngle) {
      for (let { x, y, z } of JSON.parse(visualAngle)) {
        visualangle.push(new vrPlanner.GeoLocation(x, y, z));
      }
    }
    const Aline = new AnimateLine({
      interval: interval,
      vertices: lineVertices,
      altitude: Number(altitude || 0),
      color: color || "#FFFF00",
      width: width || 5,
      lineStyle: "flat2d",
      depthTest: depthTest,
      isClose,
      id,
      title,
      type: "animateline",
      isCircle: isCircle || false,
      isGap: isGap || false,
      isShow: isShow || false,
      visualAngle: visualangle,
      showBalloon: showBalloon || false
    });

    let animation = this.renderAnimation(Aline, models, data);
    if (animation.models[0]) {
      animation.speed = animation.models[0].speed;
    }

    return animation;
  }
  static renderAnimation(line, models, data) {
    const {
      titleVisible,
      iconUrl,
      iconVisible,
      fontSize,
      fontColor,
      balloonHeight
    } = data;
    const animationP = new Animation({
      id: line.id,
      title: line.title,
      interval: line.interval,
      line: line,
      isCircle: line.isCircle,
      isGap: line.isGap,
      createTime: typeof data === "string" ? data : data.createTime,
      shareIcon: data.shareUrl,
      balloonTitle: data.balloonTitle || "标签",
      iconUrl: iconUrl || "/res/image/icon/admin/22011565592416553.png",
      titleVisible: titleVisible && true,
      iconVisible: iconVisible && true,
      fontSize: fontSize || 16,
      fontColor: fontColor || "#fff",
      balloonHeight: balloonHeight || 0,
      type: "animation"
    });
    animationP.setAnimateLine();
    if (models) {
      for (let i = 0; i < models.length; i++) {
        let rotateX = animationP.calLineAngleX(0);
        models[i].rotateX = rotateX;

        this.renderAnimateModel(models[i], animationP);
      }
    }

    return animationP;
  }

  static renderAnimateModel(data, animation) {
    const {
      imgUrl,
      rotateY,
      rotateZ,
      speed,
      url,
      isShow,
      geo,
      rotateTime,
      title,
      lineId,
      modelSize,
      rotateX
    } = data;
    let g = [];
    g = geo.split(",");

    let Geo = new vrPlanner.GeoLocation(
      g[0],
      g[1],
      animation.line.vertices[0].z()
    );
    const Amodel = new AnimateModel({
      speed,
      isShow,
      id: data.id,
      geo: Geo,
      title,
      url,
      scale: [modelSize, modelSize, modelSize],
      rotateY: rotateY || 0,
      rotateZ: rotateZ || 0,
      rotateTime: rotateTime,
      imgurl: imgUrl,
      type: "animateModel",
      lineId,
      rotateX: rotateX || 0
    });

    animation.setAnimateModel(Amodel);
    animation.setAltitude();
    //  animation.setVerticalLine();
    // Amodel.setAnimationModel(lineId);
    // AnimateModel.setAnimationLineModel(lineId);

    // return Amodel;
  }
  static renderGPSLine({
    maps = Config.maps,
    vrPlanner = Config.vrPlanner,
    data
  }) {
    const lineVertices: any = [];
    const visualangle: any = [];

    const {
      id,
      title,
      color,
      isShow,
      width,
      altitude,
      //altitude
      depthTest,
      isLevel,
      trajType,
      visualAngle,
      gpsModelList
    } = data;
    if (visualAngle) {
      try {
        for (let { x, y, z } of JSON.parse(visualAngle)) {
          visualangle.push(new vrPlanner.GeoLocation(x, y, z));
        }
      } catch (e) {
        // console.table(e);
      }
    }
    const Aline = new GPSLine({
      altitude,
      color,
      width,
      lineStyle: "flat2d",
      depthTest: depthTest,
      id,
      title,
      isLevel,
      type: "animateline",
      isShow: isShow || false,
      visualAngle: visualangle,
      lineType: trajType
    });
    let animation = this.renderGPSAnimation(data, Aline, gpsModelList);

    // if (animation.models[0]) {
    //   animation.speed = animation.models[0].speed;
    // }

    return animation;
  }
  static renderGPSAnimation(data: any, line: GPSLine, models: any) {
    const {
      verticalLineColor,
      showVerticalLine,
      fontSize,
      fontColor,
      iconUrl,
      balloonHeight,
      titleVisible,
      iconVisible,
      balloonTitle,
      isReverse,
      createTime,
      balloonBottom,
      contentsId
    } = data;

    const animationP = new GPSAnimation({
      id: line.id,
      title: line.title,
      line: line,
      verticalLineColor,
      showVerticalLine,
      fontSize,
      fontColor,
      iconUrl,
      balloonHeight,
      balloonBottom: balloonBottom || 0,
      contentsId:
        typeof contentsId == "string"
          ? contentsId
            .split(",")
            .filter(Number)
            .map(Number)
          : [],
      titleVisible,
      iconVisible,
      balloonTitle,
      isReverse,
      createTime,
      shareIcon: data.shareUrl || "/res/image/icon/admin/24971571971028404.png",
      type: "GPSAnimation"
    });

    if (models) {
      for (let i = 0; i < models.length; i++) {
        this.renderGPSModel(models[i], animationP);
      }
    }

    animationP.setAnimateLine();
    return animationP;
  }
  static renderGPSModel(data, animation) {
    const {
      imgUrl,
      rotateX,
      rotateY,
      rotateZ,
      url,
      isShow,
      geo,
      title,
      gpsId,
      modelSize,
      lat,
      lon,
      code
    } = data;
    let g = [];
    g = geo.split(",");

    let Geo = new vrPlanner.GeoLocation(g[0], g[1], g[2]);

    const Amodel = new GPSModel({
      isShow,
      id: data.id,
      geo: Geo,
      title,
      url,
      scale: [modelSize, modelSize, modelSize],
      // rotateX,
      // rotateY,
      rotateZ,
      imgurl: imgUrl,
      type: "animateModel",
      lineId: gpsId,
      code,
      lat,
      lon
    });

    animation.setAnimateModel(Amodel);
    animation.setAltitude();
    animation.setGPSVerticalLine(Amodel);
    animation.setGPSLine(Amodel.code);
    animation.setGpsBalloon(Amodel, Geo);

    // return Amodel;
  }

  static renderBlock({ data }, rightClick = true) {
    const vertices: any = [];
    const {
      id,
      color,
      height,
      position,
      settings,
      title,
      whethshare,
      contentId
    } = data;
    const _settings = JSON.parse(settings);

    for (const pos of JSON.parse(position)) {
      vertices.push(new vrPlanner.GeoLocation(pos[0], pos[1], pos[2]));
    }
    const block = {
      id,
      color,
      height: Number(height),
      altitude: Number(_settings.altitude || 0),
      opacity: color.length > 6 ? parseInt(color.slice(-2), 16) / 255 : 1,
      vertices,
      title,
      level: _settings.level || false,
      polygonStyle: _settings.polygonStyle || "ExtrudeStyle",
      whethshare,
      contentId:
        typeof contentId == "string"
          ? contentId
            .split(",")
            .filter(Number)
            .map(Number)
          : []
    };
    const geometry = new Geometry(block);
    Geometry.set(geometry);
    geometry.polygon.bindEvent("click", e => {
      if (e.isRightClick() && rightClick) Draw.openBlockLayer(geometry);
    });

    return geometry;
  }

  static renderPush({ data }) {
    const vertices: any = [];
    const { id, height, position, title, whethshare } = data;
    for (const pos of JSON.parse(position)) {
      const geo = new vrPlanner.GeoLocation(pos[0], pos[1], pos[2]);
      vertices.push(geo);
    }
    const push = new Push({
      title,
      height: Number(height),
      vertices,
      id,
      whethshare
    });
    Push.set(push);
    return push;
  }

  static renderModel({ data }) {
    const { id, position, settings, title, url, color, whethshare } = data;
    const _settings = JSON.parse(settings);
    const geo = ShowData.getGeo(position);
    const model = new Model({
      geo,
      id,
      title,
      url,
      color,
      scale: [
        Number(_settings.scaleX || 1),
        Number(_settings.scaleY || 1),
        Number(_settings.scaleZ || 1)
      ],
      rotateX: Number(_settings.rotateX || 0),
      rotateY: Number(_settings.rotateY || 0),
      rotateZ: Number(_settings.rotateZ || 0),
      opacity: Number(_settings.opacity || 1),
      imageUrl: _settings.imageUrl,
      whethshare
    });
    Model.set(model);
    return model;
  }

  static renderBalloon({ data }) {
    const {
      id,
      title,
      position,
      visible,
      settings,
      cameraLook,
      cameraPosition,
      color,
      contentId,
      subMenuId,
      whethshare
    } = data;
    const {
      balloonVisible,
      pointVisible,
      imageUrl,
      altitude,
      fontFamily,
      fontSize,
      fontItalic
    } = typeof data.settings == "string" ? JSON.parse(settings) : settings;
    const geo = ShowData.getGeo(position);
    const mark = new Mark({
      geo,
      cameraLook: ShowData.getGeo(cameraLook),
      cameraPosition: ShowData.getGeo(cameraPosition),
      title,
      visible,
      subMenuId,
      fontFamily,
      fontSize,
      fontItalic,
      icon: imageUrl,
      iconVisible: pointVisible,
      height: altitude,
      titleVisible: balloonVisible,
      contentId:
        typeof contentId == "string"
          ? contentId
            .split(",")
            .filter(Number)
            .map(Number)
          : [],
      whethshare,
      id,
      fontColor: color
    });
    mark.renderBalloon();
    Mark.set(mark);
    return mark;
  }

  static renderMonitor({ item }) {
    const { gpsX, gpsY, cameraType } = item;
    const geo = TransCoordinate.WGS84ToMercator({ x: gpsX, y: gpsY, z: 0 });
    const layer =
      maps.getLayerById("monitor-lineLayer") ||
      new vrPlanner.Layer.FeatureLayer("monitor-lineLayer");
    layer.setLodWindowSize(512);
    layer.setRenderTileTree(false);
    maps.addLayer(layer);
    const line = new vrPlanner.Feature.Line();
    const random = Math.round(Math.random() * 20 + 30);
    line.addVertex(geo);
    line.addVertex(geo.add(new vrPlanner.Math.Double3(0, 0, random)));
    const _r = Math.round(Math.random() * 7 + 1);
    const mr = new vrPlanner.Model.ModelReader();
    const _modelStyle = new vrPlanner.Style.ModelStyle();
    const point = new vrPlanner.Feature.Point();
    mr.read(`${Config.apiHost}/res/image/model/m222.a3x`).done(model => {
      _modelStyle.setModel(model);
      if (_r) {
        point.setStyle(_modelStyle);
        const aabb = point.getAABB();
        const halfLengthX = aabb.getHalfLengthX();
        const halfLengthY = aabb.getHalfLengthY();
        point.getStyle().setRotation(90 - 45 * _r);
        if (Number(_r) !== 0) {
          if (Number(_r) % 2 === 0) {
            const offsetX = [1, 1, -1, -1];
            const offsetY = [1, -1, -1, 1];
            const index = Number(_r) / 2 - 1;
            point.setGeoLocation(
              geo.add(
                new vrPlanner.Math.Double3(
                  halfLengthX * offsetX[index],
                  halfLengthY * offsetY[index],
                  random
                )
              )
            );
          } else {
            const offsetX = [0, 1, 0, -1];
            const offsetY = [1, 0, -1, 0];
            const index = (Number(_r) - 1) / 2;
            point.setGeoLocation(
              geo.add(
                new vrPlanner.Math.Double3(
                  halfLengthX * offsetX[index] * Math.sqrt(2),
                  halfLengthY * offsetY[index] * Math.sqrt(2),
                  random
                )
              )
            );
          }
        }
        layer.addFeature(point);
      }
    });
    layer.addFeature(line);
    const lineStyle = new vrPlanner.Style.LineStyle();
    layer.setStyle(lineStyle);
    lineStyle.setWidth(1);
    lineStyle.setColor(new vrPlanner.Color("#FFFFFFFF"));
    lineStyle.setDepthTest(true);
    lineStyle.setAppearance(vrPlanner.Style.LineStyle.APPEARANCE_FLAT_2D);
    lineStyle.setUnit(vrPlanner.Style.LineStyle.UNIT_PIXELS);
    let monitor = new vrPlanner.Feature.Point(
      geo.add(new vrPlanner.Math.Double3(0, 0, random))
    );
    monitor.point = point;
    let img = "";
    switch (Number(cameraType)) {
      case 1:
        img = "placemark_monitor";
        break;
      case 2:
        img = "placemark_ball";
        break;
      case 3:
        img = "placemark_hemisphere";
        break;
    }
    const style = ShowData.getSysStyle(img);
    monitor.setStyle(style);
    const balloon = new vrPlanner.Balloon("编号：");
    balloon.setOffsetX(-5);
    balloon.setOffsetY(10);
    balloon.setStylename("whiteBalloon currentBalloon");
    monitor.setBalloon(balloon);
    monitor.line = line;
    monitor.bindEvent("click", e => {
      if (e.isLeftClick()) {
      }
    });
    return monitor;
  }

  static renderMapTag({ geo, title }, typecode?) {
    const random = Math.round(Math.random() * 20 + 200);
    const point = new vrPlanner.Feature.Point(
      geo.add(new vrPlanner.Math.Double3(0, 0, random))
    );
    let urlName = "120000";
    if (typecode) {
      if (typecode.includes("|")) {
        const list = typecode.split("|");
        list.map(item => {
          urlName = this.getImgName(Number(item));
        });
      } else {
        urlName = this.getImgName(Number(typecode));
      }
    }
    point.setStyle(ShowData.getSysStyle(urlName));
    const balloon = new vrPlanner.Balloon(title);
    balloon.setStylename("whiteBalloon currentBalloon");
    balloon.setOffsetY(10);
    point.setBalloon(balloon);
    const line = new vrPlanner.Feature.Line();
    line.addVertex(geo);
    line.addVertex(geo.add(new vrPlanner.Math.Double3(0, 0, random)));
    const style = new vrPlanner.Style.LineStyle();
    line.setStyle(style);
    style.setWidth(1);
    style.setColor(new vrPlanner.Color("#FFFFFFFF"));
    style.setDepthTest(true);
    style.setAppearance(vrPlanner.Style.LineStyle.APPEARANCE_FLAT_2D);
    style.setUnit(vrPlanner.Style.LineStyle.UNIT_PIXELS);
    point.setAltitudeMode(vrPlanner.Feature.ALTITUDE_MODE_RELATIVE_TO_GROUND);
    line.setAltitudeMode(vrPlanner.Feature.ALTITUDE_MODE_RELATIVE_TO_GROUND);
    point.line = line;
    return point;
  }
  /**
   * @param pos [1,2,3] | "[1,2,3]" | "1,2,3"
   */
  public static getGeo(pos: number[] | string) {
    let position = [0, 0, 0];
    if (Array.isArray(pos) && pos.length == 3) {
      position = pos;
      return new vrPlanner.GeoLocation(...position);
    } else if (typeof pos == "string") {
      try {
        position = JSON.parse(pos);
        if (position.length < 3) return;
      } catch (e) {
        console.error(e);
        let p = pos.split(",");
        if (p.length == 3) position = p;
        else return;
      }
      return new vrPlanner.GeoLocation(...position);
    }
    return;
  }

  public static getStyle(val) {
    const placenmarkObj = {
      width: 25,
      height: 25,
      pivotY: 1,
      scale: {
        x: 0.02,
        y: 0.02
      },
      autoScale: true,
      autoScaleStart: 20,
      autoScaleEnd: 5000,
      url: Config.apiHost + `/res/image/icon/sys/placemark_${val}.png`
    };
    return new vrPlanner.Style.PlacemarkStyle(placenmarkObj);
  }

  public static getMarkerStyle(val) {
    const placenmarkObj = {
      width: 25,
      height: 25,
      pivotY: 1,
      scale: {
        x: 0.03,
        y: 0.03
      },
      autoScale: true,
      autoScaleStart: 20,
      autoScaleEnd: 500000,
      url: /.*\.svg$/.test(val)
        ? Config.apiHost + "/res/image/icon/admin/23561570847755545.png"
        : Config.apiHost + val
    };
    return new vrPlanner.Style.PlacemarkStyle(placenmarkObj);
  }

  public static getSysStyle(val) {
    const placenmarkObj = {
      width: 25,
      height: 25,
      pivotY: 1,
      scale: {
        x: 0.03,
        y: 0.03
      },
      autoScale: true,
      autoScaleStart: 20,
      autoScaleEnd: 5000,
      url: Config.apiHost + `/res/image/icon/sys/${val}.png`
    };
    return new vrPlanner.Style.PlacemarkStyle(placenmarkObj);
  }

  private static getImgName(typecode) {
    let urlName = "";
    if (typecode >= 50000 && typecode < 60000) {
      urlName = "050000";
    } else if (typecode >= 60000 && typecode < 70000) {
      urlName = "060000";
    } else if (typecode >= 120000 && typecode < 130000) {
      urlName = "120000";
    } else if (typecode >= 990000 && typecode < 1000000) {
      urlName = "990000";
    } else {
      urlName = "120000";
    }
    return urlName;
  }

  private static getDataByStr(str) {
    let reg = /CP=&&.*&&/gi;
    let [specData] = reg.exec(str);
    let [splitData] = str.split(reg);
    specData = specData.replace(/&&$/, "");
    let specObj = this.generateObjByStr(specData);
    let splitObj = this.generateObjByStr(splitData.replace(/##.*QN/, "QN"));

    return { ...specObj, ...splitObj };
  }

  private static generateObjByStr(str) {
    let obj = {};
    let REG_STR = "=&&";
    let [key, data] = str.includes(REG_STR) ? str.split(REG_STR) : ["", str];

    obj = data.split(";").reduce(this.generateObjByElem, obj);

    return key ? { [key]: { ...obj } } : obj;
  }

  private static generateObjByElem(prevObj, str) {
    let obj = {};
    const json = {
      w00000: "污水",
      w01001: "pH值",
      w01002: "色度",
      i33001: "CEMS伴热管温度",
      i33002: "CEMS冷凝温度",
      i33101: "监测站房温度",
      i33102: "监测站房湿度",
      i33103: "监测站房电压",
      i33104: "监测站房原水压力"
    };

    if (str) {
      if (str.includes(",")) {
        let data = str.split(",");
        obj = data.reduce((prevObj, elem) => {
          let [key, extraData] = elem.split("-");
          let [subKey, value] = extraData.split("=");
          let specObj = prevObj[key] || {};
          specObj[subKey] = value;
          specObj["name"] = json[key];

          return { [key]: specObj, ...prevObj };
        }, obj);
      } else {
        let [key, value] = str.split("=");
        obj[key] = value;
      }
    }

    return { ...obj, ...prevObj };
  }
}
