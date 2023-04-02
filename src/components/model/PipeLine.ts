import Line from "./Line";
import Config from "../../config/Config";
import Tools from "../tools/Tools";
import Point from "./Point";
import { message } from "antd";
import Model from "./Model";
import DataService from "../../services/DataService";
import Resource from "../../modules/Menu/Resource";

const { vrPlanner, maps, PLANID } = Config;
interface line_Attr {
  title: string;
  height: number;
  lineStyle: string;
  width: number;
  depthTest: boolean;
  isClose: boolean;
  color: string;
  level: boolean;
  whethshare: boolean;
}
export default class PipeLine extends Line {
  altitude: number;
  isNew: boolean;
  id: number;
  title: string;
  level: boolean;
  points: any[];
  timer: NodeJS.Timeout;
  private tempVertices: any[];
  static pipes: PipeLine[] = [];
  constructor({
    depthTest = true,
    vertices = [],
    color = "#FFFFFF",
    altitude = 0,
    width = 1,
    lineStyle = "flat2d",
    isClose = false,
    id = 0,
    title = "新线条" + Math.round(Math.random() * 100),
    level = false,
    whethshare = false
  }) {
    super({
      depthTest,
      vertices,
      color,
      width,
      lineStyle,
      isClose,
      whethshare
    });
    this.altitude = altitude;
    this.isNew = false;
    this.id = id;
    [...this.tempVertices] = vertices;
    this.setAttr(level, altitude, isClose);
    this.title = title;
    this.type = "line";
    this.level = level;
    this.points = [];
  }

  init() {
    [...this.tempVertices] = this.vertices;
    this.line.clearVertices();
    if (this.vertices && this.vertices.length > 0) {
      this.line.addVertices(this.vertices);
    }
    this.setWidth(this.width);
    this.setDepthTest(this.depthTest);
    this.setLineStyle(this.lineStyle);
    this.setColor(this.color);
    this.setAttr(this.level, this.altitude, this.isClose);
    this.quitEdit();
  }

  setAttr(level: boolean, altitude: number, isClose: boolean) {
    this.removeVertex({ level, altitude, isClose });
  }

  setOpacity(opacity: number) {
    this.line.setOpacity(opacity);
  }

  remove() {
    const layer = maps.getLayerById("lineLayer");
    PipeLine.remove(this);
    layer.removeFeature(this.line);
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
    maps
      .getCamera()
      .flyTo(
        this.line.getGeoLocation().add(new vrPlanner.Math.Double3(x + side, y + side, z + side)),
        this.line.getGeoLocation()
      );
  }
  static set(line: PipeLine) {
    line.isNew = false;
    PipeLine.pipes.unshift(line);
    PipeLine.pipes.sort(Tools.compare("id"));
    PipeLine.pipes.reverse();
  }

  static remove(line: PipeLine) {
    for (let i = 0; i < PipeLine.pipes.length; i++) {
      const item = PipeLine.pipes[i];
      if (item.id === line.id) {
        PipeLine.pipes.splice(i, 1);
        break;
      }
    }
  }
  setVisible(visible: boolean) {
    super.setVisible(visible);
    clearTimeout(this.timer);
  }

  async active(time) {
    if ([2300, 2416].some(pid => pid == PLANID)) {
      setTimeout(() => {
        this.setOpacity(1);
        setTimeout(() => {
          this.setOpacity(0.1);
          setTimeout(() => {
            this.setOpacity(1);
          }, 150);
        }, 150);
      }, 150);
    } else {
      let vertices = this.vertices.map(v => {
        let vc = v.clone();
        vc.setZ(v.z() + this.altitude);
        return vc;
      });
      this.line.clearVertices();
      const speed = 1;
      for (let i = 0; i < vertices.length; i++) {
        const v = vertices[i];
        if (i == 0) {
          this.line.addVertex(vertices[0]);
        } else {
          await new Promise((resolve, reject) => {
            this.line.addVertex(vertices[i - 1]);
            const subV = v.sub(vertices[i - 1]);
            const interval = subV.magnitude() / speed;
            for (let j = 0; j <= interval; j++) {
              this.timer = setTimeout(() => {
                this.line.setVertex(
                  i,
                  interval
                    ? vertices[i - 1].add(
                        subV
                          .asDouble3()
                          .div(interval)
                          .mul(j)
                      )
                    : vertices[i]
                );
                if (j >= interval - 1) resolve();
              }, j * 3);
            }
          });
        }
      }
    }
  }

