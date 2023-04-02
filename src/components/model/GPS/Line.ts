import GPSModel from "./Model";
import TrackLine from "../Track/Line";
import Config from "../../../config/Config";
import Tools from "../../tools/Tools";
import Animation from "../Animate/Animation";

const { vrPlanner, maps } = Config;
/**
 * @description GPS轨迹
 */
export default class GPSLine extends TrackLine {
  interval: number;
  id: number;
  draft: number;
  time: string; //船操作时间
  dataTime: string; //获取时间
  lineType: string;
  models: GPSModel[] = [];
  historicalData: any[] = [];

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
    interval = 10,
    type = "animateline",
    isCircle = false,
    isShow = true,
    visualAngle = [],
    isLevel = false,
    lineType = "GPSLine",
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
      altitude,
    });

    this.interval = interval;
    this.type = type;
    this.id = id;
    this.lineType = lineType;
    this.setAttribute(altitude, isClose);
  }

  saveAttribute(data) {
    this.historicalData = [].concat(data);
  }
  setAttribute(altitude, isClose) {
    const { vrPlanner } = Config;
    this.altitude = altitude;
    if (this.vertices && this.vertices.length) {
      // const z = this.vertices[0].z() + altitude;
      const length = this.vertices.length;
      this.vertices.forEach((vertex, index) => {
        if (!vertex) {
        } else {
          this.line.setVertex(
            index,
            vertex.x(),
            vertex.y(),
            altitude + vertex.z()
            // vertex.add(new vrPlanner.Math.Double3(0, 0, altitude))
          );
        }
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
    maps.getCamera().flyTo(this.visualAngle[0], this.visualAngle[1]);
  }
}
// export default class GPSLine extends Line {
//   isShow: boolean;
//   isCircle: boolean;
//   isLevel: boolean; //是否水平
//   altitude: number;
//   interval: number;
//   title: string;
//   id: number;
//   draft: number;
//   time: string; //船操作时间
//   dataTime: string; //获取时间
//   showBalloon: boolean;
//   lineType: string;
//   models: GPSModel[] = [];
//   visualAngle: any[] = []; //视角
//   historicalData: any[] = [];

//   constructor({
//     depthTest = true,
//     width = 1,
//     vertices = [],
//     color = "#ffff00",
//     altitude = 0,
//     id = 0,
//     showBalloon = true,
//     lineStyle = "flat2d",
//     isClose = false,
//     title = "轨迹" + Math.round(Math.random() * 100),
//     interval = 10,
//     type = "animateline",
//     isCircle = false,
//     isShow = true,
//     visualAngle = [],
//     isLevel = false,
//     lineType = "GPSLine",
//   }) {
//     super({ depthTest, vertices, color, width, lineStyle, isClose });
//     this.altitude = altitude;

//     this.isLevel = isLevel;
//     this.interval = interval;
//     this.title = title;
//     this.type = type;
//     this.id = id;
//     this.isCircle = isCircle;
//     this.isShow = isShow;
//     this.visualAngle = visualAngle;
//     this.showBalloon = showBalloon;
//     this.lineType = lineType;
//     this.setAttribute(altitude, isClose);
//   }

//   setWidth(width: number) {
//     this.style.setWidth(width);
//     this.width = width;
//   }

//   setDepthTest(depthTest: boolean) {
//     this.style.setDepthTest(depthTest);
//     this.depthTest = depthTest;
//   }

//   saveAttribute(data) {
//     this.historicalData = [].concat(data);
//   }

//   setGPSAnimationLine() {
//     Line.gpsline.unshift(this);
//     Line.gpsline.sort(Tools.compare("id"));
//     Line.gpsline.reverse();
//   }

//   setAnimationModels(model) {
//     // if (AnimateModel.linemodels[lineid]) {
//     //     AnimateModel.models = AnimateModel.linemodels[lineid];
//     // }
//     this.models.push(model);
//   }

//   calLineDistance() {
//     let dis;
//     let sumDis = 0;
//     for (let i = 0; i < this.vertices.length - 1; i++) {
//       var prex = this.vertices[i].x();
//       var prey = this.vertices[i].y();
//       var prez = this.vertices[i].z();
//       var endx = this.vertices[i + 1].x();
//       var endy = this.vertices[i + 1].y();
//       var endz = this.vertices[i + 1].z();
//       dis = Math.sqrt(
//         Math.pow(prex - endx, 2) +
//           Math.pow(prey - endy, 2) +
//           Math.pow(prez - endz, 2)
//       );
//       sumDis += dis;
//     }
//     return sumDis;
//   }

//   calLineAngleZ(i) {
//     var prex = this.vertices[i].x();
//     var prey = this.vertices[i].y();
//     //  var prez = this.vertices[i].z();
//     var endx = this.vertices[i + 1].x();
//     var endy = this.vertices[i + 1].y();
//     //   var endz = this.vertices[i + 1].z();
//     var hudu = Math.atan2(endx - prex, endy - prey);
//     var c = (180 * hudu) / Math.PI;
//     return -c;
//   }

//   setColor(color: string) {
//     this.style.setColor(new vrPlanner.Color(color));
//     this.color = color;
//   }

//   setAttribute(altitude, isClose) {
//     const { vrPlanner } = Config;
//     this.altitude = altitude;
//     if (this.vertices && this.vertices.length) {
//       // const z = this.vertices[0].z() + altitude;
//       const length = this.vertices.length;
//       this.vertices.forEach((vertex, index) => {
//         if (!vertex) {
//         } else {
//           this.line.setVertex(
//             index,
//             vertex.x(),
//             vertex.y(),
//             altitude + vertex.z()
//             // vertex.add(new vrPlanner.Math.Double3(0, 0, altitude))
//           );
//         }
//       });

//       if (isClose) {
//         if (this.line.getNumVertices() === this.vertices.length) {
//           this.line.addVertex(
//             this.vertices[0].add(new vrPlanner.Math.Double3(0, 0, altitude))
//           );
//         } else {
//           this.line.setVertex(
//             this.line.getNumVertices() - 1,
//             this.vertices[0].add(new vrPlanner.Math.Double3(0, 0, altitude))
//           );
//         }
//       } else {
//         if (this.line.getNumVertices() !== length) {
//           this.line.setVertex(
//             this.line.getNumVertices() - 1,
//             this.vertices[length - 1].add(
//               new vrPlanner.Math.Double3(0, 0, altitude)
//             )
//           );
//         }
//       }
//     }
//   }

//   setLevel(isLevel: boolean) {
//     if (this.vertices && this.vertices.length) {
//       if (isLevel) {
//         let height = this.vertices[0].z() + this.altitude;
//         this.vertices.forEach((vertex, index) => {
//           this.line.setVertex(index, vertex.x(), vertex.y(), height);
//         });
//       } else {
//         this.vertices.forEach((vertex, index) => {
//           this.line.setVertex(index, vertex);
//         });
//       }
//     }
//   }

//   setVisualAngle(position, lookat) {
//     this.visualAngle = [position, lookat];
//   }

//   focus() {
//     maps.getCamera().flyTo(this.visualAngle[0], this.visualAngle[1]);
//   }

//   remove() {
//     const layer = maps.getLayerById("animateLineLayer");
//     layer.removeFeature(this.line);
//     let a = Animation.animations.find((i) => i.id === this.id);
//     if (a) {
//       let i = Animation.animations.indexOf(a);
//       Animation.animations.splice(i, 1);
//     }
//     // for (let i = 0; i < Animation.animations.length; i++) {
//     //   const item = Animation.animations[i];
//     //   if (item.id === this.id) {
//     //     Animation.animations.splice(i, 1);
//     //     break;
//     //   }
//     // }
//   }

//   setVisible(visible: boolean) {
//     this.line.setVisible(visible);
//     // this.isShow = visible;
//   }
// }
