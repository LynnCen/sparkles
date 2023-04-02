import { Component, Fragment } from "react";
import VrpIcon from "../../components/VrpIcon";
import Config from "../../config/Config";
import { Button, message, InputNumber, notification, Input } from "antd";
import VrpModal from "../../components/VrpModal";
import VrpTips from "../../components/VrpTips";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Tools from "../../components/tools/Tools";
import TransCoordinate from "../../components/tools/Coordinate";
import { Line, Model, Terrain } from "../../components/model";
const css = require("../../styles/custom.css");
const scss = require("../../styles/scss/shotImg.scss");

/**
 * @name Shot
 * @author: Daryl
 * @create: 2018/12/6
 * @description: 管道
 */

const { maps, vrPlanner } = Config;
const cam = maps.getCamera()

interface ShotProps { }

interface ShotStates {
  terrain: Terrain;
  showItem: string;
  loadTime: number;
  failGeo: any[];
  yaw: number;
  pitch: number;
  imgI: number;
  imgJ: number;
  allGeo: any[];
  _pos: string;
  _lookAt: string;
  imgs: any[];
  re_pos: string;
  re_lookAt: string;
  re_dis: string;
  dis: string;
  IMGS: any[];
  photographing: boolean;
  status: string;
  vertices: any[];
  offsetX: any,
  offsetY: any,
  pos: any
}

class Test extends Component<ShotProps, ShotStates> {
  LINKLIST: any[] = [];
  LINKLIST1: any[] = [];
  shotArea = new vrPlanner.Feature.Polygon();
  shotAreaLine: any;
  //IMGS: any[] = [];

  constructor(props: ShotProps) {
    super(props);
    this.state = {
      terrain: Terrain.terrains[0],
      showItem: "null",
      loadTime: 10,
      failGeo: [],
      yaw: 0,
      pitch: 0,
      imgI: 1,
      imgJ: 1,
      allGeo: [],
      _pos: "",
      _lookAt: "",
      imgs: [],
      re_lookAt: "23459311.60222329,-2444928.4615166327,3882406.5399004417",
      re_pos: "23459392.41362766,-2444978.180307591,3882438.1240538913",
      dis: "",
      re_dis: "-701.5678548254073,353.75235765613616,118.29786919057369",
      IMGS: [],
      photographing: false,
      status: "截图",
      vertices: [],
      offsetX: {},
      offsetY: {},
      pos: {}
    };
  }

  componentWillMount() {
    let layer = new vrPlanner.Layer.FeatureLayer("pointTestLayer");
    maps.addLayer(layer);
    this.setState({
      terrain: Terrain.terrains[0]
    });
  }

  componentDidMount() {
    const { maps, vrPlanner } = Config;
    const cam = maps.getCamera();
    cam.bindEvent("move", e => {
      let camYaw = cam.getYaw().toFixed(4);
      let camPitch = cam.getPitch().toFixed(4);
      this.setState({
        yaw: camYaw,
        pitch: camPitch
      });
    });
  }

  drawArea = () => {
    message.info("选择截图区域");
    this.setState({
      showItem: "null"
    });
    this.shotAreaLine = new Line({ depthTest: false });
    this.shotAreaLine.type = "line";
    Tools.Draw(this.shotAreaLine, this.finishArea);
  };

  finishArea = line => {
    const { maps, vrPlanner } = Config;

    message.success("框选结束");
    this.setState({
      showItem: "drawArea"
    });
    line.points = [];
    line.vertices.push(line.vertices[0]);
    let layer = maps.getLayerById("lineLayer");
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

    line.vertices.forEach((vertice, index) => {
      const geo = vertice.clone();
      if (index < line.vertices.length) {
        this.setLinePoint(geo, index, line);
      }
    });
  };

