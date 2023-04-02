import TrackLine from "../Track/Line";
import AnimateModel from "./Model";
import Tools from "../../tools/Tools";
import Config from "../../../config/Config";
import Animation from "./Animation";
const { vrPlanner, maps } = Config;

/**
 * @description 手绘轨迹Line
 */
export default class AnimateLine extends TrackLine {
  isGap: boolean;
  colorSeparate: boolean; //是否分色
  interval: number;
  id: number;
  isChecked: boolean;
  lineType: string;
  models: AnimateModel[] = [];
  constructor({
    depthTest = true,
    width = 1,
    vertices = [],
    color = "#ffff00",
    altitude = 0,
    id = 0,
    showBalloon = true,
    lineStyle = "flat2d",
    isClose = false,
    title = "轨迹" + Math.round(Math.random() * 100),
    isChecked = false,
    interval = 10,
    type = "animateline",
    isCircle = false,
    isGap = false,
    isShow = true,
    visualAngle = [],
    isLevel = false,
    colorSeparate = false,
    lineType = "draw"
  }) {
    super({
      depthTest,
      vertices,
      color,
      width,
      isClose,
      isShow,
      title,
      isLevel,
      isCircle,
      showBalloon,
      visualAngle,
      altitude
    });
    this.altitude = altitude;
    this.isLevel = isLevel;
    this.interval = interval;
    this.type = type;
    this.id = id;
    this.isCircle = isCircle;
    this.isGap = isGap;
    this.isChecked = isChecked;
    this.isShow = isShow;
    this.showBalloon = showBalloon;
    this.colorSeparate = colorSeparate;
    this.lineType = lineType;
    this.setAttribute(altitude, isClose);
    this.setVisible(isShow);
  }
  setColorSeparate(colorSeparate: boolean) {
    if (colorSeparate) {
      let newLine = new vrPlanner.Feature.Line();
    }
  }

  setAttribute(altitude, isClose) {
    this.altitude = altitude;
    if (this.vertices && this.vertices.length) {
      // const z = this.vertices[0].z() + altitude;
      const length = this.vertices.length;
      this.vertices.forEach((vertex, index) => {
        this.line.setVertex(
          index,
          vertex.add(new vrPlanner.Math.Double3(0, 0, altitude))
        );
      });
      if (isClose) {
        if (this.line.getNumVertices() === this.vertices.length) {
          this.line.addVertex(
            this.vertices[0].add(new vrPlanner.Math.Double3(0, 0, altitude))
          );
        } else {
          this.line.setVertex(
            this.line.getNumVertices() - 1,
            this.vertices[0].add(new vrPlanner.Math.Double3(0, 0, altitude))
          );
        }
      } else {
        if (this.line.getNumVertices() !== length) {
          this.line.setVertex(
            this.line.getNumVertices() - 1,
            this.vertices[length - 1].add(
              new vrPlanner.Math.Double3(0, 0, altitude)
            )
          );
        }
      }
    }
  }

  focus() {
    const aabb = this.line.getAABB();
    const x = aabb.getHalfLengthX();
    const y = aabb.getHalfLengthY();
    const z = aabb.getHalfLengthZ();
    let side = 5;
    if (x > 2.5) {
      side = 25;
    } else if (y > 2.5) {
      side = 25;
    } else if (z > 2.5) {
      side = 25;
    }
    if (this.visualAngle.length < 1) {
      maps
        .getCamera()
        .flyTo(
          this.line
            .getGeoLocation()
            .add(new vrPlanner.Math.Double3(x + side, y + side, z + side)),
          this.line.getGeoLocation()
        );
    } else {
      maps.getCamera().flyTo(this.visualAngle[0], this.visualAngle[1]);
    }
  }

  remove() {
    const layer = maps.getLayerById("animateLineLayer");
    layer.removeFeature(this.line);
    let a = Animation.animations.find(i => i.id === this.id);
    if (a) {
      let i = Animation.animations.indexOf(a);
      Animation.animations.splice(i, 1);
    }
    // for (let i = 0; i < Animation.animations.length; i++) {
    //   const item = Animation.animations[i];
    //   if (item.id === this.id) {
    //     Animation.animations.splice(i, 1);
    //     break;
    //   }
    // }
  }
}