  living() {
    const { vrPlanner, maps } = Config;
    let layer = maps.getLayerById("livingLayer");
    if (!layer) {
      layer = new vrPlanner.Layer.FeatureLayer("livingLayer");
      maps.addLayer(layer);
    }
    const vertices = this.getVertices();
    const p1 = vertices[0];
    const p2 = vertices[1];
    const v1 = p1.asDouble3();
    const v2 = p2.asDouble3();
    const p0 = v2.sub(v1);
    const unit = p0.div(p0.magnitude());
    let line_list: any = [];
    let pos: any = [];
    // const point = new vrPlanner.Feature.Point(p1);
    // const style = new vrPlanner.Style.PointStyle();
    // style.setColor(new vrPlanner.Color(this.color))
    // style.setRadius(2);
    // style.setDepthTest(false)
    // point.setStyle(style);
    let _index = 0;
    // for (let i = 0; i < line_Num; i++) {
    //     const line = new vrPlanner.Feature.Line()
    //     line.addVertex(p1.sub(unit.mul(i)))
    //     line.addVertex(p1.sub(unit.mul(i - 1)))
    //     const style = new vrPlanner.Style.LineStyle()
    //     style.setDepthTest(false)
    //     line.setStyle(style)
    //     line_list.push(line)
    //     style.setWidth(1)
    //     style.setzIndex(10)
    //     style.setAppearance(vrPlanner.Style.LineStyle.APPEARANCE_FLAT_2D)
    //     // style.setColor(new vrPlanner.Color("#FF002C"+getColor("00","ff",Math.abs(i/line_Num*2-1))))
    //     const color = this.color.replace('#', '')
    //     const r = this.getColor("ff", color.slice(0, 2), Math.abs(i / line_Num * 2 - 1))
    //     const g = this.getColor("ff", color.slice(2, 4), Math.abs(i / line_Num * 2 - 1))
    //     const b = this.getColor("ff", color.slice(4, 6), Math.abs(i / line_Num * 2 - 1))
    //     style.setColor(new vrPlanner.Color("#" + r + g + b))
    //     maps.getLayerById("lineLayer").addFeature(line)
    //     pos.push(0);
    // }
    const vectors: any = [];
    let dis = 0;
    for (let i = 1; i < vertices.length; i++) {
      const v1 = vertices[i - 1].asDouble3();
      const v2 = vertices[i].asDouble3();
      const p0 = v2.sub(v1);
      dis += p0.magnitude();
      const unit = p0.div(p0.magnitude());
      vectors.push(unit);
    }
    let index = 0;
    const interval = setInterval(() => {
      const point = new Point({
        geo: p1,
        pointStyle: "point",
        whethshare: false
      });
      point.setColor(this.color);
      point.setRadius(1);
      layer.addFeature(point.point);
      point.active(0.03, vertices, vectors);
      index++;
      if (index > dis) {
        clearInterval(interval);
      }
    }, 30);
    // const interval = setInterval(() => {
    //     if(index < dis){

    //     }
    //     let geo = point.getGeoLocation();
    //     geo = geo.add(vectors[_index].mul(8 * Math.random()))
    //     const d1 = vertices[_index].distance(vertices[_index + 1])
    //     const d2 = vertices[_index].distance(geo)
    //     if (d1 < d2) {
    //         _index = (_index + 1) % vectors.length;
    //         geo = vertices[_index].add(vectors[_index].mul(d2 - d1));
    //     }
    //     if (_index > vectors.length - 1) {
    //         _index = 0;
    //     }
    //     point.setGeoLocation(geo)
    //     // for (let i = 0; i < line_list.length; i++) {
    //     //     const line = line_list[i]
    //     //     const _vertices = line.getVertices()
    //     //     let p1 = _vertices[0]
    //     //     let p2 = _vertices[1]
    //     //     p1 = p1.add(vectors[pos[i]].mul(8))
    //     //     const d1 = vertices[pos[i]].distance(vertices[pos[i] + 1])
    //     //     const d2 = vertices[pos[i]].distance(p1)
    //     //     if (d1 < d2) {
    //     //         pos[i] = (pos[i] + 1) % vectors.length;
    //     //         p1 = vertices[pos[i]].add(vectors[pos[i]].mul(d2 - d1));
    //     //     }
    //     //     if (pos[i] > vectors.length - 1) {
    //     //         pos[i] = 0;
    //     //     }
    //     //     p2 = p1.add(vectors[pos[i]])
    //     //     line.setVertex(0, p1)
    //     //     line.setVertex(1, p2)
    //     // }
    // }, 30)
  }