  setLinePoint = (geo, index, line) => {
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
    model.setScale([10, 10, 10]);
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
          const pointOnPlane = new vrPlanner.Math.Double3(0, 0, geo.z());
          const intersectionPoint = vrPlanner.Math.Vecmath.linePlaneIntersection(
            camPos,
            ray,
            pointOnPlane,
            zAxis
          );
          const _geo = new vrPlanner.GeoLocation(intersectionPoint);
          feature.setGeoLocation(_geo);
          line.setVertex(feature.index, _geo);
          line.tempVertices[feature.index] = _geo.add(
            new vrPlanner.Math.Double3(0, 0, -line.altitude)
          );
          if (feature.index === 0 && line.isClose) {
            line.getVertices().forEach((vertex, index) => {
              if (index > line.vertices.length - 1) {
                line.setVertex(index, _geo);
              }
            });
          }
        }
      }
    });
    // point.bindEvent("click", event => {
    //   if (event.isRightClick()) {
    //     line.points.splice(point.index, 1);
    //     line.points.forEach((point, index) => {
    //       point.index = index;
    //     });
    //     line.tempVertices.splice(point.index, 1);
    //     line.removeVertex();
    //     layer.removeFeature(point);
    //   }
    // });
    layer.addFeature(point);
    console.log(line);
    line.points.push(point);
  };

  setShotAngle = () => {
    const { maps } = Config;
    const terrain = Terrain.terrains[0];
    const layer = maps.getLayerById("lineLayer");

    const cam = maps.getCamera();
    const fov = cam.getFovY();

    this.setState({
      showItem: "adjustAngle"
    });
    // if (fov > 10) {
    //   cam.setFovY(0.0005);
    //   setTimeout(() => {
    //     let lookAt = cam.getLookAt();

    //     let geo = cam.getPosition().add(0, 0, 5000000);
    //     cam.setPosition(geo, lookAt);
    //   }, 500);
    // }
    console.log(this.shotAreaLine.points);
    this.shotAreaLine.points.forEach(item => {
      layer.removeFeature(item);
    });
  };

  testPixels = () => {
    const { maps, vrPlanner } = Config;

    let xPixel = 1352.13303; //5192.13303;
    let yPixel = 14215.97518;
    maps
      .getGeoLocationAtScreenPos(xPixel, yPixel)
      .done(geoLocation => {
        if (geoLocation != null) {
          console.log(geoLocation);
        }
      })
      .fail(error => {
        console.log(error.getMessage());
      });
    //13437641.178287927,3654122.079389515,11.892598615204436
    //13437680.894980067, 3654115.599297481, 12.0168671263131
    //13437678.177522067,3654100.235208701,12.053403097326608
    //13437636.579513028,3654106.715300553,11.975941249881341
  };

  showModal1 = () => {
    const { maps, vrPlanner } = Config;
    let cam = maps.getCamera();
    let pos = cam.getPosition();
    let lon = 120.71404467624112;
    let lat = 31.16149456009596; //53 47
    let lon2 = 120.71404467489049;
    let lat2 = 31.16149822031859;
    let geo = TransCoordinate.WGS84ToMercator({
      x: lon,
      y: lat,
      z: 1
    });
    let geo1 = TransCoordinate.WGS84ToMercator({
      x: lon,
      y: lat,
      z: 140
    });
    let geo2 = new vrPlanner.GeoLocation(
      13523561.144616956,
      3666462.589556309,
      10
    );
    let geo3 = new vrPlanner.GeoLocation(
      13523561.144616956,
      3666462.589556309,
      500
    );
    let geo22 = TransCoordinate.WGS84ToMercator({
      x: lon2,
      y: lat2,
      z: 1
    });

    // cam.setPosition(geo1, geo);
    console.log(geo, TransCoordinate.MercatorToWGS84(geo));
    this.setPoint(geo, 1, 20);
    this.setPoint(geo22, 2, 20);
  };

  showModal = () => {
    const terrain = Terrain.terrains[0];
    const { maps, vrPlanner } = Config;
    const cam = maps.getCamera();
    terrain.focus();

    const fov = cam.getFovY();
    console.log(cam.getMaxYaw());
    if (fov > 10) {
      cam.setFovY(0.0005);
      setTimeout(() => {
        let geo = cam.getPosition();
        let lookAt = cam.getLookAt();
        console.log(geo);
        cam.setPosition(geo.add(0, 0, 5000000), lookAt);
        //    this.showModal1();
      }, 1000);
    }

    this.setState(
      {
        showItem: "ab"
      },
      () => {
        if (!this.state.showItem) {
          cam.setFovY(50);
          cam.setLocked(false);
        }
      }
    );
  };

  handleClick = async () => {
    const { maps, vrPlanner } = Config;
    const cam = maps.getCamera();
    const position = cam.getPosition();
    // const { terrain } = this.state;
    const terrain = Terrain.terrains[0];
    const { layer } = terrain;
    this.getImg(1);
    const [minX, minY, maxX, maxY] = terrain.getInnerBounds();
    let leftTop: any, rightTop: any, leftBottom: any;
    await new Promise<void>((resolve, reject) => {
      maps.getGeoLocationAtScreenPosPrecise(0, 0).done(e => {
        leftTop = e;
        resolve();
      });
    });
    await new Promise<void>((resolve, reject) => {
      maps.getGeoLocationAtScreenPosPrecise(window.innerWidth, 0).done(e => {
        rightTop = e;
        resolve();
      });
    });
    await new Promise<void>((resolve, reject) => {
      maps.getGeoLocationAtScreenPosPrecise(0, window.innerHeight).done(e => {
        leftBottom = e;
        resolve();
      });
    });
    // const disGeo = rightTop.sub(leftTop.asDouble3());
    // const x = disGeo.x();
    // const y = disGeo.y();
    // const xvot = new vrPlanner.Math.Double3(x, y, 0);
    // console.log(xvot);
    const disGeo = leftTop.sub(leftBottom.asDouble3());
    const x = disGeo.x();
    const y = disGeo.y();
    const yvot = new vrPlanner.Math.Double3(x, y, 0);
    console.log(yvot);
    // const yvot = (new vrPlanner.Math.Double3(-y / xvot.magnitude(), x / xvot.magnitude(), 0)).mul(xvot.magnitude());
    // console.log(yvot);
    // cam.setPosition(position.add(yvot.div(window.innerWidth).mul(window.innerHeight)));

    cam.setPosition(position.add(yvot));
    this.getImg(2);
  };

  moveStart = async () => {
    const terrain = Terrain.terrains[0];
    const [minX, minY, maxX, maxY] = terrain.getInnerBounds();
    const { maps, vrPlanner } = Config;
    const cam = maps.getCamera();
    const focus = cam.getFocusPosition();
    const start = new vrPlanner.GeoLocation(minX, maxY);
    const dis = start.asDouble3().sub(focus.asDouble3());
    const pos = cam.getPosition();
    cam.setPosition(pos.add(dis));
    const yaw = cam.getYaw();
    const pitch = cam.getPitch();
    const width = maxX - minX;
    const height = maxY - minY;
    let leftTop: any, rightTop: any, rightBottom: any;
    await new Promise<void>((resolve, reject) => {
      maps.getGeoLocationAtScreenPosPrecise(0, 0).done(e => {
        console.log(e);
        leftTop = e;
        resolve();
      });
    });
    await new Promise<void>((resolve, reject) => {
      maps.getGeoLocationAtScreenPosPrecise(window.innerWidth, 0).done(e => {
        console.log(e);
        rightTop = e;
        resolve();
      });
    });
    await new Promise<void>((resolve, reject) => {
      maps
        .getGeoLocationAtScreenPosPrecise(window.innerWidth, window.innerHeight)
        .done(e => {
          console.log(e);
          rightBottom = e;
          resolve();
        });
    });
    const x_cam = leftTop.distance(rightTop);
    const y_cam =
      rightTop.distance(rightBottom) / Math.sin((-Math.PI * pitch) / 180);
    let x_vertor: any, y_vertor: any;
    if (yaw >= 0) {
      if (yaw <= 90) {
        x_vertor = new vrPlanner.Math.Double3(
          x_cam / Math.cos((Math.PI * yaw) / 180),
          0,
          0
        );
        y_vertor = new vrPlanner.Math.Double3(
          0,
          y_cam / Math.cos((Math.PI * yaw) / 180),
          0
        );
      } else {
        x_vertor = new vrPlanner.Math.Double3(
          y_cam / Math.sin((Math.PI * yaw) / 180),
          0,
          0
        );
        y_vertor = new vrPlanner.Math.Double3(
          0,
          x_cam / Math.sin((Math.PI * yaw) / 180),
          0
        );
      }
    } else {
      if (yaw >= -90) {
      } else {
      }
    }
    console.log(x_vertor, y_vertor);
    const x_length = Math.ceil(width / x_cam);
    const y_length = Math.ceil(height / y_cam);
    const _pos = cam.getPosition();
    let i = 0;
    const interval = setInterval(() => {
      const row = Math.floor(i / y_length);
      const column = i % y_length;
      cam.setPosition(_pos.add(x_vertor.mul(row)).sub(y_vertor.mul(column)));
      i++;
      if (i > x_length * y_length) {
        clearInterval(interval);
      }
    }, 1000);
  };

  cal = async () => {
    const { maps } = Config;
    const cam = maps.getCamera();
    let leftTop: any, leftBottom: any, rightTop: any, rightBottom: any;
    let _leftTop: any, _leftBottom: any, _rightTop: any, _rightBottom: any;
    const focus = cam.getFocusPosition();
     .setZ(0);
    const _focus = focus.asDouble3();
    await new Promise<void>((resolve, reject) => {
      maps
        .getGeoLocationAtScreenPosPrecise(0, 0)
        .done(e => {
          leftTop = e;
          // leftTop.setZ(0);
          _leftTop = leftTop.asDouble3();
          console.log(_focus.sub(_leftTop));
          resolve();
        })
        .fail(e => {
          console.log(e.getMessage());
          resolve();
        });
    });
    await new Promise<void>((resolve, reject) => {
      maps
        .getGeoLocationAtScreenPosPrecise(0, window.innerHeight)
        .done(e => {
          leftBottom = e;
          // leftBottom.setZ(0);
          _leftBottom = leftBottom.asDouble3();
          console.log(_focus.sub(_leftBottom));
          resolve();
        })
        .fail(e => {
          console.log(e.getMessage());
          resolve();
        });
    });
    await new Promise<void>((resolve, reject) => {
      maps
        .getGeoLocationAtScreenPosPrecise(window.innerWidth, 0)
        .done(e => {
          rightTop = e;
          // rightTop.setZ(0);
          _rightTop = rightTop.asDouble3();
          console.log(_focus.sub(_rightTop));
          resolve();
        })
        .fail(e => {
          console.log(e.getMessage());
          resolve();
        });
    });
    await new Promise<void>((resolve, reject) => {
      maps
        .getGeoLocationAtScreenPosPrecise(window.innerWidth, window.innerHeight)
        .done(e => {
          rightBottom = e;
          // rightBottom.setZ(0);
          _rightBottom = rightBottom.asDouble3();
          console.log(_focus.sub(_rightBottom));
          resolve();
        })
        .fail(e => {
          console.log(e.getMessage());
          resolve();
        });
    });
    let width: any, height: any;
    _leftTop &&
      (_leftBottom &&
        ((height = _leftBottom.sub(_leftTop)), console.log(height)));
    _leftBottom && (_rightBottom && console.log(_leftBottom.sub(_rightBottom)));
    _rightTop && (_leftTop && console.log(_leftTop.sub(_rightTop)));
    _rightBottom && (_rightBottom && console.log(_rightTop.sub(_rightBottom)));
  };

  get = async () => {
    const { maps } = Config;
    const cam = maps.getCamera();
    const front = cam.getFront();
    const focus = cam.getFocusPosition();
    // console.log(front);
    // console.log(focus);
    // console.log(focus.sub(front.mul(5000000)));
    const new_pos = focus.sub(front.mul(3000000));
    cam.setPosition(new_pos);
    let leftTop: any, leftBottom: any, rightTop: any, rightBottom: any;
    let _leftTop: any, _leftBottom: any, _rightTop: any, _rightBottom: any;
    await new Promise<void>((resolve, reject) => {
      maps
        .getGeoLocationAtScreenPosPrecise(0, 0)
        .done(e => {
          leftTop = e;
          // leftTop.setZ(0);
          _leftTop = leftTop.asDouble3();
          resolve();
        })
        .fail(e => {
          console.log(e.getMessage());
          resolve();
        });
    });
    await new Promise<void>((resolve, reject) => {
      maps
        .getGeoLocationAtScreenPosPrecise(0, window.innerHeight)
        .done(e => {
          leftBottom = e;
          // leftBottom.setZ(0);
          _leftBottom = leftBottom.asDouble3();
          resolve();
        })
        .fail(e => {
          console.log(e.getMessage());
          resolve();
        });
    });
    await new Promise<void>((resolve, reject) => {
      maps
        .getGeoLocationAtScreenPosPrecise(window.innerWidth, 0)
        .done(e => {
          rightTop = e;
          // rightTop.setZ(0);
          _rightTop = rightTop.asDouble3();
          resolve();
        })
        .fail(e => {
          console.log(e.getMessage());
          resolve();
        });
    });
    await new Promise<void>((resolve, reject) => {
      maps
        .getGeoLocationAtScreenPosPrecise(window.innerWidth, window.innerHeight)
        .done(e => {
          rightBottom = e;
          // rightBottom.setZ(0);
          _rightBottom = rightBottom.asDouble3();
          resolve();
        })
        .fail(e => {
          console.log(e.getMessage());
          resolve();
        });
    });
    let width: any, height: any;
    _leftTop &&
      (_leftBottom &&
        ((height = _leftBottom.sub(_leftTop)), console.log(height)));
    _leftBottom &&
      (_rightBottom && (width = _leftBottom.sub(_rightBottom)),
        console.log(width));
    _rightTop &&
      (_leftTop && ((width = _leftTop.sub(_rightTop)), console.log(width)));
    _rightBottom &&
      (_rightBottom &&
        ((height = _rightTop.sub(_rightBottom)), console.log(height)));
  };

  getImg = index => {
    const { IMGS } = this.state;
    return new Promise<void>((resolve, reject) => {
      maps
        .takeScreenshot(window.innerWidth, window.innerHeight)
        .done(imageData => {
          const cam = maps.getCamera();
          const link = document.createElement("a");
          const canvas = document.createElement("canvas");
          canvas.width = imageData.width;
          canvas.height = imageData.height;
          const ctx: any = canvas.getContext("2d");
          ctx.putImageData(imageData, 0, 0);
          const dataUrl = canvas.toDataURL("image/png");
          let img: any = {};
          img.dataUrl = dataUrl.substring(22);
          img.name = "grid" + index + ".png";
          IMGS.push(img);
          this.setState({
            IMGS
          });
          // const strDataURI = dataUrl.substr(22, dataUrl.length);
          const blob = this.dataURLtoBlob(dataUrl);
          const objurl = URL.createObjectURL(blob);
          link.download = "grid" + index + ".png";
          link.href = objurl;
          // link.click();
          console.log(link.download, cam.getPosition());
          this.LINKLIST.push(link);
          let timeout = setTimeout(() => {
            resolve();
            clearTimeout(timeout);
            console.log("timeout，getimg");
          }, 300);
        });
    });
  };

  getImg1 = index => {
    const { IMGS } = this.state;
    return new Promise<void>((resolve, reject) => {
      let cam = maps.getCamera();
      maps.takeScreenshot(1920, 1080).done(imageData => {
        const link = document.createElement("a");
        const canvas = document.createElement("canvas");
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        const ctx: any = canvas.getContext("2d");
        ctx.putImageData(imageData, 0, 0);
        const dataUrl = canvas.toDataURL("image/png");
        console.log(cam.getPosition);
        // const strDataURI = dataUrl.substr(22, dataUrl.length);
        const blob = this.dataURLtoBlob(dataUrl);
        const objurl = URL.createObjectURL(blob);
        link.download = "grid" + index + ".png";
        link.href = objurl;
        let img: any = {};
        img.dataUrl = dataUrl.substring(22);
        img.name = "grid" + index + ".png";
        console.log(link.download);
        let a = IMGS.find(item => item.name === img.name);
        console.log(a);
        if (a) {
          let aa = IMGS.indexOf(a);
          IMGS[aa] = img;
          console.log(aa);
          this.setState({
            IMGS
          });
        }
        console.log(a);
        // link.click();
        this.LINKLIST1.push(link);
        let timeout = setTimeout(() => {
          resolve();
          clearTimeout(timeout);
          console.log("timeout，getimg");
        }, 300);
      });
    });
  };

  takePixelItem = async () => {
    const { imgI, imgJ } = this.state;
    const { maps, vrPlanner } = Config;
    console.log("开始下载");
    let maxX = window.innerWidth;
    let maxY = window.innerHeight;
    let zip = new JSZip();
    // const reader = new FileReader();
    // let fso=new ActiveXObject(Scripting.FileSystemObject);
    let geoArr = new Array();
    for (let i = 1; i <= maxX; i += 10) {
      console.log(i);
      for (let j = 1; j <= maxY; j += 10) {
        //  console.log(j);
        await new Promise<void>((resolve, reject) => {
          maps
            .getGeoLocationAtScreenPos(i, j)
            .done(geoLocation => {
              if (geoLocation != null) {
                let geo = TransCoordinate.MercatorToWGS84(geoLocation);
                let value: string =
                  i +
                  " " +
                  j +
                  " " +
                  geo.lon +
                  " " +
                  geo.lat +
                  " " +
                  geoLocation.z();
                geoArr.push(value);
                resolve();
              }
            })
            .fail(error => {
              console.log(error.getMessage());
              let value: string = i + " " + j + "        null";
              geoArr.push(value);
              resolve();
            });
        });
      }
    }
    //geoArr.forEach(item => {
    zip.file(
      "grid" +
      (imgJ < 10 ? "0" + imgJ : imgJ) +
      "_" +
      (imgI < 10 ? "0" + imgI : imgI) +
      ".txt",
      geoArr.join("\n")
    );
    //  console.log(item);
    // });

    zip.generateAsync({ type: "blob" }).then(function (content) {
      // see FileSaver.js
      saveAs(content, "geo.zip");
    });
  };

  packageImages = () => {
    const { _pos, _lookAt, dis } = this.state;
    //   let imgs: any[] = [];
    let zip = new JSZip();
    zip.file(
      "geoFile.txt",
      "position:" + _pos + "\n" + "lookAt:" + _lookAt + "\n" + "dis" + dis
    );

    //  console.log(this.state.IMGS[0].dataUrl, typeof this.state.IMGS[0].dataUrl)
    this.state.IMGS.forEach(item => {
      zip.file(item.name, item.dataUrl, { base64: true });
    });
    zip.generateAsync({ type: "blob" }).then(function (content) {
      // see FileSaver.js
      saveAs(content, "img.zip");
    });
    this.showDownloadTips();
  };

  downloadImg = async () => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < this.LINKLIST.length) {
        this.LINKLIST[i].click();
        i++;
      } else {
        clearInterval(interval);
      }
    }, 500);
    // this.LINKLIST.forEach((item, index) => {
    //   console.log(index)
    //   item.click();
    // })
  };

  downloadImg1 = async () => {
    console.log(this.LINKLIST1);
    let i = 0;
    const interval = setInterval(() => {
      if (i < this.LINKLIST1.length) {
        this.LINKLIST1[i].click();
        i++;
      } else {
        clearInterval(interval);
      }
    }, 500);
    // this.LINKLIST.forEach((item, index) => {
    //   console.log(index)
    //   item.click();
    // })
  };

  test1 = () => {
    const { maps } = Config;
    const cam = maps.getCamera();
    const vector_leftTop = maps.getRayAtScreenPos(0, 0);
    const vector_leftBottom = maps.getRayAtScreenPos(0, window.innerHeight);
    const vector_rightTop = maps.getRayAtScreenPos(window.innerWidth, 0);
    const vector_rightBottom = maps.getRayAtScreenPos(
      window.innerWidth,
      window.innerHeight
    );
    const front = cam.getFront();
    const pos = cam.getPosition();
    const cam_height = vector_leftTop.sub(vector_leftBottom).magnitude();
    const cam_width = vector_leftTop.sub(vector_rightTop).magnitude();

    const pos_leftTop = pos.add(
      vector_leftTop.mul(Math.abs(pos.z() / vector_leftTop.z()))
    );
    const pos_leftBottom = pos.add(
      vector_leftBottom.mul(Math.abs(pos.z() / vector_leftBottom.z()))
    );
    const pos_rightTop = pos.add(
      vector_rightTop.mul(Math.abs(pos.z() / vector_rightTop.z()))
    );
    const pos_rightBottom = pos.add(
      vector_rightBottom.mul(Math.abs(pos.z() / vector_rightBottom.z()))
    );
    const pos_front = pos.add(front.mul(Math.abs(pos.z() / front.z())));
    console.log(pos_leftTop);
    console.log(pos_leftBottom);
    console.log(pos_rightTop);
    console.log(pos_rightBottom);
    console.log(pos_front);
    console.log(pos_leftTop.sub(pos_leftBottom));
    console.log(pos_leftTop.sub(pos_rightTop));
    cam.setPosition(pos.sub(pos_leftTop.sub(pos_leftBottom)));
  };

  calLoadTime = () => {
    const { maps, vrPlanner } = Config;
    const cam = maps.getCamera();
    const pos = cam.getPosition();
    const terrain = Terrain.terrains[0];
    const focus = cam.getFocusPosition();
    const _focus = new vrPlanner.Math.Double3(0, 0, focus.z());
    const zAxis = new vrPlanner.Math.Double3(0, 0, 1);
    const ray_x = maps.getRayAtScreenPos(
      window.innerWidth,
      window.innerHeight / 2
    );
    const ray_y = maps.getRayAtScreenPos(
      window.innerWidth / 2,
      window.innerHeight
    );
    const geo_X = vrPlanner.Math.Vecmath.linePlaneIntersection(
      pos,
      ray_x,
      _focus,
      zAxis
    );
    const geo_Y = vrPlanner.Math.Vecmath.linePlaneIntersection(
      pos,
      ray_y,
      _focus,
      zAxis
    );
    const offsetX = focus
      .asDouble3()
      .sub(geo_X)
      .mul(2);
    const offsetY = focus
      .asDouble3()
      .sub(geo_Y)
      .mul(2);

    let time = 0;

    cam.setPosition(pos.sub(offsetX.mul(-3)).sub(offsetY.mul(3)));
    const interval = setInterval(() => {
      console.log(time);
      if (time === 0) {
        terrain.layer.bindEvent("loadingCompleted", () => {
          console.log("loadingCompleted");
          terrain.layer.unbindEvent("loadingCompleted");
          clearInterval(interval);
          this.setState(
            {
              loadTime: time + 20
            },
            () => {
              console.log(this.state.loadTime);
              message.success("测试结束，可开始截图");
            }
          );
        });
        time++;
      } else {
        time++;
      }
    }, 300);
  };

  setPoint(geo, i, height?) {
    const { maps, vrPlanner } = Config;
    let layer = maps.getLayerById("pointTestLayer");
    //maps.addLayer(layer);
    let point = new vrPlanner.Feature.Point(
      new vrPlanner.GeoLocation(geo.x(), geo.y(), height || 20)
    );
    let style = new vrPlanner.Style.PointStyle({
      radius: 20
    });
    switch (i) {
      case 0:
        style.setColor(new vrPlanner.Color("#ffffff")); //白色
        break;
      case 1:
        style.setColor(new vrPlanner.Color("#ffff00")); //黄色
        break;
      case 2:
        style.setColor(new vrPlanner.Color("#ff0000")); //红色
        break;
      case 3:
        style.setColor(new vrPlanner.Color("#b0e0e6")); //b0e0e6
        break;
    }
    // [0, 0],
    // [0, window.innerHeight],
    // [window.innerWidth, window.innerHeight],
    // [window.innerWidth, 0]
    point.setStyle(style);

    layer.addFeature(point);
  }

  setLine = geos => {
    const { maps, vrPlanner } = Config;
    let layer = maps.getLayerById("pointTestLayer");
    let line = new vrPlanner.Feature.Line();
    let style = new vrPlanner.Style.LineStyle({
      width: 3
    });
    style.setColor(new vrPlanner.Color("#b0e0e6")); //b0e0e6
    line.setStyle(style);
    line.addVertices(geos);
    layer.addFeature(line);
  };

  test23 = async () => {
    const { maps, vrPlanner } = Config;
    const cam = maps.getCamera();
    const pos = cam.getPosition();
    const focus = cam.getFocusPosition();
    const _focus = new vrPlanner.Math.Double3(0, 0, focus.z());
    const zAxis = new vrPlanner.Math.Double3(0, 0, 1);
    const ray_x = maps.getRayAtScreenPos(
      window.innerWidth,
      window.innerHeight / 2
    );
    const ray_y = maps.getRayAtScreenPos(
      window.innerWidth / 2,
      window.innerHeight
    );
    //屏幕右边框中点
    const geo_X = vrPlanner.Math.Vecmath.linePlaneIntersection(
      pos,
      ray_x,
      _focus,
      zAxis
    );
    //屏幕下边框中点
    const geo_Y = vrPlanner.Math.Vecmath.linePlaneIntersection(
      pos,
      ray_y,
      _focus,
      zAxis
    );
    //屏幕视角宽度
    const offsetX = focus
      .asDouble3()
      .sub(geo_X)
      .mul(2);
    //屏幕视角高度
    const offsetY = focus
      .asDouble3()
      .sub(geo_Y)
      .mul(2);
    let yaw = cam.getYaw();
    const terrain = Terrain.terrains[0];

    terrain.layer.unbindEvent("loadingCompleted");
    //!同里古镇
    let geo1 = new vrPlanner.Math.Double3.create(
      13437726.50012964,
      3654308.8384258174,
      31
    );
    let geo2 = new vrPlanner.Math.Double3.create(
      13438324.922603816,
      3654070.4604343227,
      31
    );
    let geo3 = new vrPlanner.Math.Double3.create(
      13438128.998516114,
      3653578.613948926,
      31
    );
    let geo4 = new vrPlanner.Math.Double3.create(
      13437530.576041939,
      3653816.9919404206,
      31
    );
    let limit = [geo1, geo2, geo3, geo4];

    const vector12 = limit[1].sub(limit[0]);
    const vector34 = limit[3].sub(limit[2]);
    const vector23 = limit[2].sub(limit[1]);
    const vector14 = limit[0].sub(limit[3]);
    const Yvector = new vrPlanner.Math.Double3.create(0, 1, 0);
    //geo21与y轴夹角
    let angle12 = vrPlanner.Math.Vecmath.angleBetween(Yvector, vector12);
    const width = vrPlanner.Math.Vecmath.distance(limit[0], limit[1]); //dis12
    const height = vrPlanner.Math.Vecmath.distance(limit[1], limit[2]); //dis23
    const lookAt = cam.getLookAt();
    let count_x = 0;
    let count_y = 0;
    let start: any;
    let n_height = 0;
    let n_width = 0;
    let n2_height = 0;
    let n2_width = 0;
    console.log(width, height);
    const _yaw = Math.abs(yaw);
    cam.setLocked(true);
    console.log(angle12);
    await new Promise<void>((resolve, reject) => {
      if (
        yaw > 90 - this.getDegree(angle12) &&
        yaw < 180 - this.getDegree(angle12)
      ) {
        //总宽度
        const _width =
          height * Math.cos(angle12 - Math.PI / 2 - this.getRadian(yaw)) +
          width * Math.sin(angle12 - Math.PI / 2 - this.getRadian(yaw)) +
          offsetX.magnitude();
        //总高度
        const _height =
          height * Math.sin(angle12 - Math.PI / 2 - this.getRadian(yaw)) +
          width * Math.cos(angle12 - Math.PI / 2 - this.getRadian(yaw)) +
          offsetY.magnitude();
        count_x = Math.ceil(_width / offsetX.magnitude());
        count_y = Math.ceil(_height / offsetY.magnitude());
        //x-x'   y+y'
        let x =
          limit[3].x() -
          width *
          Math.cos(angle12 - Math.PI / 2 - this.getRadian(yaw)) *
          Math.sin(this.getRadian(_yaw));
        let y =
          limit[3].y() +
          width *
          Math.cos(angle12 - Math.PI / 2 - this.getRadian(yaw)) *
          Math.cos(this.getRadian(_yaw));
        start = new vrPlanner.GeoLocation(x, y, 31);
        let start2 = new vrPlanner.GeoLocation(
          x + _width * Math.cos(this.getRadian(_yaw)),
          y + _width * Math.sin(this.getRadian(_yaw)),
          0
        );
        let start4 = new vrPlanner.GeoLocation(
          x + _height * Math.sin(this.getRadian(_yaw)),
          y - _height * Math.cos(this.getRadian(Math.abs(yaw))),
          0
        );

        let start3 = new vrPlanner.GeoLocation(
          start2.x() + _height * Math.sin(this.getRadian(_yaw)),
          start2.y() - _height * Math.cos(this.getRadian(_yaw))
        );
        this.setPoint(start, 0);
        this.setPoint(start2, 1);
        this.setPoint(start3, 2);
        this.setPoint(start4, 3);

        n_height =
          width * Math.cos(angle12 - Math.PI / 2 - this.getRadian(yaw)) +
          offsetY.magnitude() * 0.5;
        n_width =
          width * Math.sin(angle12 - Math.PI / 2 - this.getRadian(yaw)) +
          offsetX.magnitude() * 0.5;
        n2_height =
          height * Math.sin(angle12 - Math.PI / 2 - this.getRadian(yaw)) +
          offsetY.magnitude() * 0.5;
        n2_width =
          height * Math.cos(angle12 - Math.PI / 2 - this.getRadian(yaw)) +
          offsetX.magnitude() * 0.5;
        resolve();
      } else if (
        yaw < 180 &&
        yaw > this.getDegree(angle12)

        // ||yaw < 270 - this.getDegree(angle12)
      ) {
        console.log("21-111", this.getDegree(angle12));
        //总宽度
        const _width =
          height * Math.cos(this.getRadian(yaw) + angle12 - Math.PI) +
          width * Math.sin(this.getRadian(yaw) + angle12 - Math.PI) +
          offsetX.magnitude();
        //总高度
        const _height =
          height * Math.sin(this.getRadian(yaw) + angle12 - Math.PI) +
          width * Math.cos(this.getRadian(yaw) + angle12 - Math.PI) +
          offsetY.magnitude();
        count_x = Math.ceil(_width / offsetX.magnitude());
        count_y = Math.ceil(_height / offsetY.magnitude());
        //x-x'   y+y'
        let x =
          limit[2].x() -
          width *
          Math.cos(this.getRadian(yaw) + angle12 - Math.PI) *
          Math.cos(this.getRadian(_yaw) - Math.PI / 2);
        let y =
          limit[2].y() -
          width *
          Math.cos(this.getRadian(yaw) + angle12 - Math.PI) *
          Math.sin(this.getRadian(_yaw) - Math.PI / 2);
        start = new vrPlanner.GeoLocation(x, y, 31);
        let start2 = new vrPlanner.GeoLocation(
          x - _width * Math.sin(this.getRadian(_yaw) - Math.PI / 2),
          y + _width * Math.cos(this.getRadian(_yaw) - Math.PI / 2),
          0
        );
        let start4 = new vrPlanner.GeoLocation(
          x + _height * Math.cos(this.getRadian(_yaw) - Math.PI / 2),
          y + _height * Math.sin(this.getRadian(_yaw) - Math.PI / 2),
          0
        );

        let start3 = new vrPlanner.GeoLocation(
          start2.x() + _height * Math.cos(this.getRadian(_yaw) - Math.PI / 2),
          start2.y() + _height * Math.sin(this.getRadian(_yaw) - Math.PI / 2)
        );
        this.setPoint(start, 0);
        this.setPoint(start2, 1);
        this.setPoint(start3, 2);
        this.setPoint(start4, 3);

        let pitch = cam.getPitch();

        n_height =
          width * Math.cos(this.getRadian(yaw) + angle12 - Math.PI) +
          offsetY.magnitude() * 0.5;
        n_width =
          width * Math.sin(this.getRadian(yaw) + angle12 - Math.PI) +
          offsetX.magnitude() * 0.5;
        n2_height =
          height * Math.sin(this.getRadian(yaw) + angle12 - Math.PI) +
          offsetY.magnitude() * 0.5;
        n2_width =
          height * Math.cos(this.getRadian(yaw) + angle12 - Math.PI) +
          offsetX.magnitude() * 0.5;
        resolve();
      } else {
        console.log(yaw);

        const _width =
          height * Math.sin(this.getRadian(_yaw) - angle12) +
          width * Math.sin(this.getRadian(_yaw) - angle12) +
          offsetX.magnitude();
        //总高度
        const _height =
          height * Math.sin(this.getRadian(_yaw) - angle12) +
          width * Math.cos(this.getRadian(_yaw) - angle12) +
          offsetY.magnitude();
        count_x = Math.ceil(_width / offsetX.magnitude());
        count_y = Math.ceil(_height / offsetY.magnitude());
        //x-x'   y+y'
        let x =
          limit[1].x() +
          height *
          Math.sin(this.getRadian(_yaw) - angle12) *
          Math.sin(Math.PI - this.getRadian(_yaw));
        let y =
          limit[1].y() -
          height *
          Math.sin(this.getRadian(_yaw) - angle12) *
          Math.cos(Math.PI - this.getRadian(_yaw));
        start = new vrPlanner.GeoLocation(x, y, 31);
        let start2 = new vrPlanner.GeoLocation(
          x - _width * Math.cos(Math.PI - this.getRadian(_yaw)),
          y - _width * Math.sin(Math.PI - this.getRadian(_yaw)),
          0
        );
        let start4 = new vrPlanner.GeoLocation(
          x - _height * Math.sin(Math.PI - this.getRadian(_yaw)),
          y + _height * Math.cos(Math.PI - this.getRadian(_yaw)),
          0
        );

        let start3 = new vrPlanner.GeoLocation(
          start2.x() - _height * Math.sin(this.getRadian(_yaw) - Math.PI / 2),
          start2.y() + _height * Math.cos(this.getRadian(_yaw) - Math.PI / 2)
        );
        this.setPoint(start, 0);
        this.setPoint(start2, 1);
        this.setPoint(start3, 2);
        this.setPoint(start4, 3);

        let pitch = cam.getPitch();

        n_height =
          height * Math.cos(this.getRadian(_yaw) - angle12) +
          offsetY.magnitude() * 0.5;
        n_width =
          height * Math.sin(this.getRadian(_yaw) - angle12) +
          offsetX.magnitude() * 0.5;
        n2_height =
          width * Math.sin(this.getRadian(_yaw) - angle12) +
          offsetY.magnitude() * 0.5;
        n2_width =
          width * Math.cos(this.getRadian(_yaw) - angle12) +
          offsetX.magnitude() * 0.5;
        resolve();
      }
    });
    let points: any = [];
    let a_num: any = [];
    let a2_num: any = [];
    for (let a = 1; a <= count_y; a++) {
      let a_width = ((n_height - a * offsetY.magnitude()) * n_width) / n_height;
      let num = Math.round(a_width / offsetX.magnitude());
      console.log(a_width, num);
      a_num.push(num >= 0 ? num : 0);
    }
    for (let a2 = 1; a2 <= count_y; a2++) {
      let a2_width =
        ((n2_height - a2 * offsetY.magnitude()) * n2_width) / n2_height;
      let num = Math.round(a2_width / offsetX.magnitude());
      console.log(a2_width, num);

      a2_num.push(num >= 0 ? num : 0);
    }

    let _a2num = a2_num.slice().reverse();
    let _anum = a_num.slice().reverse();
    console.log(a_num, a2_num);
    for (var jj = 0; jj < count_y; jj++) {
      let num1 = a_num[jj] + _a2num[jj];
      let num2 = count_x - a2_num[jj] - _anum[jj];
      //    console.log(num1, num2);

      for (var ii = 0; ii < count_x; ii++) {
        if (ii >= num1 && ii < num2) {
          points.push([ii, jj]);
        }
      }
    }

    const dis = start.asDouble3().sub(focus.asDouble3());
    this.setState(
      {
        _pos: pos,
        _lookAt: lookAt,
        dis,
        status: "截图中，时间较长"
      },
      () => {
        console.log(pos, lookAt, dis);
      }
    );
    cam.setPosition(pos.add(dis));

    console.log(count_x, count_y);
    await this.cycleGeo2(offsetX, offsetY, points);
    this.setState(
      {
        status: "截图结束，请下载"
      },
      () => {
        message.success("截图结束 可点击下载图片");
        cam.setLocked(false);
      }
    );
  };

  calBoundary = () => {
    const { maps, vrPlanner } = Config;

    const yaw = maps.getCamera().getYaw();

    const oldPitch = this.state.pitch;
    const vertices = this.shotAreaLine.vertices;
    const distance: any = [];
    const cVertices: any = [];
    const degrees: any = [];
    const newDegrees: any = [];
    const newGeoLocation: any = [];
    const limited = [0, 0, 0, 0]; //maxX, maxY,minX,minY
    for (let i = 0; i < vertices.length - 2; i++) {
      let dis = vrPlanner.Math.Vecmath.distance(
        vertices[0].asDouble3(),
        vertices[i + 1]
      );
      let x = vertices[i + 1].x() - vertices[0].x();
      let y = vertices[i + 1].y() - vertices[0].y();
      let v = new vrPlanner.GeoLocation(x, y, 0);
      let radian = Math.atan2(y, x);
      let degree = this.getDegree(radian);
      let newdegree = degree + yaw;
      let newX = dis * Math.cos(this.getRadian(newdegree));
      let newY = dis * Math.sin(this.getRadian(newdegree));
      if (newX > limited[0]) {
        limited[0] = newX;
      }
      if (newX < limited[1]) {
        limited[1] = newX;
      }
      if (newY > limited[2]) {
        limited[2] = newY;
      }
      if (newY < limited[3]) {
        limited[3] = newY;
      }
      distance.push(dis);
      cVertices.push(v);
      degrees.push(degree);
      newDegrees.push(newdegree);
      newGeoLocation.push(new vrPlanner.GeoLocation(newX, newY, 0));
    }

    console.log(newGeoLocation);
    this.setPoint(new vrPlanner.GeoLocation(limited[0], limited[2], 10), 1);
    return limited;
  };

  shotImg22 = async () => {
    const { maps, vrPlanner } = Config;
    const cam = maps.getCamera();
    const pos = cam.getPosition();
    const focus = cam.getFocusPosition();
    const _focus = new vrPlanner.Math.Double3(0, 0, focus.z());
    const zAxis = new vrPlanner.Math.Double3(0, 0, 1);
    const ray_x = maps.getRayAtScreenPos(
      window.innerWidth,
      window.innerHeight / 2
    );
    const ray_y = maps.getRayAtScreenPos(
      window.innerWidth / 2,
      window.innerHeight
    );
    //屏幕右边框中点
    const geo_X = vrPlanner.Math.Vecmath.linePlaneIntersection(
      pos,
      ray_x,
      _focus,
      zAxis
    );
    //屏幕下边框中点
    const geo_Y = vrPlanner.Math.Vecmath.linePlaneIntersection(
      pos,
      ray_y,
      _focus,
      zAxis
    );
    //屏幕视角宽度
    const offsetX = focus
      .asDouble3()
      .sub(geo_X)
      .mul(2);
    //屏幕视角高度
    const offsetY = focus
      .asDouble3()
      .sub(geo_Y)
      .mul(2);
    let yaw = cam.getYaw();
    const terrain = Terrain.terrains[0];

    terrain.layer.unbindEvent("loadingCompleted");
    let limited = this.calBoundary();
  };

  shanyinlu = async () => {
    const { maps, vrPlanner } = Config;
    const cam = maps.getCamera();
    const pos = cam.getPosition();
    const focus = cam.getFocusPosition();
    const _focus = new vrPlanner.Math.Double3(0, 0, focus.z());
    const zAxis = new vrPlanner.Math.Double3(0, 0, 1);
    const ray_x = maps.getRayAtScreenPos(
      window.innerWidth,
      window.innerHeight / 2
    );
    const terrain = Terrain.terrains[0];
    console.log(terrain.getInnerBounds());
    const limit = [
      13524784.293707628,
      3665928.987224949,
      13525968.769905623,
      3667159.2627526256
    ];
    let geo1 = new vrPlanner.GeoLocation(limit[0], limit[1], 10);
    let geo2 = new vrPlanner.GeoLocation(limit[0], limit[3], 10);
    let geo3 = new vrPlanner.GeoLocation(limit[2], limit[1], 10);
    let geo4 = new vrPlanner.GeoLocation(limit[2], limit[3], 10);
    this.setPoint(geo1, 0);
    this.setPoint(geo2, 1);
    this.setPoint(geo3, 2);
    this.setPoint(geo4, 3);
    let start = geo2;
    const lookAt = cam.getLookAt();

    const dis = start.asDouble3().sub(focus.asDouble3());
    this.setState({
      re_dis: `${dis.x()},${dis.y()},${dis.z()}`,
      re_pos: `${pos.x()},${pos.y()},${pos.z()}`,
      re_lookAt: `${lookAt.x()},${lookAt.y()},${lookAt.z()}`
    });
    console.log(pos);
    // "13735708.889162539,-24647182.601264298,15730486.14970726";
    // "13735708.889162539,-24647182.601264298,15730486.14970726";
    //ZHENGNAN    13475424.235971743,-7572010.957947623, 6138025.64215893
    //俯视 13523303.157711534,3667683.1823046687,32705213.02386026
    console.log(lookAt);
    //zhengnan 13475424.609989958,-7571923.193192819,6137977.712961942
    //俯视13523303.157711534, b: 3667683.1823081593, c: 32705113.02386026
    console.log(dis);
    //zhengnan -411.3105914089829, 1071.3194954297505, 10
    //-391.8001387473196, b: 919.9743196209893, c: 10
  };

  tongli = async () => {
    const { maps, vrPlanner } = Config;
    const cam = maps.getCamera();
    const pos = cam.getPosition();
    const focus = cam.getFocusPosition();
    const _focus = new vrPlanner.Math.Double3(0, 0, focus.z());
    const zAxis = new vrPlanner.Math.Double3(0, 0, 1);
    const ray_x = maps.getRayAtScreenPos(
      window.innerWidth,
      window.innerHeight / 2
    );

    const terrain = Terrain.terrains[0];
    console.log(terrain.getInnerBounds());
    let limit = [
      13437194.638259456,
      3652640.5437721517,
      13438505.910983775,
      3654404.222673768
    ];
    let geo1 = new vrPlanner.GeoLocation(
      13437194.638259456,
      3652640.5437721517,
      10
    );
    let geo2 = new vrPlanner.GeoLocation(
      13437194.638259456,
      3654404.222673768,
      10
    );
    let geo3 = new vrPlanner.GeoLocation(
      13438505.910983775,
      3652640.5437721517,
      10
    );
    let geo4 = new vrPlanner.GeoLocation(
      13438505.910983775,
      3654404.222673768,
      10
    );
    this.setPoint(geo1, 0);
    this.setPoint(geo2, 1);
    this.setPoint(geo3, 2);
    this.setPoint(geo4, 3);
    cam.setLocked(true);
    let start = geo2;
    const lookAt = cam.getLookAt();

    const dis = start.asDouble3().sub(focus.asDouble3());

    console.log(pos);
    //正南13437849.378577294,-2696642.4627343104,4872709.438565505
    //正南-2 13439756.185045471,-3390900.09229355,4022530.2845232706
    //俯视 13437860.248595253, b: 3653518.5251285643, c: 11677407.073425073
    console.log(lookAt);
    //正南13437849.378578382,-2696563.1276055924,4872648.562155038
    //正南-2  13439756.161627738,-3390813.2527115177,4022480.697363198
    //俯视 13437860.248595253, b: 3653518.525132055, c: 11677307.073425073
    console.log(dis);
    //正南-654.8273457549512,839.3893619752489,20.02567484974861
    //正南-2  -661.8861813209951,825.0842389981262,20.02567484974861
    // 俯视 -665.6103357970715, b: 885.2899416503496, c: 20.022134333848953
  };

  hongkougang = async () => {
    const { maps, vrPlanner } = Config;
    const cam = maps.getCamera();
    const pos = cam.getPosition();
    const focus = cam.getFocusPosition();
    const _focus = new vrPlanner.Math.Double3(0, 0, focus.z());
    const zAxis = new vrPlanner.Math.Double3(0, 0, 1);
    const ray_x = maps.getRayAtScreenPos(
      window.innerWidth,
      window.innerHeight / 2
    );
    const ray_y = maps.getRayAtScreenPos(
      window.innerWidth / 2,
      window.innerHeight
    );
    //屏幕右边框中点
    const geo_X = vrPlanner.Math.Vecmath.linePlaneIntersection(
      pos,
      ray_x,
      _focus,
      zAxis
    );
    //屏幕下边框中点
    const geo_Y = vrPlanner.Math.Vecmath.linePlaneIntersection(
      pos,
      ray_y,
      _focus,
      zAxis
    );
    //屏幕视角宽度
    const offsetX = focus
      .asDouble3()
      .sub(geo_X)
      .mul(2);
    //屏幕视角高度
    const offsetY = focus
      .asDouble3()
      .sub(geo_Y)
      .mul(2);
    let yaw = cam.getYaw();
    const terrain = Terrain.terrains[0];

    let T3Boundry = [
      13523777.926252345,
      3664961.798552367,
      13524306.941747194,
      3665556.43802102
    ];
    let T1Boudry = [
      13523317.72375013,
      3665928.7242100933,
      13523923.611438304,
      3666587.481452624
    ];
    let geo1 = new vrPlanner.GeoLocation(
      13524306.941747194,
      3664961.798552367,
      10
    ); //point1
    let geo2 = new vrPlanner.GeoLocation(
      13523317.72375013,
      3666587.481452624,
      10
    );
    let geo3 = new vrPlanner.GeoLocation(
      13523317.72375013,
      3664961.798552367,
      10
    );
    let geo4 = new vrPlanner.GeoLocation(
      13524306.941747194,
      3666587.481452624,
      10
    );
    this.setPoint(geo1, 0);
    this.setPoint(geo2, 1);
    this.setPoint(geo3, 2);
    this.setPoint(geo4, 3);
    const _yaw = Math.abs(yaw);
    cam.setLocked(true);
    let start = geo2;
    const lookAt = cam.getLookAt();

    const dis = start.asDouble3().sub(focus.asDouble3());

    console.log(pos);
    //13531994.811012652,-2394225.417103156,3656434.230802967
    //13524009.293469593,3665758.5496761464,11069018.759497348
    console.log(lookAt);
    //13531994.69801011,-2394139.795384214,3656382.569323354
    //13524009.293469593,3665758.5496726558,11068918.759497348
    console.log(dis);
    // -679.1684432718903,811.5769360428676,-8.094798922538757
    // 297.64827760122716,-796.3647563490085,15.534825474023819,
  };
  t22 = async () => {
    const { maps, vrPlanner } = Config;
    //pitch  -27.452969103171174
    const cam = maps.getCamera();
    const pos = cam.getPosition();
    const focus = cam.getFocusPosition();
    const _focus = new vrPlanner.Math.Double3(0, 0, focus.z());
    const zAxis = new vrPlanner.Math.Double3(0, 0, 1);
    const ray_x = maps.getRayAtScreenPos(
      window.innerWidth,
      window.innerHeight / 2
    );
    const ray_y = maps.getRayAtScreenPos(
      window.innerWidth / 2,
      window.innerHeight
    );
    //屏幕右边框中点
    const geo_X = vrPlanner.Math.Vecmath.linePlaneIntersection(
      pos,
      ray_x,
      _focus,
      zAxis
    );
    //屏幕下边框中点
    const geo_Y = vrPlanner.Math.Vecmath.linePlaneIntersection(
      pos,
      ray_y,
      _focus,
      zAxis
    );
    //屏幕视角宽度
    const offsetX = focus
      .asDouble3()
      .sub(geo_X)
      .mul(2);
    //屏幕视角高度
    const offsetY = focus
      .asDouble3()
      .sub(geo_Y)
      .mul(2);
    let yaw = cam.getYaw();
    const terrain = Terrain.terrains[0];

    terrain.layer.unbindEvent("loadingCompleted");
    //顺时针
    //!震得古镇
    let geo1 = new vrPlanner.Math.Double3.create(
      13412848.630341753,
      3621574.1970682302,
      31
    );
    let geo2 = new vrPlanner.Math.Double3.create(
      13414400.792259926,
      3622359.3261529696,
      31
    );
    let geo3 = new vrPlanner.Math.Double3.create(
      13414803.879766462,
      3621562.4415887734,
      31
    );
    let geo4 = new vrPlanner.Math.Double3.create(
      13413251.717936113,
      3620777.312548457,
      31
    );

    let limit = [geo1, geo2, geo3, geo4];
    const limitPolygon = new vrPlanner.Feature.Polygon();
    limitPolygon.addVertices([
      //1
      geo1,
      //2
      geo2,
      //3
      geo3,
      //4
      geo4
    ]);

    const vector12 = limit[1].sub(limit[0]);
    const vector34 = limit[3].sub(limit[2]);
    const vector23 = limit[2].sub(limit[1]);
    const vector14 = limit[0].sub(limit[3]);
    const Yvector = new vrPlanner.Math.Double3.create(0, 1, 0);
    //宽与y轴夹角
    let angle12 = vrPlanner.Math.Vecmath.angleBetween(Yvector, vector12);

    let angle23 = vrPlanner.Math.Vecmath.angleBetween(Yvector, vector23);

    const width = vrPlanner.Math.Vecmath.distance(limit[0], limit[1]); //dis12
    const height = vrPlanner.Math.Vecmath.distance(limit[1], limit[2]); //dis23
    const lookAt = cam.getLookAt();
    let count_x = 0,
      count_y = 0;
    let start: any;
    let n_height = 0;
    let n_width = 0;
    let n2_height = 0;
    let n2_width = 0;
    console.log(width, height);
    // console.log(offsetX.magnitude(), offsetY.magnitude());
    //-63.16837371211415~26.831626287885847
    const _yaw = Math.abs(yaw);
    cam.setLocked(true);
    console.log(Math.PI - angle12 - this.getRadian(_yaw));
    await new Promise<void>((resolve, reject) => {
      if (
        yaw < 90 - this.getDegree(angle12) &&
        yaw > -this.getDegree(angle12)
      ) {
        //总宽度
        const _width =
          height * Math.cos(this.getRadian(yaw) + angle12) +
          width * Math.sin(this.getRadian(yaw) + angle12) +
          offsetX.magnitude();
        //总高度
        const _height =
          height * Math.sin(this.getRadian(yaw) + angle12) +
          width * Math.cos(this.getRadian(yaw) + angle12) +
          offsetY.magnitude();
        count_x = Math.ceil(_width / offsetX.magnitude());
        count_y = Math.ceil(_height / offsetY.magnitude());
        //x-x'   y+y'
        let x =
          limit[0].x() -
          height *
          Math.cos(this.getRadian(yaw) + angle12) *
          Math.sin(this.getRadian(_yaw));
        let y =
          limit[0].y() +
          height *
          Math.cos(this.getRadian(yaw) + angle12) *
          Math.cos(this.getRadian(_yaw));
        start = new vrPlanner.GeoLocation(x, y, 31);
        let start2 = new vrPlanner.GeoLocation(
          x + _width * Math.cos(this.getRadian(_yaw)),
          y + _width * Math.sin(this.getRadian(_yaw)),
          0
        );
        let start4 = new vrPlanner.GeoLocation(
          x + _height * Math.sin(this.getRadian(_yaw)),
          y - _height * Math.cos(this.getRadian(Math.abs(yaw))),
          0
        );

        let start3 = new vrPlanner.GeoLocation(
          start2.x() + _height * Math.sin(this.getRadian(_yaw)),
          start2.y() - _height * Math.cos(this.getRadian(_yaw))
        );
        this.setPoint(start, 1);
        this.setPoint(start2, 2);
        this.setPoint(start3, 3);

        this.setPoint(start4, 4);
        n_height =
          width * Math.cos(this.getRadian(yaw) + angle12) +
          offsetY.magnitude() * 0.5;
        n_width =
          width * Math.sin(this.getRadian(yaw) + angle12) +
          offsetX.magnitude() * 0.5;
        n2_height =
          height * Math.sin(this.getRadian(yaw) + angle12) +
          offsetY.magnitude() * 0.5;
        n2_width =
          height * Math.cos(this.getRadian(yaw) + angle12) +
          offsetX.magnitude() * 0.5;
        resolve();
      }

      //* -63.16837371211415~-153.16838002655305
      else if (
        yaw > -this.getDegree(angle23) &&
        yaw < -this.getDegree(angle12)
      ) {
        const _width =
          height * Math.cos(Math.abs(angle12 + this.getRadian(yaw))) +
          width * Math.sin(Math.abs(angle12 + this.getRadian(yaw))) +
          offsetX.magnitude();
        //总高度
        const _height =
          height * Math.sin(Math.abs(angle12 + this.getRadian(yaw))) +
          width * Math.cos(Math.abs(angle12 + this.getRadian(yaw))) +
          offsetY.magnitude();
        count_x = Math.ceil(_width / offsetX.magnitude());
        count_y = Math.ceil(_height / offsetY.magnitude());
        //y-,x+

        let x =
          limit[1].x() +
          height *
          Math.sin(Math.abs(angle12 + this.getRadian(yaw))) *
          Math.cos(this.getRadian(_yaw - 90));

        let y =
          limit[1].y() -
          height *
          Math.sin(Math.abs(angle12 + this.getRadian(yaw))) *
          Math.sin(this.getRadian(_yaw - 90));
        start = new vrPlanner.GeoLocation(x, y, 31);
        let start2 = new vrPlanner.GeoLocation(
          x -
          (_width - offsetX.magnitude()) *
          Math.sin(this.getRadian(_yaw - 90)),
          y -
          (_width - offsetX.magnitude()) *
          Math.cos(this.getRadian(_yaw - 90)),
          31
        );
        let start4 = new vrPlanner.GeoLocation(
          x -
          (_height - offsetY.magnitude()) *
          Math.cos(this.getRadian(_yaw - 90)),
          y +
          (_height - offsetY.magnitude()) *
          Math.sin(this.getRadian(_yaw - 90)),
          31
        );
        let start3 = new vrPlanner.GeoLocation(
          start2.x() -
          (_height - offsetY.magnitude()) *
          Math.cos(this.getRadian(_yaw - 90)),
          start2.y() +
          (_height - offsetY.magnitude()) *
          Math.sin(this.getRadian(_yaw - 90)),
          31
        );
        this.setPoint(start, 1);
        this.setPoint(start2, 2);
        this.setPoint(start3, 3);
        this.setPoint(start4, 0);
        this.setLine([start, start2, start3, start4, start]);
        n_height =
          height * Math.sin(Math.abs(this.getRadian(yaw) + angle12)) +
          offsetY.magnitude() * 0.5;
        n_width =
          height * Math.cos(Math.abs(this.getRadian(yaw) + angle12)) +
          offsetX.magnitude() * 0.5;
        n2_height =
          width * Math.cos(Math.abs(this.getRadian(yaw) + angle12)) +
          offsetY.magnitude() * 0.5;
        n2_width =
          width * Math.sin(Math.abs(Math.abs(this.getRadian(yaw) + angle12))) +
          offsetX.magnitude() * 0.5;
        console.log(n_height, n_width, n2_height, n2_width);
        resolve();
      }
      //*-153.16838002655305~-180  &&116.83162628788585~180
      else if (
        yaw < -this.getDegree(angle23) ||
        yaw > 180 - this.getDegree(angle12)
      ) {
        const _width =
          height * Math.cos(angle12 + this.getRadian(_yaw) - Math.PI) +
          width * Math.sin(angle12 + this.getRadian(_yaw) - Math.PI) +
          offsetX.magnitude();
        //总高度
        const _height =
          height * Math.sin(angle12 + this.getRadian(_yaw) - Math.PI) +
          width * Math.cos(angle12 + this.getRadian(_yaw) - Math.PI) +
          offsetY.magnitude();
        count_x = Math.ceil(_width / offsetX.magnitude());
        count_y = Math.ceil(_height / offsetY.magnitude());
        let x =
          limit[2].x() -
          width *
          Math.cos(angle12 + this.getRadian(_yaw) - Math.PI) *
          Math.sin(this.getRadian(180 - _yaw));
        let y =
          limit[2].y() -
          width *
          Math.cos(angle12 + this.getRadian(_yaw) - Math.PI) *
          Math.cos(this.getRadian(180 - _yaw));
        start = new vrPlanner.GeoLocation(x, y, 31);
        let start2 = new vrPlanner.GeoLocation(
          x -
          (_width - offsetX.magnitude()) *
          Math.cos(this.getRadian(180 - _yaw)),
          y +
          (_width - offsetX.magnitude()) *
          Math.sin(this.getRadian(180 - _yaw)),
          31
        );
        let start4 = new vrPlanner.GeoLocation(
          x +
          (_height - offsetY.magnitude()) *
          Math.sin(this.getRadian(180 - _yaw)),
          y +
          (_height - offsetY.magnitude()) *
          Math.cos(this.getRadian(180 - _yaw)),
          31
        );
        let start3 = new vrPlanner.GeoLocation(
          start2.x() +
          (_height - offsetY.magnitude()) *
          Math.sin(this.getRadian(180 - _yaw)),
          start2.y() +
          (_height - offsetY.magnitude()) *
          Math.cos(this.getRadian(180 - _yaw)),
          31
        );
        this.setPoint(start, 1);
        this.setPoint(start2, 2);
        this.setPoint(start3, 3);
        this.setPoint(start4, 0);
        this.setLine([start, start2, start3, start4, start]);
        n_height =
          width * Math.cos(this.getRadian(_yaw) + angle12 - Math.PI) +
          offsetY.magnitude() * 0.5;
        n_width =
          width * Math.sin(this.getRadian(_yaw) + angle12 - Math.PI) +
          offsetX.magnitude() * 0.5;
        n2_height =
          height * Math.sin(this.getRadian(_yaw) + angle12 - Math.PI) +
          offsetY.magnitude() * 0.5;
        n2_width =
          height * Math.cos(this.getRadian(_yaw) + angle12 - Math.PI) +
          offsetX.magnitude() * 0.5;
        console.log(n_height, n_width, n2_height, n2_width);
        resolve();
      }
      //*26.831626287885847~116.83162628788585
      else {
        const _width =
          height * Math.cos(Math.PI - angle12 - this.getRadian(_yaw)) +
          width * Math.sin(Math.PI - angle12 - this.getRadian(_yaw)) +
          offsetX.magnitude();
        //总高度
        const _height =
          height * Math.sin(Math.PI - angle12 - this.getRadian(_yaw)) +
          width * Math.cos(Math.PI - angle12 - this.getRadian(_yaw)) +
          offsetY.magnitude();
        count_x = Math.ceil(_width / offsetX.magnitude());
        count_y = Math.ceil(_height / offsetY.magnitude());
        let x =
          limit[3].x() -
          height *
          Math.sin(Math.PI - angle12 - this.getRadian(_yaw)) *
          Math.sin(this.getRadian(_yaw));
        let y =
          limit[3].y() +
          height *
          Math.cos(Math.PI - angle12 + this.getRadian(yaw)) *
          Math.cos(this.getRadian(_yaw));
        start = new vrPlanner.GeoLocation(x, y, 31);
        let start2 = new vrPlanner.GeoLocation(
          x + (_width - offsetX.magnitude()) * Math.cos(this.getRadian(_yaw)),
          y + (_width - offsetX.magnitude()) * Math.sin(this.getRadian(_yaw)),
          31
        );
        let start4 = new vrPlanner.GeoLocation(
          x + (_height - offsetY.magnitude()) * Math.sin(this.getRadian(_yaw)),
          y - (_height - offsetY.magnitude()) * Math.cos(this.getRadian(_yaw)),
          31
        );
        let start3 = new vrPlanner.GeoLocation(
          start2.x() +
          (_height - offsetY.magnitude()) * Math.sin(this.getRadian(_yaw)),
          start2.y() -
          (_height - offsetY.magnitude()) * Math.cos(this.getRadian(_yaw)),
          31
        );
        this.setPoint(start, 1);
        this.setPoint(start2, 2);
        this.setPoint(start3, 3);
        this.setPoint(start4, 0);
        this.setLine([start, start2, start3, start4, start]);
        n_height =
          height * Math.sin(Math.PI - angle12 - this.getRadian(_yaw)) +
          offsetY.magnitude() * 0.5;
        n_width =
          height * Math.cos(Math.PI - angle12 - this.getRadian(_yaw)) +
          offsetX.magnitude() * 0.5;
        n2_height =
          width * Math.cos(Math.PI - angle12 - this.getRadian(_yaw)) +
          offsetY.magnitude() * 0.5;
        n2_width =
          width * Math.sin(Math.PI - angle12 - this.getRadian(_yaw)) +
          offsetX.magnitude() * 0.5;
        console.log(n_height, n_width, n2_height, n2_width);
        resolve();
      }
    });
    let points: any = [];
    let a_num: any = [];
    let a2_num: any = [];
    for (let a = 1; a <= count_y; a++) {
      let a_width = ((n_height - a * offsetY.magnitude()) * n_width) / n_height;
      let num = Math.round(a_width / offsetX.magnitude());
      console.log(a_width, num);
      a_num.push(num >= 0 ? num : 0);
    }
    for (let a2 = 1; a2 <= count_y; a2++) {
      let a2_width =
        ((n2_height - a2 * offsetY.magnitude()) * n2_width) / n2_height;
      let num = Math.round(a2_width / offsetX.magnitude());
      console.log(a2_width, num);

      a2_num.push(num >= 0 ? num : 0);
    }

    let _a2num = a2_num.slice().reverse();
    let _anum = a_num.slice().reverse();
    console.log(a_num, a2_num);
    for (var jj = 0; jj < count_y; jj++) {
      let num1 = a_num[jj] + _a2num[jj];
      let num2 = count_x - a2_num[jj] - _anum[jj];
      //    console.log(num1, num2);

      for (var ii = 0; ii < count_x; ii++) {
        if (ii >= num1 && ii < num2) {
          points.push([ii, jj]);
        }
      }
    }
    console.log(points);
    console.log(start);
    const dis = start.asDouble3().sub(focus.asDouble3());
    this.setState(
      {
        _pos: pos,
        _lookAt: lookAt,
        dis,
        status: "截图中，时间较长"
      },
      () => {
        console.log(pos, lookAt, dis);
      }
    );
    cam.setPosition(pos.add(dis));
    let _pos = cam.getPosition();

    console.log(count_x, count_y);
    await this.cycleGeo2(offsetX, offsetY, points);
    this.setState(
      {
        status: "截图结束，请下载"
      },
      () => {
        message.success("截图结束 可点击下载图片");
        cam.setLocked(false);
      }
    );
  };

  cycleGeo2 = async (offsetX, offsetY, points) => {
    const { maps, vrPlanner } = Config;
    const { allGeo } = this.state;
    return new Promise<void>(async (resolve, reject) => {
      let tc = 0;
      //   let i = 0; //列
      //let j = 0; //行
      let failGeo: any[] = [];
      const cam = maps.getCamera();
      const pos = cam.getPosition();
      const terrain = Terrain.terrains[0];
      //   const focus = cam.getFocusPosition();

      // console.log(_width, offsetX.magnitude());

      for (let x = 0; x < points.length; x++) {
        console.log(x);
        let i = points[x][0];
        let j = points[x][1];
        cam.setPosition(pos.sub(offsetX.mul(i)).sub(offsetY.mul(j)));
        await new Promise<void>((resolve, reject) => {
          terrain.layer.bindEvent("loadingCompleted", async () => {
            terrain.layer.unbindEvent("loadingCompleted");
            console.log("loadingCompleted", i, j);
            await this.getImg(
              (j < 9 ? "0" + (j + 1) : j + 1) +
              "_" +
              (i < 9 ? "0" + (i + 1) : i + 1)
            );
            resolve();
            //cam.setPosition(_pos.sub(offsetX.mul(i)).sub(offsetY.mul(j)));
          });
        });
      }
      resolve();
    });
  };

  test2 = async () => {
    const { maps, vrPlanner } = Config;

    const cam = maps.getCamera();
    const pos = cam.getPosition();
    const focus = cam.getFocusPosition();

    const yaw = cam.getYaw();
    const terrain = Terrain.terrains[0];
    terrain.layer.unbindEvent("loadingCompleted");
    const [minX, minY, maxX, maxY] = terrain.getInnerBounds();
    const height = maxY - minY;
    const width = maxX - minX;
    const limit = [[minX, maxY], [minX, minY], [maxX, minY], [maxX, maxY]];
    console.log(limit[0], limit[1]);
    const _focus = new vrPlanner.Math.Double3(0, 0, focus.z()); //
    const zAxis = new vrPlanner.Math.Double3(0, 0, 1);
    // getRayAtScreenPos  从查看相机返回到屏幕像素x，y的归一化射线，
    //其中x = 0在2D屏幕的左侧，y = 0在2D屏幕的顶部
    const ray_x = maps.getRayAtScreenPos(
      window.innerWidth,
      window.innerHeight / 2
    );
    const ray_y = maps.getRayAtScreenPos(
      window.innerWidth / 2,
      window.innerHeight
    );
    //屏幕右边框中点
    const geo_X = vrPlanner.Math.Vecmath.linePlaneIntersection(
      pos,
      ray_x,
      _focus,
      zAxis
    );
    //屏幕下边框中点
    const geo_Y = vrPlanner.Math.Vecmath.linePlaneIntersection(
      pos,
      ray_y,
      _focus,
      zAxis
    );
    //屏幕视角宽度
    const offsetX = focus
      .asDouble3()
      .sub(geo_X)
      .mul(2);
    //屏幕视角高度
    const offsetY = focus
      .asDouble3()
      .sub(geo_Y)
      .mul(2);

    const _width =
      height * Math.cos(this.getRadian(yaw)) +
      width * Math.sin(this.getRadian(yaw));
    const _height =
      height * Math.sin(this.getRadian(yaw)) +
      width * Math.cos(this.getRadian(yaw));
    const count_x = Math.ceil(_width / offsetX.magnitude());
    const count_y = Math.ceil(_height / offsetY.magnitude());
    cam.unbindEvent("move");
    let Geo;
    let x = 0,
      y = 0;

    if (yaw > 0) {
      if (yaw < 90) {
        const geo = limit[0];
        x =
          geo[0] -
          height *
          Math.cos(this.getRadian(yaw)) *
          Math.sin(this.getRadian(yaw));
        y =
          geo[1] -
          height *
          Math.cos(this.getRadian(yaw)) *
          Math.sin(this.getRadian(yaw));
        console.log(x, geo[0]);
      } else {
        const geo = limit[1];
        x =
          geo[0] +
          height *
          Math.cos(this.getRadian(yaw)) *
          Math.cos(this.getRadian(yaw));
        y =
          geo[1] +
          height *
          Math.cos(this.getRadian(yaw)) *
          Math.sin(this.getRadian(yaw));
      }

      const start = new vrPlanner.GeoLocation(x, y, 0);

      const lookAt = cam.getLookAt();

      const dis = start.asDouble3().sub(focus.asDouble3());
      this.setState(
        {
          _pos: pos,
          _lookAt: lookAt,
          dis,
          status: "截图中，时间较长"
        },
        () => {
          cam.setLocked(true);
          console.log(cam.isLocked());
          //   console.log(this.state._pos, this.state._lookAt, dis)
          //   console.log(pos)
        }
      );
      cam.setPosition(pos.add(dis));
      const _pos = cam.getPosition();
      //  console.log(pos.add(dis).sub(offsetX.mul(i)).sub(offsetY.mul(j)), pos.add(dis))

      await this.cycleGeo(_pos, offsetX, offsetY, count_x, count_y);

      await this.reCycleGeo(dis);
      this.setState(
        {
          status: "截图结束，请下载"
        },
        () => {
          message.success("截图结束 可点击下载图片");
          cam.setLocked(false);
        }
      );
    } else {
      if (yaw > -90) {
        limit[2];
      } else {
        limit[3];
      }
    }
  };

  cycleGeo = async (_pos, offsetX, offsetY, count_x, count_y) => {
    const { maps, vrPlanner } = Config;
    const { allGeo } = this.state;
    return new Promise((resolve, reject) => {
      let tc = 0;
      let i = 0; //列
      let j = 0; //行
      let failGeo: any[] = [];
      const cam = maps.getCamera();
      const pos = cam.getPosition();
      const terrain = Terrain.terrains[0];
      //   const focus = cam.getFocusPosition();

      // console.log(_width, offsetX.magnitude());
      console.log(count_x, count_y);

      const interval = setInterval(async () => {
        if (tc === 0) {
          cam.setPosition(_pos.sub(offsetX.mul(i)).sub(offsetY.mul(j)));
          console.log(cam.getPosition());
          terrain.layer.bindEvent("loadingCompleted", async () => {
            terrain.layer.unbindEvent("loadingCompleted");
            console.log("loadingCompleted", i, j);
            tc = -3;

            await this.getImg(j + 1 + "_" + (i + 1));
            // tc = 0;
            // if (j === 1) {
            //   cam.setPosition(_pos.sub(offsetX.mul(i)).sub(offsetY.mul(j)));
            // }
            //  console.log(j + "_" + i)
            if (i >= count_x) {
              j++;
              i = -1;

              if (j >= count_y) {
                this.setState(
                  {
                    failGeo: failGeo
                  },
                  () => {
                    console.log(this.state.failGeo);
                    resolve(this.state.failGeo);
                  }
                );

                clearInterval(interval);
              }
            }
            i++;
            //cam.setPosition(_pos.sub(offsetX.mul(i)).sub(offsetY.mul(j)));
          });
          tc++;
        } else if (tc >= this.state.loadTime) {
          failGeo.push({
            i: i + 1,
            j: j + 1,
            geo: cam.getPosition(),
            lookAt: cam.getLookAt()
          });
          console.log({
            i: i + 1,
            j: j + 1,
            geo: cam.getPosition(),
            lookAt: cam.getLookAt()
          });
          terrain.layer.unbindEvent("loadingCompleted");
          console.log("loadingUnCompleted", i, j);
          tc = -3;
          await this.getImg(j + 1 + "_" + (i + 1));
          // if (j === 1)
          //   cam.setPosition(_pos.sub(offsetX.mul(i)).sub(offsetY.mul(j - 1)));
          // }

          allGeo.push({
            i: i,
            j: j,
            geo: _pos.sub(offsetX.mul(i)).sub(offsetY.mul(j))
          });
          //  console.log(j + "_" + i)
          // tc = 0;
          if (i >= count_x) {
            j++;
            i = -1;
            if (j >= count_y) {
              this.setState(
                {
                  failGeo: failGeo
                },
                () => {
                  //          console.log(this.state.failGeo)
                  resolve(this.state.failGeo);
                }
              );
              clearInterval(interval);
            }
          }
          i++;
          cam.setPosition(_pos.sub(offsetX.mul(i)).sub(offsetY.mul(j)));
        } else if (tc < 0) {
          //    console.log(tc);
          tc++;
        } else {
          tc++;
        }
      }, 300);
    });
  };

  reCycleGeo = dis => {
    return new Promise<void>((resolve, reject) => {
      const { maps, vrPlanner } = Config;
      const cam = maps.getCamera();
      const pos = cam.getPosition();
      const terrain = Terrain.terrains[0];
      let tt = 0;
      cam.setPosition(pos.add(dis));

      let reloadTime = 0;
      if (this.state.loadTime > 100) {
        reloadTime = 1.5 * this.state.loadTime;
      } else if (this.state.loadTime < 60 && this.state.loadTime > 30) {
        reloadTime = 2.5 * this.state.loadTime;
      } else if (this.state.loadTime < 30) {
        reloadTime = 3 * this.state.loadTime;
      } else {
        reloadTime = 2 * this.state.loadTime;
      }
      let aa = 0;
      const interval = setInterval(async () => {
        console.log(
          "i",
          this.state.failGeo[aa].i,
          "tt",
          this.state.failGeo[aa].j
        );
        if (aa === 0) {
          cam.setPosition(
            this.state.failGeo[aa].geo,
            this.state.failGeo[aa].lookAt
          );
        }
        if (tt === 0) {
          terrain.layer.bindEvent("loadingCompleted", async () => {
            terrain.layer.unbindEvent("loadingCompleted");
            //   console.log("loadingCompleted");
            //    console.log(cam.getPosition())
            tt = -3;
            await this.getImg1(
              this.state.failGeo[aa].j + "_" + this.state.failGeo[aa].i
            );
            aa++;
            if (aa >= this.state.failGeo.length) {
              clearInterval(interval);
              resolve();
            } else {
              cam.setPosition(
                this.state.failGeo[aa].geo,
                this.state.failGeo[aa].lookAt
              );
              // clearInterval(interval)

              //    console.log("failGeo j i" + this.state.failGeo[aa].j + "_" + this.state.failGeo[aa].i)
            }
          });
          tt++;
        } else if (tt >= reloadTime) {
          terrain.layer.unbindEvent("loadingCompleted");
          tt = -3;
          await this.getImg1(
            this.state.failGeo[aa].j + "_" + this.state.failGeo[aa].i
          );
          aa++;
          if (aa >= this.state.failGeo.length) {
            resolve();
            clearInterval(interval);
          } else {
            cam.setPosition(
              this.state.failGeo[aa].geo,
              this.state.failGeo[aa].lookAt
            );
          }
        } else {
          tt++;
        }
      }, 300);
    });
  };

  test3 = () => {
    const { maps, vrPlanner } = Config;

    const cam = maps.getCamera();
    const pos = cam.getPosition();
    const focus = cam.getFocusPosition();
    const _focus = new vrPlanner.Math.Double3(0, 0, focus.z());
    const zAxis = new vrPlanner.Math.Double3(0, 0, 1);
    const ray_x = maps.getRayAtScreenPos(
      window.innerWidth,
      window.innerHeight / 2
    );
    const ray_y = maps.getRayAtScreenPos(
      window.innerWidth / 2,
      window.innerHeight
    );
    const geo_X = vrPlanner.Math.Vecmath.linePlaneIntersection(
      pos,
      ray_x,
      _focus,
      zAxis
    );
    const geo_Y = vrPlanner.Math.Vecmath.linePlaneIntersection(
      pos,
      ray_y,
      _focus,
      zAxis
    );
    const offsetX = focus
      .asDouble3()
      .sub(geo_X)
      .mul(2);
    const offsetY = focus
      .asDouble3()
      .sub(geo_Y)
      .mul(2);
    const yaw = cam.getYaw();
    const terrain = Terrain.terrains[0];
    terrain.layer.unbindEvent("loadingCompleted");
    const [minX, minY, maxX, maxY] = terrain.getInnerBounds();
    const height = maxY - minY;
    const width = maxX - minX;
    const limit = [[minX, maxY], [minX, minY], [maxX, minY], [maxX, maxY]];
    if (yaw > 0) {
      if (yaw < 90) {
        const geo = limit[0];
        const x =
          geo[0] -
          height *
          Math.cos(this.getRadian(yaw)) *
          Math.sin(this.getRadian(yaw));
        const y =
          geo[1] -
          height *
          Math.cos(this.getRadian(yaw)) *
          Math.sin(this.getRadian(yaw));
        const start = new vrPlanner.GeoLocation(x, y, 0);
        const _width =
          height * Math.cos(this.getRadian(yaw)) +
          width * Math.sin(this.getRadian(yaw));
        const _height =
          height * Math.sin(this.getRadian(yaw)) +
          width * Math.cos(this.getRadian(yaw));
        const count_x = Math.ceil(_width / offsetX.magnitude());
        const count_y = Math.ceil(_height / offsetY.magnitude());
        let i = 0;
        let j = 0;
        const dis = start.asDouble3().sub(focus.asDouble3());
        cam.setPosition(pos.add(dis.Z(0)));
        const _pos = cam.getPosition();
        terrain.layer.bindEvent("loadingCompleted", () => {
          console.log("loadingCompleted");
          i++;
          cam.setPosition(_pos.sub(offsetX.mul(i)).sub(offsetY.mul(j)));
          if (i > count_x) {
            j++;
            i = -1;
            if (j > count_y) {
              terrain.layer.unbindEvent("loadingCompleted");
              // clearInterval(interval);
            }
          }
        });
        // const interval = setInterval(() => {
        //   console.log(i)

        //   if (i > count_x) {
        //     j++;
        //     i = -1;
        //     if (j > count_y) {
        //       clearInterval(interval);
        //     }
        //   }
        //   i++;
        // }, 500)
      } else {
        const geo = limit[0];
        const x =
          geo[0] +
          height *
          Math.cos(this.getRadian(yaw)) *
          Math.cos(this.getRadian(yaw));
        const y =
          geo[1] +
          height *
          Math.cos(this.getRadian(yaw)) *
          Math.sin(this.getRadian(yaw));
        const start = new vrPlanner.GeoLocation(x, y, 0);
        const _width =
          width * Math.sin(this.getRadian(yaw)) -
          height * Math.cos(this.getRadian(yaw));
        const _height =
          height * Math.sin(this.getRadian(yaw)) -
          width * Math.cos(this.getRadian(yaw));
        const count_x = Math.ceil(_width / offsetX.magnitude());
        const count_y = Math.ceil(_height / offsetY.magnitude());
        let i = 0;
        let j = 0;
        const dis = start.asDouble3().sub(focus.asDouble3());
        cam.setPosition(pos.add(dis));
        const _pos = cam.getPosition();
        const interval = setInterval(() => {
          cam.setPosition(_pos.sub(offsetX.mul(i)).sub(offsetY.mul(j)));
          if (i > count_x) {
            j++;
            i = -1;
            if (j > count_y) {
              clearInterval(interval);
            }
          }
          i++;
        }, 500);
      }
    } else {
      if (yaw > -90) {
        limit[2];
      } else {
        limit[3];
      }
    }
  };

  getRadian = (angle: number) => {
    return (Math.PI * angle) / 180;
  };

  getDegree = radian => {
    return (180 * radian) / Math.PI;
  };

  dataURLtoBlob = dataurl => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  showTips = () => {
    VrpTips.showTips(
      "截图中",
      <div>
        <p className={css["m-b-sm"]}>正在截图中</p>
        <p className={css["m-b-sm"]}>过程时间可能较长</p>
        <p className={css["m-b-sm"]}>请不要随意移动地图或旋转镜头</p>
      </div>,
      275
    );
  };

  showDownloadTips = () => {
    VrpTips.showTips(
      "下载中",
      <div>
        <p className={css["m-b-sm"]}>正在打包中</p>
        <p className={css["m-b-sm"]}>过程时间可能较长</p>
        <p className={css["m-b-sm"]}>请不要随意刷新页面</p>
      </div>,
      275
    );
  };

  changeImgI = value => {
    this.setState({
      imgI: value
    });
  };

  changeImgJ = value => {
    this.setState({
      imgJ: value
    });
  };

  setImgPosition = () => {
    const { imgI, imgJ, allGeo, re_lookAt, re_pos, re_dis } = this.state;
    const { maps, vrPlanner } = Config;
    const terrain = Terrain.terrains[0];
    let cam = maps.getCamera();
    let _pos = re_pos.split(",");
    let pos = new vrPlanner.GeoLocation(_pos[0], _pos[1], _pos[2]);
    let _lookAt = re_lookAt.split(",");

    let lookAt = new vrPlanner.GeoLocation(_lookAt[0], _lookAt[1], _lookAt[2]);
    if (imgI === 0) {
      cam.flyTo(pos, lookAt);
    } else {
      cam.setPosition(pos, lookAt);
      const focus = cam.getFocusPosition();

      const _focus = new vrPlanner.Math.Double3(0, 0, focus.z());
      const zAxis = new vrPlanner.Math.Double3(0, 0, 1);
      const ray_x = maps.getRayAtScreenPos(
        window.innerWidth,
        window.innerHeight / 2
      );
      const ray_y = maps.getRayAtScreenPos(
        window.innerWidth / 2,
        window.innerHeight
      );
      const geo_X = vrPlanner.Math.Vecmath.linePlaneIntersection(
        pos,
        ray_x,
        _focus,
        zAxis
      );
      const geo_Y = vrPlanner.Math.Vecmath.linePlaneIntersection(
        pos,
        ray_y,
        _focus,
        zAxis
      );
      const offsetX = focus
        .asDouble3()
        .sub(geo_X)
        .mul(2);
      const offsetY = focus
        .asDouble3()
        .sub(geo_Y)
        .mul(2);
      const _dis = re_dis.split(",");
      //console.log(Number(_dis[0]));

      const dis = new vrPlanner.Math.Double3.create(
        Number(_dis[0]),
        Number(_dis[1]),
        Number(_dis[2])
      );

      const timeout = setTimeout(() => {
        cam.setPosition(pos.add(dis));
        let n_pos = cam.getPosition();
        //    console.log(n_pos, pos.add(dis));

        // let value = allGeo.find((item) => item.i === imgI && item.j === imgJ);
        // console.log(value);
        // cam.setPosition(value.geo)
        cam.setPosition(
          n_pos.sub(offsetX.mul(imgI - 1)).sub(offsetY.mul(imgJ - 1))
        );
        console.log("focusPosition: ", cam.getFocusPosition());
        let gg = TransCoordinate.MercatorToWGS84(cam.getFocusPosition());
        console.log(
          (imgI - 0.5) * 1920 +
          "," +
          (imgJ - 0.5) * 975 +
          "," +
          gg.lon +
          "," +
          gg.lat +
          "," +
          imgJ +
          "-" +
          imgI +
          ",0"
        );
        terrain.layer.bindEvent("loadingCompleted", () => {
          console.log("loadingCompleted");
          //  console.log(cam.getFocusPosition());

          message.success("loadingCompleted");
          terrain.layer.unbindEvent("loadingCompleted");
        });

        //   console.log(pos.sub(offsetX.mul(imgI)).sub(offsetY.mul(imgJ - 1)));
      }, 30);
    }
  };

  setReLookAt = e => {
    this.setState({
      re_lookAt: e.target.value
    });
  };

  setRePosition = e => {
    this.setState(
      {
        re_pos: e.target.value
      },
      () => {
        console.log(typeof this.state.re_pos);
      }
    );
  };

  getImgPosition = () => {
    const { maps } = Config;
    const cam = maps.getCamera();
    let pos = cam.getPosition();
    let lookAt = cam.getLookAt();
    console.log("pos", pos);
    console.log("lookAt", lookAt);
  };

  setReDis = e => {
    this.setState({
      re_dis: e.target.value
    });
  };

  getReImg = () => {
    const { IMGS, imgI, imgJ } = this.state;
    maps
      .takeScreenshot(window.innerWidth, window.innerHeight)
      .done(imageData => {
        const cam = maps.getCamera();
        const link = document.createElement("a");
        const canvas = document.createElement("canvas");
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        const ctx: any = canvas.getContext("2d");
        ctx.putImageData(imageData, 0, 0);
        const dataUrl = canvas.toDataURL("image/png ");

        const blob = this.dataURLtoBlob(dataUrl);
        const objurl = URL.createObjectURL(blob);
        link.download =
          "grid" +
          (imgJ < 10 ? "0" + imgJ : imgJ) +
          "_" +
          (imgI < 10 ? "0" + imgI : imgI) +
          ".png";
        link.href = objurl;
        link.click();
        message.success("重新截图成功");
      });
  };

  Jump = () => {
    const { imgI, imgJ, offsetX, offsetY, pos } = this.state;
    console.log(imgI, imgJ);
    console.log("-------------", offsetX);
    console.log("-------------", offsetY);
    console.log("-------------", pos);
    cam.setPosition(pos.add(offsetX.mul(imgI - 1).add(offsetY.mul(imgJ - 1))))
  }

  getCamera = () => {
    const a = maps.getRayAtScreenPos(window.innerWidth / 2, 0);
    const b = maps.getRayAtScreenPos(window.innerWidth, window.innerHeight / 2);
    const focus = cam.getFocusPosition();
    const _focus = new vrPlanner.Math.Double3(0, 0, focus.z());
    const z = new vrPlanner.Math.Double3(0, 0, 1);
    const pos = cam.getPosition();
    const geo_X = vrPlanner.Math.Vecmath.linePlaneIntersection(pos, a, _focus, z);
    const geo_Y = vrPlanner.Math.Vecmath.linePlaneIntersection(pos, b, _focus, z);
    const offsetX = geo_X.sub(focus.asDouble3()).mul(2);
    const offsetY = geo_Y.sub(focus.asDouble3()).mul(2);
    this.setState({
      offsetX,
      offsetY,
      pos,
    })
  }

  getPosition = () => {
    const pos = cam.getPosition();
    const lookAt = cam.getLookAt();
    this.setState({
      re_pos: `${pos.x()},${pos.y()},${pos.z()}`,
      re_lookAt: `${lookAt.x()},${lookAt.y()},${lookAt.z()}`,
    })

  }
  setPosition = () => {
    const { re_pos, re_lookAt } = this.state;
    const pos = new vrPlanner.GeoLocation(Number(re_pos.split(',')[0]), Number(re_pos.split(',')[1]), Number(re_pos.split(',')[2]))
    const lookAt = new vrPlanner.GeoLocation(Number(re_lookAt.split(',')[0]), Number(re_lookAt.split(',')[1]), Number(re_lookAt.split(',')[2]))
    cam.setPosition(pos, lookAt)
  }

  render() {
    return (
      <div>
        <VrpIcon
          iconName={"icon-tupian"}
          className={css["vrp-menu-icon"]}
          title={"截图"}
          onClick={this.showModal}
        />
        {this.state.showItem === "chooseMode" ? (
          <VrpModal
            className={scss["shotImg-vrpModal"]}
            defaultPosition={{ x: 10, y: 195 }}
            title={this.state.status}
            style={{ width: 320, height: 540 }}
            onClose={this.showModal}
          >
            <Button
              type="primary"
              onClick={this.drawArea}
              style={{
                display: "block",
                margin: "8px 0 8px 0"
              }}
            >
              框选区域
            </Button>
            <Button
              type="primary"
              onClick={this.drawArea}
              style={{
                display: "block",
                margin: "8px 0 8px 0"
              }}
            >
              自定义截图
            </Button>
          </VrpModal>
        ) : null}
        {this.state.showItem === "drawArea" ? (
          <div className={scss["shotImg-drawArea-container"]}>
            <Button
              type="dashed"
              ghost
              className={scss["shotImg-drawArea-but"]}
              onClick={this.setShotAngle}
            >
              选择截图角度
            </Button>
          </div>
        ) : null}
        {this.state.showItem === "adjustAngle" ? (
          // <VrpModal
          //   className={scss["shotImg-vrpModal"]}
          //   defaultPosition={{ x: 10, y: 195 }}
          //   title={this.state.status}
          //   style={{ width: 320, height: 540 }}
          //   onClose={this.showModal}
          // >
          <Fragment>
            <div className={scss["shotImg-adjustAngle-angle"]}>
              <span>yaw偏航角：</span>
              <span>{this.state.yaw}</span>
              <span>pitch偏航角：</span>
              <span>{this.state.pitch}</span>
            </div>
            <div className={scss["shotImg-adjustAngle-but"]}>
              <Button
                type="dashed"
                ghost
                // style={{
                //   display: "block"
                // }}
                onClick={() => {
                  this.shanyinlu();
                  this.showTips();
                }}
              // -63.16837371211415~26.831626287885847
              >
                开始截图
              </Button>

              {/* </VrpModal> */}
            </div>
          </Fragment>
        ) : null}
        {this.state.showItem === "ab" ? (
          <VrpModal
            className={scss["shotImg-vrpModal"]}
            defaultPosition={{ x: 10, y: 195 }}
            title={this.state.status}
            style={{ width: 320, height: 540 }}
            onClose={this.showModal}
          >
            <span>yaw偏航角：</span>
            <span>{this.state.yaw}</span>
            <br />
            <span>pitch偏航角：</span>
            <span>{this.state.pitch}</span>
            <br />

            {/* <Button
              type="primary"
              style={{
                display: "block",
                margin: "8px 0 8px 0"
              }}
              onClick={this.calLoadTime}
            >
              测试加载时长
            </Button> */}
            <Button
              type="primary"
              onClick={() => {
                this.getCamera();
              }}
            // -63.16837371211415~26.831626287885847
            >
              获取屏幕相机视角
            </Button>

            <Button
              type="primary"
              onClick={() => {
                this.takePixelItem();
              }}
            // -63.16837371211415~26.831626287885847
            >
              获取经纬度信息
            </Button>

            <Button
              type="primary"
              // disabled={this.LINKLIST.length === 0 ? true : false}
              style={{
                display: "block",
                margin: "8px 0 8px 0"
              }}
              onClick={this.takePixelItem}
            //   onClick={this.packageImages}
            >
              下载图片
            </Button>
            <Button
              type="primary"
              style={{
                display: "inline-block",
                margin: "8px 0 8px 8px"
              }}
              onClick={this.testPixels}
            >
              查找经纬度
            </Button>
            <span style={{ display: "block" }}>
              如若截图效果不佳，请根据图片名称在下方手动输入编号，
            </span>
            <span style={{ display: "block" }}>点击确认后将跳转至该位置</span>
            <span style={{ display: "block" }}>
              相关数据保存在压缩包中的txt文件中
            </span>

            <div
              style={{
                margin: "8px 0 8px 0"
              }}
            >
              <span>position:</span>
              <Input
                size={"small"}
                onChange={this.setRePosition}
                placeholder="如:13811959.824192822, 1397919.1202164677, 16237538.10444816"
                value={this.state.re_pos}
              />
              <span>lookAt:</span>
              <Input
                size={"small"}
                onChange={this.setReLookAt}
                placeholder="如:13811959.824192822, 1397919.1202164677, 16237538.10444816"
                value={this.state.re_lookAt}
              />
              <span>dis:</span>
              <Input
                size={"small"}
                onChange={this.setReDis}
                placeholder="如:13811959.824192822, 1397919.1202164677, 16237538.10444816"
                value={this.state.re_dis}
              />
            </div>
            <div className={css["jietu-manual-div"]}>
              <span>grid</span>
              <InputNumber
                min={1}
                value={this.state.imgJ}
                size={"small"}
                style={{
                  width: "50px",
                  margin: " 0 8px 0 0 "
                }}
                onChange={this.changeImgJ}
              />
              <span>_</span>
              <InputNumber
                min={1}
                size={"small"}
                value={this.state.imgI}
                style={{
                  width: "50px",
                  margin: " 0 8px 0 0 "
                }}
                onChange={this.changeImgI}
              />
            </div>

            <div style={{ margin: "8px 0 0 0" }}>
              <Button
                type="primary"
                style={{ marginRight: "10px" }}
                onClick={this.Jump}
              >
                跳转
              </Button>
              <Button type="primary" onClick={this.getReImg}>
                截图
              </Button>
              <Button type="primary"
                onClick={this.getPosition}>获取坐标</Button>
              <Button type="primary"
                onClick={this.setPosition}>定位</Button>
            </div>
          </VrpModal>
        ) : null}
      </div>
    );
  }
}

export default Test;
