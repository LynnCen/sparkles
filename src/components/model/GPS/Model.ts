import TrackModel from "../Track/Model";
import GPSLine from "./Line";
import Mark from "../Mark";
import Config from "../../../config/Config";
import TransCoordinate from "../../tools/Coordinate";
import Animation from "../Animate/Animation";

const {vrPlanner, maps} = Config;
/**
 * @description GPS动画模型
 */
export default class GPSModel extends TrackModel {
  static linemodels: any = {};
  static models: any[] = []; //这只是一个中转站
  id: number;
  timeOut: any;
  timeInterval: any;
  animation: any;
  mark: Mark;
  type: any;
  code: string;
  lat: number;
  lon: number;
  course: number; //航向
  line: GPSLine;

  constructor({
                geo,
                url,
                color = "",
                lengthY = 0,
                scale = [1, 1, 1],
                opacity = 1,
                id = 0,
                type = "animateModel",
                speed = 30,
                imgurl = "",
                rotateZ = 0,
                title,
                code = "",
                lat = 0,
                lon = 0,
                course = 0,
                lineId,
                isShow = true
              }) {
    super({
      geo,
      imgurl,
      url,
      color,
      scale,
      opacity,
      rotateZ,
      title,
      lineId,
      lengthY,
      isShow
    });
    this.id = id;
    this.code = code;
    this.title = title;
    this.lat = lat;
    this.lon = lon;
    //this.line = line;
    this.course = course;
    this.animation = maps.animate(
      new vrPlanner.Animation.SequenceEffect([]),
      true
    );
    const animation = Animation.animations.find(item => item.id == this.lineId);
    this.mark = new Mark({
      geo: this.geo,
      height: 0,
      fontSize: 22,
      icon: "/res/image/icon/admin/23371569725099035.png",
      title: animation && animation.title,
      whethshare: false
    });
    // this.mark.setVisible(animation!.line.showBalloon)
    this.setVisible(this.isShow);
    // this.setModel();
  }

  init() {
    this.setScale(this.scale);
    this.setOpacity(this.opacity);
    this.setPosition(this.geo.x(), this.geo.y(), this.geo.z());
    // this.setModel(this.url);
  }

  GPSDataToGeo(data) {
    let geo = TransCoordinate.WGS84ToMercator({
      x: data[0].lon,
      y: data[0].lat,
      z: 0
    });
  }

  remove() {
    const layer = Config.maps.getLayerById("animateModelLayer");
    layer.removeFeature(this.point);

    // Point.removeAnimateModel(this, lineid);
  }

  setModelRotation(rotate: number, type?: string) {
    this.point.getStyle().setRotation(rotate);
    if (!type) {
      this.rotateZ = rotate;
    }
  }

  setVisible(visible: boolean) {
    this.point.setVisible(visible);
    // const animation = Animation.animations.find(item => item.id == this.lineId);
  }

  clearTime() {
    clearTimeout(this.timeOut);
    clearInterval(this.timeInterval);
  }
}