  bezier(start_num) {
    const vertices = this.getVertices();
    if (start_num < 1 || start_num > vertices.length - 1) {
      message.error("超出线段长度");
      return false;
    }
    this.line.clearVertices();
    for (let i = 0; i < start_num; i++) {
      this.line.addVertex(vertices[i]);
    }
    for (let i = start_num; i < start_num + 1; i++) {
      const p1 = vertices[i];
      const p0 = vertices[i - 1];
      const center = new vrPlanner.GeoLocation(
        (p1.x() + p0.x()) / 2,
        (p1.y() + p0.y()) / 2,
        (p1.z() + p0.z()) / 2
      );
      const v1 = p1.asDouble3();
      const v0 = p0.asDouble3();
      const v = v1.sub(v0);
      const dis = v.magnitude();
      const _v = new vrPlanner.Math.Double3(-v.y(), v.x(), v.z());
      const _vector = _v.div(_v.magnitude()).mul(dis / 2);
      const p = center.sub(_vector);
      for (let j = 0; j <= 1; j += 0.01) {
        const x = this.squareBezier(p0.x(), p.x(), p1.x(), j);
        const y = this.squareBezier(p0.y(), p.y(), p1.y(), j);
        const z = this.squareBezier(p0.z(), p.z(), p1.z(), j);
        this.line.addVertex(new vrPlanner.GeoLocation(x, y, z));
      }
    }
    for (let i = start_num + 1; i < vertices.length; i++) {
      this.line.addVertex(vertices[i]);
    }
  }

  private getColor(r1, r2, index) {
    const a = Math.round(parseInt(r1, 16) + index * (parseInt(r2, 16) - parseInt(r1, 16))).toString(
      16
    );
    return a.length < 2 ? "0" + a : a;
  }

  private squareBezier(p0, p1, p2, t) {
    var k = 1 - t;
    return Math.pow(k, 2) * p0 + 2 * (1 - t) * t * p1 + Math.pow(t, 2) * p2;
  }

  catmullRom() {
    const vertices = this.vertices;
    this.line.clearVertices();
    const p0 = vertices[0];
    const p1 = vertices[1];
    const p2 = vertices[2];
    const p3 = vertices[3];
    const t0 = 0;
    const t1 = this.getT(t0, p0, p1);
    const t2 = this.getT(t1, p1, p2);
    const t3 = this.getT(t2, p2, p3);
    for (let t = t1; t < t2; t += (t2 - t1) / 20) {
      const a1 = p0.mul((t1 - t) / (t1 - t0)).add(p1.mul((t - t0) / (t1 - t0)).asDouble3());
      const a2 = p1.mul((t2 - t) / (t2 - t1)).add(p2.mul((t - t1) / (t2 - t1)).asDouble3());
      const a3 = p2.mul((t3 - t) / (t3 - t2)).add(p3.mul((t - t2) / (t3 - t2)).asDouble3());

      const b1 = a1.mul((t2 - t) / (t2 - t0)).add(a2.mul((t - t0) / (t2 - t0)).asDouble3());
      const b2 = a2.mul((t3 - t) / (t3 - t1)).add(a3.mul((t - t1) / (t3 - t1)).asDouble3());

      const c = b1.mul((t2 - t) / (t2 - t1)).add(b2.mul((t - t1) / (t2 - t1)).asDouble3());
      this.line.addVertex(c);
    }
  }

  private getT(t, p0, p1) {
    const a = Math.pow(p1.x() - p0.x(), 2) + Math.pow(p1.y() - p0.y(), 2);
    const b = Math.sqrt(a);
    const c = Math.sqrt(b);
    return c + t;
  }

