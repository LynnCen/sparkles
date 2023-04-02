import { Component } from "react";
import VrpIcon from "../../components/VrpIcon";
import VrpModal from "../../components/VrpModal";
import Config from "../../config/Config";
import { Button, Radio } from "antd";
import RadioGroup from "antd/lib/radio/group";
import { Line, Point } from "../../components/model/";

const css = require("../../styles/custom.css");

/**
 * @name Curve
 * @description: 管道
 */

interface CurveProps {}

interface CurveStates {
  isCurve: boolean;
  color: string;
  width: number;
  renderType: string;
}

class CurveModel extends Component<CurveProps, CurveStates> {
  DATA;
  STATE_CREATE_NEW_AREA: string = "create";
  STATE_ADD_TO_AREA: string = "add";
  LINE: Line;
  P1;
  P2;
  constructor(props: CurveProps) {
    super(props);
    this.state = {
      isCurve: false,
      color: "#ffffff",
      width: 1,
      renderType: "line"
    };
  }

  closeModal = () => {
    this.setState({
      isCurve: false
    });
  };
  colorChange = color => {
    this.setState({
      color
    });
  };
  handleClick = () => {
    this.setState({
      isCurve: true
    });
  };

  widthChange = width => {
    this.setState({
      width
    });
  };

  clearPipe = () => {
    let layer = Config.maps.getLayerById("testLayer");
    this.DATA = "";
    if (layer) {
      layer.clearFeatures();
    }
  };

  draw = () => {
    const { maps, vrPlanner } = Config;
    let stateCurrent = this.STATE_CREATE_NEW_AREA;
    let firstClick = false;
    let waitForGeo = false;
    let layer = maps.getLayerById("curveLayer");
    if (!layer) {
      layer = new vrPlanner.Layer.FeatureLayer("curveLayer");
      maps.addLayer(layer);
    }
    maps.bindEvent("click", event => {
      const geo = event.getGeoLocation();
      switch (stateCurrent) {
        case this.STATE_CREATE_NEW_AREA:
          if (geo && event.isLeftClick()) {
            this.createFollowerLine(geo);
            this.createPoint(this.LINE, geo);
            this.createAuxiliary(geo);
            maps.bindEvent("mousemove", mouseEvent => {
              if (!waitForGeo) {
                waitForGeo = true;
                maps.getGeoLocationAtScreenPos(
                  mouseEvent.getPageX(),
                  mouseEvent.getPageY(),
                  e => {
                    const geo = e.getGeoLocation();
                    if (geo) {
                      this.LINE.setVertex(this.LINE.getNumVertices() - 1, geo);
                    }
                    waitForGeo = false;
                  }
                );
              }
            });
            stateCurrent = this.STATE_ADD_TO_AREA;
          }
          break;
        case this.STATE_ADD_TO_AREA:
          if (geo && event.isLeftClick()) {
            this.createPoint(this.LINE, geo);
            this.LINE.addVertex(geo);
            this.createAuxiliary(geo);
            if (this.LINE.getNumVertices() >= 2) {
              maps.unbindEvent("click");
              maps.unbindEvent("mousemove");
            }
          }
          break;
      }
    });
  };

  createFollowerLine = geo => {
    const layer = Config.maps.getLayerById("curveLayer");
    this.LINE = new Line({ width: 2, color: "#ffffff", depthTest: false });
    this.LINE.addVertex(geo);
    this.LINE.addVertex(geo.clone());
    layer.addFeature(this.LINE.line);
  };

  createAuxiliary = geo => {
    const { vrPlanner } = Config;
    const layer = Config.maps.getLayerById("curveLayer");
    const auxiliary = new Line({
      width: 2,
      color: "#00ff00",
      depthTest: false
    });
    auxiliary.addVertex(geo);
    auxiliary.addVertex(geo.clone().add(new vrPlanner.Math.Double3(20, 20, 0)));
    this.createPoint(
      auxiliary,
      geo.clone().add(new vrPlanner.Math.Double3(30, 30, 0)),
      true
    );
    layer.addFeature(auxiliary.line);
  };

