import Point from "./Point";
import Config from "../../config/Config";

const { vrPlanner } = Config;
export default class ModelBase extends Point {
  url: string;
  private _color: string;
  scale: number[];
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  opacity: number;

  constructor({
    geo,
    url,
    color = "",
    scale = [1, 1, 1],
    rotateX = 0,
    rotateY = 0,
    rotateZ = 0,
    opacity = 1,
    whethshare = false,
    altitudeMode = vrPlanner.Feature.ALTITUDE_MODE_ABSOLUTE
  }) {
    super({ geo, pointStyle: "model", whethshare });
    this.point.setStyle(this.style);
    this.point.setAltitudeMode(altitudeMode);
    this.opacity = opacity;
    this.url = url;
    this.color = color;
    this.scale = scale;
    this.rotateX = rotateX;
    this.rotateY = rotateY;
    this.rotateZ = rotateZ;
    this.setModel(url);
    this.setScale(this.scale);
    this.setRotation({
      rotateX: this.rotateX,
      rotateY: this.rotateY,
      rotateZ: this.rotateZ
    });
    this.setOpacity(this.opacity);
    this.point.bindEvent("mouseEnter", featureEvent => {
      const feature = featureEvent.getFeature();
      feature.setOpacity(0.8);
      feature.bindEvent("mouseLeave", () => {
        feature.setOpacity(1);
        feature.unbindEvent("mouseLeave");
      });
    });
  }

  protected get color() {
    return this._color;
  }

  protected set color(color) {
    this._color = color;
    this.setMaterial(color);
  }

  setColor(color) {
    this._color = color;
  }

  init() {
    this.setScale(this.scale);
    this.setRotation({
      rotateX: this.rotateX,
      rotateY: this.rotateY,
      rotateZ: this.rotateZ
    });
    this.setOpacity(this.opacity);
    this.setPosition(this.geo.x(), this.geo.y(), this.geo.z());
    this.setModel(this.url);
    this.setMaterial(this.color);
  }

  setScale(scale: number[]) {
    this.style.setScale(scale[0], scale[1], scale[2]);
  }

  getRotation() {
    const { style } = this;
    const euler = style.getEulerRotation();
    if (euler !== null) {
      return euler;
    } else {
      return new vrPlanner.Math.Euler(0, 0, 0);
    }
  }
  setEulerRotation(euler) {
    this.style.setEulerRotation(euler);
  }
  setRotation({ rotateX = 0, rotateY = 0, rotateZ = 0 }) {
    const euler = new vrPlanner.Math.Euler(rotateX, rotateY, rotateZ);
    this.setEulerRotation(euler);
  }

  rotate(angle: { rotateX: number; rotateY: number; rotateZ: number }) {
    const euler = new vrPlanner.Math.Euler(
      angle.rotateX,
      angle.rotateY,
      angle.rotateZ
    );
    this.setEulerRotation(euler);
  }

  setOpacity(opacity: number) {
    this.style.setOpacity(opacity);
  }

  setPosition(x: number, y: number, z: number) {
    this.point.setGeoLocation(new Config.vrPlanner.GeoLocation(x, y, z));
  }

  setModel(url) {
    const modelReader = new Config.vrPlanner.Model.ModelReader();
    modelReader
      .read(Config.apiHost + url)
      .done(model => {
        this.style.setModel(model);
      })
      .fail(function(error) {
        var hasNext;
        do {
          hasNext = error.hasNext();
          error = error.next();
        } while (hasNext);
      });
  }

  setMaterial(color: string) {
    const material = new Config.vrPlanner.Mesh.Material();
    if (color === "undefined" || color === "") this.style.setMaterial(material);
    else {
      material.setColor(new Config.vrPlanner.Color(color));
      this.style.setMaterial(material);
    }
  }

  focus() {
    const aabb = this.point.getAABB();
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
    Config.maps
      .getCamera()
      .flyTo(
        this.point
          .getGeoLocation()
          .add(new Config.vrPlanner.Math.Double3(x + side, y + side, z + side)),
        this.point.getGeoLocation()
      );
  }

  active(time) {
    // let scale = [0.1, 0.1, 0.1]
    // this.setScale(scale);
    // const offset = [(this.scale[0] - 0.1) / 120, (this.scale[1] - 0.1) / 120, (this.scale[2] - 0.1) / 120];
    // let i = 0;
    // let ani = 0;
    // const act = () => {
    //     i++;
    //     scale = [scale[0] + offset[0], scale[1] + offset[1], scale[2] + offset[2]]
    //     this.setScale(scale);
    //     if (i <= 120) {
    //         ani = requestAnimationFrame(act);
    //     } else {
    //         window.cancelAnimationFrame(ani);
    //     }
    // }
    // ani = requestAnimationFrame(act);
  }
}
