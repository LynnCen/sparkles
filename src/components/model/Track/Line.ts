import Config from "../../../config/Config";
import Line from "../Line";

/**
 * @description 轨迹line
 */
export default class TrackLine extends Line {
  isShow: boolean;
  isCircle: boolean;
  isLevel: boolean; //是否水平
  altitude: number;
  showBalloon: boolean;
  visualAngle: any[] = []; //视角
  title: string;
  constructor({
    color = "#ffff00",
    isClose = false,
    width = 1,
    depthTest = true,
    vertices = [],
    isShow = true,
    isCircle = false,
    isLevel = false,
    altitude = 0,
    showBalloon = true,
    visualAngle = [],
    title
  }) {
    super({
      color,
      width,
      isClose,
      depthTest,
      vertices
    });

    this.isShow = isShow;
    this.isCircle = isCircle;
    this.isLevel = isLevel;
    this.altitude = altitude;
    this.showBalloon = showBalloon;
    this.visualAngle = visualAngle;
    this.title = title;
  }
  setWidth(width: number) {
    this.style.setWidth(width);
    this.width = width;
  }
  setDepthTest(depthTest: boolean) {
    this.style.setDepthTest(depthTest);
    this.depthTest = depthTest;
  }
  //计算轨迹线条长度
  calLineDistance() {
    let dis;
    let sumDis = 0;
    for (let i = 0; i < this.vertices.length - 1; i++) {
      var prex = this.vertices[i].x();
      var prey = this.vertices[i].y();
      var prez = this.vertices[i].z();
      var endx = this.vertices[i + 1].x();
      var endy = this.vertices[i + 1].y();
      var endz = this.vertices[i + 1].z();
      dis = Math.sqrt(
        Math.pow(prex - endx, 2) +
          Math.pow(prey - endy, 2) +
          Math.pow(prez - endz, 2)
      );
      sumDis += dis;
    }
    return sumDis;
  }

  setLevel(isLevel: boolean) {
    if (this.vertices && this.vertices.length) {
      if (isLevel) {
        let height = this.vertices[0].z() + this.altitude;
        this.vertices.forEach((vertex, index) => {
          this.line.setVertex(index, vertex.x(), vertex.y(), height);
        });
      } else {
        this.vertices.forEach((vertex, index) => {
          this.line.setVertex(index, vertex);
        });
      }
    }
  }
  setColor(color: string) {
    this.style.setColor(new Config.vrPlanner.Color(color));
    this.color = color;
  }
  setVisualAngle(position, lookat) {
    this.visualAngle = [position, lookat];
  }

  setVisible(visible: boolean) {
    this.line.setVisible(visible);
    // this.isShow = visible;
  }
}