  createPoint = (line: Line, geo, isAuxiliary?) => {
    const { maps, vrPlanner } = Config;
    const index = line.getNumVertices() - 1;
    const camera = maps.getCamera();
    const layer = maps.getLayerById("curveLayer");
    const point = new Point({ geo, pointStyle: "point", whethshare: false });
    point.point.index = index;
    point.setRadius(1);
    point.setColor("#FFFFFF");
    point.style.setDepthTest(false);
    layer.addFeature(point.point);
    layer.bindEvent("mouseDown", () => {
      camera.setLocked(true);
    });
    layer.bindEvent("mouseUp", () => {
      camera.setLocked(false);
    });
    point.point.bindEvent("mouseDrag", event => {
      const feature = event.getFeature();
      const pointGeo = feature.getGeoLocation();
      const camPos = camera.getPosition();
      const mouse2dX = event.getPageX();
      const mouse2dY = event.getPageY();
      const ray = maps.getRayAtScreenPos(mouse2dX, mouse2dY);
      const zAxis = new vrPlanner.Math.Double3(0, 0, 1);
      if (event.isCtrlKey()) {
        const dist = vrPlanner.Math.Vecmath.lineLineDistance(
          pointGeo,
          zAxis,
          camPos,
          ray
        );
        const nearestPoint = pointGeo.add(zAxis.mul(dist[1]));
        point.point.setGeoLocation(new vrPlanner.GeoLocation(nearestPoint));
        line.setVertex(index, point.point.getGeoLocation());
      } else {
        const pointOnPlane = new vrPlanner.Math.Double3(0, 0, pointGeo.z());
        const intersectionPoint = vrPlanner.Math.Vecmath.linePlaneIntersection(
          camPos,
          ray,
          pointOnPlane,
          zAxis
        );
        point.point.setGeoLocation(intersectionPoint);
        line.setVertex(index, point.point.getGeoLocation());
      }
      if (isAuxiliary) {
        const p0 = this.LINE.vertices[0];
        const p1 = point.point.getGeoLocation();
        const p2 = this.LINE.vertices[1];
        this.LINE.setDepthTest(true);
        this.LINE.line.clearVertices();
        for (let i = 0; i <= 1; i += 0.01) {
          const x = this.squareBezier(p0.x(), p1.x(), p2.x(), i);
          const y = this.squareBezier(p0.y(), p1.y(), p2.y(), i);
          const z = this.squareBezier(p0.z(), p1.z(), p2.z(), i);
          this.LINE.line.addVertex(new vrPlanner.GeoLocation(x, y, z));
        }
      }
    });
  };

  squareBezier(p0, p1, p2, t) {
    var k = 1 - t;
    return Math.pow(k, 2) * p0 + 2 * (1 - t) * t * p1 + Math.pow(t, 2) * p2;
  }

  cubedBezier(p0, p1, p2, p3, t) {
    const k = 1 - t;
    return (
      p0 * Math.pow(k, 3) +
      3 * p1 * Math.pow(k, 2) * t +
      3 * p2 * Math.pow(t, 2) * k +
      p3 * Math.pow(t, 3)
    );
  }

  renderChange = e => {
    console.log(e.target.value);
  };

  active = () => {
    const point = new Point({
      geo: this.LINE.vertices[0],
      pointStyle: "point",
      whethshare: false
    });
    let i = 1;
    point.setRadius(1);
    const layer = Config.maps.getLayerById("curveLayer");
    layer.addFeature(point.point);
    const vertices = this.LINE.getVertices();
    const r1 = "00";
    const g1 = "ff";
    const b1 = "00";
    const r2 = "00";
    const g2 = "00";
    const b2 = "ff";
    const interval = setInterval(() => {
      const geo = point.point.getGeoLocation();
      const geo1 = vertices[i];
      const geo2 = vertices[i - 1];
      const dis = new Config.vrPlanner.Math.Double3(
        geo1.x() - geo2.x(),
        geo1.y() - geo2.y(),
        geo1.z() - geo2.z()
      );
      const unit = dis.div(dis.magnitude());
      point.point.setGeoLocation(geo.add(dis));
      const r = Math.round(
        parseInt(r1, 16) + 0.01 * i * (parseInt(r2, 16) - parseInt(r1, 16))
      ).toString(16);
      const g = Math.round(
        parseInt(g1, 16) + 0.01 * i * (parseInt(g2, 16) - parseInt(g1, 16))
      ).toString(16);
      const b = Math.round(
        parseInt(b1, 16) + 0.01 * i * (parseInt(b2, 16) - parseInt(b1, 16))
      ).toString(16);
      point.setColor(
        (r.length < 2 ? "0" + r : r) +
          (g.length < 2 ? "0" + g : g) +
          (b.length < 2 ? "0" + b : b)
      );
      if (i >= vertices.length - 1) {
        i = 1;
        point.point.setGeoLocation(this.LINE.vertices[0]);
        point.setColor(r1 + g1 + b1);
        // clearInterval(interval);
      }
      i++;
    }, 1000 / 60);
  };

  render() {
    const btnGroup = (
      <div className={css["text-center"]}>
        <Button type="primary" onClick={this.draw}>
          绘制
        </Button>
        <Button className={css["m-l-md"]} type="primary" onClick={this.active}>
          运动
        </Button>
        <Button
          className={css["m-l-md"]}
          type="primary"
          onClick={this.clearPipe}
        >
          清除
        </Button>
      </div>
    );
    return (
      <div>
        <VrpIcon
          iconName={"icon-excel"}
          className={css["vrp-menu-icon"]}
          title={"贝塞尔曲线"}
          onClick={this.handleClick}
        />
        {this.state.isCurve ? (
          <VrpModal
            defaultPosition={{ x: 30, y: 95 }}
            title="贝塞尔曲线"
            style={{ width: 300 }}
            footer={btnGroup}
            onClose={this.closeModal}
          >
            <div className={css["vrp-form"]}>
              <div className={css["flex-center-left"]}>
                <label className={css["flex-none-label"]}>数据类型</label>
                <RadioGroup
                  defaultValue={this.state.renderType}
                  buttonStyle="solid"
                  onChange={this.renderChange}
                >
                  <Radio.Button value="line">直线</Radio.Button>
                  <Radio.Button value="square">二次</Radio.Button>
                  <Radio.Button value="cubed">三次</Radio.Button>
                </RadioGroup>
              </div>
            </div>
          </VrpModal>
        ) : null}
      </div>
    );
  }
}

export default CurveModel;