  set(attr) {
    this.setAttr(attr.isLevel, attr.altitude, false);
    this.setColor(attr.color);
    this.setDepthTest(attr.isDepth);
    this.setWidth(attr.width);
  }

  setPoint(geo: any, index: number) {
    const { maps, vrPlanner } = Config;
    const camera = maps.getCamera();
    const model = new Model({
      geo,
      url: "/res/source/admin/1586854697454/锥形3.a3x",
      title: ""
    });
    const layer = maps.getLayerById("lineLayer");
    const { point } = model;
    point.index = index;
    model.setScale([7, 7, 7]);
    layer.bindEvent("mouseDrag", event => {
      const feature = event.getFeature();
      const style = feature.getStyle();
      if (style.getType() === "ModelStyle") {
        const geo = feature.getGeoLocation();
        const camPos = camera.getPosition();
        const mouse2dX = event.getPageX();
        const mouse2dY = event.getPageY();
        const zAxis = new vrPlanner.Math.Double3(0, 0, 1);
        const ray = maps.getRayAtScreenPos(mouse2dX, mouse2dY);
        if (event.isLeftClick()) {
          if (event.isCtrlKey()) {
            if (this.line.level) {
              message.warning("无法调整海拔，请先关闭水平");
            } else {
              const dist = vrPlanner.Math.Vecmath.lineLineDistance(geo, zAxis, camPos, ray);
              const nearestPoint = geo.add(zAxis.mul(dist[1]));
              feature.setGeoLocation(nearestPoint);
              this.line.setVertex(feature.index, nearestPoint);
              this.tempVertices[feature.index] = nearestPoint.add(
                new vrPlanner.Math.Double3(0, 0, -this.line.altitude)
              );
              if (feature.index === 0 && this.line.isClose) {
                this.line.getVertices().forEach((vertex, index) => {
                  if (index > this.vertices.length - 1) {
                    this.line.setVertex(index, nearestPoint);
                  }
                });
              }
            }
          } else {
            const pointOnPlane = new vrPlanner.Math.Double3(0, 0, geo.z());
            const intersectionPoint = vrPlanner.Math.Vecmath.linePlaneIntersection(
              camPos,
              ray,
              pointOnPlane,
              zAxis
            );
            const _geo = new vrPlanner.GeoLocation(intersectionPoint);
            feature.setGeoLocation(_geo);
            this.line.setVertex(feature.index, _geo);
            this.tempVertices[feature.index] = _geo.add(
              new vrPlanner.Math.Double3(0, 0, -this.line.altitude)
            );
            if (feature.index === 0 && this.line.isClose) {
              this.line.getVertices().forEach((vertex, index) => {
                if (index > this.vertices.length - 1) {
                  this.line.setVertex(index, _geo);
                }
              });
            }
          }
        }
      }
    });
    point.bindEvent("click", event => {
      if (event.isRightClick()) {
        this.points.splice(point.index, 1);
        this.points.forEach((point, index) => {
          point.index = index;
        });
        this.tempVertices.splice(point.index, 1);
        this.removeVertex();
        layer.removeFeature(point);
      }
    });
    layer.addFeature(point);
    this.points.push(point);
  }

  edit() {
    const vertices = this.line.getVertices();
    [...this.tempVertices] = this.vertices;
    const { maps, vrPlanner } = Config;
    let layer = maps.getLayerById("lineLayer");
    this.points = [];
    if (!layer) {
      layer = new vrPlanner.Layer.FeatureLayer("lineLayer");
      maps.addLayer(layer);
    }

    layer.bindEvent("mouseDown", () => {
      maps.getCamera().setLocked(true);
    });

    maps.bindEvent("mouseUp", () => {
      maps.getCamera().setLocked(false);
    });
    if (vertices.length) {
      vertices.forEach((vertice, index) => {
        const geo = vertice.clone();
        if (index < this.vertices.length) {
          this.setPoint(geo, index);
        }
      });
    }
    maps.bindEvent("click", event => {
      if (event.isLeftClick()) {
        if (this.line.isClose) message.warning("无法添加点位，请先关闭闭合");
        else {
          let geo = event.getGeoLocation();
          if (this.line.level) {
            geo = new vrPlanner.GeoLocation(geo.x(), geo.y(), this.getVertices()[0].z());
          }
          this.line.addVertex(geo);
          this.setPoint(geo, this.getNumVertices() - 1);
          this.tempVertices.push(geo.add(new vrPlanner.Math.Double3(0, 0, -this.line.altitude)));
        }
      }
    });
  }

