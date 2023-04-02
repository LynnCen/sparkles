import TrackModel from "../Track/Model";
import Mark from "../Mark";
import AnimateLine from "./Line";
import Config from "../../../config/Config";

const { vrPlanner, maps, apiHost } = Config;
/**
 * @description 手绘轨迹模型
 */
export default class AnimateModel extends TrackModel {
  static linemodels: any = {};
  static models: any[] = []; //这只是一个中转站
  id: number;
  rotateTime: number;
  speed: number;
  timeOut: any;
  timeInterval: any;
  animation: any;
  mark: Mark;
  type: any;
  line: AnimateLine;

  constructor({
    geo,
    url,
    rotateTime = 0.5,
    color = "",
    isShow = true,
    scale = [1, 1, 1],
    opacity = 1,
    id = 0,
    type = "animateModel",
    speed = 30,
    imgurl = "",
    lineId,
    title,
    rotateX = 0.0,
    rotateY = 0.0,
    rotateZ = 0.0,
    lengthY = 0
  }) {
    super({
      geo,
      url,
      color,
      scale,
      opacity,
      rotateX,
      rotateY,
      rotateZ,
      title,
      imgurl,
      isShow,
      lineId,
      lengthY
    });
    this.speed = speed;
    this.isShow = isShow;
    this.id = id;
    this.rotateTime = rotateTime;
    this.rotateX = rotateX;
    //this.line = line;
    this.animation = maps.animate(
      new vrPlanner.Animation.SequenceEffect([]),
      false
    );
    // const animation = Animation.animations.find(item => item.id == this.lineId);
    // this.mark = new Mark({
    //   geo: this.geo,
    //   height: 0,
    //   fontSize: 22,
    //   icon: "/res/image/icon/admin/23371569725099035.png",
    //   title: animation && animation.title,
    //   whethshare: false
    // });
    // this.mark.setVisible(animation!.line.showBalloon)
    this.setVisible(this.isShow);
    //  this.setEuler(this.rotateX);
  }

  init() {
    this.setScale(this.scale);

    this.setOpacity(this.opacity);
    this.setPosition(this.geo.x(), this.geo.y(), this.geo.z());
    this.setModel(this.url);
  }

  //   setEuler(rotateX) {
  //     let euler = new Config.vrPlanner.Math.Euler(rotateX, 0, this.rotate);
  //     this.style.setEulerRotation(euler);
  //   }

  remove() {
    const layer = Config.maps.getLayerById("animateModelLayer");
    layer.removeFeature(this.point);
  }
  add() {
    const layer = Config.maps.getLayerById("animateModelLayer");
    layer.addFeature(this.point);
  }

  setAnimationModel(lineid) {
    if (AnimateModel.linemodels[lineid]) {
      AnimateModel.models = AnimateModel.linemodels[lineid];
    }
    AnimateModel.models.push(this);
  }

  static setAnimationLineModel(id) {
    AnimateModel.linemodels[id] = this.models;
    AnimateModel.models = [];
  }

  setModelRotation(rotate: number, type?: string) {
    this.point.getStyle().setRotation(rotate);
    if (!type) {
      this.rotateZ = rotate;
    }
  }


  setVisible(visible: boolean) {
    this.point.setVisible(visible);
    // if (this.lineId) {
    //   let animation = Animation.animations.find(item => item.id == this.lineId);
    //   if (animation) {
    //     if (animation.balloon) {
    //       animation.balloon.setVisible(visible && animation!.line.showBalloon);
    //       this.mark.setVisible(false);
    //     }
    //     else {
    //       this.mark.setVisible(visible && animation!.line.showBalloon);
    //       animation.balloon.setVisible(false);
    //     }
    //   }
    // }
    // this.isShow = visible;
  }

  setRotateTime(rotateTime: number) {
    this.rotateTime = rotateTime;
  }

  clearTime() {
    clearTimeout(this.timeOut);
    clearInterval(this.timeInterval);
  }
}