  save(attr: line_Attr, isSave: boolean = true) {
    this.isNew = false;
    this.title = attr.title;
    this.altitude = attr.height;
    this.lineStyle = attr.lineStyle;
    this.width = attr.width;
    this.depthTest = attr.depthTest;
    this.isClose = attr.isClose;
    this.color = attr.color;
    this.level = attr.level;
    this.whethshare = attr.whethshare;
    const position: any = [];
    this.vertices = [];
    this.tempVertices.forEach((vertex, index) => {
      this.vertices[index] = this.getVertices()[index].add(
        new vrPlanner.Math.Double3(0, 0, -this.altitude)
      );
      position.push({
        x: this.vertices[index].x(),
        y: this.vertices[index].y(),
        z: this.vertices[index].z()
      });
    });
    if (isSave) {
      if (!this.id) {
        DataService.addData(
          Object.assign({ position: JSON.stringify(position), closeOpen: attr.isClose }, attr),
          (flag, res) => {
            if (flag) {
              message.success("保存成功");
              this.id = res.data;
              PipeLine.set(this);
              if (Resource.ReloadList) {
                Resource.ReloadList();
              }
              console.log(
                {
                  position: JSON.stringify(position),
                  closeOpen: attr.isClose
                },
                attr
              );
            } else {
              message.error(res.message);
            }
          }
        );
      } else {
        DataService.modData(
          Object.assign(
            {
              position: JSON.stringify(position),
              id: this.id,
              closeOpen: attr.isClose
            },
            attr
          ),
          (flag, res) => {
            if (flag) {
              message.success("保存成功");
              this.id = res.data;
            } else {
              message.error(res.message);
            }
          }
        );
      }
    }
  }

  quitEdit() {
    let layer = maps.getLayerById("lineLayer");
    if (layer) {
      maps.unbindEvent("click");
      layer.unbindEvent("mouseDown");
      maps.unbindEvent("mouseUp");
      layer.unbindEvent("mouseDrag");
      if (this.points)
        if (this.points.length) {
          this.points.forEach(point => {
            layer.removeFeature(point);
          });
        }
    }
  }

  removeVertex({ level, altitude, isClose } = this.line) {
    if (level.toString() === "undefined") level = this.level;
    if (altitude.toString() === "undefined") altitude = this.altitude;
    if (isClose.toString() === "undefined") isClose = this.isClose;
    this.line.clearVertices();
    let [...vertices] = this.tempVertices;
    if (vertices && vertices.length) {
      const z = vertices[0].z() + altitude;
      const length = vertices.length;
      vertices.forEach((vertex, index) => {
        const geo = new vrPlanner.GeoLocation(
          vertex.x(),
          vertex.y(),
          level ? z : vertex.z() + altitude
        );
        this.line.addVertex(geo);
        if (this.points && this.points.length && this.points[index]) {
          this.points[index].setGeoLocation(geo);
        }
      });
      if (isClose) {
        if (this.getNumVertices() === vertices.length) {
          this.line.addVertex(
            new vrPlanner.GeoLocation(vertices[0].x(), vertices[0].y(), vertices[0].z() + altitude)
          );
        } else {
          this.line.addVertex(
            new vrPlanner.GeoLocation(vertices[0].x(), vertices[0].y(), vertices[0].z() + altitude)
          );
        }
      } else {
        if (this.getNumVertices() !== length) {
          this.line.addVertex(
            new vrPlanner.GeoLocation(
              vertices[length - 1].x(),
              vertices[length - 1].y(),
              vertices[level ? 0 : length - 1].z() + altitude
            )
          );
        }
      }
    }
  }

  static getById(id: number) {
    for (let i = 0; i < this.pipes.length; i++) {
      const pipe = this.pipes[i];
      if (pipe.id === id) {
        return pipe;
      }
    }
    return null;
  }
}
